// Kartenspiel „Hammer & Siegel“ (Spiel im Spiel): Kampagne mit zwölf Gegnern. Oben die Regeln (in Node testbar), unten die Anzeige.
// Der Fortschritt bleibt auf dem Gerät (localStorage). Der Fortsetzungscode der Geschichte bleibt davon unberührt.
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle } from '../engine/ui.js';
import { figurHtml, portraetHtml, bildHtml, kartenBild } from '../engine/bilder.js';
import { kampagne } from '../../data/kampagne.js';
import { K, maxKopien, anzahl } from './duell-regeln.js';
import { lutherKarten } from '../../data/kartei.js';
import { view as duellView } from './duell.js';
import { zeigeSiegelbriefe } from './siegelbrief.js';

const SCHLUESSEL = 'hier-stehe-ich.kampagne.v1';
export const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
export const neuerKampagnenStand = () => ({ karten: [], sterne: {}, anfuehrer: 'a-luther', deck: [], gesehen: [], briefe: [], wachs: 0 });
// Doppelte Karten werden zu Siegellack. So viel Siegellack ergibt einen neuen Siegelbrief.
export const WACHS_JE_BRIEF = 5;

// ---------- Siegelbriefe (Kartenpakete) ----------
// Nach jedem Sieg ein Siegelbrief, beim ersten Mal mit drei Sternen dazu ein großer. Inhalt: Luthers Karten nach Seltenheit.
// Immer Fortschritt: Karten, die man noch nicht (oft genug) hat, kommen zuerst. Der erste Sieg gegen einen Gegner bringt sicher eine seiner Belohnungskarten.
// Kopien: gewöhnliche und seltene Karten darf man zweimal haben (und zweimal ins Deck nehmen), epische und legendäre einmal (maxKopien).
const SELTEN = ['gewoehnlich', 'selten', 'episch', 'legendaer'];
export const briefRules = {
  /** Gewichte der Seltenheiten. kapitel 0–3 macht seltene Karten wahrscheinlicher, glanz heißt: mindestens „selten“ (groß: mindestens „episch“). */
  gewichte(kapitel, platz) {
    const g = { gewoehnlich: 55, selten: 30, episch: 12 + 3 * kapitel, legendaer: 3 + 2 * kapitel };
    if (platz === 'glanz') g.gewoehnlich = 0;
    if (platz === 'gross') { g.gewoehnlich = 0; g.selten = 0; g.episch = 70; g.legendaer = 20 + 5 * kapitel; }
    return g;
  },
  ziehSeltenheit(gewichte, rnd) {
    const summe = SELTEN.reduce((n, s) => n + gewichte[s], 0);
    let r = rnd() * summe;
    for (const s of SELTEN) { r -= gewichte[s]; if (r < 0) return s; }
    return 'selten';
  },
  /** Öffnet einen Brief. besitz: Karten, die man schon hat (eine Karte kann zweimal darin stehen). Gibt die Karten mit „neu“ zurück
   *  (neu heißt: eine weitere Kopie, die man noch haben darf). rnd: Zufall (0–1), für Tests festlegbar. */
  inhalt(brief, besitz, rnd = Math.random) {
    const g = kampagne.gegner[brief.gegner];
    const kapitel = Math.max(0, kampagne.kapitel.findIndex((k) => k.gegner.includes(brief.gegner)));
    const pool = lutherKarten.filter((k) => k.seltenheit && SELTEN.includes(k.seltenheit));
    const plaetze = brief.art === 'gross' ? ['frei', 'frei', 'glanz', 'gross'] : ['frei', 'frei', 'glanz'];
    const gezogen = [];
    // „hat“: so viele Kopien, wie man haben darf (mit dem, was schon in diesem Brief liegt)
    const hat = (id) => anzahl(besitz, id) + gezogen.filter((x) => x.id === id).length >= maxKopien(id);
    const aus = (liste) => liste[Math.floor(rnd() * liste.length)];
    // Erster Sieg: eine Belohnungskarte des Gegners, die noch fehlt
    if (brief.belohnung) { const fehlt = (g?.belohnungen || []).filter((id) => !hat(id)); if (fehlt.length) gezogen.push({ id: aus(fehlt), neu: true }); }
    // Die Belohnungskarte ersetzt einen freien Platz. Freie Plätze ziehen nach Seltenheit aus allen Karten (Doppelte möglich),
    // der Glanzplatz (und beim großen Brief der letzte) bringt eine neue Karte, solange es eine gibt.
    const rest = gezogen.length ? plaetze.slice(1) : plaetze;
    for (const platz of rest) {
      const seltenheit = briefRules.ziehSeltenheit(briefRules.gewichte(kapitel, platz), rnd);
      const mindest = platz === 'gross' ? 2 : platz === 'glanz' ? 1 : 0;
      const nichtImBrief = (k) => !gezogen.some((y) => y.id === k.id);
      const passend = pool.filter((k) => k.seltenheit === seltenheit && nichtImBrief(k));
      let k;
      if (platz === 'frei') k = aus(passend.length ? passend : pool.filter(nichtImBrief));
      else {
        const neuePassend = passend.filter((x) => !hat(x.id));
        const neueHoeher = pool.filter((x) => SELTEN.indexOf(x.seltenheit) >= mindest && !hat(x.id));
        k = neuePassend.length ? aus(neuePassend) : neueHoeher.length ? aus(neueHoeher) : aus(passend.length ? passend : pool.filter(nichtImBrief));
      }
      gezogen.push({ id: k.id, neu: !hat(k.id) });
    }
    return gezogen;
  }
};

export const rules = {
  sterneSumme: (s) => Object.values(s.sterne).reduce((n, x) => n + x, 0),
  /** Der erste Gegner ist offen, jeder weitere nach einem Sieg gegen den vorigen. */
  offen: (s, id) => { const i = reihenfolge.indexOf(id); return i === 0 || (s.sterne[reihenfolge[i - 1]] || 0) > 0; },
  /** Sterne für eine Partie: Sieg, Sieg ohne verlorene Runde, Sieg mit kleinem Deck. */
  sterneFuer: (z, deckGroesse) => (z.sieger !== 'luther' ? 0
    : 1 + (z.runden.every((r) => r.sieger === 'luther') ? 1 : 0) + (deckGroesse <= kampagne.sterne.kleinDeck ? 1 : 0)),
  anfuehrerFrei: (s) => kampagne.anfuehrer.filter((a) => rules.sterneSumme(s) >= a.ab).map((a) => a.id),
  /** Ergebnis einer Partie eintragen. Gibt zurück, was neu ist. */
  eintragen(s, gegnerId, z, deckGroesse) {
    const n = structuredClone(s);
    const vorher = n.sterne[gegnerId] || 0;
    const jetzt = rules.sterneFuer(z, deckGroesse);
    n.sterne[gegnerId] = Math.max(vorher, jetzt);
    if (!n.gesehen.includes(gegnerId)) n.gesehen.push(gegnerId);
    const freiVorher = rules.anfuehrerFrei(s);
    // Siegelbriefe: nach jedem Sieg einer (beim ersten Sieg mit sicherer Belohnungskarte), beim ersten Mal mit 3 Sternen ein großer dazu
    const briefe = [];
    if (jetzt > 0) briefe.push({ art: 'klein', gegner: gegnerId, belohnung: vorher === 0 });
    if (vorher < 3 && jetzt === 3) briefe.push({ art: 'gross', gegner: gegnerId });
    n.briefe = [...(n.briefe || []), ...briefe];
    return { stand: n, jetzt, briefe, ersterSieg: vorher === 0 && jetzt > 0, neueAnfuehrer: rules.anfuehrerFrei(n).filter((a) => !freiVorher.includes(a)) };
  },
  /** Den ersten Brief öffnen: Karten in die Sammlung, Brief weg. */
  oeffne(s, besitz, rnd = Math.random) {
    const n = structuredClone(s);
    const brief = n.briefe.shift();
    if (!brief) return { stand: s, brief: null, karten: [] };
    const karten = briefRules.inhalt(brief, besitz, rnd);
    for (const k of karten) if (k.neu) n.karten.push(k.id);
    // Doppelte: Siegellack sammeln; genug davon ergibt einen neuen Brief
    n.wachs = (n.wachs || 0) + karten.filter((k) => !k.neu).length;
    let ausWachs = 0;
    while (n.wachs >= WACHS_JE_BRIEF) { n.wachs -= WACHS_JE_BRIEF; n.briefe.push({ art: 'klein', gegner: brief.gegner, ausWachs: true }); ausWachs += 1; }
    return { stand: n, brief, karten, ausWachs };
  }
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
  // Besitz mit Kopien: Karten aus der Geschichte einmal, aus Siegelbriefen dazu, höchstens maxKopien je Karte
  const besitz = () => { const aus = []; for (const id of [...ctx.karten().map((k) => k.id), ...stand.karten]) if (anzahl(aus, id) < maxKopien(id)) aus.push(id); return aus; };

  function uebersicht() {
    const frei = rules.anfuehrerFrei(stand);
    if (!frei.includes(stand.anfuehrer)) neu({ ...stand, anfuehrer: 'a-luther' });
    setzeInhalt(el, h('div', { class: 'kamp' },
      h('div', { class: 'kamp-kopf' },
        h('div', {}, h('p', { class: 'kicker' }, t.kampKicker), h('p', {}, t.kampText)),
        h('p', { class: 'kamp-summe' }, fuelle(t.kampSterne, { n: rules.sterneSumme(stand), von: reihenfolge.length * 3 }))),
      stand.briefe.length ? h('button', { type: 'button', class: 'kamp-brief-knopf oben', onclick: () => briefeOeffnen(uebersicht) },
        h('span', { class: 'kamp-brief-bild', 'aria-hidden': 'true' }, stand.briefe.slice(0, 5).map((b) => h('span', { class: `mini-brief${b.art === 'gross' ? ' gross' : ''}` }))),
        h('strong', {}, fuelle(t.kampBriefeOffen, { n: stand.briefe.length }))) : null,
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
            h('span', { class: 'kamp-bild', 'aria-hidden': 'true', html: portraetHtml(g, ctx.figuren[g.figur] || {}) }),
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
    const zeichne = () => setzeInhalt(el, h('div', { class: `d-ende ${sieg ? 'sieg' : 'niederlage'}` },
      h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, ctx.figuren[g.figur] || {}) }),
        h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', { class: 'd-ende-titel' }, sieg ? t.duellSieg : t.duellNiederlage), h('p', {}, sieg ? g.sieg : g.niederlage))),
      h('ul', { class: 'd-runden' }, z.runden.map((x) => h('li', { class: x.sieger }, fuelle(t.duellRundeZeile, { n: x.runde, du: x.luther, er: x.kirche }),
        ' ', h('strong', {}, x.sieger === 'luther' ? t.duellGewonnen : t.duellVerloren)))),
      sieg ? h('div', { class: 'kamp-ergebnis' }, sterneHtml(r.jetzt), h('p', {}, fuelle(t.kampSterneJetzt, { n: r.jetzt })),
        h('ul', { class: 'klein' }, h('li', {}, t.kampStern1), h('li', {}, t.kampStern2), h('li', {}, fuelle(t.kampStern3, { n: kampagne.sterne.kleinDeck })))) : h('p', {}, t.kampNiederlageTipp),
      r.neueAnfuehrer.length ? h('p', { class: 'kamp-neu' }, fuelle(t.kampNeuerAnfuehrer, { name: r.neueAnfuehrer.map((a) => K(a).titel).join(t.und) })) : null,
      // Belohnung: Siegelbriefe. Ein großer Brief mit Siegel, Antippen öffnet ihn.
      stand.briefe.length ? h('div', { class: 'kamp-briefe' },
        h('p', { class: 'kicker' }, r.briefe.length > 1 ? t.kampBriefGrossNeu : t.kampBriefNeu),
        h('button', { type: 'button', class: 'kamp-brief-knopf', onclick: () => briefeOeffnen(zeichne) },
          h('span', { class: 'kamp-brief-bild', 'aria-hidden': 'true' }, stand.briefe.slice(0, 5).map((b) => h('span', { class: `mini-brief${b.art === 'gross' ? ' gross' : ''}` }))),
          h('strong', {}, fuelle(t.kampBriefeOffen, { n: stand.briefe.length })))) : null,
      h('div', { class: 'reihe fuss' }, knopf(t.duellNochmal, () => spiel(id), 'still'),
        knopf(t.kampZurUebersicht, uebersicht, 'haupt'))));
    zeichne();
  }

  /** Alle ungeöffneten Siegelbriefe nacheinander öffnen. */
  function briefeOeffnen(danach) {
    if (!stand.briefe.length) { danach(); return; }
    zeigeSiegelbriefe({ t, wachs: WACHS_JE_BRIEF, anzahl: stand.briefe.length,
      oeffne: () => { const r = rules.oeffne(stand, besitz()); neu(r.stand); return r; },
      fertig: () => danach() });
  }

  uebersicht();
}
