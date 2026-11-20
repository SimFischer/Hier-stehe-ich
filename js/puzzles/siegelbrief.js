// Siegelbrief öffnen („Hammer & Siegel“): Siegel aufbrechen, Karten fliegen verdeckt heraus und leuchten in ihrer Seltenheit,
// Antippen dreht sie um. Regeln (Inhalt, Siegellack) in js/puzzles/kampagne.js (briefRules, rules.oeffne).
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle } from '../engine/ui.js';
import { bildHtml } from '../engine/bilder.js';
import { kampagne } from '../../data/kampagne.js';
import { K } from './duell-regeln.js';
import { wachsTropfen } from './kampagne-extras.js';

const PAUSE = (ms) => new Promise((r) => setTimeout(r, ms));
// Ebenen aus docs/ASSET-PROMPTS-5.md: Brief zu und auf auf derselben Fläche, darüber das Siegel (ganz, dann zwei Hälften
// mit demselben Mittelpunkt), dahinter der Lichtschein. Lage des Siegels: siehe .sb-siegel-ebene in css/siegelbrief.css.
const RUECKEN = { gewoehnlich: 'ruecken-luther', selten: 'ruecken-selten', episch: 'ruecken-episch', legendaer: 'ruecken-legendaer' };
const vorladen = (namen) => namen.forEach((n) => { const d = document.createElement('div'); d.innerHTML = bildHtml(n); d.querySelector('img')?.decode?.().catch(() => {}); });

/**
 * Öffnet die Briefe in stand.briefe nacheinander.
 * oeffne(): öffnet den ersten Brief und gibt { stand, brief, karten } zurück (speichert selbst).
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
    const brief_ = gross ? 'siegelbrief-gross' : 'siegelbrief';
    vorladen([`${brief_}-auf`, 'siegel-bruch-links', 'siegel-bruch-rechts', 'siegel-licht', ...karten.map((k) => RUECKEN[K(k.id).seltenheit])]);
    const umschlag = h('button', { type: 'button', class: `sb-umschlag${gross ? ' gross' : ''}`, 'aria-label': t.kampBriefTippen },
      h('span', { class: 'sb-licht', 'aria-hidden': 'true', html: bildHtml('siegel-licht') }),
      h('span', { class: 'sb-ebene zu', 'aria-hidden': 'true', html: bildHtml(`${brief_}-zu`) }),
      h('span', { class: 'sb-ebene auf', 'aria-hidden': 'true', html: bildHtml(`${brief_}-auf`) }),
      h('span', { class: 'sb-siegel-ebene', 'aria-hidden': 'true' },
        h('span', { class: 'sb-siegel ganz', html: bildHtml('siegel-ganz') }),
        h('span', { class: 'sb-siegel links', html: bildHtml('siegel-bruch-links') }),
        h('span', { class: 'sb-siegel rechts', html: bildHtml('siegel-bruch-rechts') })));
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
      if (!ruhig) await PAUSE(1500);
      kartenZeigen(brief, karten, ausWachs, stand);
    });
  }

  function kartenZeigen(brief, karten, ausWachs, stand) {
    let offen = 0;
    const plaetze = karten.map((k, i) => {
      const karte = K(k.id);
      const platz = h('button', { type: 'button', class: `sb-karte rar-${karte.seltenheit}`, style: `--i:${i}`, 'aria-label': `${t.kampKarteVerdeckt} ${t.seltenheit[karte.seltenheit]}` },
        ['episch', 'legendaer'].includes(karte.seltenheit) ? h('span', { class: 'sb-karten-licht', 'aria-hidden': 'true', html: bildHtml('siegel-licht') }) : null,
        h('span', { class: 'sb-innen' },
          h('span', { class: 'sb-ruecken', 'aria-hidden': 'true', html: bildHtml(RUECKEN[karte.seltenheit] || 'ruecken-luther') }),
          h('span', { class: 'sb-vorne' }, kartenChip(karte, {}),
            h('span', { class: `sb-marke${k.neu ? ' neu' : ''}` }, k.neu ? t.kampNeu : t.kampDoppelt))));
      platz.addEventListener('click', () => {
        if (!platz.classList.contains('offen')) {
          platz.classList.add('offen'); platz.setAttribute('aria-label', karte.titel); offen += 1;
          // Doppelt: ein Tropfen Siegellack fliegt sichtbar heraus
          if (!k.neu) platz.append(h('span', { class: 'sb-lack-plus', 'aria-hidden': 'true' }, h('span', { html: bildHtml('siegel-ganz') }), t.kampLackBekommen));
          if (offen === karten.length) fertigZeigen();
        } else zeigeKartenDetail(karte);
      });
      return platz;
    });
    const fuss = h('div', { class: 'sb-fuss' });
    // Siegellack: Stand vor diesem Brief plus die Doppelten daraus; ist ein neuer Brief entstanden, sind die Tropfen wieder leer
    const fertigZeigen = () => {
      const rest = stand.briefe.length;
      setzeInhalt(fuss,
        h('div', { class: 'sb-wachs' },
          h('strong', {}, t.kampLackTitel), wachsTropfen(Math.min(stand.wachs || 0, wachs), wachs),
          h('span', {}, fuelle(t.kampLackStand, { n: stand.wachs || 0 }))),
        h('p', { class: 'sb-lack-erklaerung' }, t.kampLackErklaerung),
        h('div', { class: 'reihe mitte' }, rest ? knopf(fuelle(t.kampNaechsterBrief, { n: rest }), briefZeigen, 'haupt gross') : knopf(t.kampInSammlung, zu, 'haupt gross')));
    };
    setzeInhalt(fuss, h('p', { class: 'sb-hinweis' }, t.kampKarteTippen), knopf(t.kampAlleAufdecken, () => plaetze.forEach((p, i) => setTimeout(() => { if (!p.classList.contains('offen')) p.click(); }, i * 250)), 'still'));
    setzeInhalt(buehne, h('div', { class: 'sb-kopf' }, h('p', { class: 'kicker' }, brief.art === 'gross' ? t.kampBriefGross : t.kampBrief), h('h2', {}, t.kampDeineKarten)),
      h('div', { class: 'sb-karten', style: `--n:${karten.length}` }, plaetze), fuss);
  }

  briefZeigen();
  void anzahl;
}
