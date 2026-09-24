/*
 * Anfrage-Assistent – Demo
 * Reines JavaScript, kein Framework. Alle Eingaben liegen nur im
 * Arbeitsspeicher (Variable `state`) – keine Cookies, kein Web Storage.
 * Betriebsspezifische Inhalte kommen ausschließlich aus config.js.
 */
(function () {
  'use strict';

  const CFG = window.APP_CONFIG;
  if (!CFG) {
    document.getElementById('step-root').textContent = 'Konfiguration (config.js) konnte nicht geladen werden.';
    return;
  }

  /* ------------------------------------------------------------------
   * Konstanten
   * ------------------------------------------------------------------ */
  const STEP = { SERVICE: 1, DETAILS: 2, LOCATION: 3, TIMING: 4, PHOTOS: 5, CONTACT: 6, REVIEW: 7, DONE: 8 };
  const TOTAL_STEPS = 6;
  const STEP_NAMES = { 1: 'Leistung', 2: 'Details', 3: 'Einsatzort', 4: 'Zeitraum', 5: 'Fotos', 6: 'Kontakt', 7: 'Prüfen' };

  const PHOTO = {
    max: (CFG.photos && CFG.photos.maxCount) || 5,
    maxBytes: ((CFG.photos && CFG.photos.maxSizeMB) || 10) * 1024 * 1024,
    maxEdge: (CFG.photos && CFG.photos.maxEdgePx) || 1600,
    quality: 0.85
  };
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'];
  const ALLOWED_EXT = /\.(jpe?g|png|heic|heif)$/i;

  const POSTAL_CODES = (CFG.serviceArea && CFG.serviceArea.postalCodes || []).map(String);
  const CITIES = (CFG.serviceArea && CFG.serviceArea.cities) || {};

  const REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
   * Zustand (nur im Arbeitsspeicher)
   * ------------------------------------------------------------------ */
  function initialState() {
    return {
      step: STEP.SERVICE,
      editing: false,         // true = über "Ändern" aus der Zusammenfassung gekommen
      service: null,
      details: {},
      plz: '',
      city: '',
      cityAuto: false,
      timing: null,
      photos: [],             // { id, blob, url, width, height }
      processing: 0,
      contact: { name: '', phone: '', email: '', callback: '', privacy: false, website: '' },
      startedAt: Date.now(),
      submitting: false,
      preview: null
    };
  }
  let state = initialState();
  let photoSeq = 0;
  let navLock = false;

  /* ------------------------------------------------------------------
   * DOM
   * ------------------------------------------------------------------ */
  const form = document.getElementById('wizard');
  const root = document.getElementById('step-root');
  const progressEl = document.getElementById('progress');
  const progressLabel = document.getElementById('progress-label');
  const progressName = document.getElementById('progress-name');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const actionBar = document.getElementById('action-bar');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const barMsg = document.getElementById('bar-msg');

  /* ------------------------------------------------------------------
   * Hilfsfunktionen
   * ------------------------------------------------------------------ */
  const ICONS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    next: '<path d="M9 18l6-6-6-6"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
    gallery: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-9 9"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.01"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    phone: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    flex: '<path d="M7 7h13M17 4l3 3-3 3M17 17H4M7 14l-3 3 3 3"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
    noPerson: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 11-7.4M3 3l18 18"/>',
    clip: '<path d="M21 11l-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z"/>',
    restart: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'
  };

  function svg(inner, cls) {
    return '<svg class="' + (cls || 'icon') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }
  function icon(name, cls) { return svg(ICONS[name] || '', cls); }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function currentService() {
    return CFG.services.find(function (s) { return s.id === state.service; }) || null;
  }
  function currentTiming() {
    return CFG.timingOptions.find(function (t) { return t.id === state.timing; }) || null;
  }
  function isInArea(plz) { return POSTAL_CODES.indexOf(plz) !== -1; }
  function formatBytes(n) {
    return n < 1024 * 1024 ? Math.round(n / 1024) + ' KB' : (n / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB';
  }
  function formatDate(d) {
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(d) + ' Uhr';
  }
  function randomDigits(n) {
    const arr = new Uint32Array(1);
    (window.crypto || window.msCrypto).getRandomValues(arr);
    const min = Math.pow(10, n - 1);
    return String(min + (arr[0] % (9 * min)));
  }

  /* ------------------------------------------------------------------
   * Branding aus config.js
   * ------------------------------------------------------------------ */
  function hexToRgb(hex) {
    let h = String(hex).replace('#', '').trim();
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(hex, withHex, amount) {
    const a = hexToRgb(hex), b = hexToRgb(withHex);
    return '#' + a.map(function (v, i) {
      return Math.round(v + (b[i] - v) * amount).toString(16).padStart(2, '0');
    }).join('');
  }
  function luminance(hex) {
    const c = hexToRgb(hex).map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function readableOn(hex) {
    const l = luminance(hex);
    return (1.05 / (l + 0.05)) >= ((l + 0.05) / 0.05) ? '#ffffff' : '#161a1d';
  }

  function applyBranding() {
    const s = document.documentElement.style;
    const p = CFG.colors.primary;
    const a = CFG.colors.accent;
    s.setProperty('--primary', p);
    s.setProperty('--primary-dark', mix(p, '#000000', 0.22));
    s.setProperty('--primary-soft', mix(p, '#ffffff', 0.88));
    s.setProperty('--primary-softer', mix(p, '#ffffff', 0.94));
    s.setProperty('--primary-ring', mix(p, '#ffffff', 0.55));
    s.setProperty('--on-primary', readableOn(p));
    s.setProperty('--accent', a);
    s.setProperty('--accent-soft', mix(a, '#ffffff', 0.84));
    s.setProperty('--accent-ink', mix(a, '#000000', 0.55));
    s.setProperty('--on-accent', readableOn(a));

    document.title = 'Anfrage – ' + CFG.company.name;
    document.getElementById('brand-logo').textContent = CFG.company.logoText || '';
    document.getElementById('brand-name').textContent = CFG.company.name;
    document.getElementById('brand-tagline').textContent = CFG.company.tagline || '';
  }

  /* ------------------------------------------------------------------
   * Bausteine
   * ------------------------------------------------------------------ */
  function stepHead(title, sub) {
    return '<header class="step-head">' +
      '<h1 class="step-title" tabindex="-1">' + esc(title) + '</h1>' +
      (sub ? '<p class="step-sub">' + esc(sub) + '</p>' : '') +
      '</header>';
  }

  function errorSlot(key) {
    return '<p class="field-error" id="err-' + esc(key) + '" role="alert" hidden></p>';
  }

  function notice(kind, iconName, html) {
    return '<div class="notice notice-' + kind + '">' + icon(iconName) + '<div>' + html + '</div></div>';
  }

  function choiceGroup(opts) {
    // opts: { key, name, legend, hint, options, value, optional }
    const short = opts.options.every(function (o) { return String(o).length <= 14; });
    const cols = !short ? 1 : (opts.options.length <= 3 ? opts.options.length : 2);
    const hintId = opts.hint ? 'hint-' + opts.key : '';
    return '<fieldset class="field" id="field-' + esc(opts.key) + '" aria-describedby="' + (hintId ? hintId + ' ' : '') + 'err-' + esc(opts.key) + '">' +
      '<legend class="label">' + esc(opts.legend) + (opts.optional ? ' <span class="optional">(freiwillig)</span>' : '') + '</legend>' +
      (opts.hint ? '<p class="hint" id="' + hintId + '">' + esc(opts.hint) + '</p>' : '') +
      '<div class="options cols-' + cols + '">' +
      opts.options.map(function (o) {
        const checked = opts.value === o ? ' checked' : '';
        return '<label class="opt"><input type="radio" name="' + esc(opts.name) + '" value="' + esc(o) + '"' + checked + '>' +
          '<span class="opt-ui"><span class="opt-dot" aria-hidden="true"></span><span class="opt-text">' + esc(o) + '</span></span></label>';
      }).join('') +
      '</div>' + errorSlot(opts.key) + '</fieldset>';
  }

  function textField(o) {
    // o: { key, name, label, type, value, autocomplete, inputmode, hint, maxlength, placeholder, optional }
    const describedBy = (o.hint ? 'hint-' + o.key + ' ' : '') + 'err-' + o.key;
    return '<div class="field" id="field-' + esc(o.key) + '">' +
      '<label class="label" for="in-' + esc(o.key) + '">' + esc(o.label) + (o.optional ? ' <span class="optional">(freiwillig)</span>' : '') + '</label>' +
      (o.hint ? '<p class="hint" id="hint-' + esc(o.key) + '">' + esc(o.hint) + '</p>' : '') +
      '<input class="input" id="in-' + esc(o.key) + '" name="' + esc(o.name) + '" type="' + (o.type || 'text') + '"' +
      ' value="' + esc(o.value) + '"' +
      (o.autocomplete ? ' autocomplete="' + o.autocomplete + '"' : '') +
      (o.inputmode ? ' inputmode="' + o.inputmode + '"' : '') +
      (o.maxlength ? ' maxlength="' + o.maxlength + '"' : '') +
      (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') +
      (o.extra || '') +
      ' aria-describedby="' + describedBy + '">' +
      (o.noError ? '' : errorSlot(o.key)) + '</div>';
  }

  /* ------------------------------------------------------------------
   * Schritt-Ansichten
   * ------------------------------------------------------------------ */
  const VIEWS = {};

  VIEWS[STEP.SERVICE] = function () {
    return stepHead('Was dürfen wir für Sie tun?', 'Wählen Sie die gewünschte Leistung – ein Tipp genügt.') +
      '<div class="tiles" id="field-service">' +
      CFG.services.map(function (s) {
        const sel = state.service === s.id;
        return '<button type="button" class="tile' + (sel ? ' is-selected' : '') + '" data-action="pick-service" data-id="' + esc(s.id) + '" aria-pressed="' + sel + '">' +
          '<span class="tile-icon">' + svg(s.icon, 'icon icon-lg') + '</span>' +
          '<span class="tile-label">' + esc(s.label) + '</span>' +
          (s.description ? '<span class="tile-sub">' + esc(s.description) + '</span>' : '') +
          '<span class="tile-check" aria-hidden="true">' + icon('check') + '</span>' +
          '</button>';
      }).join('') +
      '</div>' + errorSlot('service');
  };

  VIEWS[STEP.DETAILS] = function () {
    const svc = currentService();
    if (!svc) return '';
    return stepHead('Details: ' + svc.label, 'Ein paar kurze Angaben helfen uns, Ihr Vorhaben richtig einzuschätzen.') +
      svc.questions.map(function (q) {
        const value = state.details[q.id] || '';
        if (q.type === 'textarea') {
          const max = q.maxLength || 1000;
          return '<div class="field" id="field-' + esc(q.id) + '">' +
            '<label class="label" for="in-' + esc(q.id) + '">' + esc(q.label) + '</label>' +
            (q.warning ? notice('warn', 'lock', esc(q.warning)) : '') +
            '<textarea class="input textarea" id="in-' + esc(q.id) + '" name="d:' + esc(q.id) + '" rows="6" maxlength="' + max + '"' +
            (q.placeholder ? ' placeholder="' + esc(q.placeholder) + '"' : '') +
            ' aria-describedby="count-' + esc(q.id) + ' err-' + esc(q.id) + '">' + esc(value) + '</textarea>' +
            '<div class="counter" id="count-' + esc(q.id) + '"><span data-counter="' + esc(q.id) + '">' + value.length + '</span> / ' + max + ' Zeichen</div>' +
            errorSlot(q.id) + '</div>';
        }
        return choiceGroup({
          key: q.id, name: 'd:' + q.id, legend: q.label, hint: q.hint,
          options: q.options, value: value, optional: q.required === false
        });
      }).join('');
  };

  VIEWS[STEP.LOCATION] = function () {
    const areaList = POSTAL_CODES.map(function (p) {
      return '<li>' + esc(p) + (CITIES[p] ? ' <span>' + esc(CITIES[p]) + '</span>' : '') + '</li>';
    }).join('');
    return stepHead('Wo soll gearbeitet werden?', 'Wir prüfen direkt, ob der Ort in unserem Einsatzgebiet liegt.') +
      '<div class="row-plz">' +
      textField({ key: 'plz', name: 'plz', label: 'Postleitzahl', value: state.plz, autocomplete: 'postal-code', inputmode: 'numeric', maxlength: 5, extra: ' pattern="[0-9]*"', noError: true }) +
      textField({ key: 'city', name: 'city', label: 'Ort', value: state.city, autocomplete: 'address-level2', noError: true }) +
      '</div>' +
      '<div class="row-errors">' + errorSlot('plz') + errorSlot('city') + '</div>' +
      '<div id="area-status" class="area-status" aria-live="polite">' + areaStatusHtml() + '</div>' +
      '<div class="area-box">' +
      '<p class="area-title">' + icon('pin') + '<span>Unser Einsatzgebiet</span></p>' +
      '<ul class="area-list">' + areaList + '</ul></div>';
  };

  function areaStatusHtml() {
    if (/^\d{5}$/.test(state.plz) && isInArea(state.plz)) {
      const city = CITIES[state.plz] ? ' ' + CITIES[state.plz] : '';
      return '<p class="status-ok">' + icon('check') + '<span>Prima – ' + esc(state.plz + city) + ' liegt in unserem Einsatzgebiet.</span></p>';
    }
    return '';
  }

  VIEWS[STEP.TIMING] = function () {
    return stepHead('Wann soll es losgehen?', 'Damit wir Ihre Anfrage richtig einplanen können.') +
      '<fieldset class="field" id="field-timing" aria-describedby="err-timing">' +
      '<legend class="sr-only">Gewünschter Zeitraum</legend>' +
      '<div class="cards">' +
      CFG.timingOptions.map(function (t) {
        const checked = state.timing === t.id ? ' checked' : '';
        return '<label class="card-opt"><input type="radio" name="timing" value="' + esc(t.id) + '"' + checked + '>' +
          '<span class="card-ui">' +
          '<span class="card-icon urg-' + esc(t.urgency) + '">' + icon(t.icon || 'calendar') + '</span>' +
          '<span class="card-text"><strong>' + esc(t.label) + '</strong>' + (t.description ? '<small>' + esc(t.description) + '</small>' : '') + '</span>' +
          '<span class="card-radio" aria-hidden="true"></span>' +
          '</span></label>';
      }).join('') +
      '</div>' + errorSlot('timing') + '</fieldset>';
  };

  VIEWS[STEP.PHOTOS] = function () {
    return stepHead('Haben Sie Fotos?', 'Freiwillig – Fotos helfen uns, den Aufwand besser einzuschätzen.') +
      notice('warn', 'noPerson', '<strong>Bitte keine Personen fotografieren.</strong> Nur die Flächen und Räume, um die es geht.') +
      '<div class="upload-actions">' +
      '<div class="upload-btn">' +
      '<input type="file" class="file-input" id="photo-camera" accept="image/*" capture="environment" data-photo-input>' +
      '<label for="photo-camera" class="btn btn-primary btn-block">' + icon('camera') + '<span>Foto aufnehmen</span></label>' +
      '</div>' +
      '<div class="upload-btn">' +
      '<input type="file" class="file-input" id="photo-gallery" accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif" multiple data-photo-input>' +
      '<label for="photo-gallery" class="btn btn-secondary btn-block">' + icon('gallery') + '<span>Aus Galerie wählen</span></label>' +
      '</div>' +
      '</div>' +
      '<p class="hint hint-center">Bis zu ' + PHOTO.max + ' Fotos · JPG, PNG oder HEIC · max. ' + Math.round(PHOTO.maxBytes / 1048576) + ' MB pro Bild</p>' +
      '<div id="err-photos" class="photo-messages" aria-live="polite"></div>' +
      '<div id="photo-area"></div>' +
      '<p class="privacy-mini">' + icon('shield') + '<span>Ihre Bilder werden direkt auf Ihrem Gerät verkleinert. Standort- und Kameradaten werden dabei entfernt.</span></p>';
  };

  VIEWS[STEP.CONTACT] = function () {
    const c = state.contact;
    return stepHead('Wie erreichen wir Sie?', 'Wir melden uns persönlich bei Ihnen – ohne Werbung, versprochen.') +
      textField({ key: 'name', name: 'c:name', label: 'Ihr Name', value: c.name, autocomplete: 'name', maxlength: 100 }) +
      '<fieldset class="field field-group" id="field-reach" aria-describedby="hint-reach err-reach">' +
      '<legend class="label">So erreichen wir Sie</legend>' +
      '<p class="hint" id="hint-reach">Telefon oder E-Mail – mindestens eine Angabe.</p>' +
      textField({ key: 'phone', name: 'c:phone', label: 'Telefon', type: 'tel', value: c.phone, autocomplete: 'tel', inputmode: 'tel', maxlength: 30 }) +
      textField({ key: 'email', name: 'c:email', label: 'E-Mail', type: 'email', value: c.email, autocomplete: 'email', inputmode: 'email', maxlength: 120 }) +
      errorSlot('reach') +
      '</fieldset>' +
      choiceGroup({ key: 'callback', name: 'c:callback', legend: 'Wann erreichen wir Sie am besten?', options: CFG.callbackTimes, value: c.callback, optional: true }) +
      // Honeypot: für Menschen unsichtbar, Bots füllen es oft aus
      '<div class="hp" aria-hidden="true">' +
      '<label for="hp-website">Webseite – bitte leer lassen</label>' +
      '<input type="text" id="hp-website" name="c:website" tabindex="-1" autocomplete="off" value="' + esc(c.website) + '">' +
      '</div>' +
      '<div class="privacy-box field" id="field-privacy">' +
      '<p class="privacy-text">' + icon('shield') + '<span>' + esc(CFG.texts.privacyText) + ' Mehr dazu in unserer <a href="' + esc(CFG.texts.privacyUrl) + '" target="_blank" rel="noopener">Datenschutzerklärung</a>.</span></p>' +
      '<label class="check"><input type="checkbox" name="c:privacy" id="in-privacy"' + (c.privacy ? ' checked' : '') + ' aria-describedby="err-privacy">' +
      '<span>Ich habe die Datenschutzerklärung gelesen.</span></label>' +
      errorSlot('privacy') +
      '</div>';
  };

  VIEWS[STEP.REVIEW] = function () {
    const svc = currentService();
    const timing = currentTiming();
    const c = state.contact;

    const detailRows = svc.questions.map(function (q) {
      const v = state.details[q.id];
      return v ? row(q.short || q.label, v, q.type === 'textarea') : '';
    }).join('');

    const photosHtml = state.photos.length
      ? '<ul class="review-photos">' + state.photos.map(function (p, i) {
        return '<li><img src="' + p.url + '" alt="Foto ' + (i + 1) + '"></li>';
      }).join('') + '</ul>'
      : '<p class="muted">Keine Fotos hinzugefügt.</p>';

    return stepHead('Bitte prüfen Sie Ihre Angaben', 'Mit „Ändern“ passen Sie einen Abschnitt direkt an.') +
      reviewCard('Leistung', STEP.SERVICE,
        '<p class="review-service">' + svg(svc.icon, 'icon') + '<strong>' + esc(svc.label) + '</strong></p>') +
      reviewCard('Details', STEP.DETAILS, '<dl class="dl">' + detailRows + '</dl>') +
      reviewCard('Einsatzort', STEP.LOCATION, '<dl class="dl">' + row('PLZ / Ort', state.plz + ' ' + state.city.trim()) + '</dl>') +
      reviewCard('Zeitraum', STEP.TIMING, '<dl class="dl">' + row('Beginn', timing ? timing.label : '') + '</dl>') +
      reviewCard('Fotos (' + state.photos.length + ')', STEP.PHOTOS, photosHtml) +
      reviewCard('Kontakt', STEP.CONTACT, '<dl class="dl">' +
        row('Name', c.name.trim()) +
        (c.phone.trim() ? row('Telefon', c.phone.trim()) : '') +
        (c.email.trim() ? row('E-Mail', c.email.trim()) : '') +
        row('Rückruf', c.callback || 'keine Angabe') +
        row('Datenschutz', 'gelesen und bestätigt') +
        '</dl>') +
      '<p class="review-note">' + icon('info') + '<span>Mit „Anfrage senden“ übermitteln Sie Ihre Angaben unverbindlich an ' + esc(CFG.company.name) + '.</span></p>' +
      errorSlot('submit');
  };

  function reviewCard(title, step, body) {
    return '<section class="review-card">' +
      '<div class="review-head"><h2>' + esc(title) + '</h2>' +
      '<button type="button" class="btn-link" data-action="edit" data-step="' + step + '" aria-label="' + esc(title.replace(/\s*\(\d+\)$/, '')) + ' ändern">' + icon('edit') + '<span>Ändern</span></button>' +
      '</div><div class="review-body">' + body + '</div></section>';
  }
  function row(label, value, multiline) {
    return '<div class="dl-row"><dt>' + esc(label) + '</dt><dd' + (multiline ? ' class="pre"' : '') + '>' + esc(value) + '</dd></div>';
  }

  VIEWS[STEP.DONE] = function () {
    const d = state.preview;
    return '<div class="done">' +
      '<div class="done-check" aria-hidden="true">' + svg('<path d="M20 6L9 17l-5-5"/>', 'icon') + '</div>' +
      '<h1 class="step-title" tabindex="-1">Danke!</h1>' +
      '<p class="done-text">' + esc(CFG.texts.responseTime) + '</p>' +
      '<div class="request-id"><span>Ihre Anfragenummer</span><strong>' + esc(d ? d.requestId : '') + '</strong></div>' +
      '<p class="hint hint-center">Bitte geben Sie diese Nummer bei Rückfragen an.</p>' +
      '</div>' +
      (d ? '<section class="preview-wrap" aria-labelledby="preview-title">' +
        '<div class="preview-intro">' +
        '<span class="badge">Demo-Ansicht</span>' +
        '<h2 id="preview-title">Diese E-Mail erhält der Betrieb</h2>' +
        '<p>So landet die Anfrage fertig sortiert im Postfach von ' + esc(CFG.company.name) + ' – ohne Rückfragen, ohne Abtippen.</p>' +
        '</div>' + emailPreviewHtml(d) + '</section>' : '') +
      '<div class="done-actions"><button type="button" class="btn btn-secondary btn-block" data-action="restart">' + icon('restart') + '<span>Neue Anfrage starten</span></button></div>';
  };

  /* ------------------------------------------------------------------
   * E-Mail-Vorschau (Demo)
   * ------------------------------------------------------------------ */
  function emailPreviewHtml(d) {
    const urg = d.timing.urgency;
    const urgencyTitle = { high: 'Dringend', medium: 'Planbar', low: 'Flexibel' }[urg] || '';
    const urgencyIcon = { high: 'bolt', medium: 'calendar', low: 'flex' }[urg] || 'calendar';
    const created = formatDate(new Date(d.createdAt));
    const c = d.contact;

    const mrow = function (label, value, cls) {
      return '<tr><th scope="row">' + esc(label) + '</th><td' + (cls ? ' class="' + cls + '"' : '') + '>' + value + '</td></tr>';
    };

    const detailRows = d.details.map(function (x) {
      return mrow(x.label, esc(x.answer), x.multiline ? 'pre' : '');
    }).join('');

    const photos = d.photos.length
      ? '<div class="mail-photos">' + d.photos.map(function (p) {
        return '<figure><img src="' + p.url + '" alt="' + esc(p.name) + '"></figure>';
      }).join('') + '</div>' +
        '<ul class="mail-attach">' + d.photos.map(function (p) {
          return '<li>' + icon('clip') + '<span>' + esc(p.name) + '</span><small>' + formatBytes(p.size) + ' · ' + p.width + '×' + p.height + '</small></li>';
        }).join('') + '</ul>'
      : '<p class="mail-muted">Keine Fotos angehängt.</p>';

    return '<article class="mail" aria-label="E-Mail-Vorschau">' +
      '<div class="mail-toolbar" aria-hidden="true"><span></span><span></span><span></span><em>Posteingang</em></div>' +
      '<header class="mail-head">' +
      '<div class="mail-avatar" aria-hidden="true">' + esc(CFG.company.logoText || '') + '</div>' +
      '<div class="mail-meta">' +
      '<div class="mail-from"><strong>Anfrage-Assistent</strong> <span>&lt;' + esc(CFG.company.senderEmail) + '&gt;</span></div>' +
      '<div class="mail-line">An: ' + esc(CFG.company.email) + '</div>' +
      (c.email ? '<div class="mail-line">Antwort an: ' + esc(c.email) + '</div>' : '') +
      '<div class="mail-line">' + esc(created) + '</div>' +
      '</div>' +
      '</header>' +
      '<h3 class="mail-subject">' + (urg === 'high' ? '<span class="subject-flag">DRINGEND</span>' : '') +
      esc('Neue Anfrage: ' + d.service.label + ' · ' + d.location.plz + ' ' + d.location.city + ' · ') +
      '<span class="nowrap">' + esc(d.requestId) + '</span></h3>' +

      '<div class="mail-body">' +
      '<div class="urgency urgency-' + esc(urg) + '">' +
      '<span class="urgency-icon">' + icon(urgencyIcon) + '</span>' +
      '<div><strong>' + esc(urgencyTitle) + ': ' + esc(d.timing.label) + '</strong><span>' + esc(d.timing.note || '') + '</span></div>' +
      '</div>' +

      '<p class="mail-greeting">Hallo Team von ' + esc(CFG.company.name) + ',<br>über den Anfrage-Assistenten auf Ihrer Webseite ist eine neue Anfrage eingegangen.</p>' +

      '<div class="facts">' +
      fact('tool', 'Leistung', d.service.label) +
      fact('pin', 'Einsatzort', d.location.plz + ' ' + d.location.city) +
      fact('clock', 'Beginn', d.timing.label) +
      fact('phone', 'Rückruf', c.callbackTime || 'keine Angabe') +
      '</div>' +

      '<section class="mail-section"><h4>' + icon('user') + 'Kunde</h4>' +
      '<table class="mail-table"><tbody>' +
      mrow('Name', '<strong>' + esc(c.name) + '</strong>') +
      (c.phone ? mrow('Telefon', '<span class="mail-link">' + esc(c.phone) + '</span>') : '') +
      (c.email ? mrow('E-Mail', '<span class="mail-link">' + esc(c.email) + '</span>') : '') +
      mrow('Beste Rückrufzeit', esc(c.callbackTime || 'keine Angabe')) +
      '</tbody></table>' +
      '<div class="mail-actions" aria-hidden="true">' +
      (c.phone ? '<span class="mail-btn mail-btn-primary">' + icon('phone') + 'Anrufen</span>' : '') +
      (c.email ? '<span class="mail-btn">' + icon('mail') + 'Antworten</span>' : '') +
      '</div>' +
      '</section>' +

      '<section class="mail-section"><h4>' + svg(d.service.icon, 'icon') + 'Auftrag: ' + esc(d.service.label) + '</h4>' +
      '<table class="mail-table"><tbody>' + detailRows + '</tbody></table></section>' +

      '<section class="mail-section"><h4>' + icon('pin') + 'Einsatzort & Zeitraum</h4>' +
      '<table class="mail-table"><tbody>' +
      mrow('PLZ / Ort', esc(d.location.plz + ' ' + d.location.city)) +
      mrow('Einsatzgebiet', '<span class="tag tag-ok">' + icon('check') + 'im Einsatzgebiet</span>') +
      mrow('Gewünschter Beginn', '<span class="tag tag-' + esc(urg) + '">' + esc(d.timing.label) + '</span>') +
      '</tbody></table></section>' +

      '<section class="mail-section"><h4>' + icon('gallery') + 'Fotos (' + d.photos.length + ')</h4>' + photos + '</section>' +

      '<footer class="mail-foot">' +
      '<dl>' +
      '<div><dt>Anfragenummer</dt><dd>' + esc(d.requestId) + '</dd></div>' +
      '<div><dt>Eingang</dt><dd>' + esc(created) + '</dd></div>' +
      '<div><dt>Datenschutz</dt><dd>Kenntnisnahme bestätigt</dd></div>' +
      '<div><dt>Spam-Schutz</dt><dd>' + (d.honeypot ? '<span class="warn-text">Verdacht – würde verworfen</span>' : 'geprüft, unauffällig') + '</dd></div>' +
      '</dl>' +
      '<p>Diese Nachricht wurde automatisch vom Anfrage-Assistenten auf ' + esc(CFG.company.website || '') + ' erstellt. Fotos wurden verkleinert und ohne Standortdaten übermittelt.</p>' +
      '</footer>' +
      '</div></article>';
  }

  function fact(iconName, label, value) {
    return '<div class="fact">' + icon(iconName) + '<div><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong></div></div>';
  }

  /* ------------------------------------------------------------------
   * Rendern & Navigation
   * ------------------------------------------------------------------ */
  function render(direction, initial) {
    hideBarMessage();
    root.innerHTML = VIEWS[state.step]();

    if (state.step === STEP.PHOTOS) renderPhotoArea();
    updateProgress();
    updateActions();

    if (!initial && !REDUCED_MOTION) {
      root.classList.remove('anim-fwd', 'anim-back');
      void root.offsetWidth; // Animation neu starten
      root.classList.add(direction === 'back' ? 'anim-back' : 'anim-fwd');
    }
    if (!initial) {
      window.scrollTo(0, 0);
      const h = root.querySelector('.step-title');
      if (h) h.focus({ preventScroll: true });
    }
  }

  function goTo(step, direction) {
    if (step === STEP.REVIEW) state.editing = false;
    state.step = step;
    render(direction || 'fwd');
  }

  function updateProgress() {
    const s = state.step;
    if (s === STEP.DONE) { progressEl.hidden = true; return; }
    progressEl.hidden = false;
    const n = Math.min(s, TOTAL_STEPS);
    progressLabel.textContent = s <= TOTAL_STEPS ? 'Schritt ' + s + ' von ' + TOTAL_STEPS : 'Fast geschafft';
    progressName.textContent = STEP_NAMES[s] || '';
    progressFill.style.width = (s <= TOTAL_STEPS ? (s / TOTAL_STEPS) * 100 : 100) + '%';
    progressBar.setAttribute('aria-valuenow', String(n));
    progressBar.setAttribute('aria-valuetext', s <= TOTAL_STEPS ? 'Schritt ' + s + ' von ' + TOTAL_STEPS + ': ' + STEP_NAMES[s] : 'Zusammenfassung');
  }

  function updateActions() {
    const s = state.step;
    actionBar.hidden = s === STEP.DONE;
    document.body.classList.toggle('no-bar', s === STEP.DONE);
    btnBack.disabled = s === STEP.SERVICE;

    let label = 'Weiter';
    let iconName = 'next';
    if (s === STEP.REVIEW) { label = 'Anfrage senden'; iconName = 'send'; }
    else if (state.editing && s !== STEP.SERVICE) { label = 'Übernehmen'; iconName = 'check'; }
    else if (s === STEP.CONTACT) { label = 'Angaben prüfen'; }
    else if (s === STEP.PHOTOS && state.photos.length === 0) { label = 'Ohne Fotos weiter'; }
    setNextButton(label, iconName);
  }

  function setNextButton(label, iconName) {
    btnNext.innerHTML = '<span class="btn-label">' + esc(label) + '</span>' + svg(ICONS[iconName], 'icon');
  }

  function next() {
    if (state.submitting || navLock) return;
    try {
      const s = state.step;
      if (s === STEP.REVIEW) { submit(); return; }

      // Werte direkt aus den Feldern übernehmen – Autofill (z. B. Safari)
      // löst nicht immer ein input-/change-Ereignis aus.
      syncFromDom();

      const errors = validate(s);
      if (errors.length) { showErrors(errors); return; }

      if (state.editing && s !== STEP.SERVICE) { goTo(STEP.REVIEW); return; }
      goTo(s + 1);
    } catch (err) {
      if (window.console) console.error(err);
      showBarMessage('Da ist etwas schiefgelaufen. Bitte versuchen Sie es noch einmal.');
    }
  }

  function syncFromDom() {
    root.querySelectorAll('input[name], textarea[name]').forEach(function (el) {
      if (el.type === 'radio' && !el.checked) return;
      if (el.name === 'city' && el.value === state.city) return; // cityAuto erhalten
      onFieldInput({ target: el });
    });
  }

  /* Hinweis direkt über den Buttons – bleibt sichtbar, auch wenn das
     fehlerhafte Feld weiter oben außerhalb des Bildschirms liegt. */
  function showBarMessage(text, targetKey) {
    barMsg.innerHTML = icon('alert') + '<span>' + esc(text) + '</span>' +
      (targetKey ? '<span class="bar-msg-link">Anzeigen</span>' : '');
    barMsg.setAttribute('data-target', targetKey || '');
    barMsg.hidden = false;
  }
  function hideBarMessage() {
    barMsg.hidden = true;
  }

  function focusField(key) {
    const field = document.getElementById('field-' + key) || document.getElementById('err-' + key);
    if (!field) return;
    const target = field.querySelector('input:checked') ||
      field.querySelector('input:not([tabindex="-1"]), textarea, button');
    const top = field.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: Math.max(0, top), behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
    if (target) target.focus({ preventScroll: true });
  }

  function back() {
    if (state.submitting || navLock) return;
    if (state.step <= STEP.SERVICE || state.step === STEP.DONE) return;
    goTo(state.step - 1, 'back');
  }

  function pickService(id, button) {
    if (navLock) return;
    const changed = state.service !== id;
    if (changed) {
      state.service = id;
      state.details = {};
    }
    // Auswahl kurz sichtbar machen, dann weiter
    root.querySelectorAll('.tile').forEach(function (t) {
      const on = t === button;
      t.classList.toggle('is-selected', on);
      t.setAttribute('aria-pressed', String(on));
    });
    clearError('service');
    navLock = true;
    setTimeout(function () {
      navLock = false;
      goTo(state.editing && !changed ? STEP.REVIEW : STEP.DETAILS);
    }, REDUCED_MOTION ? 0 : 220);
  }

  /* ------------------------------------------------------------------
   * Validierung
   * ------------------------------------------------------------------ */
  function validPhone(v) {
    return /^[+()\d\s\/.-]+$/.test(v) && v.replace(/\D/g, '').length >= 6;
  }
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }
  function outOfAreaMsg() {
    return CFG.texts.outOfArea || 'Leider außerhalb unseres Einsatzgebiets.';
  }

  function validate(step) {
    const e = [];
    const add = function (key, msg) { e.push({ key: key, msg: msg }); };

    switch (step) {
      case STEP.SERVICE:
        if (!state.service) add('service', 'Bitte wählen Sie eine Leistung aus.');
        break;

      case STEP.DETAILS:
        currentService().questions.forEach(function (q) {
          if (q.required === false) return;
          const v = String(state.details[q.id] || '').trim();
          if (!v) {
            add(q.id, q.type === 'textarea' ? 'Bitte beschreiben Sie kurz Ihr Anliegen.' : 'Bitte wählen Sie eine Antwort aus.');
          } else if (q.minLength && v.length < q.minLength) {
            add(q.id, 'Bitte beschreiben Sie Ihr Anliegen etwas genauer (mindestens ' + q.minLength + ' Zeichen).');
          }
        });
        break;

      case STEP.LOCATION:
        if (!/^\d{5}$/.test(state.plz)) add('plz', 'Bitte geben Sie eine 5-stellige Postleitzahl ein.');
        else if (!isInArea(state.plz)) add('plz', outOfAreaMsg());
        if (!state.city.trim()) add('city', 'Bitte geben Sie den Ort an.');
        break;

      case STEP.TIMING:
        if (!state.timing) add('timing', 'Bitte wählen Sie einen Zeitraum aus.');
        break;

      case STEP.PHOTOS:
        if (state.processing > 0) add('photos', 'Einen Moment bitte – Ihre Fotos werden noch vorbereitet.');
        break;

      case STEP.CONTACT: {
        const c = state.contact;
        const phone = c.phone.trim();
        const email = c.email.trim();
        if (c.name.trim().length < 2) add('name', 'Bitte geben Sie Ihren Namen an.');
        if (!phone && !email) {
          add('reach', 'Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an, damit wir Sie erreichen können.');
        }
        if (phone && !validPhone(phone)) add('phone', 'Bitte prüfen Sie die Telefonnummer.');
        if (email && !validEmail(email)) add('email', 'Bitte prüfen Sie die E-Mail-Adresse (z. B. name@beispiel.de).');
        if (!c.privacy) add('privacy', 'Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben.');
        break;
      }
    }
    return e;
  }

  function showError(key, msg) {
    const slot = document.getElementById('err-' + key);
    if (!slot) return;
    slot.innerHTML = icon('alert') + '<span>' + esc(msg) + '</span>';
    slot.hidden = false;
    const field = document.getElementById('field-' + key);
    if (field) {
      field.classList.add('has-error');
      field.querySelectorAll('input:not([type=hidden]), textarea').forEach(function (i) {
        if (i.name !== 'c:website') i.setAttribute('aria-invalid', 'true');
      });
    }
  }

  function clearError(key) {
    const slot = document.getElementById('err-' + key);
    if (slot && !slot.hidden) { slot.hidden = true; slot.textContent = ''; }
    const field = document.getElementById('field-' + key);
    if (field && field.classList.contains('has-error')) {
      field.classList.remove('has-error');
      field.querySelectorAll('[aria-invalid]').forEach(function (i) {
        // Nur zurücksetzen, wenn kein verschachteltes Feld noch einen Fehler hat
        const inner = i.closest('.has-error');
        if (!inner) i.removeAttribute('aria-invalid');
      });
    }
  }

  function showErrors(errors) {
    root.querySelectorAll('.field-error:not([hidden])').forEach(function (el) {
      clearError(el.id.slice(4));
    });
    errors.forEach(function (er) { showError(er.key, er.msg); });

    const first = errors[0];
    showBarMessage(errors.length === 1 ? first.msg : 'Bitte prüfen Sie die ' + errors.length + ' markierten Angaben.', first.key);
    focusField(first.key);
  }

  /* ------------------------------------------------------------------
   * Eingaben übernehmen
   * ------------------------------------------------------------------ */
  function onFieldInput(e) {
    const t = e.target;
    const name = t.name;
    if (!name) return;

    if (name.indexOf('d:') === 0) {
      const id = name.slice(2);
      state.details[id] = t.value;
      const counter = root.querySelector('[data-counter="' + id + '"]');
      if (counter) counter.textContent = t.value.length;
      clearError(id);
      return;
    }

    switch (name) {
      case 'plz': {
        const clean = t.value.replace(/\D/g, '').slice(0, 5);
        if (clean !== t.value) t.value = clean;
        state.plz = clean;
        if (clean.length === 5) {
          if (isInArea(clean)) {
            clearError('plz');
            if (CITIES[clean] && (!state.city.trim() || state.cityAuto)) {
              state.city = CITIES[clean];
              state.cityAuto = true;
              const cityInput = document.getElementById('in-city');
              if (cityInput) cityInput.value = state.city;
              clearError('city');
            }
          } else {
            showError('plz', outOfAreaMsg());
          }
        } else {
          clearError('plz');
        }
        const status = document.getElementById('area-status');
        if (status) status.innerHTML = areaStatusHtml();
        break;
      }
      case 'city':
        state.city = t.value;
        state.cityAuto = false;
        clearError('city');
        break;
      case 'timing':
        state.timing = t.value;
        clearError('timing');
        break;
      case 'c:name':
        state.contact.name = t.value;
        clearError('name');
        break;
      case 'c:phone':
        state.contact.phone = t.value;
        clearError('phone');
        clearError('reach');
        break;
      case 'c:email':
        state.contact.email = t.value;
        clearError('email');
        clearError('reach');
        break;
      case 'c:callback':
        state.contact.callback = t.value;
        break;
      case 'c:website':
        state.contact.website = t.value;
        break;
      case 'c:privacy':
        state.contact.privacy = t.checked;
        if (t.checked) clearError('privacy');
        break;
    }
  }

  /* ------------------------------------------------------------------
   * Fotos: prüfen, verkleinern, Metadaten entfernen
   * ------------------------------------------------------------------ */
  function isAllowedFile(file) {
    const type = (file.type || '').toLowerCase();
    if (ALLOWED_TYPES.indexOf(type) !== -1) return true;
    // Manche Geräte liefern bei HEIC keinen MIME-Typ -> Dateiendung prüfen
    if (!type || type === 'application/octet-stream') return ALLOWED_EXT.test(file.name);
    return false;
  }

  function decodeImage(file) {
    // 1. Versuch: createImageBitmap (berücksichtigt die EXIF-Drehung)
    const viaBitmap = ('createImageBitmap' in window)
      ? createImageBitmap(file, { imageOrientation: 'from-image' }).then(function (bmp) {
        return { source: bmp, width: bmp.width, height: bmp.height, cleanup: function () { bmp.close && bmp.close(); } };
      })
      : Promise.reject(new Error('no bitmap'));

    // 2. Versuch: klassisches <img>
    return viaBitmap.catch(function () {
      return new Promise(function (resolve, reject) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function () {
          resolve({ source: img, width: img.naturalWidth, height: img.naturalHeight, cleanup: function () { URL.revokeObjectURL(url); } });
        };
        img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('decode')); };
        img.src = url;
      });
    });
  }

  function processImage(file) {
    return decodeImage(file).then(function (img) {
      const scale = Math.min(1, PHOTO.maxEdge / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; // transparente PNGs auf Weiß
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img.source, 0, 0, w, h);
      img.cleanup();
      // Neu als JPEG speichern -> keine EXIF-/GPS-Daten mehr enthalten
      return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error('encode')); return; }
          resolve({ id: ++photoSeq, blob: blob, url: URL.createObjectURL(blob), width: w, height: h });
        }, 'image/jpeg', PHOTO.quality);
      });
    });
  }

  function handleFiles(fileList) {
    const files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return;
    const messages = [];
    const free = Math.max(0, PHOTO.max - state.photos.length - state.processing);

    if (files.length > free) {
      messages.push(free === 0
        ? 'Es sind bereits ' + PHOTO.max + ' Fotos ausgewählt.'
        : 'Es sind maximal ' + PHOTO.max + ' Fotos möglich – ' + (files.length - free) + ' Foto(s) wurden nicht übernommen.');
    }

    const accepted = [];
    files.slice(0, free).forEach(function (file) {
      if (!isAllowedFile(file)) {
        messages.push('„' + file.name + '“: Bitte nur JPG, PNG oder HEIC verwenden.');
      } else if (file.size > PHOTO.maxBytes) {
        messages.push('„' + file.name + '“ ist größer als ' + Math.round(PHOTO.maxBytes / 1048576) + ' MB.');
      } else {
        accepted.push(file);
      }
    });

    showPhotoMessages(messages);
    state.processing += accepted.length;
    renderPhotoArea();

    // Nacheinander verarbeiten (schont den Speicher auf dem Handy)
    accepted.reduce(function (chain, file) {
      return chain.then(function () {
        return processImage(file).then(function (photo) {
          state.photos.push(photo);
        }).catch(function () {
          messages.push('„' + file.name + '“ konnte nicht gelesen werden. HEIC-Bilder unterstützt nicht jeder Browser – bitte ggf. als JPG auswählen.');
          showPhotoMessages(messages);
        }).then(function () {
          state.processing--;
          renderPhotoArea();
          if (state.step === STEP.PHOTOS) updateActions();
        });
      });
    }, Promise.resolve());
  }

  function showPhotoMessages(messages) {
    const box = document.getElementById('err-photos');
    if (!box) return;
    box.innerHTML = messages.map(function (m) {
      return '<p class="field-error">' + icon('alert') + '<span>' + esc(m) + '</span></p>';
    }).join('');
  }

  function renderPhotoArea() {
    const area = document.getElementById('photo-area');
    if (!area) return;
    const count = state.photos.length;
    const full = count + state.processing >= PHOTO.max;

    let html = '<div class="photo-count"><span>' + count + ' von ' + PHOTO.max + ' Fotos</span>' +
      (state.processing ? '<span class="processing">Wird vorbereitet …</span>' : '') + '</div>';

    if (!count && !state.processing) {
      html += '<div class="photo-empty">' + icon('gallery', 'icon icon-lg') + '<span>Noch keine Fotos ausgewählt</span></div>';
    } else {
      html += '<ul class="photo-grid">' +
        state.photos.map(function (p, i) {
          return '<li class="photo"><img src="' + p.url + '" alt="Foto ' + (i + 1) + '">' +
            '<button type="button" class="photo-del" data-action="del-photo" data-id="' + p.id + '" aria-label="Foto ' + (i + 1) + ' entfernen">' +
            '<span>' + icon('trash') + '</span></button></li>';
        }).join('') +
        new Array(state.processing + 1).join('<li class="photo is-loading"><span class="spinner" aria-hidden="true"></span><span class="sr-only">Foto wird vorbereitet</span></li>') +
        '</ul>';
    }
    area.innerHTML = html;

    root.querySelectorAll('[data-photo-input]').forEach(function (input) {
      input.disabled = full;
      const label = root.querySelector('label[for="' + input.id + '"]');
      if (label) label.classList.toggle('is-disabled', full);
    });
  }

  function deletePhoto(id) {
    const idx = state.photos.findIndex(function (p) { return p.id === id; });
    if (idx === -1) return;
    URL.revokeObjectURL(state.photos[idx].url);
    state.photos.splice(idx, 1);
    showPhotoMessages([]);
    renderPhotoArea();
    updateActions();
    // Fokus sinnvoll weitergeben
    const buttons = root.querySelectorAll('.photo-del');
    const nextFocus = buttons[Math.min(idx, buttons.length - 1)] || document.getElementById('photo-gallery');
    if (nextFocus) nextFocus.focus();
  }

  /* ------------------------------------------------------------------
   * Absenden
   * ------------------------------------------------------------------ */
  function buildRequestData() {
    const svc = currentService();
    const timing = currentTiming();
    const now = new Date();
    const c = state.contact;
    return {
      requestId: (CFG.requestIdPrefix || 'AN') + '-' + now.getFullYear() + '-' + randomDigits(4),
      createdAt: now.toISOString(),
      company: CFG.company.name,
      service: { id: svc.id, label: svc.label, icon: svc.icon },
      details: svc.questions
        .filter(function (q) { return String(state.details[q.id] || '').trim(); })
        .map(function (q) {
          return { id: q.id, label: q.short || q.label, question: q.label, answer: String(state.details[q.id]).trim(), multiline: q.type === 'textarea' };
        }),
      location: { plz: state.plz, city: state.city.trim() },
      timing: { id: timing.id, label: timing.label, urgency: timing.urgency, note: timing.emailNote || '' },
      photos: state.photos.map(function (p, i) {
        return { name: 'foto-' + (i + 1) + '.jpg', blob: p.blob, url: p.url, size: p.blob.size, width: p.width, height: p.height };
      }),
      contact: {
        name: c.name.trim(),
        phone: c.phone.trim(),
        email: c.email.trim(),
        callbackTime: c.callback
      },
      privacyAccepted: c.privacy,
      honeypot: c.website,
      fillTimeSeconds: Math.round((Date.now() - state.startedAt) / 1000)
    };
  }

  /**
   * Versendet die Anfrage.
   *
   * DEMO: Es wird NICHTS versendet. Die Funktion wartet kurz (damit es sich
   * echt anfühlt) und zeigt anschließend nur die E-Mail-Vorschau an.
   *
   * LIVE-BETRIEB: Den Inhalt dieser Funktion durch einen Aufruf an ein
   * PHP-Skript auf dem Webspace des Kunden ersetzen, z. B.:
   *
   *   async function sendRequest(data) {
   *     const fd = new FormData();
   *     const payload = Object.assign({}, data, { photos: undefined });
   *     fd.append('payload', JSON.stringify(payload));
   *     fd.append('website', data.honeypot);            // Honeypot serverseitig prüfen
   *     data.photos.forEach(function (p, i) { fd.append('foto' + (i + 1), p.blob, p.name); });
   *     const res = await fetch('anfrage.php', { method: 'POST', body: fd });
   *     if (!res.ok) throw new Error('Versand fehlgeschlagen');
   *     return res.json();
   *   }
   *
   * Muss ein Promise zurückgeben; ein Fehler (reject/throw) zeigt dem Nutzer
   * automatisch eine freundliche Fehlermeldung an.
   */
  function sendRequest(data) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        showEmailPreview(data);
        resolve({ ok: true, requestId: data.requestId });
      }, 900);
    });
  }

  function showEmailPreview(data) {
    state.preview = data;
  }

  function submit() {
    state.submitting = true;
    btnNext.disabled = true;
    btnBack.disabled = true;
    btnNext.classList.add('is-loading');
    btnNext.innerHTML = '<span class="spinner spinner-light" aria-hidden="true"></span><span class="btn-label">Wird gesendet …</span>';
    clearError('submit');

    const data = buildRequestData();
    Promise.resolve()
      .then(function () { return sendRequest(data); })
      .then(function () {
        state.submitting = false;
        btnNext.disabled = false;
        btnNext.classList.remove('is-loading');
        goTo(STEP.DONE);
      })
      .catch(function () {
        state.submitting = false;
        btnNext.disabled = false;
        btnNext.classList.remove('is-loading');
        updateActions();
        showError('submit', 'Das Senden hat leider nicht geklappt. Bitte versuchen Sie es in einem Moment noch einmal.');
      });
  }

  function restart() {
    state.photos.forEach(function (p) { URL.revokeObjectURL(p.url); });
    state = initialState();
    goTo(STEP.SERVICE, 'back');
  }

  /* ------------------------------------------------------------------
   * Ereignisse
   * ------------------------------------------------------------------ */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    next();
  });

  btnBack.addEventListener('click', back);

  form.addEventListener('input', onFieldInput);

  // Hinweis über den Buttons ausblenden, sobald keine Fehler mehr sichtbar sind
  form.addEventListener('input', function () {
    if (!barMsg.hidden && !root.querySelector('.field-error:not([hidden])')) hideBarMessage();
  });
  form.addEventListener('change', function () {
    if (!barMsg.hidden && !root.querySelector('.field-error:not([hidden])')) hideBarMessage();
  });

  barMsg.addEventListener('click', function () {
    const key = barMsg.getAttribute('data-target');
    if (key) focusField(key);
  });

  form.addEventListener('change', function (e) {
    const t = e.target;
    if (t.hasAttribute('data-photo-input')) {
      const files = t.files;
      handleFiles(files);
      t.value = '';
      return;
    }
    onFieldInput(e);
  });

  form.addEventListener('click', function (e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    switch (el.getAttribute('data-action')) {
      case 'pick-service':
        pickService(el.getAttribute('data-id'), el);
        break;
      case 'del-photo':
        deletePhoto(Number(el.getAttribute('data-id')));
        break;
      case 'edit':
        state.editing = true;
        goTo(Number(el.getAttribute('data-step')), 'back');
        break;
      case 'restart':
        restart();
        break;
    }
  });

  /* ------------------------------------------------------------------
   * Start
   * ------------------------------------------------------------------ */
  applyBranding();
  render('fwd', true);
})();
