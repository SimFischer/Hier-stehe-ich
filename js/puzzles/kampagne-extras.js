// „Hammer & Siegel“: alles, was zum Weiterspielen motiviert. Einführung beim ersten Start (Bildtafeln),
// Fortschrittsleiste in der Übersicht (Weg zum Gipfel, Siegellack, Sammlung, nächster Anführer) und die Sammlung.
// Inhalte der Einführung: data/kampagne.js (einfuehrung). Regeln: js/puzzles/kampagne.js.
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle } from '../engine/ui.js';
import { bildHtml, portraetHtml, kartenBild } from '../engine/bilder.js';
import { kampagne } from '../../data/kampagne.js';
import { lutherKarten } from '../../data/kartei.js';
import { K, maxKopien, anzahl } from './duell-regeln.js';

const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
const SELTEN = ['legendaer', 'episch', 'selten', 'gewoehnlich'];
const RUECKEN = { gewoehnlich: 'ruecken-luther', selten: 'ruecken-selten', episch: 'ruecken-episch', legendaer: 'ruecken-legendaer' };
const pool = () => lutherKarten.filter((k) => k.seltenheit);
const sterneSumme = (stand) => Object.values(stand.sterne).reduce((n, x) => n + x, 0);

/** Sammlung: wie viele Karten (mit Kopien) man hat und wie viele es gibt. */
export function sammlungStand(besitz) {
  let n = 0, von = 0;
  for (const k of pool()) { const m = maxKopien(k.id); von += m; n += Math.min(m, anzahl(besitz, k.id)); }
  return { n, von };
}

/** Siegellack als Tropfen: gefüllte und leere Siegel. */
export function wachsTropfen(n, von) {
  return h('span', { class: 'ke-tropfen', 'aria-hidden': 'true' },
    Array.from({ length: von }, (_, i) => h('span', { class: `ke-tropfen-siegel${i < n ? ' voll' : ''}`, html: bildHtml('siegel-ganz') })));
}

/** Kleine Porträtreihe: der Weg zum Gipfel. */
function gipfelWeg(stand, figuren, { klein = false } = {}) {
  const aktuell = reihenfolge.find((id) => !stand.sterne[id]);
  return h('ol', { class: `ke-weg${klein ? ' klein' : ''}` }, reihenfolge.map((id, i) => {
    const g = kampagne.gegner[id];
    const besiegt = Boolean(stand.sterne[id]);
    const gipfel = i >= reihenfolge.length - 2;
    return h('li', { class: `ke-weg-punkt${besiegt ? ' besiegt' : ''}${id === aktuell ? ' aktuell' : ''}${gipfel ? ' gipfel' : ''}`, title: g.name },
      h('span', { class: 'ke-weg-bild', 'aria-hidden': 'true', html: portraetHtml(g, figuren[g.figur] || {}) }),
      gipfel ? h('span', { class: 'ke-krone', 'aria-hidden': 'true' }, '♛') : null,
      besiegt ? h('span', { class: 'ke-haken', 'aria-hidden': 'true' }, '✓') : null);
  }));
}

/** Fortschrittsleiste oben in der Übersicht: immer ein nächstes Ziel vor Augen. */
export function zielLeiste({ t, stand, besitz, figuren, wachsJeBrief, onSammlung }) {
  const besiegt = reihenfolge.filter((id) => stand.sterne[id]).length;
  const wachs = stand.wachs || 0;
  const s = sammlungStand(besitz);
  const sterne = sterneSumme(stand);
  const naechster = kampagne.anfuehrer.find((a) => a.ab > sterne);
  return h('div', { class: 'ke-ziele' },
    h('div', { class: 'ke-gipfel' },
      h('p', {}, fuelle(t.kampGipfel, { n: besiegt, von: reihenfolge.length })),
      gipfelWeg(stand, figuren)),
    h('div', { class: 'ke-reihe' },
      h('div', { class: 'ke-ziel lack' },
        h('strong', {}, t.kampLackTitel),
        wachsTropfen(wachs, wachsJeBrief),
        h('span', {}, fuelle(t.kampLackNoch, { n: wachsJeBrief - wachs })),
        h('small', {}, t.kampLackErklaerung)),
      h('div', { class: 'ke-ziel sammlung' },
        h('strong', {}, t.kampSammlungTitel),
        h('span', { class: 'ke-balken', 'aria-hidden': 'true' }, h('span', { style: `width:${(s.n / s.von) * 100}%` })),
        h('span', {}, fuelle(t.kampSammlungStand, { n: s.n, von: s.von })),
        knopf(t.kampSammlungAnsehen, onSammlung, 'still klein')),
      h('div', { class: 'ke-ziel fuehrer' },
        h('strong', {}, t.kampFuehrerTitel),
        naechster ? [
          h('span', { class: 'ke-fuehrer-bild', 'aria-hidden': 'true', html: bildHtml(kartenBild(K(naechster.id)).name) }),
          h('span', { class: 'ke-balken', 'aria-hidden': 'true' }, h('span', { style: `width:${Math.min(100, (sterne / naechster.ab) * 100)}%` })),
          h('span', {}, fuelle(t.kampFuehrerNoch, { n: naechster.ab - sterne, name: K(naechster.id).titel }))
        ] : h('span', {}, t.kampFuehrerAlle))));
}

/** Sammlung: alle Karten nach Seltenheit; fehlende verdeckt mit der Rückseite ihrer Seltenheit. */
export function zeigeSammlung({ t, besitz }) {
  const buehne = h('div', { class: 'ke-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.kampSammlungTitel });
  const s = sammlungStand(besitz);
  const zu = () => buehne.remove();
  setzeInhalt(buehne, h('div', { class: 'ke-sammlung' },
    h('div', { class: 'ke-sammlung-kopf' },
      h('div', {}, h('h2', {}, t.kampSammlungTitel), h('p', {}, fuelle(t.kampSammlungStand, { n: s.n, von: s.von }), ' · ', t.kampSammlungText)),
      knopf(t.schliessen, zu, 'haupt')),
    SELTEN.map((sel) => {
      const karten = pool().filter((k) => k.seltenheit === sel);
      return h('section', { class: `ke-sammlung-gruppe rar-${sel}` },
        h('h3', {}, t.seltenheit[sel]),
        h('div', { class: 'ke-sammlung-karten' }, karten.map((k) => {
          const hat = Math.min(anzahl(besitz, k.id), maxKopien(k.id));
          return hat ? h('span', { class: 'ke-sammel-karte' }, kartenChip(k, { klein: true, onclick: () => zeigeKartenDetail(k) }),
            h('span', { class: `ke-anzahl${hat === maxKopien(k.id) ? ' voll' : ''}` }, `${hat}/${maxKopien(k.id)}`))
            : h('span', { class: 'ke-sammel-karte fehlt', 'aria-label': t.seltenheit[sel] }, h('span', { class: 'ke-fehlt-bild', html: bildHtml(RUECKEN[sel]) }), h('span', { class: 'ke-fehlt-zeichen' }, '?'));
        })));
    })));
  document.body.append(buehne);
  buehne.querySelector('.knopf')?.focus();
}

/** Einführung: Bildtafeln, die Hammer & Siegel als eigenes Spiel vorstellen. fertig() nach der letzten Tafel. */
export function zeigeEinfuehrung({ t, stand, besitz, figuren, wachsJeBrief, fertig }) {
  const tafeln = kampagne.einfuehrung;
  let nr = 0;
  const buehne = h('div', { class: 'ke-buehne intro', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.kampSoGehts });
  document.body.append(buehne);
  const bild = (art) => {
    if (art === 'weg') return h('div', { class: 'ke-bild weg' }, gipfelWeg(stand, figuren),
      h('div', { class: 'ke-gipfel-paar' }, ['k-karl', 'k-leo'].map((id) => h('span', { class: 'ke-gipfel-bild', html: portraetHtml(kampagne.gegner[id], figuren[kampagne.gegner[id].figur] || {}) }))));
    if (art === 'karten') {
      const eigene = [...new Set(besitz)].map(K).filter((k) => k?.seltenheit).sort((a, b) => b.staerke - a.staerke).slice(0, 5);
      return h('div', { class: 'ke-bild karten' }, eigene.map((k, i) => h('span', { class: 'ke-faecher', style: `--i:${i - (eigene.length - 1) / 2}` }, kartenChip(k, {}))));
    }
    if (art === 'briefe') return h('div', { class: 'ke-bild briefe' },
      h('span', { class: 'ke-brief', html: bildHtml('siegelbrief-zu') }),
      h('span', { class: 'ke-pfeil', 'aria-hidden': 'true' }, '➜'),
      h('span', { class: 'ke-ruecken-reihe' }, ['gewoehnlich', 'selten', 'episch', 'legendaer'].map((sel) =>
        h('span', { class: `ke-ruecken rar-${sel}` }, h('span', { html: bildHtml(RUECKEN[sel]) }), h('small', {}, t.seltenheit[sel])))));
    if (art === 'lack') return h('div', { class: 'ke-bild lack' },
      wachsTropfen(wachsJeBrief, wachsJeBrief), h('span', { class: 'ke-gleich', 'aria-hidden': 'true' }, '='), h('span', { class: 'ke-brief klein', html: bildHtml('siegelbrief-zu') }));
    if (art === 'anfuehrer') return h('div', { class: 'ke-bild anfuehrer' }, kampagne.anfuehrer.map((a) =>
      h('span', { class: 'ke-fuehrer' }, h('span', { class: 'ke-fuehrer-bild', html: bildHtml(kartenBild(K(a.id)).name) }), h('strong', {}, K(a.id).titel), h('small', {}, a.ab ? `${a.ab} ★` : t.kampGewaehlt))));
    if (art === 'wieder') {
      const g = kampagne.gegner[reihenfolge[0]];
      return h('div', { class: 'ke-bild wieder' },
        h('span', { class: 'ke-gipfel-bild', html: portraetHtml(g, figuren[g.figur] || {}) }),
        h('span', { class: 'ke-kreis', 'aria-hidden': 'true' }, '↻'),
        h('span', { class: 'ke-brief klein', html: bildHtml('siegelbrief-zu') }),
        h('strong', { class: 'ke-plus' }, '+1'));
    }
    return null;
  };
  const zeichne = () => {
    const tafel = tafeln[nr];
    const letzte = nr === tafeln.length - 1;
    setzeInhalt(buehne, h('div', { class: 'ke-tafel' },
      h('p', { class: 'kicker' }, t.dispSpielImSpiel, ' · ', fuelle(t.kampIntroTafel, { n: nr + 1, von: tafeln.length })),
      h('h2', {}, tafel.titel),
      bild(tafel.art),
      h('p', { class: 'ke-text' }, tafel.text),
      h('div', { class: 'ke-punkte', 'aria-hidden': 'true' }, tafeln.map((_, i) => h('span', { class: i === nr ? 'an' : '' }))),
      h('div', { class: 'reihe mitte' },
        nr > 0 ? knopf(t.kampIntroZurueck, () => { nr -= 1; zeichne(); }, 'still') : null,
        knopf(letzte ? t.kampIntroLos : t.kampIntroWeiter, () => { if (letzte) { buehne.remove(); fertig(); } else { nr += 1; zeichne(); } }, 'haupt gross'))));
    buehne.querySelector('.knopf.haupt')?.focus();
  };
  zeichne();
}
