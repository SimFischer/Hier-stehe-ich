// Layoutprüfung im Browser. Im laufenden Spiel in der Konsole aufrufen:
//   const { pruefe } = await import('./tests/layout-browser.js'); console.table(await pruefe());
// Geprüft wird jede Szene und jeder Rätselschritt in der aktuellen Fenstergröße:
// kein seitliches Scrollen, kein Scrollen im Rätselblatt, Schrift ab 14 px, Tippziele ab 44 px,
// Hotspots im Bild, nicht übereinander und nicht unter dem Textband.
// Achtung: Die Prüfung überschreibt den Spielstand auf diesem Gerät.
import { aendere, ersetze } from '../js/engine/save.js';
import { neuerStand, loeseStation, springeZu, gibKarte } from '../js/engine/state.js';
import { game } from '../data/game.js';
import { zeigeSzene } from '../js/engine/szenen.js';
import { oeffneRaetsel } from '../js/engine/raetsel.js';
import { scenes } from '../data/scenes.js';
import { puzzles } from '../data/puzzles.js';
import { bonus } from '../data/bonus.js';

const MIN_SCHRIFT = 14;
const MIN_ZIEL = 44;
const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function bilderGeladen(el) {
  // Höchstens 1,5 Sekunden warten: In einem ausgeblendeten Fenster werden Bilder manchmal nicht fertig.
  const fertig = Promise.all([...el.querySelectorAll('img')].map((i) => (i.complete ? null : new Promise((ok) => { i.addEventListener('load', ok, { once: true }); i.addEventListener('error', ok, { once: true }); }))));
  await Promise.race([fertig, warte(1500)]);
  await warte(60);
}
const sichtbar = (e) => e.offsetParent !== null && getComputedStyle(e).visibility !== 'hidden';
const flaeche = (r) => Math.max(0, r.width) * Math.max(0, r.height);
function schnitt(a, b) {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return w > 0 && h > 0 ? w * h : 0;
}

/** Kleine Schrift und kleine Tippziele in einem Bereich. */
function kleinteile(bereich) {
  const fehler = [];
  for (const e of bereich.querySelectorAll('*')) {
    if (!sichtbar(e) || e.closest('[aria-hidden="true"]')) continue;
    const eigenerText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    const px = parseFloat(getComputedStyle(e).fontSize);
    if (eigenerText && px < MIN_SCHRIFT - 0.5) fehler.push(`Schrift ${px}px: „${e.textContent.trim().slice(0, 30)}“`);
    if ((e.tagName === 'BUTTON' || e.tagName === 'INPUT' || e.tagName === 'A') && !e.classList.contains('begriff')) {
      const r = e.getBoundingClientRect();
      if (r.height < MIN_ZIEL - 0.5 || r.width < MIN_ZIEL - 0.5) fehler.push(`Ziel ${Math.round(r.width)}×${Math.round(r.height)}: „${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30)}“`);
    }
  }
  return [...new Set(fehler)];
}

function seitlich() {
  const d = document.documentElement;
  return d.scrollWidth > innerWidth + 1 ? [`Seite ${d.scrollWidth - innerWidth}px zu breit`] : [];
}

async function pruefeSzene(sz) {
  aendere((s) => { s.szene = sz.id; });
  zeigeSzene(sz.id);
  const szene = document.getElementById('szene');
  await bilderGeladen(szene);
  const fehler = [...seitlich()];
  const rahmen = szene.getBoundingClientRect();
  const band = document.getElementById('band').getBoundingClientRect();
  const spots = [...document.querySelectorAll('#hotspots .hotspot')].map((b) => ({ name: b.textContent.trim(), r: b.getBoundingClientRect() }));
  for (const s of spots) {
    if (s.r.left < rahmen.left - 2 || s.r.right > rahmen.right + 2 || s.r.top < rahmen.top - 2) fehler.push(`„${s.name}“ ragt aus dem Bild`);
    const verdeckt = schnitt(s.r, band) / (flaeche(s.r) || 1);
    if (verdeckt > 0.35) fehler.push(`„${s.name}“ zu ${Math.round(verdeckt * 100)} % unter dem Textband`);
    if (s.r.height < MIN_ZIEL - 0.5 || s.r.width < MIN_ZIEL - 0.5) fehler.push(`„${s.name}“ nur ${Math.round(s.r.width)}×${Math.round(s.r.height)}`);
  }
  for (let i = 0; i < spots.length; i++) for (let j = i + 1; j < spots.length; j++) {
    const a = spots[i], b = spots[j];
    // Schilder dürfen sich nicht überdecken. Gemessen wird nur das obere Drittel (dort steht das Schild).
    const oben = (r) => ({ left: r.left, right: r.right, top: r.top, bottom: r.top + Math.min(r.height, 34) });
    if (schnitt(oben(a.r), oben(b.r)) > 40) fehler.push(`„${a.name}“ und „${b.name}“ überdecken sich`);
  }
  return fehler;
}

async function pruefeSchritt(id, i, daten) {
  const blatt = document.getElementById('blatt');
  oeffneRaetsel(id, { bild: daten.bild, schritt: i, sammel: daten.sammel, beiEnde: () => {} });
  const koerper = blatt.querySelector('.blatt-koerper');
  await bilderGeladen(blatt);
  const fehler = [...seitlich()];
  // Ausnahme: Vorbereitung der Disputation (Deckbau) darf scrollen, der Spieltisch nicht.
  if (!koerper.querySelector('.d-vor') && koerper.scrollHeight > koerper.clientHeight + 2) fehler.push(`Rätselblatt scrollt (${koerper.scrollHeight - koerper.clientHeight}px)`);
  if (koerper.scrollWidth > koerper.clientWidth + 2) fehler.push(`Rätselblatt zu breit (${koerper.scrollWidth - koerper.clientWidth}px)`);
  fehler.push(...kleinteile(blatt));
  blatt.querySelector('.blatt-kopf .schliess')?.click();
  return fehler;
}

/** Prüft alles in der aktuellen Fenstergröße. Gibt eine Liste { wo, fehler } zurück. */
export async function pruefe() {
  const stand = neuerStand(); loeseStation(stand, 'f'); stand.szene = 'druckerei';
  ersetze(stand);
  document.getElementById('start').hidden = true;
  document.querySelector('dialog.fenster')?.close();
  const ergebnis = [];
  ergebnis.push({ wo: 'Leiste', fehler: [...seitlich(), ...kleinteile(document.querySelector('.leiste'))] });
  for (const sz of scenes.filter((x) => x.hotspots?.length)) ergebnis.push({ wo: `Szene ${sz.id}`, fehler: await pruefeSzene(sz) });
  const sammel = { hand: ['k5', 'k9', 'k7', 'k8', 't43'], thesen: ['t36', 't43'], stufe: { verhoer: 3 } };
  const alle = [...Object.values(puzzles), ...Object.values(bonus)];
  for (const r of alle) {
    const bild = scenes.find((sz) => (sz.hotspots || []).some((h) => h.ziel === r.id)) || scenes[0];
    // Spielstand wie beim echten Spielen: alle Stationen davor gelöst, Funde der eigenen Szene im Beutel.
    const st = game.stationen.find((x) => x.raetsel === r.id);
    const s = neuerStand();
    if (st) { springeZu(s, st.id); for (const h of bild.hotspots || []) gibKarte(s, h.gibt); } else loeseStation(s, 'f');
    ersetze(s);
    for (let i = 0; i < r.schritte.length; i++) {
      ergebnis.push({ wo: `${r.titel} · Schritt ${i + 1} (${r.schritte[i].art})`, fehler: await pruefeSchritt(r.id, i, { bild, sammel }) });
    }
  }
  return ergebnis.filter((x) => x.fehler.length).map((x) => ({ wo: x.wo, fehler: x.fehler.join(' | ') }));
}
