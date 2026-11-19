// Siegelbrief öffnen („Hammer & Siegel“): Siegel aufbrechen, Karten fliegen verdeckt heraus und leuchten in ihrer Seltenheit,
// Antippen dreht sie um. Regeln (Inhalt, Siegellack) in js/puzzles/kampagne.js (briefRules, rules.oeffne).
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle } from '../engine/ui.js';
import { bildHtml } from '../engine/bilder.js';
import { kampagne } from '../../data/kampagne.js';
import { K } from './duell-regeln.js';

const PAUSE = (ms) => new Promise((r) => setTimeout(r, ms));
const SIEGEL = '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="sbw" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#e2735a"/><stop offset="0.6" stop-color="#a6301c"/><stop offset="1" stop-color="#5c1409"/></radialGradient></defs>'
  + '<path d="M50 4c7 0 9 6 15 8s12-1 15 5-2 11 0 17 8 9 6 16-8 7-10 13 1 12-5 16-11-1-17 2-8 8-15 8-9-6-15-8-12 1-15-5 2-11 0-17-8-9-6-16 8-7 10-13-1-12 5-16 11 1 17-2 8-8 15-8z" fill="url(#sbw)"/>'
  + '<circle cx="50" cy="50" r="29" fill="none" stroke="#f0b49f" stroke-opacity="0.45" stroke-width="2"/>'
  + '<path d="M36 64l18-18M50 40l10-10 8 8-10 10zM58 58l-6 6" stroke="#f6cdbf" stroke-opacity="0.75" stroke-width="5" stroke-linecap="round" fill="none"/></svg>';

/**
 * Öffnet die Briefe in stand.briefe nacheinander.
 * oeffne(): öffnet den ersten Brief und gibt { stand, brief, karten, ausWachs } zurück (speichert selbst).
 * fertig(): nach dem letzten Brief.
 */
export function zeigeSiegelbriefe({ t, oeffne, anzahl, wachs, fertig }) {
  const buehne = h('div', { class: 'sb-buehne', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.kampBrief });
  document.body.append(buehne);
  const zu = () => { buehne.remove(); fertig(); };

  function briefZeigen() {
    const ergebnis = oeffne();
    if (!ergebnis.brief) { zu(); return; }
    const { brief, karten, ausWachs, stand } = ergebnis;
    const g = kampagne.gegner[brief.gegner];
    const gross = brief.art === 'gross';
    const umschlag = h('button', { type: 'button', class: `sb-umschlag${gross ? ' gross' : ''}`, 'aria-label': t.kampBriefTippen },
      h('span', { class: 'sb-klappe', 'aria-hidden': 'true' }),
      h('span', { class: 'sb-siegel links', 'aria-hidden': 'true', html: SIEGEL }),
      h('span', { class: 'sb-siegel rechts', 'aria-hidden': 'true', html: SIEGEL }));
    setzeInhalt(buehne,
      h('div', { class: 'sb-kopf' },
        h('p', { class: 'kicker' }, gross ? t.kampBriefGross : t.kampBrief),
        h('h2', {}, fuelle(t.kampBriefAus, { ort: g ? g.ort.split(',')[0] : '' })),
        h('p', { class: 'sb-hinweis' }, t.kampBriefTippen)),
      h('div', { class: 'sb-mitte' }, umschlag));
    umschlag.focus();
    umschlag.addEventListener('click', async () => {
      if (umschlag.classList.contains('auf')) return;
      umschlag.classList.add('auf');
      const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!ruhig) await PAUSE(900);
      kartenZeigen(brief, karten, ausWachs, stand);
    });
  }

  function kartenZeigen(brief, karten, ausWachs, stand) {
    let offen = 0;
    const plaetze = karten.map((k, i) => {
      const karte = K(k.id);
      const platz = h('button', { type: 'button', class: `sb-karte rar-${karte.seltenheit}`, style: `--i:${i}`, 'aria-label': `${t.kampKarteVerdeckt} ${t.seltenheit[karte.seltenheit]}` },
        h('span', { class: 'sb-innen' },
          h('span', { class: 'sb-ruecken', 'aria-hidden': 'true', html: bildHtml('ruecken-luther') }),
          h('span', { class: 'sb-vorne' }, kartenChip(karte, {}),
            h('span', { class: `sb-marke${k.neu ? ' neu' : ''}` }, k.neu ? t.kampNeu : t.kampDoppelt))));
      platz.addEventListener('click', () => {
        if (!platz.classList.contains('offen')) { platz.classList.add('offen'); platz.setAttribute('aria-label', karte.titel); offen += 1; if (offen === karten.length) fertigZeigen(); }
        else zeigeKartenDetail(karte);
      });
      return platz;
    });
    const fuss = h('div', { class: 'sb-fuss' });
    const fertigZeigen = () => {
      const rest = stand.briefe.length;
      setzeInhalt(fuss,
        h('p', { class: 'sb-wachs' }, fuelle(t.kampWachs, { n: stand.wachs || 0, von: wachs }),
          h('span', { class: 'sb-wachs-balken', 'aria-hidden': 'true' }, h('span', { style: `width:${((stand.wachs || 0) / wachs) * 100}%` }))),
        ausWachs ? h('p', { class: 'sb-neuer-brief' }, t.kampWachsBrief) : null,
        h('div', { class: 'reihe mitte' }, rest ? knopf(fuelle(t.kampNaechsterBrief, { n: rest }), briefZeigen, 'haupt gross') : knopf(t.kampInSammlung, zu, 'haupt gross')));
    };
    setzeInhalt(fuss, h('p', { class: 'sb-hinweis' }, t.kampKarteTippen), knopf(t.kampAlleAufdecken, () => plaetze.forEach((p, i) => setTimeout(() => { if (!p.classList.contains('offen')) p.click(); }, i * 250)), 'still'));
    setzeInhalt(buehne, h('div', { class: 'sb-kopf' }, h('p', { class: 'kicker' }, brief.art === 'gross' ? t.kampBriefGross : t.kampBrief), h('h2', {}, t.kampDeineKarten)),
      h('div', { class: 'sb-karten', style: `--n:${karten.length}` }, plaetze), fuss);
  }

  briefZeigen();
  void anzahl;
}
