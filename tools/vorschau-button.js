/*
 * Vorschau-Button (Lesezeichen / Bookmarklet)
 * -------------------------------------------
 * Blendet auf der Website eines Handwerksbetriebs – nur im eigenen Browser –
 * einen Button "Jetzt Angebot anfragen" ein. Der Button führt zur Demo des
 * Anfrage-Assistenten, automatisch angepasst an den Betrieb
 * (Firmenname, Farbe, Postleitzahl/Ort, Domain).
 *
 * An der echten Website wird nichts verändert. Neu laden = Button weg.
 * Erneut tippen = Button wieder entfernen.
 *
 * Aus dieser Datei wird der Lesezeichen-Code erzeugt:
 *   node tools/build-bookmarklet.js
 * Nur Block-Kommentare verwenden (keine Zeilenkommentare mit zwei Schrägstrichen).
 */
(function () {
  var DEMO_URL = 'https://berningmalte10-cloud.github.io/Anfrage-demo/';
  var ID = 'aa-vorschau';

  var old = document.getElementById(ID);
  if (old) {
    old.remove();
    var oldCard = document.getElementById(ID + '-karte');
    if (oldCard) oldCard.remove();
    return;
  }

  /* ---------- Firmenname ---------- */
  function firmenname() {
    var generisch = /^(kontakt|startseite|home|impressum|leistungen|über uns|willkommen|referenzen)$/i;
    var og = document.querySelector('meta[property="og:site_name"]');
    if (og && og.content && og.content.trim()) return og.content.trim();
    var teile = String(document.title || '').split(/\s+[|–—\-:·»]\s+/)
      .map(function (t) { return t.trim(); })
      .filter(function (t) { return t && !generisch.test(t); });
    return teile[0] || location.hostname.replace(/^www\./, '');
  }

  /* ---------- Hauptfarbe der Website ---------- */
  function toHex(rgb) {
    var m = String(rgb).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if (!m || (m[4] !== undefined && parseFloat(m[4]) < 0.5)) return null;
    var r = +m[1], g = +m[2], b = +m[3];
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var l = (max + min) / 510;
    var s = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
    if (s < 0.25 || l < 0.12 || l > 0.8) return null; /* grau, fast schwarz, fast weiß */
    return '#' + [r, g, b].map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
  }
  function hauptfarbe() {
    var score = {};
    var add = function (c, w) { if (c) score[c] = (score[c] || 0) + w; };
    var theme = document.querySelector('meta[name="theme-color"]');
    if (theme && /^#[0-9a-f]{6}$/i.test(theme.content)) add(theme.content.toLowerCase(), 5);
    var els = document.querySelectorAll('header, nav, footer, button, .btn, .button, [class*="button"], [class*="btn"], a, h1, h2, h3');
    for (var i = 0; i < els.length && i < 600; i++) {
      var cs = getComputedStyle(els[i]);
      add(toHex(cs.backgroundColor), 3);
      add(toHex(cs.color), 1);
      add(toHex(cs.borderTopColor), 1);
    }
    var best = null, max = 0;
    for (var k in score) { if (score[k] > max) { max = score[k]; best = k; } }
    return best || '#1e5b4f';
  }

  /* ---------- Postleitzahl und Ort ---------- */
  function plzOrt() {
    var text = document.body.innerText || '';
    var re = /\b(\d{5})\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\-]+(?:[ \-](?:an der|am|im|a\. ?d\.|[A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\-]+))?)/g;
    var m, found = [];
    while ((m = re.exec(text)) && found.length < 5) {
      if (!/^(Uhr|Euro|EUR|Mo|Di|Mi|Do|Fr|Sa|So)$/.test(m[2])) found.push({ plz: m[1], ort: m[2].trim() });
    }
    return found[0] || null;
  }

  var farbe = hauptfarbe();
  var ort = plzOrt();
  var params = new URLSearchParams();
  params.set('firma', firmenname());
  params.set('farbe', farbe);
  params.set('web', location.hostname);
  if (ort) { params.set('plz', ort.plz); params.set('ort', ort.ort); }
  var ziel = DEMO_URL + '?' + params.toString();

  /* ---------- Button einblenden ---------- */
  var box = document.createElement('div');
  box.id = ID;
  box.setAttribute('style', 'all:initial;position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:6px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;');

  var tag = document.createElement('span');
  tag.textContent = 'Vorschau';
  tag.setAttribute('style', 'all:initial;font:600 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;background:#fff;color:#444;border-radius:99px;padding:5px 9px;box-shadow:0 2px 8px rgba(0,0,0,.15);');

  var btn = document.createElement('a');
  btn.href = ziel;
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><rect x="3" y="3" width="14" height="6" rx="1.5"/><path d="M17 6h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-7v3"/><rect x="10" y="15" width="4" height="6" rx="1"/></svg><span>Jetzt Angebot anfragen</span>';
  btn.setAttribute('style', 'all:initial;cursor:pointer;display:flex;align-items:center;gap:10px;min-height:56px;padding:0 22px;border-radius:99px;background:' + farbe + ';color:#fff;font:700 17px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 10px 28px rgba(0,0,0,.28);text-decoration:none;');

  box.appendChild(tag);
  box.appendChild(btn);
  document.body.appendChild(box);

  /* ---------- Zusätzlich: Hinweis-Karte unter der ersten Überschrift ---------- */
  var h1 = document.querySelector('main h1, #content h1, article h1, h1');
  if (h1 && h1.parentNode) {
    var card = document.createElement('div');
    card.id = ID + '-karte';
    card.setAttribute('style', 'all:initial;display:flex;flex-wrap:wrap;align-items:center;gap:14px;box-sizing:border-box;width:100%;max-width:720px;margin:18px 0 24px;padding:18px 20px;border-radius:16px;background:#fff;border:2px solid ' + farbe + ';box-shadow:0 6px 20px rgba(0,0,0,.08);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#1b1f23;');
    card.innerHTML =
      '<div style="all:initial;flex:1 1 240px;font-family:inherit;color:inherit;">' +
      '<div style="all:initial;display:block;font:700 19px/1.3 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#1b1f23;">Schneller zum Angebot</div>' +
      '<div style="all:initial;display:block;margin-top:4px;font:400 15.5px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#4a535c;">In 2 Minuten anfragen – mit Fotos, direkt vom Handy. Wir melden uns mit allen Infos zurück.</div>' +
      '</div>';
    var cardBtn = btn.cloneNode(true);
    cardBtn.style.boxShadow = 'none';
    cardBtn.querySelector('span').textContent = 'Anfrage starten';
    card.appendChild(cardBtn);
    h1.parentNode.insertBefore(card, h1.nextSibling);
  }
})();
