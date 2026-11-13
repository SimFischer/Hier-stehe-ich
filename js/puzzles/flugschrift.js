// Die eigene Flugschrift: Schlagzeile, drei Kernaussagen, ein Bild. Drucken (PDF) oder als Bild teilen.
import { h, setzeInhalt, knopf, rich, kartenChip, fuelle, melde } from '../engine/ui.js';
import { motivSvg } from '../engine/platzhalter.js';

export const rules = {
  start: (s) => ({ schlagzeile: s.schlagzeilen[0], eigene: false, karten: [], motiv: s.motive[0].id }),
  kuerze: (text, max) => String(text).replace(/\s+/g, ' ').trimStart().slice(0, max),
  umschalten(f, id, s) {
    if (f.karten.includes(id)) return { ...f, karten: f.karten.filter((k) => k !== id) };
    return f.karten.length < s.karten ? { ...f, karten: [...f.karten, id] } : f;
  },
  gueltig: (f, s) => f.schlagzeile.trim().length > 0 && f.schlagzeile.length <= s.maxZeichen && f.karten.length === s.karten && s.motive.some((m) => m.id === f.motiv)
};

function umbruch(g, text, breite) {
  const zeilen = []; let zeile = '';
  for (const wort of text.split(' ')) {
    const probe = zeile ? `${zeile} ${wort}` : wort;
    if (g.measureText(probe).width > breite && zeile) { zeilen.push(zeile); zeile = wort; } else zeile = probe;
  }
  if (zeile) zeilen.push(zeile);
  return zeilen;
}

/** Zeichnet die Flugschrift als Bild (für das Teilen-Menü oder zum Speichern). */
export async function alsBild(f, schritt, ctx) {
  const c = document.createElement('canvas'); c.width = 1000; c.height = 1400;
  const g = c.getContext('2d');
  g.fillStyle = '#efe3c8'; g.fillRect(0, 0, 1000, 1400);
  g.strokeStyle = '#1f1a17'; g.lineWidth = 10; g.strokeRect(30, 30, 940, 1340); g.lineWidth = 3; g.strokeRect(48, 48, 904, 1304);
  g.fillStyle = '#1f1a17'; g.textAlign = 'center';
  g.font = 'italic 34px Georgia, serif'; g.fillText(schritt.kopf, 500, 120);
  g.font = 'bold 76px Georgia, serif';
  let y = 230;
  for (const z of umbruch(g, f.schlagzeile, 820)) { g.fillText(z, 500, y); y += 88; }
  const bild = new Image();
  bild.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(motivSvg(f.motiv))}`;
  await bild.decode().catch(() => {});
  const groesse = 360; g.drawImage(bild, 500 - groesse / 2, y, groesse, groesse); y += groesse + 70;
  g.font = '40px Georgia, serif';
  for (const id of f.karten) {
    for (const z of umbruch(g, `❧ ${ctx.karte(id).text}`, 800)) { g.fillText(z, 500, y); y += 52; }
    y += 22;
  }
  g.font = 'italic 30px Georgia, serif'; g.fillText(schritt.fuss, 500, 1310);
  return new Promise((ok) => c.toBlob(ok, 'image/png'));
}

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let f = ctx.state.flug && rules.gueltig(ctx.state.flug, schritt) ? { ...ctx.state.flug } : rules.start(schritt);
  const beutel = ctx.karten();

  const blatt = () => h('div', { class: 'flugblatt' },
    h('p', { class: 'fb-kopf' }, schritt.kopf),
    h('h3', {}, f.schlagzeile || '…'),
    h('div', { class: 'fb-bild', html: motivSvg(f.motiv) }),
    h('ul', {}, f.karten.map((id) => h('li', {}, ctx.karte(id).text))),
    h('p', { class: 'fb-fuss' }, schritt.fuss));

  const zeichne = () => {
    const ok = rules.gueltig(f, schritt);
    const vorschau = h('div', { class: 'fb-vorschau' }, blatt());
    const knoepfe = [
      knopf(t.flugDrucken, () => { setzeInhalt(document.getElementById('druck'), blatt()); window.print(); }, '', { disabled: !ok }),
      knopf(t.flugTeilen, async () => {
        const blob = await alsBild(f, schritt, ctx);
        const datei = new File([blob], t.flugDatei, { type: 'image/png' });
        if (navigator.canShare?.({ files: [datei] })) navigator.share({ files: [datei] }).catch(() => {});
        else { const a = h('a', { href: URL.createObjectURL(blob), download: t.flugDatei }); a.click(); melde(t.flugGespeichert); }
      }, '', { disabled: !ok }),
      knopf(t.flugFertig, () => fertig({ flug: f }), 'haupt', { disabled: !ok })];
    const eingabe = h('input', { type: 'text', maxlength: schritt.maxZeichen, value: f.eigene ? f.schlagzeile : '', placeholder: schritt.eigene, 'aria-label': schritt.eigene,
      oninput: (e) => {
        f = { ...f, eigene: true, schlagzeile: rules.kuerze(e.target.value, schritt.maxZeichen) };
        setzeInhalt(vorschau, blatt());
        for (const k of knoepfe) k.disabled = !rules.gueltig(f, schritt);
        for (const w of links.querySelectorAll('.schlagzeilen .gewaehlt')) w.classList.remove('gewaehlt');
      } });
    const links = h('div', { class: 'fb-form' },
      h('p', { class: 'anweisung' }, rich(schritt.anweisung)),
      h('fieldset', { class: 'schlagzeilen' }, h('legend', {}, t.flugSchlagzeile),
        schritt.schlagzeilen.map((sz) => h('button', { type: 'button', class: `wahlknopf${!f.eigene && f.schlagzeile === sz ? ' gewaehlt' : ''}`, onclick: () => { f = { ...f, eigene: false, schlagzeile: sz }; zeichne(); } }, sz)),
        eingabe, h('span', { class: 'klein' }, schritt.namenHinweis)),
      h('fieldset', {}, h('legend', {}, fuelle(t.flugKarten, { n: f.karten.length, von: schritt.karten })),
        h('div', { class: 'hand fb-karten' }, beutel.map((k) => kartenChip(k, { klein: true, gewaehlt: f.karten.includes(k.id), onclick: () => { f = rules.umschalten(f, k.id, schritt); zeichne(); } })))));
    const rechts = h('div', { class: 'fb-rechts' }, vorschau,
      h('fieldset', {}, h('legend', {}, t.flugBild),
        schritt.motive.map((m) => h('button', { type: 'button', class: `wahlknopf${f.motiv === m.id ? ' gewaehlt' : ''}`, onclick: () => { f = { ...f, motiv: m.id }; zeichne(); } }, m.label))),
      h('div', { class: 'reihe' }, knoepfe));
    setzeInhalt(el, h('div', { class: 'fb' }, links, rechts));
  };
  zeichne();
}
