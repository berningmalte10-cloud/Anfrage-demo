<?php
/*
 * =====================================================================
 *  anfrage.php – der "Briefträger" des Anfrage-Assistenten
 * =====================================================================
 *  Nimmt die Anfrage aus dem Formular entgegen, prüft sie und verschickt
 *  sie per E-Mail (SMTP) an den Betrieb. Es wird nichts auf dem Server
 *  gespeichert. Einstellungen: mail-config.php
 *
 *  Benötigt: PHP 7.4 oder neuer, Ordner "phpmailer" daneben.
 *  An dieser Datei muss für einen neuen Kunden nichts geändert werden.
 * =====================================================================
 */

declare(strict_types=1);

define('ANFRAGE_ASSISTENT', true);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

date_default_timezone_set('Europe/Berlin');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const MAX_FOTOS = 5;
const MAX_FOTO_BYTES = 8 * 1024 * 1024;
const MIN_AUSFUELLZEIT_SEKUNDEN = 3;

/* ------------------------------------------------------------------
 * Hilfsfunktionen
 * ------------------------------------------------------------------ */

function antwort(int $status, array $daten): void
{
    http_response_code($status);
    echo json_encode($daten, JSON_UNESCAPED_UNICODE);
    exit;
}

function fehler(int $status, string $meldung): void
{
    antwort($status, ['ok' => false, 'error' => $meldung]);
}

/** Text säubern: Steuerzeichen entfernen, kürzen. */
function text($wert, int $max, bool $mehrzeilig = false): string
{
    if (!is_string($wert) && !is_numeric($wert)) {
        return '';
    }
    $wert = (string) $wert;
    if (!mb_check_encoding($wert, 'UTF-8')) {
        return '';
    }
    $wert = $mehrzeilig
        ? preg_replace('/[^\P{C}\n]/u', '', str_replace("\r", '', $wert))
        : preg_replace('/\p{C}/u', ' ', $wert);
    $wert = trim((string) $wert);
    return mb_substr($wert, 0, $max);
}

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function client_ip(): string
{
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '');
}

/**
 * Einfache Begrenzung der Anfragen pro Stunde und Anschluss.
 * Gespeichert wird nur ein nicht umkehrbarer Hash der IP, max. 1 Stunde.
 */
function anfragen_begrenzen(int $maxProStunde): bool
{
    if ($maxProStunde <= 0) {
        return true;
    }
    $datei = sys_get_temp_dir() . '/anfrage_limit_' . md5(__DIR__) . '.json';
    $schluessel = hash('sha256', client_ip() . '|' . __DIR__);
    $jetzt = time();

    $fp = @fopen($datei, 'c+');
    if (!$fp) {
        return true; // Im Zweifel nicht blockieren
    }
    flock($fp, LOCK_EX);
    $daten = json_decode((string) stream_get_contents($fp), true);
    if (!is_array($daten)) {
        $daten = [];
    }
    foreach ($daten as $k => $zeiten) {
        $daten[$k] = array_values(array_filter((array) $zeiten, function ($t) use ($jetzt) {
            return is_int($t) && $t > $jetzt - 3600;
        }));
        if (!$daten[$k]) {
            unset($daten[$k]);
        }
    }
    $erlaubt = count($daten[$schluessel] ?? []) < $maxProStunde;
    if ($erlaubt) {
        $daten[$schluessel][] = $jetzt;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, (string) json_encode($daten));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return $erlaubt;
}

/* ------------------------------------------------------------------
 * Grundprüfungen
 * ------------------------------------------------------------------ */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fehler(405, 'Nur POST erlaubt.');
}

$configDatei = __DIR__ . '/mail-config.php';
if (!is_file($configDatei)) {
    error_log('Anfrage-Assistent: mail-config.php fehlt.');
    fehler(500, 'Der Versand ist noch nicht eingerichtet.');
}
$cfg = require $configDatei;

// Nur Anfragen von der eigenen Webseite annehmen
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $eigenerHost = preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? ''));
    if (!$originHost || strcasecmp($originHost, $eigenerHost) !== 0) {
        fehler(403, 'Anfrage nicht erlaubt.');
    }
}

$payload = json_decode((string) ($_POST['payload'] ?? ''), true);
if (!is_array($payload)) {
    fehler(400, 'Die Anfrage konnte nicht gelesen werden.');
}

$requestId = text($payload['requestId'] ?? '', 20);
if (!preg_match('/^[A-Z0-9]{1,6}-\d{4}-\d{4}$/', $requestId)) {
    $requestId = 'AN-' . date('Y') . '-' . random_int(1000, 9999);
}

// Spam: Honeypot ausgefüllt oder unrealistisch schnell ausgefüllt
// -> so tun, als wäre alles gut, aber nichts senden.
$honeypot = text($payload['honeypot'] ?? '', 200);
$ausfuellzeit = (int) ($payload['fillTimeSeconds'] ?? 0);
if ($honeypot !== '' || $ausfuellzeit < MIN_AUSFUELLZEIT_SEKUNDEN) {
    antwort(200, ['ok' => true, 'requestId' => $requestId]);
}

if (!anfragen_begrenzen((int) ($cfg['max_anfragen_pro_stunde'] ?? 5))) {
    fehler(429, 'Es wurden gerade sehr viele Anfragen gesendet. Bitte versuchen Sie es später noch einmal.');
}

/* ------------------------------------------------------------------
 * Angaben prüfen
 * ------------------------------------------------------------------ */

$leistung = text($payload['service']['label'] ?? '', 80);

$details = [];
foreach (array_slice((array) ($payload['details'] ?? []), 0, 20) as $d) {
    if (!is_array($d)) {
        continue;
    }
    $mehrzeilig = !empty($d['multiline']);
    $label = text($d['label'] ?? '', 80);
    $wert = text($d['answer'] ?? '', 1000, $mehrzeilig);
    if ($label !== '' && $wert !== '') {
        $details[] = ['label' => $label, 'wert' => $wert, 'mehrzeilig' => $mehrzeilig];
    }
}

$plz = text($payload['location']['plz'] ?? '', 5);
$ort = text($payload['location']['city'] ?? '', 80);

$zeitraum = text($payload['timing']['label'] ?? '', 80);
$zeitraumHinweis = text($payload['timing']['note'] ?? '', 200);
$dringlichkeit = (string) ($payload['timing']['urgency'] ?? 'medium');
if (!in_array($dringlichkeit, ['high', 'medium', 'low'], true)) {
    $dringlichkeit = 'medium';
}

$name = text($payload['contact']['name'] ?? '', 100);
$telefon = text($payload['contact']['phone'] ?? '', 30);
$email = text($payload['contact']['email'] ?? '', 120);
$rueckruf = text($payload['contact']['callbackTime'] ?? '', 30);

$fehlerListe = [];
if ($leistung === '') {
    $fehlerListe[] = 'Leistung fehlt.';
}
if (!preg_match('/^\d{5}$/', $plz)) {
    $fehlerListe[] = 'Postleitzahl ist ungültig.';
} elseif (!empty($cfg['erlaubte_plz']) && !in_array($plz, array_map('strval', $cfg['erlaubte_plz']), true)) {
    $fehlerListe[] = 'Die Postleitzahl liegt außerhalb des Einsatzgebiets.';
}
if ($ort === '') {
    $fehlerListe[] = 'Ort fehlt.';
}
if ($zeitraum === '') {
    $fehlerListe[] = 'Zeitraum fehlt.';
}
if (mb_strlen($name) < 2) {
    $fehlerListe[] = 'Name fehlt.';
}
if ($telefon === '' && $email === '') {
    $fehlerListe[] = 'Telefon oder E-Mail fehlt.';
}
if ($telefon !== '' && (!preg_match('/^[+()\d\s\/.\-]+$/', $telefon) || strlen(preg_replace('/\D/', '', $telefon)) < 6)) {
    $fehlerListe[] = 'Telefonnummer ist ungültig.';
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $fehlerListe[] = 'E-Mail-Adresse ist ungültig.';
}
if (($payload['privacyAccepted'] ?? false) !== true) {
    $fehlerListe[] = 'Die Datenschutzerklärung wurde nicht bestätigt.';
}
if ($fehlerListe) {
    fehler(422, 'Bitte prüfen Sie Ihre Angaben: ' . implode(' ', $fehlerListe));
}

/* ------------------------------------------------------------------
 * Fotos prüfen
 * ------------------------------------------------------------------ */

$fotos = [];
for ($i = 1; $i <= MAX_FOTOS; $i++) {
    $f = $_FILES['foto' . $i] ?? null;
    if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        continue;
    }
    if ($f['error'] !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) {
        fehler(400, 'Ein Foto konnte nicht übertragen werden. Bitte versuchen Sie es mit weniger oder kleineren Fotos.');
    }
    if ($f['size'] > MAX_FOTO_BYTES) {
        fehler(400, 'Ein Foto ist zu groß.');
    }
    $info = @getimagesize($f['tmp_name']);
    if (!$info || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG], true)) {
        fehler(400, 'Eine Datei ist kein gültiges Foto.');
    }
    $endung = $info[2] === IMAGETYPE_PNG ? 'png' : 'jpg';
    $fotos[] = [
        'pfad'   => $f['tmp_name'],
        'name'   => 'foto-' . (count($fotos) + 1) . '.' . $endung,
        'mime'   => $info['mime'],
        'cid'    => 'foto' . (count($fotos) + 1),
        'bytes'  => (int) $f['size'],
        'breite' => (int) $info[0],
        'hoehe'  => (int) $info[1],
    ];
}

/* ------------------------------------------------------------------
 * E-Mail zusammenbauen
 * ------------------------------------------------------------------ */

$firma = (string) ($cfg['firmenname'] ?? '');
$farbe = preg_match('/^#[0-9a-fA-F]{6}$/', (string) ($cfg['farbe'] ?? '')) ? $cfg['farbe'] : '#1E5B4F';
$eingang = date('d.m.Y, H:i') . ' Uhr';

$betreff = ($dringlichkeit === 'high' ? '[DRINGEND] ' : '')
    . 'Neue Anfrage: ' . $leistung . ' · ' . $plz . ' ' . $ort . ' · ' . $requestId;

$dringlichkeitStil = [
    'high'   => ['titel' => 'Dringend',  'bg' => '#fdeceb', 'rand' => '#c62828', 'text' => '#8c1d18'],
    'medium' => ['titel' => 'Planbar',   'bg' => '#fff5e3', 'rand' => '#d18a00', 'text' => '#6e4600'],
    'low'    => ['titel' => 'Flexibel',  'bg' => '#e6f3eb', 'rand' => '#1c6e3a', 'text' => '#14532b'],
][$dringlichkeit];

function zeile(string $label, string $wertHtml): string
{
    return '<tr>'
        . '<td style="padding:8px 12px 8px 0;border-bottom:1px solid #eef1f3;color:#545f69;font-size:14px;vertical-align:top;width:42%;">' . h($label) . '</td>'
        . '<td style="padding:8px 0;border-bottom:1px solid #eef1f3;color:#161a1d;font-size:14px;font-weight:bold;vertical-align:top;">' . $wertHtml . '</td>'
        . '</tr>';
}

function abschnitt(string $titel, string $farbe, string $inhalt): string
{
    return '<tr><td style="padding:18px 0 0;">'
        . '<div style="font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:' . $farbe . ';padding-bottom:6px;border-bottom:2px solid ' . $farbe . ';">' . h($titel) . '</div>'
        . $inhalt
        . '</td></tr>';
}

function fakt(string $label, string $wert): string
{
    return '<td width="50%" style="padding:4px;vertical-align:top;">'
        . '<div style="background:#f3f6f5;border:1px solid #e1e8e6;border-radius:10px;padding:10px 12px;">'
        . '<div style="font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#545f69;">' . h($label) . '</div>'
        . '<div style="font-size:15px;font-weight:bold;color:#161a1d;">' . h($wert) . '</div>'
        . '</div></td>';
}

// Kunde
$kundeZeilen = zeile('Name', h($name));
if ($telefon !== '') {
    $kundeZeilen .= zeile('Telefon', '<a href="tel:' . h(preg_replace('/[^\d+]/', '', $telefon)) . '" style="color:#1a5fb4;">' . h($telefon) . '</a>');
}
if ($email !== '') {
    $kundeZeilen .= zeile('E-Mail', '<a href="mailto:' . h($email) . '" style="color:#1a5fb4;">' . h($email) . '</a>');
}
$kundeZeilen .= zeile('Beste Rückrufzeit', h($rueckruf !== '' ? $rueckruf : 'keine Angabe'));

// Auftrag
$auftragZeilen = '';
foreach ($details as $d) {
    $wert = $d['mehrzeilig'] ? nl2br(h($d['wert'])) : h($d['wert']);
    $auftragZeilen .= zeile($d['label'], $wert);
}

// Fotos
if ($fotos) {
    $fotoHtml = '<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:10px;"><tr>';
    foreach ($fotos as $n => $f) {
        if ($n > 0 && $n % 3 === 0) {
            $fotoHtml .= '</tr><tr>';
        }
        $fotoHtml .= '<td style="padding:0 8px 8px 0;"><img src="cid:' . $f['cid'] . '" width="170" alt="' . h($f['name']) . '" style="display:block;width:170px;max-width:100%;height:auto;border-radius:8px;border:1px solid #dce1e5;"></td>';
    }
    $fotoHtml .= '</tr></table>'
        . '<div style="font-size:12px;color:#545f69;">Die Fotos hängen zusätzlich als Dateien an dieser E-Mail.</div>';
} else {
    $fotoHtml = '<div style="padding-top:8px;font-size:14px;color:#545f69;">Keine Fotos angehängt.</div>';
}

$html = '<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . h($betreff) . '</title></head>'
    . '<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#161a1d;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;"><tr><td align="center" style="padding:20px 10px;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:14px;border:1px solid #dce1e5;">'
    . '<tr><td style="padding:22px 24px;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'

    // Titel
    . '<tr><td style="font-size:20px;font-weight:bold;line-height:1.3;padding-bottom:14px;">'
    . ($dringlichkeit === 'high' ? '<span style="display:inline-block;background:#c62828;color:#ffffff;font-size:11px;letter-spacing:1px;padding:2px 8px;border-radius:5px;vertical-align:3px;margin-right:6px;">DRINGEND</span>' : '')
    . 'Neue Anfrage: ' . h($leistung) . '</td></tr>'

    // Dringlichkeit
    . '<tr><td style="background:' . $dringlichkeitStil['bg'] . ';border-left:6px solid ' . $dringlichkeitStil['rand'] . ';border-radius:10px;padding:12px 14px;color:' . $dringlichkeitStil['text'] . ';">'
    . '<div style="font-size:16px;font-weight:bold;">' . h($dringlichkeitStil['titel'] . ': ' . $zeitraum) . '</div>'
    . ($zeitraumHinweis !== '' ? '<div style="font-size:14px;">' . h($zeitraumHinweis) . '</div>' : '')
    . '</td></tr>'

    . '<tr><td style="padding:16px 0 10px;font-size:15px;color:#3b454e;">Hallo Team von ' . h($firma) . ',<br>über den Anfrage-Assistenten auf Ihrer Webseite ist eine neue Anfrage eingegangen.</td></tr>'

    // Kurzinfos
    . '<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
    . '<tr>' . fakt('Leistung', $leistung) . fakt('Einsatzort', $plz . ' ' . $ort) . '</tr>'
    . '<tr>' . fakt('Beginn', $zeitraum) . fakt('Rückruf', $rueckruf !== '' ? $rueckruf : 'keine Angabe') . '</tr>'
    . '</table></td></tr>'

    . abschnitt('Kunde', $farbe, '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $kundeZeilen . '</table>')
    . abschnitt('Auftrag: ' . $leistung, $farbe, '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $auftragZeilen . '</table>')
    . abschnitt('Einsatzort & Zeitraum', $farbe, '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        . zeile('PLZ / Ort', h($plz . ' ' . $ort))
        . zeile('Gewünschter Beginn', h($zeitraum))
        . '</table>')
    . abschnitt('Fotos (' . count($fotos) . ')', $farbe, $fotoHtml)

    // Fußzeile
    . '<tr><td style="padding-top:20px;"><div style="background:#f5f7f8;border-radius:10px;padding:12px 14px;font-size:12px;color:#545f69;line-height:1.5;">'
    . '<b>Anfragenummer:</b> ' . h($requestId) . '<br>'
    . '<b>Eingang:</b> ' . h($eingang) . '<br>'
    . '<b>Datenschutz:</b> Kenntnisnahme der Datenschutzerklärung bestätigt<br>'
    . 'Diese Nachricht wurde automatisch vom Anfrage-Assistenten' . (!empty($cfg['website']) ? ' auf ' . h((string) $cfg['website']) : '') . ' erstellt. '
    . 'Fotos wurden auf dem Gerät des Kunden verkleinert und ohne Standortdaten übermittelt.'
    . '</div></td></tr>'

    . '</table></td></tr></table>'
    . '</td></tr></table></body></html>';

// Textversion für einfache E-Mail-Programme
$text = ($dringlichkeit === 'high' ? "*** DRINGEND ***\n" : '')
    . "Neue Anfrage: {$leistung}\n"
    . "Anfragenummer: {$requestId}\n"
    . "Eingang: {$eingang}\n\n"
    . "ZEITRAUM\n{$zeitraum}" . ($zeitraumHinweis !== '' ? " – {$zeitraumHinweis}" : '') . "\n\n"
    . "KUNDE\nName: {$name}\n"
    . ($telefon !== '' ? "Telefon: {$telefon}\n" : '')
    . ($email !== '' ? "E-Mail: {$email}\n" : '')
    . 'Beste Rückrufzeit: ' . ($rueckruf !== '' ? $rueckruf : 'keine Angabe') . "\n\n"
    . "AUFTRAG: {$leistung}\n";
foreach ($details as $d) {
    $text .= $d['label'] . ': ' . $d['wert'] . "\n";
}
$text .= "\nEINSATZORT\n{$plz} {$ort}\n\n"
    . 'FOTOS: ' . count($fotos) . ($fotos ? ' (im Anhang)' : '') . "\n";

/* ------------------------------------------------------------------
 * Versenden
 * ------------------------------------------------------------------ */

function neuer_mailer(array $cfg): PHPMailer
{
    $smtp = $cfg['smtp'] ?? [];
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = (string) ($smtp['server'] ?? '');
    $mail->Port = (int) ($smtp['port'] ?? 587);
    $mail->SMTPAuth = true;
    $mail->Username = (string) ($smtp['benutzer'] ?? '');
    $mail->Password = (string) ($smtp['passwort'] ?? '');
    $verschluesselung = (string) ($smtp['verschluesselung'] ?? 'tls');
    if ($verschluesselung === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($verschluesselung === 'keine') { // nur für lokale Tests
        $mail->SMTPSecure = '';
        $mail->SMTPAutoTLS = false;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    }
    $mail->Timeout = 20;
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->Encoding = PHPMailer::ENCODING_BASE64;
    $mail->setFrom((string) $cfg['absender'], (string) ($cfg['absender_name'] ?? 'Anfrage-Assistent'));
    return $mail;
}

try {
    $mail = neuer_mailer($cfg);
    $mail->addAddress((string) $cfg['empfaenger'], $firma);
    if ($email !== '') {
        $mail->addReplyTo($email, $name);
    }
    if ($dringlichkeit === 'high') {
        $mail->Priority = 1;
    }
    $mail->Subject = $betreff;
    $mail->isHTML(true);
    $mail->Body = $html;
    $mail->AltBody = $text;
    foreach ($fotos as $f) {
        $mail->addEmbeddedImage($f['pfad'], $f['cid'], $f['name'], PHPMailer::ENCODING_BASE64, $f['mime'], 'inline');
        $mail->addAttachment($f['pfad'], $f['name'], PHPMailer::ENCODING_BASE64, $f['mime']);
    }
    $mail->send();
} catch (MailException $e) {
    // Keine Kundendaten ins Log schreiben – nur den technischen Fehler
    error_log('Anfrage-Assistent: Versand fehlgeschlagen (' . $requestId . '): ' . ($mail->ErrorInfo ?? $e->getMessage()));
    fehler(500, 'Das Senden hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal oder rufen Sie uns an.');
}

// Optionale Eingangsbestätigung an den Kunden
if (!empty($cfg['bestaetigung_an_kunden']) && $email !== '') {
    try {
        $best = neuer_mailer($cfg);
        $best->addAddress($email, $name);
        $best->addReplyTo((string) $cfg['empfaenger'], $firma);
        $best->Subject = 'Ihre Anfrage bei ' . $firma . ' (' . $requestId . ')';
        $best->isHTML(false);
        $best->Body = "Guten Tag {$name},\n\n"
            . "vielen Dank für Ihre Anfrage ({$leistung}). Sie ist bei uns eingegangen.\n"
            . "Ihre Anfragenummer: {$requestId}\n\n"
            . "Wir melden uns so bald wie möglich bei Ihnen.\n\n"
            . "Freundliche Grüße\n{$firma}\n"
            . (!empty($cfg['website']) ? $cfg['website'] . "\n" : '');
        $best->send();
    } catch (MailException $e) {
        error_log('Anfrage-Assistent: Bestätigung fehlgeschlagen (' . $requestId . ').');
    }
}

antwort(200, ['ok' => true, 'requestId' => $requestId]);
