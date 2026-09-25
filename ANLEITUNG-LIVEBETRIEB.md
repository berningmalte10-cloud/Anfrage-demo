# Anleitung: Anfrage-Assistent beim Kunden einrichten

So bringen Sie den Assistenten auf die Website eines Kunden, damit Anfragen per E-Mail beim Betrieb ankommen.
Dauer: etwa 30 Minuten pro Kunde.

---

## Das Prinzip in einem Satz

Das **Formular** (Briefkasten) und der **Briefträger** (`anfrage.php`) kommen zusammen in einen Ordner
auf dem Webspace des Kunden. Der Briefträger schickt jede Anfrage als E-Mail an den Betrieb.

> **Wichtig:** Auf GitHub Pages funktioniert der Versand nicht. Dort bleibt es bei Ihrer Demo.

---

## Schritt 1: Diese Dinge vom Kunden besorgen

| Was | Wo findet der Kunde das? |
|---|---|
| **Zugang zum Webspace** (FTP oder Dateimanager) | Kundenbereich des Hosters (IONOS, Strato, All-Inkl …) oder beim Webdesigner |
| **Ein E-Mail-Postfach zum Versenden**, z. B. `anfrage@kundenfirma.de` | Kann im Kundenbereich des Hosters neu angelegt werden (empfohlen) |
| **Passwort** dieses Postfachs | Wird beim Anlegen festgelegt |
| **Empfänger-Adresse**, z. B. `info@kundenfirma.de` | Dort sollen die Anfragen ankommen |
| **Postleitzahlen** des Einsatzgebiets, Firmenname, Farben | Beim Kunden erfragen |

---

## Schritt 2: Die Dateien vorbereiten (auf Ihrem Computer)

1. Laden Sie das Projekt von GitHub herunter: Grüner Knopf **„Code“ → „Download ZIP“**, dann entpacken.
2. **`config.js`** öffnen (mit einem einfachen Texteditor, z. B. Editor/TextEdit) und anpassen:
   - `mode: "demo"` ändern in **`mode: "live"`** ← wichtig, sonst wird nichts versendet!
   - Firmenname, Farben, Postleitzahlen usw. wie gewohnt eintragen.
3. Die Datei **`mail-config.beispiel.php`** kopieren und die Kopie **`mail-config.php`** nennen.
4. **`mail-config.php`** öffnen und die Angaben des Kunden eintragen:

```php
'empfaenger' => 'info@kundenfirma.de',        // hier kommen die Anfragen an
'firmenname' => 'Malerbetrieb Schmidt',
'website'    => 'www.kundenfirma.de',
'farbe'      => '#1E5B4F',                     // wie in config.js

'smtp' => [
    'server'           => 'smtp.ionos.de',        // siehe Tabelle unten
    'port'             => 587,
    'verschluesselung' => 'tls',
    'benutzer'         => 'anfrage@kundenfirma.de',
    'passwort'         => 'das-passwort',
],

'absender' => 'anfrage@kundenfirma.de',       // gleiche Adresse wie "benutzer"
```

**Server-Angaben der bekanntesten Hoster:**

| Hoster | server | port | verschluesselung |
|---|---|---|---|
| IONOS | `smtp.ionos.de` | `587` | `tls` |
| Strato | `smtp.strato.de` | `465` | `ssl` |
| All-Inkl | steht im KAS bei „E-Mail“ (z. B. `w0123456.kasserver.com`) | `587` | `tls` |
| Hetzner | `mail.your-server.de` | `587` | `tls` |
| Anderer Hoster | im Kundenbereich unter „E-Mail-Postfach → Einstellungen für E-Mail-Programme“ nachsehen | | |

> ⚠️ **`mail-config.php` enthält ein Passwort. Laden Sie diese Datei niemals auf GitHub hoch** – nur auf den Webspace des Kunden.

---

## Schritt 3: Hochladen auf den Webspace des Kunden

1. Mit dem Webspace verbinden – entweder mit dem kostenlosen Programm **FileZilla** (FTP-Zugangsdaten eingeben)
   oder über den **Dateimanager** im Kundenbereich des Hosters.
2. Im Hauptordner der Website einen neuen Ordner **`anfrage`** anlegen.
3. Diese Dateien und Ordner in den Ordner `anfrage` hochladen:

```
anfrage/
├── index.html
├── style.css
├── app.js
├── config.js           (mit mode: "live")
├── anfrage.php         (der Briefträger)
├── mail-config.php     (mit den Zugangsdaten)
├── .htaccess           (Schutz der Zugangsdaten)
└── phpmailer/          (der ganze Ordner)
```

> Die Datei `.htaccess` beginnt mit einem Punkt und ist auf dem Mac/PC manchmal versteckt.
> In FileZilla: Menü **Server → Anzeigen versteckter Dateien erzwingen**.

Nicht hochladen müssen Sie: `README.md`, diese Anleitung, `mail-config.beispiel.php`, `.gitignore`.

Das Formular ist jetzt erreichbar unter: **`https://www.kundenfirma.de/anfrage/`**

---

## Schritt 4: Testen

1. Die Adresse auf dem Handy öffnen – oben darf **kein** Demo-Banner mehr stehen.
2. Eine Testanfrage mit 1–2 Fotos abschicken.
3. Prüfen:
   - ✅ Die E-Mail kommt beim Empfänger an (auch im **Spam-Ordner** nachsehen).
   - ✅ Die Fotos sind in der E-Mail zu sehen.
   - ✅ Auf „Antworten“ tippen → die Adresse des Anfragenden erscheint.

**Kommt keine E-Mail an?** Siehe „Hilfe bei Problemen“ unten.

---

## Schritt 5: Button auf der Website setzen

Auf der Website des Kunden einen Knopf oder Link einfügen, z. B. **„Jetzt Angebot anfragen“**,
der auf `https://www.kundenfirma.de/anfrage/` zeigt. Gute Stellen: Startseite, Menü, Leistungsseiten.

- **WordPress:** Seite bearbeiten → Block „Button“ einfügen → Link eintragen.
- **Andere Systeme:** Link einfügen wie bei jeder anderen Seite.

---

## Schritt 6: Datenschutz

- In die **Datenschutzerklärung** des Kunden einen Abschnitt zum Anfrageformular aufnehmen
  (welche Daten, wozu, Übermittlung per E-Mail, keine Speicherung auf dem Server, Löschung nach Erledigung).
- Den Link zur Datenschutzerklärung in `config.js` bei **`privacyUrl`** eintragen (statt `"#"`).
- Mit dem Hoster sollte ein **Auftragsverarbeitungsvertrag (AVV)** bestehen – den bieten die großen Hoster im Kundenbereich zum Abschließen an.

---

## Hilfe bei Problemen

| Problem | Lösung |
|---|---|
| Nach „Anfrage senden“ kommt „Das Senden hat leider nicht geklappt“ | Zugangsdaten in `mail-config.php` prüfen (Server, Port, Benutzer, Passwort). Bei Strato `465` + `ssl` verwenden. |
| „Der Versand ist noch nicht eingerichtet“ | `mail-config.php` fehlt oder heißt falsch (z. B. noch `mail-config.beispiel.php`). |
| Es erscheint weiterhin die E-Mail-Vorschau | In `config.js` steht noch `mode: "demo"` → auf `"live"` ändern. |
| E-Mail landet im Spam | `absender` muss dieselbe Adresse sein wie `benutzer` und zur Domain des Kunden gehören. |
| Fehler beim Senden mit vielen Fotos | Beim Hoster das Upload-Limit prüfen (PHP-Einstellung `post_max_size` mindestens 16M). |
| Weiße Seite / Fehler 500 beim Senden | Beim Hoster **PHP 7.4 oder neuer** einstellen (im Kundenbereich unter „PHP-Version“). |

---

## Was der Briefträger automatisch erledigt

- Prüft alle Angaben noch einmal auf dem Server.
- **Spam-Schutz:** unsichtbares Fallenfeld, Mindest-Ausfüllzeit, höchstens 5 Anfragen pro Stunde vom selben Anschluss.
- Nimmt nur Anfragen von der eigenen Website an.
- Nimmt nur echte Fotos (JPG/PNG) an.
- Schickt die E-Mail im Stil der Demo-Vorschau – mit **DRINGEND**-Markierung, Fotos im Text und als Anhang.
- „Antworten“ geht direkt an den Anfragenden.
- Speichert **keine** Anfragen auf dem Server.
- Optional: Eingangsbestätigung an den Anfragenden (`'bestaetigung_an_kunden' => true` in `mail-config.php`).
