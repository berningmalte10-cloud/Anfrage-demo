/* Erzeugt aus tools/vorschau-button.js den Lesezeichen-Code (tools/lesezeichen.txt).
   Aufruf: node tools/build-bookmarklet.js */
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, 'vorschau-button.js'), 'utf8');
const code = src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').map(l => l.trim()).filter(Boolean).join('\n');
new Function(code); /* Syntaxprüfung */
const out = 'javascript:' + encodeURIComponent(code);
fs.writeFileSync(path.join(__dirname, 'lesezeichen.txt'), out + '\n');
console.log('lesezeichen.txt geschrieben (' + out.length + ' Zeichen)');

/* Kurzversion: lädt vorschau-button.js von GitHub Pages (immer aktuell) */
const kurz = "javascript:(function(){var s=document.createElement('script');" +
  "s.src='https://berningmalte10-cloud.github.io/Anfrage-demo/tools/vorschau-button.js?t='+Date.now();" +
  "s.onerror=function(){alert('Vorschau konnte nicht geladen werden. Bitte die lange Version des Lesezeichens verwenden.')};" +
  "document.body.appendChild(s)})();";
fs.writeFileSync(path.join(__dirname, 'lesezeichen-kurz.txt'), kurz + '\n');
console.log('lesezeichen-kurz.txt geschrieben (' + kurz.length + ' Zeichen)');
