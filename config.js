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

  /* ---------- Betrieb ---------- */
  company: {
    name: "Malerbetrieb Muster",
    logoText: "MM",                       // 1–3 Zeichen im Logo-Quadrat
    tagline: "Meisterbetrieb für Farbe & Raum",
    email: "info@malerbetrieb-muster.de", // Empfänger der Anfragen (für die E-Mail-Vorschau)
    senderEmail: "anfrage@malerbetrieb-muster.de",
    website: "www.malerbetrieb-muster.de"
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
  requestIdPrefix: "MB", // ergibt z. B. MB-2026-4821

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

  /* ---------- Leistungen ----------
   *  id:          interner Schlüssel (ohne Leerzeichen)
   *  label:       Name auf der Kachel
   *  description: kleine Zeile unter dem Namen
   *  icon:        Inline-SVG-Inhalt (viewBox 0 0 24 24, Linien-Icon)
   *  questions:   Detailfragen dieser Leistung
   *      type "choice"   = Auswahlknöpfe (options = Antworten)
   *      type "textarea" = Freitext
   *      short          = Kurzbezeichnung für Zusammenfassung & E-Mail
   *      required: false = freiwillige Frage
   */
  services: [
    {
      id: "innenanstrich",
      label: "Innenanstrich",
      description: "Wände & Decken",
      icon: '<rect x="3" y="3" width="14" height="6" rx="1.5"/><path d="M17 6h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-7v3"/><rect x="10" y="15" width="4" height="6" rx="1"/>',
      questions: [
        { id: "raeume", type: "choice", short: "Räume", label: "Wie viele Räume sollen gestrichen werden?",
          options: ["1 Raum", "2 Räume", "3–4 Räume", "5 oder mehr"] },
        { id: "flaeche", type: "choice", short: "Fläche (ca.)", label: "Wie groß ist die Wohnfläche ungefähr?",
          hint: "Eine grobe Schätzung genügt.",
          options: ["bis 30 m²", "30–60 m²", "60–100 m²", "über 100 m²", "Weiß ich nicht"] },
        { id: "moebel", type: "choice", short: "Möbel vorhanden", label: "Stehen Möbel in den Räumen?",
          options: ["Ja", "Nein"] },
        { id: "decken", type: "choice", short: "Decken streichen", label: "Sollen die Decken auch gestrichen werden?",
          options: ["Ja", "Nein"] }
      ]
    },
    {
      id: "fassade",
      label: "Fassade",
      description: "Außenanstrich & Putz",
      icon: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/><path d="M8 12h.01M16 12h.01"/>',
      questions: [
        { id: "hausart", type: "choice", short: "Hausart", label: "Um welche Art von Gebäude geht es?",
          options: ["Einfamilienhaus", "Doppelhaushälfte", "Reihenhaus", "Mehrfamilienhaus", "Gewerbegebäude"] },
        { id: "stockwerke", type: "choice", short: "Stockwerke", label: "Wie viele Stockwerke hat das Gebäude?",
          options: ["1", "2", "3", "4 oder mehr"] },
        { id: "flaeche", type: "choice", short: "Fassadenfläche (ca.)", label: "Wie groß ist die Fassadenfläche ungefähr?",
          hint: "Eine grobe Schätzung genügt.",
          options: ["bis 100 m²", "100–200 m²", "200–400 m²", "über 400 m²", "Weiß ich nicht"] },
        { id: "geruest", type: "choice", short: "Gerüst nötig", label: "Wird ein Gerüst benötigt?",
          options: ["Ja", "Nein", "Weiß nicht"] }
      ]
    },
    {
      id: "tapezieren",
      label: "Tapezieren",
      description: "Raufaser, Vlies & Muster",
      icon: '<circle cx="7" cy="7" r="3.5"/><path d="M7 3.5h12.5v13l-2.5 2-2.5-2-2.5 2-2.5-2-2.5 2V10.5"/>',
      questions: [
        { id: "raeume", type: "choice", short: "Räume", label: "Wie viele Räume sollen tapeziert werden?",
          options: ["1 Raum", "2 Räume", "3–4 Räume", "5 oder mehr"] },
        { id: "tapetenart", type: "choice", short: "Tapetenart", label: "Welche Tapete wünschen Sie?",
          options: ["Raufaser", "Vliestapete", "Mustertapete", "Glasfaser", "Noch offen"] },
        { id: "alteTapete", type: "choice", short: "Alte Tapete entfernen", label: "Muss alte Tapete entfernt werden?",
          options: ["Ja", "Nein"] }
      ]
    },
    {
      id: "bodenbelag",
      label: "Bodenbelag",
      description: "Vinyl, Laminat & mehr",
      icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M10 3v6M15 9v6M8 15v6"/>',
      questions: [
        { id: "belagart", type: "choice", short: "Belagart", label: "Welcher Belag soll verlegt werden?",
          options: ["Vinyl / Designboden", "Laminat", "Teppichboden", "Parkett", "Noch offen"] },
        { id: "flaeche", type: "choice", short: "Fläche (ca.)", label: "Wie groß ist die Fläche ungefähr?",
          hint: "Eine grobe Schätzung genügt.",
          options: ["bis 20 m²", "20–50 m²", "50–100 m²", "über 100 m²", "Weiß ich nicht"] },
        { id: "alterBelag", type: "choice", short: "Alten Belag entfernen", label: "Muss der alte Belag entfernt werden?",
          options: ["Ja", "Nein"] }
      ]
    },
    {
      id: "sonstiges",
      label: "Sonstiges",
      description: "Ihr individuelles Anliegen",
      icon: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
      questions: [
        { id: "beschreibung", type: "textarea", short: "Beschreibung", label: "Was dürfen wir für Sie tun?",
          placeholder: "z. B. Türen und Zargen lackieren, Treppenhaus streichen, Farbberatung …",
          warning: "Bitte keine sensiblen Angaben eintragen (z. B. Gesundheits- oder Bankdaten).",
          minLength: 10, maxLength: 1000 }
      ]
    }
  ],

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
