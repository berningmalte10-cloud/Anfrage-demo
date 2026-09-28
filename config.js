/*
 * =====================================================================
 *  KONFIGURATION – Anfrage-Assistent
 * =====================================================================
 *  Hier stehen ALLE betriebsspezifischen Inhalte. Für einen anderen
 *  Betrieb oder ein anderes Gewerk muss nur diese Datei angepasst werden –
 *  app.js bleibt unverändert.
 *
 *  Hinweise zum Bearbeiten:
 *  - Texte immer in Anführungszeichen "..." schreiben.
 *  - Nach jedem Eintrag in einer Liste steht ein Komma.
 *  - Farben als Hex-Wert, z. B. "#1E5B4F".
 * =====================================================================
 */
window.APP_CONFIG = {

  /* ---------- Betriebsart ----------
   *  "demo" = nichts wird versendet, am Ende erscheint die E-Mail-Vorschau
   *  "live" = Anfrage wird über anfrage.php per E-Mail an den Betrieb gesendet
   *           (nur auf dem Webspace des Kunden, nicht auf GitHub Pages!)
   */
  mode: "demo",
  endpoint: "anfrage.php",

  /* ---------- Betrieb ---------- */
  company: {
    name: "Handwerk Muster GmbH",         // wird in der Demo durch das Gewerk-Beispiel ersetzt
    logoText: "HM",                       // 1–3 Zeichen im Logo-Quadrat
    tagline: "Ihr Meisterbetrieb aus der Region",
    email: "info@handwerk-muster.de",     // Empfänger der Anfragen (für die E-Mail-Vorschau)
    senderEmail: "anfrage@handwerk-muster.de",
    website: "www.handwerk-muster.de"
  },

  /* ---------- Farben ---------- */
  colors: {
    primary: "#1E5B4F", // Hauptfarbe: Buttons, Auswahl, Fortschrittsbalken
    accent: "#E3A33B"   // Akzentfarbe: kleine Hervorhebungen
  },

  /* ---------- Texte ---------- */
  texts: {
    responseTime: "Wir melden uns in der Regel innerhalb von 2 Werktagen.",
    privacyUrl: "#", // Link zur Datenschutzerklärung
    privacyText: "Ihre Angaben verwenden wir ausschließlich, um Ihre Anfrage zu bearbeiten. Eine Weitergabe an Dritte erfolgt nicht.",
    outOfArea: "Leider außerhalb unseres Einsatzgebiets. Wir sind derzeit nur in den unten genannten Postleitzahl-Gebieten für Sie da."
  },

  /* ---------- Anfragenummer ---------- */
  requestIdPrefix: "AN", // ergibt z. B. AN-2026-4821

  /* ---------- Einsatzgebiet ---------- */
  serviceArea: {
    // Erlaubte Postleitzahlen
    postalCodes: ["46395", "46397", "46399", "46414", "46325"],
    // Optional: Ort wird bei Eingabe der PLZ automatisch vorgeschlagen
    cities: {
      "46395": "Bocholt",
      "46397": "Bocholt",
      "46399": "Bocholt",
      "46414": "Rhede",
      "46325": "Borken"
    }
  },

  /* ---------- Fotos ---------- */
  photos: {
    maxCount: 5,
    maxSizeMB: 10,
    maxEdgePx: 1600
  },

  /* ---------- Gewerk / Branche ----------
   *  trade: Welches Profil aus "trades" gilt. Für einen echten Betrieb das
   *         passende Gewerk eintragen (oder unten eigene Leistungen anlegen).
   *  In der Demo kann die Branche zusätzlich über den Link (?gewerk=elektro)
   *  oder über die Auswahl im ersten Schritt gewechselt werden.
   *  Mögliche Werte: "allgemein", "maler", "sanitaer", "elektro", "dach", "tischler", "garten", "boden"
   */
  trade: "allgemein",

  /* ---------- Icons ----------
   *  Inline-SVG-Inhalte (viewBox 0 0 24 24, Linien-Icons). In den Leistungen
   *  wird nur der Name angegeben, z. B. icon: "roller".
   */
  icons: {
    "roller": "<rect x=\"3\" y=\"3\" width=\"14\" height=\"6\" rx=\"1.5\"/><path d=\"M17 6h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-7v3\"/><rect x=\"10\" y=\"15\" width=\"4\" height=\"6\" rx=\"1\"/>",
    "house": "<path d=\"M3 11l9-7 9 7\"/><path d=\"M5 9.5V20h14V9.5\"/><path d=\"M10 20v-5h4v5\"/><path d=\"M8 12h.01M16 12h.01\"/>",
    "wallpaper": "<circle cx=\"7\" cy=\"7\" r=\"3.5\"/><path d=\"M7 3.5h12.5v13l-2.5 2-2.5-2-2.5 2-2.5-2-2.5 2V10.5\"/>",
    "floor": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18M3 15h18M10 3v6M15 9v6M8 15v6\"/>",
    "tiles": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 12h18M12 3v18\"/>",
    "chat": "<path d=\"M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z\"/><path d=\"M8 11h.01M12 11h.01M16 11h.01\"/>",
    "bath": "<path d=\"M3 12h18v2a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-2z\"/><path d=\"M6 12V6a2 2 0 0 1 4 0\"/><path d=\"M7 20l-1 2M17 20l1 2\"/>",
    "flame": "<path d=\"M12 3c.5 3.5 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5.5.5 1.5 1.5 2.5 2.5 3 .5-2.5 0-5.5 0-8z\"/>",
    "drop": "<path d=\"M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z\"/><path d=\"M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5\"/>",
    "wrench": "<path d=\"M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z\"/>",
    "plug": "<path d=\"M9 2v6M15 2v6\"/><path d=\"M6 8h12v3a6 6 0 0 1-12 0V8z\"/><path d=\"M12 17v5\"/>",
    "bolt": "<path d=\"M13 2L4 14h7l-1 8 9-12h-7l1-8z\"/>",
    "car": "<path d=\"M5 17h14v-5l-2-5H7l-2 5v5z\"/><path d=\"M5 12h14\"/><circle cx=\"8\" cy=\"17\" r=\"2\"/><circle cx=\"16\" cy=\"17\" r=\"2\"/>",
    "sun": "<rect x=\"3\" y=\"11\" width=\"18\" height=\"10\" rx=\"1\"/><path d=\"M3 16h18M9 11v10M15 11v10\"/><path d=\"M12 2v3M5.6 4.6l1.6 1.6M18.4 4.6l-1.6 1.6\"/>",
    "roof": "<path d=\"M2 13L12 4l10 9\"/><path d=\"M5 11v9h14v-9\"/><path d=\"M8 14h8M8 17h8\"/>",
    "roofrepair": "<path d=\"M2 13L12 4l10 9\"/><path d=\"M5 11v9h14v-9\"/><path d=\"M12 12v5M9.5 14.5h5\"/>",
    "layers": "<path d=\"M12 3l9 5-9 5-9-5 9-5z\"/><path d=\"M3 13l9 5 9-5\"/>",
    "skylight": "<path d=\"M2 14L12 5l10 9\"/><path d=\"M9 11.5l3-2.5 3 2.5v4H9z\"/><path d=\"M5 12v8h14v-8\"/>",
    "window": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"1.5\"/><path d=\"M12 3v18M4 12h16\"/>",
    "door": "<path d=\"M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17\"/><path d=\"M4 21h16\"/><path d=\"M14.5 12h.01\"/>",
    "cabinet": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"1.5\"/><path d=\"M12 3v18M4 10h16\"/><path d=\"M10 6.5h-2M16 6.5h-2M10 14h-2M16 14h-2\"/>",
    "stairs": "<path d=\"M3 21h4v-4h4v-4h4V9h4V5h2\"/><path d=\"M3 21h18\"/>",
    "leaf": "<path d=\"M12 22V12\"/><path d=\"M12 12C8 12 5 9 5 5c4 0 7 3 7 7zM12 14c4 0 7-3 7-7-4 0-7 3-7 7z\"/>",
    "paving": "<path d=\"M3 5h8v5H3zM13 5h8v5h-8zM3 14h5v5H3zM10 14h11v5H10z\"/>",
    "fence": "<path d=\"M5 21V6l2-3 2 3v15M15 21V6l2-3 2 3v15\"/><path d=\"M3 10h18M3 16h18\"/>",
    "scissors": "<circle cx=\"6\" cy=\"6\" r=\"3\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><path d=\"M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12\"/>"
  },

  /* ---------- Leistungen je Gewerk ----------
   *  label:    Name des Gewerks in der Branchen-Auswahl der Demo
   *  company:  Beispiel-Firmenname für die Demo (wird im Livebetrieb und bei
   *            ?firma=… durch den echten Namen ersetzt)
   *  services: Leistungen mit Detailfragen
   *      id / label / description / icon (Name aus "icons")
   *      questions: type "choice" = Auswahlknöpfe (options = Antworten)
   *                 type "textarea" = Freitext
   *                 short = Kurzbezeichnung für Zusammenfassung & E-Mail
   *                 required: false = freiwillige Frage
   */
  trades: {
    "allgemein": {
      "label": "Alle Gewerke (Beispiel)",
      "company": {
        "name": "Handwerk Muster GmbH",
        "logoText": "HM",
        "tagline": "Ihr Meisterbetrieb aus der Region"
      },
      "services": [
        {
          "id": "maler",
          "label": "Malerarbeiten",
          "description": "Innen & Fassade",
          "icon": "roller",
          "questions": [
            {
              "id": "bereich",
              "type": "choice",
              "short": "Bereich",
              "label": "Wo soll gestrichen werden?",
              "options": [
                "Innenräume",
                "Fassade",
                "Beides"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 50 m²",
                "50–150 m²",
                "über 150 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "moebel",
              "type": "choice",
              "short": "Möbel vorhanden",
              "label": "Stehen Möbel in den Räumen?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "bad",
          "label": "Bad & Sanitär",
          "description": "Sanierung & Reparatur",
          "icon": "bath",
          "questions": [
            {
              "id": "vorhaben",
              "type": "choice",
              "short": "Vorhaben",
              "label": "Was ist geplant?",
              "options": [
                "Komplettsanierung",
                "Teilsanierung",
                "Reparatur",
                "Neuinstallation"
              ]
            },
            {
              "id": "groesse",
              "type": "choice",
              "short": "Badgröße (ca.)",
              "label": "Wie groß ist das Bad ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 5 m²",
                "5–10 m²",
                "über 10 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "barrierefrei",
              "type": "choice",
              "short": "Barrierefrei",
              "label": "Soll das Bad barrierefrei werden?",
              "options": [
                "Ja",
                "Nein",
                "Weiß nicht"
              ]
            }
          ]
        },
        {
          "id": "heizung",
          "label": "Heizung",
          "description": "Neu, Wartung, Störung",
          "icon": "flame",
          "questions": [
            {
              "id": "anliegen",
              "type": "choice",
              "short": "Anliegen",
              "label": "Worum geht es?",
              "options": [
                "Neue Heizung",
                "Wartung",
                "Störung",
                "Beratung"
              ]
            },
            {
              "id": "art",
              "type": "choice",
              "short": "Heizungsart",
              "label": "Welche Heizung haben Sie heute?",
              "options": [
                "Gas",
                "Öl",
                "Wärmepumpe",
                "Andere",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "gebaeude",
              "type": "choice",
              "short": "Gebäude",
              "label": "Um welches Gebäude geht es?",
              "options": [
                "Wohnung",
                "Einfamilienhaus",
                "Mehrfamilienhaus",
                "Gewerbe"
              ]
            }
          ]
        },
        {
          "id": "elektro",
          "label": "Elektro",
          "description": "Installation & Störung",
          "icon": "plug",
          "questions": [
            {
              "id": "anliegen",
              "type": "choice",
              "short": "Anliegen",
              "label": "Worum geht es?",
              "options": [
                "Neuinstallation",
                "Erweiterung",
                "Störung / Defekt",
                "Wallbox",
                "Photovoltaik"
              ]
            },
            {
              "id": "gebaeude",
              "type": "choice",
              "short": "Gebäude",
              "label": "Um welches Gebäude geht es?",
              "options": [
                "Wohnung",
                "Einfamilienhaus",
                "Mehrfamilienhaus",
                "Gewerbe"
              ]
            },
            {
              "id": "baujahr",
              "type": "choice",
              "short": "Baujahr",
              "label": "Wann wurde das Gebäude gebaut?",
              "options": [
                "vor 1970",
                "1970–2000",
                "nach 2000",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "dach",
          "label": "Dach",
          "description": "Eindeckung & Reparatur",
          "icon": "roof",
          "questions": [
            {
              "id": "anliegen",
              "type": "choice",
              "short": "Anliegen",
              "label": "Was ist geplant?",
              "options": [
                "Neueindeckung",
                "Reparatur",
                "Dämmung",
                "Dachfenster",
                "Rinnen / Kamin"
              ]
            },
            {
              "id": "dachform",
              "type": "choice",
              "short": "Dachform",
              "label": "Welche Dachform hat das Haus?",
              "options": [
                "Satteldach",
                "Flachdach",
                "Walmdach",
                "Andere"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Dachfläche (ca.)",
              "label": "Wie groß ist die Dachfläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 100 m²",
                "100–200 m²",
                "über 200 m²",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "boden",
          "label": "Boden & Fliesen",
          "description": "Verlegen & Erneuern",
          "icon": "tiles",
          "questions": [
            {
              "id": "belag",
              "type": "choice",
              "short": "Belag",
              "label": "Welcher Belag soll verlegt werden?",
              "options": [
                "Fliesen",
                "Vinyl",
                "Laminat",
                "Parkett",
                "Noch offen"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 20 m²",
                "20–50 m²",
                "50–100 m²",
                "über 100 m²"
              ]
            },
            {
              "id": "altbelag",
              "type": "choice",
              "short": "Alten Belag entfernen",
              "label": "Muss der alte Belag entfernt werden?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "fenster",
          "label": "Fenster & Türen",
          "description": "Tischler & Schreiner",
          "icon": "window",
          "questions": [
            {
              "id": "anliegen",
              "type": "choice",
              "short": "Anliegen",
              "label": "Was ist geplant?",
              "options": [
                "Neue Fenster",
                "Neue Türen",
                "Reparatur",
                "Einbruchschutz"
              ]
            },
            {
              "id": "anzahl",
              "type": "choice",
              "short": "Anzahl",
              "label": "Um wie viele Fenster oder Türen geht es?",
              "options": [
                "1",
                "2–5",
                "6–10",
                "mehr als 10"
              ]
            },
            {
              "id": "material",
              "type": "choice",
              "short": "Material",
              "label": "Welches Material wünschen Sie?",
              "options": [
                "Kunststoff",
                "Holz",
                "Aluminium",
                "Noch offen"
              ]
            }
          ]
        },
        {
          "id": "garten",
          "label": "Garten & Außen",
          "description": "Pflaster, Terrasse, Zaun",
          "icon": "leaf",
          "questions": [
            {
              "id": "anliegen",
              "type": "choice",
              "short": "Anliegen",
              "label": "Was ist geplant?",
              "options": [
                "Pflaster",
                "Terrasse",
                "Zaun",
                "Gartenpflege",
                "Neuanlage"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 30 m²",
                "30–100 m²",
                "über 100 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "zugang",
              "type": "choice",
              "short": "Zufahrt für Maschinen",
              "label": "Kommt ein Minibagger an die Fläche heran?",
              "options": [
                "Ja",
                "Nein",
                "Weiß nicht"
              ]
            }
          ]
        },
        {
          "id": "sonstiges",
          "label": "Sonstiges",
          "description": "Ihr individuelles Anliegen",
          "icon": "chat",
          "questions": [
            {
              "id": "beschreibung",
              "type": "textarea",
              "short": "Beschreibung",
              "label": "Was dürfen wir für Sie tun?",
              "placeholder": "Beschreiben Sie kurz Ihr Vorhaben …",
              "warning": "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
              "minLength": 10,
              "maxLength": 1000
            }
          ]
        }
      ]
    },
    "maler": {
      "label": "Maler & Lackierer",
      "company": {
        "name": "Malerbetrieb Muster",
        "logoText": "MM",
        "tagline": "Meisterbetrieb für Farbe & Raum"
      },
      "services": [
        {
          "id": "innenanstrich",
          "label": "Innenanstrich",
          "description": "Wände & Decken",
          "icon": "roller",
          "questions": [
            {
              "id": "raeume",
              "type": "choice",
              "short": "Räume",
              "label": "Wie viele Räume sollen gestrichen werden?",
              "options": [
                "1 Raum",
                "2 Räume",
                "3–4 Räume",
                "5 oder mehr"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Wohnfläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 30 m²",
                "30–60 m²",
                "60–100 m²",
                "über 100 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "moebel",
              "type": "choice",
              "short": "Möbel vorhanden",
              "label": "Stehen Möbel in den Räumen?",
              "options": [
                "Ja",
                "Nein"
              ]
            },
            {
              "id": "decken",
              "type": "choice",
              "short": "Decken streichen",
              "label": "Sollen die Decken auch gestrichen werden?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "fassade",
          "label": "Fassade",
          "description": "Außenanstrich & Putz",
          "icon": "house",
          "questions": [
            {
              "id": "hausart",
              "type": "choice",
              "short": "Hausart",
              "label": "Um welche Art von Gebäude geht es?",
              "options": [
                "Einfamilienhaus",
                "Doppelhaushälfte",
                "Reihenhaus",
                "Mehrfamilienhaus",
                "Gewerbegebäude"
              ]
            },
            {
              "id": "stockwerke",
              "type": "choice",
              "short": "Stockwerke",
              "label": "Wie viele Stockwerke hat das Gebäude?",
              "options": [
                "1",
                "2",
                "3",
                "4 oder mehr"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fassadenfläche (ca.)",
              "label": "Wie groß ist die Fassadenfläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 100 m²",
                "100–200 m²",
                "200–400 m²",
                "über 400 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "geruest",
              "type": "choice",
              "short": "Gerüst nötig",
              "label": "Wird ein Gerüst benötigt?",
              "options": [
                "Ja",
                "Nein",
                "Weiß nicht"
              ]
            }
          ]
        },
        {
          "id": "tapezieren",
          "label": "Tapezieren",
          "description": "Raufaser, Vlies & Muster",
          "icon": "wallpaper",
          "questions": [
            {
              "id": "raeume",
              "type": "choice",
              "short": "Räume",
              "label": "Wie viele Räume sollen tapeziert werden?",
              "options": [
                "1 Raum",
                "2 Räume",
                "3–4 Räume",
                "5 oder mehr"
              ]
            },
            {
              "id": "tapetenart",
              "type": "choice",
              "short": "Tapetenart",
              "label": "Welche Tapete wünschen Sie?",
              "options": [
                "Raufaser",
                "Vliestapete",
                "Mustertapete",
                "Glasfaser",
                "Noch offen"
              ]
            },
            {
              "id": "alteTapete",
              "type": "choice",
              "short": "Alte Tapete entfernen",
              "label": "Muss alte Tapete entfernt werden?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "bodenbelag",
          "label": "Bodenbelag",
          "description": "Vinyl, Laminat & mehr",
          "icon": "floor",
          "questions": [
            {
              "id": "belagart",
              "type": "choice",
              "short": "Belagart",
              "label": "Welcher Belag soll verlegt werden?",
              "options": [
                "Vinyl / Designboden",
                "Laminat",
                "Teppichboden",
                "Parkett",
                "Noch offen"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 20 m²",
                "20–50 m²",
                "50–100 m²",
                "über 100 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "alterBelag",
              "type": "choice",
              "short": "Alten Belag entfernen",
              "label": "Muss der alte Belag entfernt werden?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "sonstiges",
          "label": "Sonstiges",
          "description": "Ihr individuelles Anliegen",
          "icon": "chat",
          "questions": [
            {
              "id": "beschreibung",
              "type": "textarea",
              "short": "Beschreibung",
              "label": "Was dürfen wir für Sie tun?",
              "placeholder": "z. B. Türen und Zargen lackieren, Treppenhaus streichen, Farbberatung …",
              "warning": "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
              "minLength": 10,
              "maxLength": 1000
            }
          ]
        }
      ]
    },
    "sanitaer": {
      "label": "Sanitär & Heizung",
      "company": {
        "name": "Sanitär & Heizung Muster",
        "logoText": "SH",
        "tagline": "Ihr Meisterbetrieb für Bad & Wärme"
      },
      "services": [
        {
          "id": "bad",
          "label": "Badsanierung",
          "description": "Komplett oder teilweise",
          "icon": "bath",
          "questions": [
            {
              "id": "vorhaben",
              "type": "choice",
              "short": "Vorhaben",
              "label": "Was ist geplant?",
              "options": [
                "Komplettsanierung",
                "Teilsanierung",
                "Nur Dusche / Wanne",
                "Barrierefreies Bad"
              ]
            },
            {
              "id": "groesse",
              "type": "choice",
              "short": "Badgröße (ca.)",
              "label": "Wie groß ist das Bad ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 5 m²",
                "5–10 m²",
                "über 10 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "wc",
              "type": "choice",
              "short": "Zweites WC",
              "label": "Gibt es ein weiteres WC, das mitgemacht werden soll?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "heizung",
          "label": "Neue Heizung",
          "description": "Wärmepumpe, Gas & mehr",
          "icon": "flame",
          "questions": [
            {
              "id": "art",
              "type": "choice",
              "short": "Heizung heute",
              "label": "Welche Heizung haben Sie heute?",
              "options": [
                "Gas",
                "Öl",
                "Wärmepumpe",
                "Andere",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "alter",
              "type": "choice",
              "short": "Alter der Heizung",
              "label": "Wie alt ist die Heizung?",
              "options": [
                "unter 10 Jahre",
                "10–20 Jahre",
                "über 20 Jahre",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "wunsch",
              "type": "choice",
              "short": "Gewünscht",
              "label": "Was interessiert Sie?",
              "options": [
                "Wärmepumpe",
                "Gas-Brennwert",
                "Hybrid",
                "Beratung"
              ]
            }
          ]
        },
        {
          "id": "stoerung",
          "label": "Störung & Notfall",
          "description": "Heizung, Wasser, Abfluss",
          "icon": "drop",
          "questions": [
            {
              "id": "problem",
              "type": "choice",
              "short": "Problem",
              "label": "Was ist passiert?",
              "options": [
                "Heizung aus",
                "Kein Warmwasser",
                "Wasserschaden",
                "Abfluss verstopft",
                "Anderes"
              ]
            },
            {
              "id": "gebaeude",
              "type": "choice",
              "short": "Gebäude",
              "label": "Um welches Gebäude geht es?",
              "options": [
                "Wohnung",
                "Einfamilienhaus",
                "Mehrfamilienhaus",
                "Gewerbe"
              ]
            }
          ]
        },
        {
          "id": "wartung",
          "label": "Wartung",
          "description": "Heizung & Therme",
          "icon": "wrench",
          "questions": [
            {
              "id": "geraet",
              "type": "choice",
              "short": "Gerät",
              "label": "Was soll gewartet werden?",
              "options": [
                "Gastherme",
                "Ölheizung",
                "Wärmepumpe",
                "Solaranlage"
              ]
            },
            {
              "id": "letzte",
              "type": "choice",
              "short": "Letzte Wartung",
              "label": "Wann war die letzte Wartung?",
              "options": [
                "vor 1 Jahr",
                "vor 2–3 Jahren",
                "länger her",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "sonstiges",
          "label": "Sonstiges",
          "description": "Ihr individuelles Anliegen",
          "icon": "chat",
          "questions": [
            {
              "id": "beschreibung",
              "type": "textarea",
              "short": "Beschreibung",
              "label": "Was dürfen wir für Sie tun?",
              "placeholder": "z. B. neuer Heizkörper, Außenwasserhahn, Enthärtungsanlage …",
              "warning": "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
              "minLength": 10,
              "maxLength": 1000
            }
          ]
        }
      ]
    },
    "elektro": {
      "label": "Elektro",
      "company": {
        "name": "Elektro Muster",
        "logoText": "EM",
        "tagline": "Ihr Elektromeister aus der Region"
      },
      "services": [
        {
          "id": "installation",
          "label": "Installation",
          "description": "Neu, Umbau, Erweiterung",
          "icon": "plug",
          "questions": [
            {
              "id": "umfang",
              "type": "choice",
              "short": "Umfang",
              "label": "Was ist geplant?",
              "options": [
                "Komplette Neuinstallation",
                "Einzelne Räume",
                "Zusätzliche Steckdosen",
                "Beleuchtung"
              ]
            },
            {
              "id": "gebaeude",
              "type": "choice",
              "short": "Gebäude",
              "label": "Um welches Gebäude geht es?",
              "options": [
                "Wohnung",
                "Einfamilienhaus",
                "Mehrfamilienhaus",
                "Gewerbe"
              ]
            },
            {
              "id": "baujahr",
              "type": "choice",
              "short": "Baujahr",
              "label": "Wann wurde das Gebäude gebaut?",
              "options": [
                "vor 1970",
                "1970–2000",
                "nach 2000",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "stoerung",
          "label": "Störung",
          "description": "Sicherung, Ausfall, Defekt",
          "icon": "bolt",
          "questions": [
            {
              "id": "problem",
              "type": "choice",
              "short": "Problem",
              "label": "Was ist passiert?",
              "options": [
                "Sicherung fliegt raus",
                "Strom ganz weg",
                "Gerät defekt",
                "Brandgeruch",
                "Anderes"
              ]
            },
            {
              "id": "bereich",
              "type": "choice",
              "short": "Bereich",
              "label": "Wo tritt das Problem auf?",
              "options": [
                "Ein Raum",
                "Mehrere Räume",
                "Ganzes Haus",
                "Außenbereich"
              ]
            }
          ]
        },
        {
          "id": "wallbox",
          "label": "Wallbox",
          "description": "Laden zu Hause",
          "icon": "car",
          "questions": [
            {
              "id": "stellplatz",
              "type": "choice",
              "short": "Stellplatz",
              "label": "Wo soll geladen werden?",
              "options": [
                "Garage",
                "Carport",
                "Außenstellplatz",
                "Tiefgarage"
              ]
            },
            {
              "id": "abstand",
              "type": "choice",
              "short": "Entfernung",
              "label": "Wie weit ist es vom Stromkasten entfernt?",
              "options": [
                "unter 10 m",
                "10–25 m",
                "über 25 m",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "pv",
          "label": "Photovoltaik",
          "description": "Solaranlage & Speicher",
          "icon": "sun",
          "questions": [
            {
              "id": "dach",
              "type": "choice",
              "short": "Dach",
              "label": "Welche Dachform hat das Haus?",
              "options": [
                "Satteldach",
                "Flachdach",
                "Pultdach",
                "Andere"
              ]
            },
            {
              "id": "speicher",
              "type": "choice",
              "short": "Speicher",
              "label": "Wünschen Sie einen Stromspeicher?",
              "options": [
                "Ja",
                "Nein",
                "Weiß nicht"
              ]
            }
          ]
        },
        {
          "id": "sonstiges",
          "label": "Sonstiges",
          "description": "Ihr individuelles Anliegen",
          "icon": "chat",
          "questions": [
            {
              "id": "beschreibung",
              "type": "textarea",
              "short": "Beschreibung",
              "label": "Was dürfen wir für Sie tun?",
              "placeholder": "z. B. Smart Home, Türsprechanlage, E-Check …",
              "warning": "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
              "minLength": 10,
              "maxLength": 1000
            }
          ]
        }
      ]
    },
    "dach": {
      "label": "Dachdecker",
      "company": {
        "name": "Dachdeckerei Muster",
        "logoText": "DM",
        "tagline": "Ihr Meisterbetrieb für Dach & Wand"
      },
      "services": [
        {
          "id": "eindeckung",
          "label": "Neueindeckung",
          "description": "Ziegel, Schiefer, Blech",
          "icon": "roof",
          "questions": [
            {
              "id": "dachform",
              "type": "choice",
              "short": "Dachform",
              "label": "Welche Dachform hat das Haus?",
              "options": [
                "Satteldach",
                "Walmdach",
                "Flachdach",
                "Pultdach",
                "Andere"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Dachfläche (ca.)",
              "label": "Wie groß ist die Dachfläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 100 m²",
                "100–200 m²",
                "über 200 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "daemmung",
              "type": "choice",
              "short": "Dämmung",
              "label": "Soll das Dach gleichzeitig gedämmt werden?",
              "options": [
                "Ja",
                "Nein",
                "Weiß nicht"
              ]
            }
          ]
        },
        {
          "id": "reparatur",
          "label": "Reparatur",
          "description": "Undicht, Sturmschaden",
          "icon": "roofrepair",
          "questions": [
            {
              "id": "problem",
              "type": "choice",
              "short": "Problem",
              "label": "Was ist passiert?",
              "options": [
                "Dach undicht",
                "Sturmschaden",
                "Ziegel lose",
                "Anderes"
              ]
            },
            {
              "id": "dringend",
              "type": "choice",
              "short": "Wasser im Haus",
              "label": "Tritt bereits Wasser ins Haus ein?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "daemmung",
          "label": "Dämmung",
          "description": "Dach & oberste Decke",
          "icon": "layers",
          "questions": [
            {
              "id": "art",
              "type": "choice",
              "short": "Art",
              "label": "Was soll gedämmt werden?",
              "options": [
                "Dachschräge",
                "Oberste Geschossdecke",
                "Flachdach",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "genutzt",
              "type": "choice",
              "short": "Dachboden bewohnt",
              "label": "Wird der Dachboden als Wohnraum genutzt?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "fenster",
          "label": "Dachfenster",
          "description": "Neu oder Austausch",
          "icon": "skylight",
          "questions": [
            {
              "id": "anzahl",
              "type": "choice",
              "short": "Anzahl",
              "label": "Um wie viele Dachfenster geht es?",
              "options": [
                "1",
                "2",
                "3–4",
                "5 oder mehr"
              ]
            },
            {
              "id": "art",
              "type": "choice",
              "short": "Art",
              "label": "Neues Fenster oder Austausch?",
              "options": [
                "Neu einbauen",
                "Austausch",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "sonstiges",
          "label": "Sonstiges",
          "description": "Ihr individuelles Anliegen",
          "icon": "chat",
          "questions": [
            {
              "id": "beschreibung",
              "type": "textarea",
              "short": "Beschreibung",
              "label": "Was dürfen wir für Sie tun?",
              "placeholder": "z. B. Dachrinne, Kaminverkleidung, Carportdach …",
              "warning": "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
              "minLength": 10,
              "maxLength": 1000
            }
          ]
        }
      ]
    },
    "tischler": {
      "label": "Tischler & Schreiner",
      "company": {
        "name": "Tischlerei Muster",
        "logoText": "TM",
        "tagline": "Handwerk aus Holz, Maß für Maß"
      },
      "services": [
        {
          "id": "fenster",
          "label": "Fenster",
          "description": "Neu oder Austausch",
          "icon": "window",
          "questions": [
            {
              "id": "anzahl",
              "type": "choice",
              "short": "Anzahl",
              "label": "Um wie viele Fenster geht es?",
              "options": [
                "1",
                "2–5",
                "6–10",
                "mehr als 10"
              ]
            },
            {
              "id": "material",
              "type": "choice",
              "short": "Material",
              "label": "Welches Material wünschen Sie?",
              "options": [
                "Kunststoff",
                "Holz",
                "Holz-Alu",
                "Noch offen"
              ]
            }
          ]
        },
        {
          "id": "tueren",
          "label": "Türen",
          "description": "Haus- & Innentüren",
          "icon": "door",
          "questions": [
            {
              "id": "art",
              "type": "choice",
              "short": "Art",
              "label": "Welche Türen?",
              "options": [
                "Haustür",
                "Innentüren",
                "Beides"
              ]
            },
            {
              "id": "anzahl",
              "type": "choice",
              "short": "Anzahl",
              "label": "Wie viele Türen?",
              "options": [
                "1",
                "2–4",
                "5 oder mehr"
              ]
            }
          ]
        },
        {
          "id": "moebel",
          "label": "Möbel & Einbau",
          "description": "Schränke nach Maß",
          "icon": "cabinet",
          "questions": [
            {
              "id": "art",
              "type": "choice",
              "short": "Möbel",
              "label": "Was soll gebaut werden?",
              "options": [
                "Einbauschrank",
                "Küche",
                "Regal / Nische",
                "Anderes"
              ]
            },
            {
              "id": "raum",
              "type": "choice",
              "short": "Raum",
              "label": "In welchem Raum?",
              "options": [
                "Schlafzimmer",
                "Wohnzimmer",
                "Küche",
                "Dachschräge",
                "Anderer"
              ]
            }
          ]
        },
        {
          "id": "treppe",
          "label": "Treppen",
          "description": "Neu oder Renovierung",
          "icon": "stairs",
          "questions": [
            {
              "id": "art",
              "type": "choice",
              "short": "Vorhaben",
              "label": "Was ist geplant?",
              "options": [
                "Neue Treppe",
                "Renovierung",
                "Geländer"
              ]
            },
            {
              "id": "form",
              "type": "choice",
              "short": "Form",
              "label": "Welche Form hat die Treppe?",
              "options": [
                "Gerade",
                "Viertelgewendelt",
                "Halbgewendelt",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "sonstiges",
          "label": "Sonstiges",
          "description": "Ihr individuelles Anliegen",
          "icon": "chat",
          "questions": [
            {
              "id": "beschreibung",
              "type": "textarea",
              "short": "Beschreibung",
              "label": "Was dürfen wir für Sie tun?",
              "placeholder": "z. B. Reparatur, Insektenschutz, Holzboden …",
              "warning": "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
              "minLength": 10,
              "maxLength": 1000
            }
          ]
        }
      ]
    },
    "garten": {
      "label": "Garten- & Landschaftsbau",
      "company": {
        "name": "Garten- und Landschaftsbau Muster",
        "logoText": "GM",
        "tagline": "Ihr Fachbetrieb für Garten & Außenanlagen"
      },
      "services": [
        {
          "id": "pflaster",
          "label": "Pflaster & Wege",
          "description": "Einfahrt, Weg, Hof",
          "icon": "paving",
          "questions": [
            {
              "id": "bereich",
              "type": "choice",
              "short": "Bereich",
              "label": "Was soll gepflastert werden?",
              "options": [
                "Einfahrt",
                "Gartenweg",
                "Hof / Stellplatz",
                "Anderes"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 30 m²",
                "30–100 m²",
                "über 100 m²",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "alt",
              "type": "choice",
              "short": "Alten Belag entfernen",
              "label": "Muss ein alter Belag entfernt werden?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "terrasse",
          "label": "Terrasse",
          "description": "Holz, WPC oder Stein",
          "icon": "floor",
          "questions": [
            {
              "id": "material",
              "type": "choice",
              "short": "Material",
              "label": "Welches Material wünschen Sie?",
              "options": [
                "Holz",
                "WPC",
                "Naturstein",
                "Betonstein",
                "Noch offen"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß soll die Terrasse werden?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 20 m²",
                "20–40 m²",
                "über 40 m²",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "zaun",
          "label": "Zaun & Sichtschutz",
          "description": "Neu oder Austausch",
          "icon": "fence",
          "questions": [
            {
              "id": "art",
              "type": "choice",
              "short": "Art",
              "label": "Was wünschen Sie?",
              "options": [
                "Zaun",
                "Sichtschutz",
                "Tor",
                "Mauer"
              ]
            },
            {
              "id": "laenge",
              "type": "choice",
              "short": "Länge (ca.)",
              "label": "Wie lang ungefähr?",
              "options": [
                "bis 10 m",
                "10–30 m",
                "über 30 m",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "pflege",
          "label": "Gartenpflege",
          "description": "Schnitt, Rasen, Beete",
          "icon": "scissors",
          "questions": [
            {
              "id": "art",
              "type": "choice",
              "short": "Leistung",
              "label": "Was soll gemacht werden?",
              "options": [
                "Hecke schneiden",
                "Rasenpflege",
                "Baumschnitt",
                "Laufende Pflege"
              ]
            },
            {
              "id": "groesse",
              "type": "choice",
              "short": "Gartengröße (ca.)",
              "label": "Wie groß ist der Garten ungefähr?",
              "options": [
                "bis 200 m²",
                "200–500 m²",
                "über 500 m²",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "sonstiges",
          "label": "Sonstiges",
          "description": "Ihr individuelles Anliegen",
          "icon": "chat",
          "questions": [
            {
              "id": "beschreibung",
              "type": "textarea",
              "short": "Beschreibung",
              "label": "Was dürfen wir für Sie tun?",
              "placeholder": "z. B. Teich, Hochbeet, Rollrasen …",
              "warning": "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
              "minLength": 10,
              "maxLength": 1000
            }
          ]
        }
      ]
    },
    "boden": {
      "label": "Boden & Fliesen",
      "company": {
        "name": "Boden & Fliesen Muster",
        "logoText": "BF",
        "tagline": "Ihr Fachbetrieb für schöne Böden"
      },
      "services": [
        {
          "id": "fliesen",
          "label": "Fliesen",
          "description": "Bad, Küche, Boden",
          "icon": "tiles",
          "questions": [
            {
              "id": "raum",
              "type": "choice",
              "short": "Raum",
              "label": "Wo sollen Fliesen verlegt werden?",
              "options": [
                "Bad",
                "Küche",
                "Wohnbereich",
                "Terrasse",
                "Anderes"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 10 m²",
                "10–30 m²",
                "30–60 m²",
                "über 60 m²"
              ]
            },
            {
              "id": "wand",
              "type": "choice",
              "short": "Auch Wände",
              "label": "Sollen auch Wände gefliest werden?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "vinyl",
          "label": "Vinyl & Laminat",
          "description": "Klicken oder kleben",
          "icon": "floor",
          "questions": [
            {
              "id": "belag",
              "type": "choice",
              "short": "Belag",
              "label": "Welcher Belag?",
              "options": [
                "Vinyl / Designboden",
                "Laminat",
                "Noch offen"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 20 m²",
                "20–50 m²",
                "50–100 m²",
                "über 100 m²"
              ]
            },
            {
              "id": "alt",
              "type": "choice",
              "short": "Alten Belag entfernen",
              "label": "Muss der alte Belag entfernt werden?",
              "options": [
                "Ja",
                "Nein"
              ]
            }
          ]
        },
        {
          "id": "parkett",
          "label": "Parkett",
          "description": "Verlegen & Schleifen",
          "icon": "layers",
          "questions": [
            {
              "id": "vorhaben",
              "type": "choice",
              "short": "Vorhaben",
              "label": "Was ist geplant?",
              "options": [
                "Neu verlegen",
                "Abschleifen",
                "Versiegeln / Ölen"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 20 m²",
                "20–50 m²",
                "50–100 m²",
                "über 100 m²"
              ]
            }
          ]
        },
        {
          "id": "estrich",
          "label": "Estrich & Ausgleich",
          "description": "Untergrund vorbereiten",
          "icon": "wrench",
          "questions": [
            {
              "id": "art",
              "type": "choice",
              "short": "Art",
              "label": "Was wird benötigt?",
              "options": [
                "Neuer Estrich",
                "Ausgleichsmasse",
                "Reparatur",
                "Weiß ich nicht"
              ]
            },
            {
              "id": "flaeche",
              "type": "choice",
              "short": "Fläche (ca.)",
              "label": "Wie groß ist die Fläche ungefähr?",
              "hint": "Eine grobe Schätzung genügt.",
              "options": [
                "bis 20 m²",
                "20–50 m²",
                "über 50 m²",
                "Weiß ich nicht"
              ]
            }
          ]
        },
        {
          "id": "sonstiges",
          "label": "Sonstiges",
          "description": "Ihr individuelles Anliegen",
          "icon": "chat",
          "questions": [
            {
              "id": "beschreibung",
              "type": "textarea",
              "short": "Beschreibung",
              "label": "Was dürfen wir für Sie tun?",
              "placeholder": "z. B. Treppe belegen, Sockelleisten, Silikonfugen …",
              "warning": "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
              "minLength": 10,
              "maxLength": 1000
            }
          ]
        }
      ]
    }
  },

  /* ---------- Zeitraum ----------
   *  urgency: "high" | "medium" | "low" – steuert die Hervorhebung in der E-Mail
   *  icon:    "bolt" | "calendar" | "flex"
   */
  timingOptions: [
    { id: "asap",  label: "So schnell wie möglich", description: "Kurzfristiger Bedarf",
      urgency: "high", icon: "bolt",
      emailNote: "Kunde wünscht einen schnellstmöglichen Beginn – bitte zeitnah melden." },
    { id: "1-3",   label: "In 1–3 Monaten", description: "Gut planbar",
      urgency: "medium", icon: "calendar",
      emailNote: "Beginn in 1–3 Monaten gewünscht." },
    { id: "flex",  label: "Flexibel", description: "Termin nach Absprache",
      urgency: "low", icon: "flex",
      emailNote: "Zeitlich flexibel – Termin nach Absprache." }
  ],

  /* ---------- Rückrufzeiten ---------- */
  callbackTimes: ["Morgens", "Mittags", "Nachmittags", "Egal"]
};
