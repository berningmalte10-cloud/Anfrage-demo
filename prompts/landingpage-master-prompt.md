# Master-Prompt: Landingpage für den Anfrage-Assistenten

> So verwenden: Den gesamten Text ab „ROLLE“ kopieren und einer KI (z. B. Claude Code) geben.
> Vorher alle Platzhalter in eckigen Klammern ausfüllen oder bewusst stehen lassen.

---

## ROLLE

Du bist ein erfahrener Webentwickler, Conversion-Texter und UX-Designer für kleine Handwerksbetriebe in Deutschland. Du schreibst klar, ehrlich und ohne Marketing-Floskeln. Du baust schnelle, barrierearme Seiten, die auf dem Handy perfekt funktionieren.

## KONTEXT

Ich biete Handwerksbetrieben (zuerst Malerbetrieben im Westmünsterland) einen **Anfrage-Assistenten** für ihre bestehende Website an:

- Kunden stellen auf dem Handy in 6 kurzen Schritten eine vollständige Anfrage: Leistung → Detailfragen per Auswahlknöpfen → PLZ/Ort (nur im Einsatzgebiet möglich) → gewünschter Zeitraum → bis zu 5 Fotos → Kontakt mit Datenschutz-Bestätigung → Zusammenfassung.
- Der Betrieb erhält eine übersichtlich gegliederte E-Mail: Betreff mit Leistung, PLZ und Anfragenummer, Dringlichkeit farbig hervorgehoben, alle Angaben, Fotos, „Antworten“ geht direkt an den Kunden.
- Keine Cookies, keine fremden Server, Anfragen werden nicht gespeichert. Fotos werden auf dem Gerät des Kunden verkleinert, Standortdaten entfernt.
- Der Assistent kommt als eigener Ordner zur bestehenden Website dazu, an der Website muss nichts umgebaut werden.
- Pro Betrieb angepasst: Firmenname, Farben, Leistungen, Fragen, Postleitzahlen.
- Eine Demo existiert bereits: `[DEMO-URL]` (Standard: https://berningmalte10-cloud.github.io/Anfrage-demo/). Sie akzeptiert Link-Parameter zur Personalisierung: `firma`, `farbe` (Hex, URL-kodiert), `plz` (kommagetrennt), `ort`, `web`, `kuerzel`.

**Vertriebsweg, für den die Landingpage gebaut wird:**
Ich rufe Betriebe an (Kaltakquise), stelle mich vor, prüfe mit Fragen, ob der Betrieb passt und das Problem hat (verpasste Anrufe, unvollständige Anfragen, unnötige Besichtigungen, Anfragen außerhalb des Einsatzgebiets, Büroarbeit abends). Wenn ja, schicke ich **noch während des Telefonats** mit seiner Zustimmung den Link zur Landingpage per SMS, WhatsApp oder E-Mail. Die Seite soll in 1–2 Minuten zeigen, wie es funktioniert und was es ihm bringt, und zum **Termin (15 Minuten, vor Ort oder per Video)** führen. Viele Empfänger öffnen den Link erst abends, die Seite muss also auch ohne mich am Telefon verständlich sein.

## ZIEL DER SEITE

1. **Hauptziel:** Der Inhaber vereinbart einen 15-Minuten-Termin (oder bestätigt den im Telefonat vereinbarten).
2. **Nebenziel:** Er probiert die Demo aus, idealerweise in seinen eigenen Farben und mit seinem Namen.
3. Er versteht in unter 60 Sekunden: Was ist das? Was bringt es mir? Was kostet es? Wie geht es weiter?

## ZIELGRUPPE (Leser der Seite)

- Inhaber eines Handwerksbetriebs mit 1–20 Mitarbeitenden, meist 35–60 Jahre alt.
- Liest auf dem Handy, oft zwischen zwei Baustellen oder abends auf dem Sofa.
- Wenig Zeit, kein Interesse an Technikbegriffen, misstrauisch gegenüber „Online-Marketing“.
- Denkt in Aufträgen, Stunden und Euro.
- Sprache: „Sie“, kurze Sätze, Alltagswörter aus dem Handwerk (Baustelle, Besichtigung, Angebot, Rückruf, Aufmaß).

## TECHNISCHE VORGABEN

- Nur **HTML, CSS und reines JavaScript**, kein Framework, kein Build-Schritt. Läuft direkt auf GitHub Pages und auf jedem einfachen Webspace.
- Dateien: `index.html`, `style.css`, `app.js`, `config.js`, `impressum.html`, `datenschutz.html`.
- **Keine externen Ressourcen:** keine Google Fonts, keine CDNs, keine eingebetteten Videos von YouTube o. Ä., keine Tracking- oder Analyse-Skripte, keine Icons von fremden Servern. Systemschriften und eigene Inline-SVG-Icons.
- **Keine Cookies, kein localStorage, kein sessionStorage.**
- Mobile-first, funktioniert ab 320 px Breite, große Tap-Flächen (mindestens 48 px), Kontraste nach WCAG AA, alle Bedienelemente per Tastatur erreichbar, sinnvolle Überschriften-Hierarchie, `lang="de"`.
- Schnell: Gesamtgröße unter 300 KB ohne Bilder, keine Layout-Sprünge, Bilder (falls vorhanden) als optimierte WebP/JPG mit `width`/`height`.
- `prefers-reduced-motion` respektieren.
- Alle austauschbaren Inhalte (Markenname, Kontaktdaten, Preise, Demo-URL, Standardwerte des Rechners, Texte der FAQ) in `config.js`, damit ich sie ohne Programmierkenntnisse ändern kann.

## PERSONALISIERUNG ÜBER LINK-PARAMETER

Die Seite liest beim Laden optionale Parameter und passt sich an. Nur im Arbeitsspeicher, nichts wird gespeichert.

| Parameter | Wirkung | Beispiel |
|---|---|---|
| `firma` | Überschrift „Für [Firma]“ im Hero, Name im Rechner und im Terminbereich | `firma=Malerbetrieb%20Klein-Uebbing` |
| `name` | Persönliche Anrede im Hero: „Guten Tag Herr Klein, …“ | `name=Herr%20Klein` |
| `farbe` | Akzentfarbe der Demo-Vorschau (nicht der ganzen Seite) | `farbe=%235cb83c` |
| `plz`, `ort`, `web` | werden 1:1 an den Demo-Link weitergereicht | `plz=46414&ort=Rhede` |
| `gewerk` | wählt Beispieltexte für das Gewerk (Standard: maler) | `gewerk=maler` |

Anforderungen:
- Werte strikt bereinigen (Länge begrenzen, nur erlaubte Zeichen, Farbe nur als `#rrggbb`), nie als HTML einsetzen (nur `textContent`).
- Ohne Parameter wirkt die Seite vollständig und allgemein („Für Malerbetriebe im Münsterland“).
- Der Button „Demo ausprobieren“ baut den Demo-Link mit denselben Parametern zusammen, damit die Demo in Name und Farbe des Betriebs erscheint.
- Zusätzlich eine kleine Hilfsseite `link-bauen.html` (nur für mich, `noindex`, nicht verlinkt): Formular mit Firma, Anrede, Farbe, PLZ, Ort → erzeugt den personalisierten Link mit Knöpfen „Kopieren“, „Per WhatsApp teilen“ (`https://wa.me/?text=…`) und „Per SMS teilen“ (`sms:?&body=…`). So kann ich ihn während des Telefonats in 20 Sekunden verschicken.

## AUFBAU DER SEITE (Reihenfolge und Inhalte)

Schreibe alle Texte fertig aus (auf Deutsch, Sie-Form). Die Vorschläge unten sind Richtung, nicht Pflichtwortlaut. Jeder Abschnitt hat eine klare Aufgabe; nichts wiederholt sich.

### 1. Kopfzeile
- Logo-Text `[MARKENNAME]` links, rechts ein kleiner Knopf „Termin vereinbaren“ (springt zu Abschnitt 9).
- Schlank, bleibt beim Scrollen nicht störend im Weg (optional sticky mit geringer Höhe).

### 2. Hero (erster Bildschirm auf dem Handy)
- Personalisierte Zeile, wenn `firma` gesetzt: „Für [Firma]“.
- Überschrift, die den Nutzen nennt, z. B.: „Vollständige Anfragen mit Fotos – auch wenn Sie auf der Baustelle sind.“
- Unterzeile (1 Satz): was es ist, z. B.: „Ein Anfrage-Assistent für Ihre Website: Ihre Kunden beschreiben ihr Vorhaben in 2 Minuten, Sie bekommen eine fertig sortierte E-Mail.“
- Zwei Knöpfe: primär „Demo ansehen“ (öffnet die personalisierte Demo in neuem Tab), sekundär „Was bringt mir das?“ (springt zum Rechner).
- Rechts bzw. darunter: eine **realistische Handy-Darstellung** des ersten Demo-Schritts (Leistungskacheln), gebaut mit HTML/CSS, kein Screenshot-Bild nötig.
- Kleine Vertrauenszeile: „Keine Cookies · Keine Daten auf fremden Servern · Einrichtung in einer Woche“.

### 3. Das Problem (kurz, wiedererkennbar)
- Überschrift z. B. „Kommt Ihnen das bekannt vor?“
- 4 kurze Karten mit Icon, jeweils 1 Satz: verpasste Anrufe auf der Baustelle · Anfragen ohne Angaben („Bitte um Angebot fürs Wohnzimmer“) · Hinfahren nur um zu sehen, wie groß die Fläche ist · Anfragen aus Orten, in denen Sie gar nicht arbeiten.
- Kein Dramatisieren, keine erfundenen Statistiken.

### 4. So funktioniert es (3 Schritte, visuell)
1. „Ihr Kunde tippt auf Ihrer Website auf ‚Angebot anfragen‘.“
2. „Er beantwortet ein paar Fragen und macht Fotos – in etwa 2 Minuten.“
3. „Sie bekommen eine sortierte E-Mail und können direkt ein Angebot schreiben oder zurückrufen.“
- Als horizontale Schrittfolge auf Tablet/Desktop, vertikal auf dem Handy, mit Verbindungslinie.

### 5. Die E-Mail, die Sie bekommen (wichtigstes Verkaufsargument)
- Nachgebaute, gut lesbare **Beispiel-E-Mail** (HTML/CSS, keine Grafik): Betreff „[DRINGEND] Neue Anfrage: Fassade · 46414 Rhede · MB-2026-4821“, farbiger Dringlichkeitsbalken, Kurzinfos (Leistung, Ort, Beginn, Rückrufzeit), Abschnitte Kunde / Auftrag / Fotos (Platzhalter-Kacheln in dezenten Farbtönen).
- Daneben bzw. darunter 3–4 Markierungen mit kurzen Erklärungen („Dringlichkeit sofort sichtbar“, „Alle Maße und Wünsche auf einen Blick“, „Fotos statt Anfahrt“, „Antworten geht direkt an den Kunden“).
- Beispieldaten klar als Beispiel kennzeichnen.

### 6. Rechner: „Was bringt Ihnen das?“
Interaktiver, ehrlicher Rechner mit Schiebereglern **und** Zahleneingabefeldern (beides synchron, beschriftet, per Tastatur bedienbar). Alle Standardwerte in `config.js`, bewusst vorsichtig gewählt.

**Eingaben (Standardwert):**
| Eingabe | Standard |
|---|---|
| Anfragen pro Woche | 5 |
| Anteil Anfragen, bei denen Sie zurückrufen/nachfragen müssen | 60 % |
| Minuten pro Rückfrage | 15 |
| Besichtigungen pro Monat nur zum Einschätzen des Aufwands | 4 |
| Davon mit Fotos vermeidbar | 50 % |
| Minuten pro Besichtigung inkl. Fahrt | 60 |
| Ihr Stundensatz (€) | 55 |
| Verpasste Anrufe pro Woche | 3 |
| Anteil davon, der stattdessen den Assistenten nutzt | 30 % |
| Anteil Anfragen, die zum Auftrag werden | 20 % |
| Durchschnittlicher Auftragswert (€) | 2.500 |

**Berechnung (Monat = 4,33 Wochen):**
- Gesparte Stunden = Anfragen × 4,33 × Rückfrage-Anteil × Minuten ÷ 60 + Besichtigungen × vermeidbar × Minuten ÷ 60
- Wert der Zeit = gesparte Stunden × Stundensatz
- Zusätzliche Anfragen = verpasste Anrufe × 4,33 × Anteil Assistent
- Mögliche zusätzliche Aufträge = zusätzliche Anfragen × Auftragsquote
- Möglicher zusätzlicher Auftragswert = Aufträge × Auftragswert
- Kosten = monatliche Gebühr aus `config.js` (29 €), einmalig 590 €
- Amortisation in Monaten = Einrichtung ÷ (Wert der Zeit − monatliche Gebühr), nur wenn positiv

**Ausgabe:**
- Große, klare Ergebniskarte: „Rund X Stunden pro Monat weniger Rückfragen und Anfahrten (≈ Y € Arbeitszeit)“ und „Rund Z zusätzliche Anfragen pro Monat“.
- Zusätzlicher Auftragswert **deutlich getrennt und vorsichtig formuliert** („möglicher zusätzlicher Auftragswert“), nicht in die Amortisation einrechnen.
- Zeile: „Die Einrichtung hat sich nach etwa N Monaten allein durch gesparte Zeit bezahlt gemacht.“
- Hinweis direkt am Ergebnis: „Schätzung auf Basis Ihrer Angaben. Keine Garantie.“
- Werte runden (Stunden auf 0,5, Euro auf 10), deutsches Zahlenformat.
- Ergebnis live aktualisieren, mit `aria-live="polite"`.
- Wenn `firma` gesetzt: „Ihre Schätzung für [Firma]“.

### 7. Das bekommen Sie (Leistungen)
- Liste mit Häkchen: Anpassung an Ihren Betrieb (Name, Farben, Leistungen, Fragen, Einsatzgebiet) · Einrichtung auf Ihrer Website inkl. Button · gemeinsame Testanfrage · Hilfe, wenn etwas hakt · kleine Änderungen inklusive.
- Datenschutz-Block: keine Cookies, keine fremden Server, keine Speicherung der Anfragen, Fotos ohne Standortdaten.

### 8. Preise
- Zwei Karten aus `config.js`: **Start** (590 € einmalig + 29 € / Monat) und **Plus** (890 € einmalig + 49 € / Monat) mit Leistungsunterschieden.
- Hinweis zur Umsatzsteuer aus `config.js` (z. B. „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“ – Text nur übernehmen, wenn ich ihn in `config.js` bestätige).
- **Pilotangebot** als Hervorhebung, steuerbar über `config.js` (an/aus, Text, Anzahl Plätze): z. B. „Pilotphase: Die ersten 3 Betriebe erhalten die Einrichtung zum halben Preis – im Gegenzug für ehrliches Feedback.“ Keine künstliche Verknappung mit Countdown.
- Monatlich kündbar bzw. Kündigungsfrist aus `config.js`.

### 9. Termin vereinbaren (Hauptziel)
- Überschrift z. B. „15 Minuten, und Sie sehen es auf Ihrer eigenen Website.“
- Kurz, was im Termin passiert: Vorschau auf der eigenen Website, Demo in eigenen Farben, Fragen klären, fester Preis.
- **Terminanfrage im Stil des Anfrage-Assistenten** (das Produkt selbst erleben): 3 kleine Schritte – (1) vor Ort oder per Video, (2) Wunschtage und Tageszeit als Auswahlknöpfe, (3) Name, Betrieb, Telefon. Pflichtfelder, Fehlermeldungen direkt am Feld, Honeypot-Feld, Datenschutz-Checkbox mit Link.
- Versand über eine Funktion `sendBooking(data)` in `app.js`, die an `[BOOKING-ENDPOINT]` (z. B. ein PHP-Skript) sendet. Solange kein Endpoint in `config.js` steht: Danke-Meldung anzeigen und darunter klar sagen, dass die Terminanfrage in dieser Version nicht versendet wurde, plus Telefonnummer.
- Alternativ immer sichtbar: Telefonnummer als Text (kopierbar) und WhatsApp-Link aus `config.js`.

### 10. Häufige Fragen (FAQ, aufklappbar mit `<details>`)
Mindestens diese Fragen, Antworten kurz und ehrlich:
- Muss ich meine Website ändern? (Nein, es kommt ein Ordner und ein Button dazu.)
- Funktioniert das mit meiner Website? (Bei den meisten Hostern ja; bei reinen Baukästen ohne PHP gibt es eine Lösung über eine Subdomain.)
- Landen die Anfragen im Spam? (Versand über Ihr eigenes Postfach, Test bei der Einrichtung, Absender wird als sicher markiert.)
- Was ist mit Datenschutz? (Keine Cookies, keine Speicherung, Hinweis für Ihre Datenschutzerklärung liefere ich mit – keine Rechtsberatung.)
- Was, wenn ein Kunde lieber anruft? (Telefon bleibt; der Assistent ist ein zusätzlicher Weg.)
- Kann ich Fragen und Leistungen ändern lassen? (Ja, kleine Änderungen sind in der Betreuung enthalten.)
- Wie schnell ist es eingerichtet? (In der Regel innerhalb einer Woche.)
- Wie kann ich kündigen? (Frist aus `config.js`.)

### 11. Über mich
- Kurzer persönlicher Absatz aus `config.js`: Name `[IHR NAME]`, Region `[REGION]`, warum ich das mache, Foto optional (`[FOTO-PFAD]`, lokal gespeichert).
- Ehrlich: noch junges Angebot, persönliche Betreuung aus der Region.

### 12. Fußzeile
- Impressum, Datenschutz (eigene Seiten), Kontakt, Copyright-Jahr automatisch.

## RECHTLICHES (verbindlich einhalten)

- `impressum.html` mit Platzhaltern für die Angaben nach § 5 DDG (Name, Anschrift, Kontakt, ggf. USt-IdNr.). Keine erfundenen Daten.
- `datenschutz.html` als **Gerüst** mit Platzhaltern (Verantwortlicher, Hosting, Terminanfrage, Rechte der Betroffenen) und dem sichtbaren Hinweis, dass der Text rechtlich geprüft werden muss.
- Keine erfundenen Kundenstimmen, Bewertungen, Logos, Kundenzahlen oder Statistiken. Gibt es noch keine Referenzen, entfällt der Abschnitt; stattdessen das Pilotangebot. Platz für echte Referenzen später über `config.js` (leer = ausgeblendet).
- Keine Versprechen wie „garantiert mehr Aufträge“. Der Rechner ist als Schätzung gekennzeichnet.
- Kein Tracking, keine Öffnungsverfolgung, keine Cookies – daher kein Cookie-Banner nötig.
- `<meta name="robots" content="noindex">` nur auf `link-bauen.html`; die Landingpage selbst darf indexiert werden (über `config.js` umschaltbar).

## DESIGN

- Seriös, freundlich, handwerklich, modern. Weißer oder sehr heller Hintergrund, eine Hauptfarbe und eine Akzentfarbe aus `config.js` (Vorschlag: tiefes Grün `#1E5B4F` und warmes Ocker `#E3A33B`, passend zur Demo).
- Systemschriften: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; klare Typo-Skala, Überschriften kräftig, Fließtext 17–18 px auf dem Handy.
- Abgerundete Karten nur dort, wo etwas ein eigenes Objekt ist (Handy-Mockup, E-Mail, Preise, Rechner-Ergebnis). Nicht jede Fläche als Karte.
- Großzügige Abstände, maximal ca. 65 Zeichen pro Zeile.
- Dezente Einblend-Animationen nur beim ersten Anzeigen, nichts, das Inhalte versteckt, bis gescrollt wird.
- Keine Emojis als Gestaltungselement, keine Stockfotos von lächelnden Menschen im Anzug.
- Hell- und Dunkelmodus nicht nötig; die Seite ist bewusst hell, setzt aber alle Farben explizit.

## TEXT-REGELN

- Sie-Form, aktive Sätze, meist unter 20 Wörtern.
- Nutzen vor Funktion („Sie sparen die Anfahrt“ statt „Foto-Upload-Funktion“).
- Keine Anglizismen, wo es ein normales Wort gibt (Anfrage statt Lead, Termin statt Call).
- Zahlen konkret und ehrlich; Beispiele als Beispiele kennzeichnen.
- Jeder Knopf sagt, was passiert („Demo ansehen“, „Termin anfragen“), nicht „Mehr erfahren“.

## `config.js` – mindestens diese Felder

```js
window.LANDING_CONFIG = {
  brand: { name: "[MARKENNAME]", tagline: "Anfrage-Assistent für Handwerksbetriebe" },
  owner: { name: "[IHR NAME]", region: "[REGION]", about: "[2–3 Sätze über mich]", photo: "" },
  contact: { phone: "[TELEFON]", email: "[E-MAIL]", whatsapp: "[WHATSAPP-NUMMER ohne +]" },
  colors: { primary: "#1E5B4F", accent: "#E3A33B" },
  demoUrl: "https://berningmalte10-cloud.github.io/Anfrage-demo/",
  bookingEndpoint: "",          // leer = Terminanfrage wird nicht versendet (Hinweis anzeigen)
  pricing: {
    start: { once: 590, monthly: 29 },
    plus:  { once: 890, monthly: 49 },
    vatNote: "",                // z. B. Hinweis Kleinunternehmer, erst nach Prüfung eintragen
    cancellation: "monatlich kündbar",
    pilot: { enabled: true, seats: 3, text: "[Text zum Pilotangebot]" }
  },
  calculatorDefaults: { /* alle Standardwerte aus Abschnitt 6 */ },
  faq: [ /* { q: "...", a: "..." } */ ],
  references: [],               // leer = Abschnitt ausgeblendet
  indexable: true
};
```

## LIEFERUMFANG

1. Alle Dateien vollständig (`index.html`, `style.css`, `app.js`, `config.js`, `impressum.html`, `datenschutz.html`, `link-bauen.html`).
2. Eine `README.md` auf Deutsch: Veröffentlichen auf GitHub Pages Schritt für Schritt, Anpassen von `config.js`, Erzeugen eines personalisierten Links, Einrichten des Termin-Endpoints.
3. Am Ende eine kurze Liste aller Platzhalter, die ich noch ausfüllen muss.

## ABNAHMEKRITERIEN (bitte selbst prüfen, bevor du fertig meldest)

- [ ] Auf 375 px Breite ist im ersten Bildschirm klar, was angeboten wird, und ein Knopf zur Demo sichtbar.
- [ ] Mit `?firma=Malerbetrieb%20Beispiel&name=Herr%20Beispiel&farbe=%23b3261e&plz=46399&ort=Bocholt` erscheinen Anrede und Firmenname, und „Demo ansehen“ öffnet die Demo mit denselben Parametern.
- [ ] Ohne Parameter wirkt die Seite vollständig und allgemein.
- [ ] Schädliche Parameterwerte (z. B. `<script>`) werden nicht ausgeführt und nicht als HTML angezeigt.
- [ ] Der Rechner rechnet mit den Standardwerten nachvollziehbar (Rechenweg im Code kommentiert), aktualisiert live und ist per Tastatur bedienbar.
- [ ] Die Terminanfrage prüft Pflichtfelder mit Meldung am Feld, hat ein Honeypot-Feld und zeigt ohne Endpoint den ehrlichen Hinweis.
- [ ] Keine externen Anfragen im Netzwerk-Tab, keine Cookies, kein Web Storage.
- [ ] Keine erfundenen Referenzen, Zahlen oder Rechtstexte.
- [ ] `link-bauen.html` erzeugt korrekte, URL-kodierte Links und öffnet WhatsApp/SMS mit vorbereitetem Text:
      „Hallo [Anrede], wie besprochen hier der Link – in 2 Minuten sehen Sie, wie es funktioniert: [LINK]. Viele Grüße, [IHR NAME]“
- [ ] Lighthouse (mobil): Performance, Barrierefreiheit und Best Practices jeweils mindestens 90.

## PLATZHALTER, DIE ICH SPÄTER AUSFÜLLE

`[MARKENNAME]`, `[DOMAIN]`, `[IHR NAME]`, `[REGION]`, `[TELEFON]`, `[E-MAIL]`, `[WHATSAPP-NUMMER]`, `[FOTO-PFAD]`, `[BOOKING-ENDPOINT]`, `[DEMO-URL]`, Impressumsangaben, Datenschutzerklärung, Text zum Pilotangebot, Umsatzsteuer-Hinweis.
