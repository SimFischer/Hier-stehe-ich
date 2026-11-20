// Prachtausgaben aus „Hammer & Siegel“: Stufe je Karte (1 koloriert, 2 Prachtausgabe mit Gold).
// Die Kampagne setzt die Stufen (setzePracht); Karten fragen sie beim Zeichnen ab (prachtKlasse). Ohne Kampagne: keine.
let stufen = {};
export const setzePracht = (m) => { stufen = m || {}; };
export const prachtStufe = (id) => stufen[id] || 0;
export const prachtKlasse = (id) => (stufen[id] ? ` pracht-${stufen[id]}` : '');
