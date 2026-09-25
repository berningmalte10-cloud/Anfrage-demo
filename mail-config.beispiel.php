<?php
/*
 * =====================================================================
 *  E-MAIL-EINSTELLUNGEN für den Anfrage-Assistenten
 * =====================================================================
 *  1. Diese Datei kopieren und die Kopie "mail-config.php" nennen.
 *  2. In mail-config.php die Angaben des Kunden eintragen.
 *  3. mail-config.php NUR auf den Webspace des Kunden hochladen –
 *     niemals auf GitHub (dort wäre das Passwort öffentlich).
 *
 *  Die Zugangsdaten (Server, Port, Benutzer, Passwort) findet der Kunde
 *  im Kundenbereich seines Hosters bei den E-Mail-Postfächern.
 *  Beispiele siehe ANLEITUNG-LIVEBETRIEB.md.
 * =====================================================================
 */

if (!defined('ANFRAGE_ASSISTENT')) {
    http_response_code(403);
    exit;
}

return [

    // An diese Adresse gehen die Anfragen
    'empfaenger' => 'info@malerbetrieb-kunde.de',

    // Name des Betriebs (erscheint in der E-Mail)
    'firmenname' => 'Malerbetrieb Muster',

    // Webseite des Betriebs (erscheint in der Fußzeile der E-Mail)
    'website' => 'www.malerbetrieb-kunde.de',

    // Hauptfarbe für die E-Mail (am besten wie in config.js)
    'farbe' => '#1E5B4F',

    // Postfach, über das die E-Mails verschickt werden
    'smtp' => [
        'server'           => 'smtp.ionos.de',
        'port'             => 587,          // 587 oder 465
        'verschluesselung' => 'tls',        // 'tls' bei Port 587, 'ssl' bei Port 465
        'benutzer'         => 'anfrage@malerbetrieb-kunde.de',
        'passwort'         => 'HIER-DAS-PASSWORT-EINTRAGEN',
    ],

    // Absender der E-Mail – muss fast immer gleich dem SMTP-Benutzer sein
    'absender'      => 'anfrage@malerbetrieb-kunde.de',
    'absender_name' => 'Anfrage-Assistent',

    // Soll der Kunde eine kurze Eingangsbestätigung bekommen? (true / false)
    'bestaetigung_an_kunden' => false,

    // Schutz gegen Missbrauch: max. Anfragen pro Stunde vom selben Anschluss
    'max_anfragen_pro_stunde' => 5,

    // Optional: erlaubte Postleitzahlen auch auf dem Server prüfen.
    // Leer lassen [] = keine Prüfung. Sonst wie in config.js, z. B.:
    // ['46395', '46397', '46399', '46414', '46325']
    'erlaubte_plz' => [],
];
