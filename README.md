# Anfrage-Assistent – Demo (Malerbetrieb)

Mehrstufiger Anfrage-Assistent für Handwerksbetriebe. Reines HTML/CSS/JavaScript,
ohne Framework, ohne Build-Schritt und ohne externe Ressourcen. Läuft direkt auf GitHub Pages.

**Demo:** Es werden keine Daten versendet. Statt eines Versands zeigt die Seite am Ende
eine Vorschau der E-Mail, die der Betrieb erhalten würde.

## Dateien

| Datei        | Inhalt                                                              |
|--------------|---------------------------------------------------------------------|
| `index.html` | Grundgerüst der Seite                                               |
| `style.css`  | Gestaltung (Mobile-first)                                           |
| `app.js`     | Ablauf, Prüfungen, Foto-Verarbeitung, `sendRequest(data)`           |
| `config.js`  | **Alle betriebsspezifischen Inhalte** (Name, Farben, Leistungen, PLZ …) |

## Auf GitHub Pages veröffentlichen

1. Die Dateien auf den Branch `main` des Repositories bringen (z. B. diesen Branch mergen).
2. Auf GitHub im Repository **Settings → Pages** öffnen.
3. Unter **Build and deployment → Source** „Deploy from a branch“ wählen.
4. Branch `main` und Ordner `/ (root)` auswählen, **Save** klicken.
5. Nach ca. 1–2 Minuten ist die Seite erreichbar unter
   `https://<benutzername>.github.io/<repository>/`.

## Anpassen in `config.js`

- **Firmenname / Logo:** `company.name`, `company.logoText`, `company.tagline`
- **Farben:** `colors.primary` (Hauptfarbe) und `colors.accent` (Akzent) als Hex-Wert
- **Einsatzgebiet:** `serviceArea.postalCodes` (Liste der PLZ) und optional `serviceArea.cities`
- **Texte:** `texts.responseTime`, `texts.privacyUrl`, `texts.outOfArea`
- **Leistungen & Detailfragen:** `services`
- **Zeiträume / Rückrufzeiten:** `timingOptions`, `callbackTimes`

## Später: echter Versand

In `app.js` die Funktion `sendRequest(data)` durch einen `fetch()`-Aufruf an ein
PHP-Skript ersetzen. Ein Beispiel steht als Kommentar direkt über der Funktion.
Der Honeypot-Wert (`data.honeypot`) sollte serverseitig geprüft werden.
