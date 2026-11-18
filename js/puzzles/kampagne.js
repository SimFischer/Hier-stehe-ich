// Bonusspiel „Das Spiel im Spiel“: Kampagne mit zwölf Gegnern. Oben die Regeln (in Node testbar), unten die Anzeige.
// Der Fortschritt bleibt auf dem Gerät (localStorage). Der Fortsetzungscode der Geschichte bleibt davon unberührt.
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle } from '../engine/ui.js';
import { figurHtml, bildHtml, kartenBild } from '../engine/bilder.js';
import { kampagne } from '../../data/kampagne.js';
import { K } from './duell-regeln.js';
import { view as duellView } from './duell.js';

const SCHLUESSEL = 'hier-stehe-ich.kampagne.v1';
export const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
export const neuerKampagnenStand = () => ({ karten: [], sterne: {}, anfuehrer: 'a-luther', deck: [], gesehen: [] });

export const rules = {
  sterneSumme: (s) => Object.values(s.sterne).reduce((n, x) => n + x, 0),
  /** Der erste Gegner ist offen, jeder weitere nach einem Sieg gegen den vorigen. */
  offen: (s, id) => { const i = reihenfolge.indexOf(id); return i === 0 || (s.sterne[reihenfolge[i - 1]] || 0) > 0; },
  /** Sterne für eine Partie: Sieg, Sieg ohne verlorene Runde, Sieg mit kleinem Deck. */
  sterneFuer: (z, deckGroesse) => (z.sieger !== 'luther' ? 0
    : 1 + (z.runden.every((r) => r.sieger === 'luther') ? 1 : 0) + (deckGroesse <= kampagne.sterne.kleinDeck ? 1 : 0)),
  /** Zur Wahl stehen bis zu drei Karten des Gegners, die man noch nicht hat. */
  belohnungen: (gegner, besitz) => gegner.belohnungen.filter((id) => !besitz.includes(id)).slice(0, 3),
  anfuehrerFrei: (s) => kampagne.anfuehrer.filter((a) => rules.sterneSumme(s) >= a.ab).map((a) => a.id),
  /** Ergebnis einer Partie eintragen. Gibt zurück, was neu ist. */
  eintragen(s, gegnerId, z, deckGroesse) {
    const n = structuredClone(s);
    const vorher = n.sterne[gegnerId] || 0;
    const jetzt = rules.sterneFuer(z, deckGroesse);
    n.sterne[gegnerId] = Math.max(vorher, jetzt);
    if (!n.gesehen.includes(gegnerId)) n.gesehen.push(gegnerId);
    const freiVorher = rules.anfuehrerFrei(s);
    // Belohnung: beim ersten Sieg und beim ersten Mal mit 3 Sternen je eine Karte
    const belohnt = (vorher === 0 && jetzt > 0) || (vorher < 3 && jetzt === 3);
    return { stand: n, jetzt, ersterSieg: belohnt, neueAnfuehrer: rules.anfuehrerFrei(n).filter((a) => !freiVorher.includes(a)) };
  },
  waehle(s, kartenId) { const n = structuredClone(s); if (!n.karten.includes(kartenId)) n.karten.push(kartenId); return n; }
};

export function ladeStand() {
  try { return { ...neuerKampagnenStand(), ...JSON.parse(localStorage.getItem(SCHLUESSEL)) }; } catch { return neuerKampagnenStand(); }
}
function speichere(s) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify(s)); } catch { /* privater Modus: Spiel läuft trotzdem */ } }

const sterneHtml = (n, von = 3) => h('span', { class: 'k-sterne', 'aria-hidden': 'true' }, Array.from({ length: von }, (_, i) => h('span', { class: i < n ? 'an' : '' }, '★')));

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let stand = ladeStand();
  const neu = (s) => { stand = s; speichere(s); };
  const besitz = () => [...new Set([...ctx.karten().map((k) => k.id), ...stand.karten])];

  function uebersicht() {
    const frei = rules.anfuehrerFrei(stand);
    if (!frei.includes(stand.anfuehrer)) neu({ ...stand, anfuehrer: 'a-luther' });
    setzeInhalt(el, h('div', { class: 'kamp' },
      h('div', { class: 'kamp-kopf' },
        h('div', {}, h('p', { class: 'kicker' }, t.kampKicker), h('p', {}, t.kampText)),
        h('p', { class: 'kamp-summe' }, fuelle(t.kampSterne, { n: rules.sterneSumme(stand), von: reihenfolge.length * 3 }))),
      h('h3', { class: 'zwischen' }, t.kampAnfuehrer),
      h('div', { class: 'kamp-anfuehrer' }, kampagne.anfuehrer.map((a) => {
        const offen = frei.includes(a.id);
        return h('span', { class: 'karte-huelle' },
          h('button', { type: 'button', class: `kamp-fuehrer${stand.anfuehrer === a.id ? ' gewaehlt' : ''}`, disabled: !offen, 'aria-pressed': String(stand.anfuehrer === a.id),
            onclick: () => { neu({ ...stand, anfuehrer: a.id }); uebersicht(); } },
            h('span', { class: 'bk-bild', 'aria-hidden': 'true', html: bildHtml(kartenBild(K(a.id)).name) }),
            h('strong', {}, K(a.id).titel), h('em', {}, offen ? (stand.anfuehrer === a.id ? t.kampGewaehlt : t.kampWaehlen) : fuelle(t.kampAbSternen, { n: a.ab }))),
          h('button', { type: 'button', class: 'karte-info', 'aria-label': fuelle(t.kartenInfo, { titel: K(a.id).titel }), onclick: () => zeigeKartenDetail(K(a.id)) }, 'i'));
      })),
      kampagne.kapitel.map((kap, i) => h('section', { class: 'kamp-kapitel' },
        h('h3', {}, fuelle(t.kampKapitel, { n: i + 1, titel: kap.titel }), h('em', {}, ` ${kap.zeit}`)),
        h('div', { class: 'kamp-gegner' }, kap.gegner.map((id) => {
          const g = kampagne.gegner[id];
          const offen = rules.offen(stand, id);
          return h('button', { type: 'button', class: `kamp-tafel${offen ? '' : ' zu'}${stand.sterne[id] ? ' besiegt' : ''}`, disabled: !offen, onclick: () => spiel(id) },
            h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: figurHtml(ctx.figuren[g.figur] || {}) }),
            h('strong', {}, g.name), h('span', { class: 'klein' }, g.ort),
            offen ? sterneHtml(stand.sterne[id] || 0) : h('span', { class: 'klein' }, t.kampGesperrt));
        })))),
      h('div', { class: 'reihe fuss' }, h('span', {}), knopf(t.kampBeenden, () => fertig({}), 'still'))));
  }

  function spiel(id) {
    duellView(el, { art: 'duell', gegner: id, kampagne: {
      besitz: besitz(), anfuehrer: stand.anfuehrer, deck: stand.deck,
      merkeDeck: (deck) => neu({ ...stand, deck: [...deck] }),
      zurueck: uebersicht,
      ergebnis: (z, deck) => auswertung(id, z, deck)
    } }, ctx, () => uebersicht());
  }

  function auswertung(id, z, deck) {
    const g = kampagne.gegner[id];
    const r = rules.eintragen(stand, id, z, deck.length);
    neu(r.stand);
    const sieg = z.sieger === 'luther';
    const wahl = r.ersterSieg ? rules.belohnungen(g, besitz()) : [];
    const zeichne = (gewaehlt = null) => setzeInhalt(el, h('div', { class: `d-ende ${sieg ? 'sieg' : 'niederlage'}` },
      h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: figurHtml(ctx.figuren[g.figur] || {}) }),
        h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', { class: 'd-ende-titel' }, sieg ? t.duellSieg : t.duellNiederlage), h('p', {}, sieg ? g.sieg : g.niederlage))),
      h('ul', { class: 'd-runden' }, z.runden.map((x) => h('li', { class: x.sieger }, fuelle(t.duellRundeZeile, { n: x.runde, du: x.luther, er: x.kirche }),
        ' ', h('strong', {}, x.sieger === 'luther' ? t.duellGewonnen : t.duellVerloren)))),
      sieg ? h('div', { class: 'kamp-ergebnis' }, sterneHtml(r.jetzt), h('p', {}, fuelle(t.kampSterneJetzt, { n: r.jetzt })),
        h('ul', { class: 'klein' }, h('li', {}, t.kampStern1), h('li', {}, t.kampStern2), h('li', {}, fuelle(t.kampStern3, { n: kampagne.sterne.kleinDeck })))) : h('p', {}, t.kampNiederlageTipp),
      r.neueAnfuehrer.length ? h('p', { class: 'kamp-neu' }, fuelle(t.kampNeuerAnfuehrer, { name: r.neueAnfuehrer.map((a) => K(a).titel).join(t.und) })) : null,
      wahl.length ? h('div', { class: 'd-belohnung' }, h('p', { class: 'kicker' }, gewaehlt ? t.kampGewaehltKarte : t.kampWaehleKarte),
        h('div', { class: 'kamp-wahl' }, wahl.map((kid) => h('span', { class: 'karte-huelle' },
          kartenChip(K(kid), { gewaehlt: gewaehlt === kid, aus: Boolean(gewaehlt) && gewaehlt !== kid, onclick: gewaehlt ? null : () => { neu(rules.waehle(stand, kid)); zeichne(kid); } }),
          h('button', { type: 'button', class: 'karte-info', 'aria-label': fuelle(t.kartenInfo, { titel: K(kid).titel }), onclick: () => zeigeKartenDetail(K(kid)) }, 'i'))))) : null,
      h('div', { class: 'reihe fuss' }, knopf(t.duellNochmal, () => spiel(id), 'still'),
        knopf(t.kampZurUebersicht, uebersicht, 'haupt', { disabled: wahl.length > 0 && !gewaehlt }))));
    zeichne();
  }

  uebersicht();
}
