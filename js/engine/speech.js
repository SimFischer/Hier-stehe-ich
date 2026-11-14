// Vorlesen mit der Sprachausgabe des Browsers. Es wird nichts versendet.
const LESBAR = ['.sprecher', 'p', 'blockquote', 'li', 'legend', '.frage', '.option', '.teil', '.ziel-kopf', '.karte strong', 'h3'].join(',');

export const kannSprechen = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function still() { if (kannSprechen()) window.speechSynthesis.cancel(); }

export function sprich(text) {
  if (!kannSprechen() || !text) return;
  still();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'de-DE';
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

/** Sammelt den sichtbaren Lesetext eines Bereichs, ohne Knöpfe der Bedienung. */
export function textVon(el) {
  const teile = [];
  for (const e of el.querySelectorAll(LESBAR)) {
    if (e.offsetParent === null || e.closest('[hidden]')) continue;
    if (teile.some((x) => x.el.contains(e))) continue; // nichts doppelt lesen
    const text = e.textContent.replace(/\s+/g, ' ').trim();
    if (text) teile.push({ el: e, text });
  }
  return teile.map((x) => x.text).join('. ');
}

export const liesVor = (el) => sprich(textVon(el));
