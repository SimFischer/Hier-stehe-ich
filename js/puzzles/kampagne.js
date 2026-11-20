// Kartenspiel „Hammer & Siegel“ (Spiel im Spiel): Kampagne mit zwölf Gegnern. Oben die Regeln (in Node testbar), unten die Anzeige.
// Der Fortschritt bleibt auf dem Gerät (localStorage). Der Fortsetzungscode der Geschichte bleibt davon unberührt.
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle, melde } from '../engine/ui.js';
import { figurHtml, portraetHtml, bildHtml, kartenBild } from '../engine/bilder.js';
import { kampagne } from '../../data/kampagne.js';
import { K, maxKopien, anzahl } from './duell-regeln.js';
import { lutherKarten } from '../../data/kartei.js';
import { view as duellView } from './duell.js';
import { zeigeSiegelbriefe } from './siegelbrief.js';
import { setzePracht } from '../engine/pracht.js';
import { zeigeEinfuehrung, zielLeiste, zeigeSammlung, zeigeLexikon, zeigeAbzeichen, siegelAbzeichen, zeigeWerkstatt, zeigeFinale, zeigeKapitelAbschluss } from './kampagne-extras.js';

const SCHLUESSEL = 'hier-stehe-ich.kampagne.v1';
export const reihenfolge = kampagne.kapitel.flatMap((k) => k.gegner);
export const neuerKampagnenStand = () => ({ karten: [], sterne: {}, anfuehrer: 'a-luther', deck: [], gesehen: [], briefe: [], wachs: 0, intro: false, lexikon: [], decks: [], abzeichen: [], niederlagen: {}, pracht: {}, durchgespielt: null,
  kircheSiege: [], kircheDeck: [], kircheAnfuehrer: null });
// Konter-Lexikon: Jedes Paar „Luthers Karte entkräftet Kirchenkarte“, das in einer Partie wirkt, wird eingetragen. Je 5 Paare: ein Siegelbrief.
export const LEXIKON_JE_BRIEF = 5;
export const lexikonPaare = () => lutherKarten.flatMap((k) => (k.entkraeftet || []).map((c) => `${k.id}>${c}`));
// Doppelte Karten werden zu Siegellack. So viel kostet ein Siegelbrief in der Druckerwerkstatt.
export const WACHS_JE_BRIEF = 5;
// Siegellack für jedes neue Siegel-Abzeichen (data/kampagne.js, abzeichen)
export const ABZEICHEN_WACHS = 3;

// ---------- Siegelbriefe (Kartenpakete) ----------
// Nach jedem Sieg ein Siegelbrief, beim ersten Mal mit drei Sternen dazu ein großer. Inhalt: Luthers Karten nach Seltenheit.
// Immer Fortschritt: Karten, die man noch nicht (oft genug) hat, kommen zuerst. Der erste Sieg gegen einen Gegner bringt sicher eine seiner Belohnungskarten.
// Kopien: gewöhnliche und seltene Karten darf man zweimal haben (und zweimal ins Deck nehmen), epische und legendäre einmal (maxKopien).
const SELTEN = ['gewoehnlich', 'selten', 'episch', 'legendaer'];
// Höchste Seltenheit je Kapitel: Wer weiterkommt, findet bessere Karten. Kapitel 1 bis „selten“, Kapitel 2 bis „episch“, ab Kapitel 3 auch legendär.
// (Die sichere Belohnungskarte beim ersten Sieg gegen einen Gegner gilt unabhängig davon.)
export const KAPITEL_HOECHSTE = ['selten', 'episch', 'legendaer', 'legendaer'];
export const briefRules = {
  /** Gewichte der Seltenheiten. kapitel 0–3 macht seltene Karten wahrscheinlicher, glanz heißt: mindestens „selten“ (groß: mindestens „episch“). */
  gewichte(kapitel, platz) {
    const g = { gewoehnlich: 55, selten: 30, episch: 14, legendaer: kapitel >= 3 ? 8 : 4 };
    if (platz === 'glanz') g.gewoehnlich = 0;
    if (platz === 'gross') { g.gewoehnlich = 0; g.selten = 0; g.episch = 70; g.legendaer = kapitel >= 3 ? 30 : 15; }
    // Was es in diesem Kapitel noch nicht gibt, fällt weg (der große Brief bekommt dann die beste erlaubte Seltenheit)
    const hoechste = SELTEN.indexOf(KAPITEL_HOECHSTE[kapitel] || 'legendaer');
    SELTEN.forEach((sel, i) => { if (i > hoechste) g[sel] = 0; });
    // Bleibt nichts übrig (großer Brief in Kapitel 1), gibt es die beste Seltenheit, die das Kapitel erlaubt
    if (SELTEN.every((sel) => !g[sel])) g[SELTEN[hoechste]] = 1;
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
      const hoechste = SELTEN.indexOf(KAPITEL_HOECHSTE[kapitel] || 'legendaer');
      const mindest = Math.min(hoechste, platz === 'gross' ? 2 : platz === 'glanz' ? 1 : 0);
      const nichtImBrief = (k) => !gezogen.some((y) => y.id === k.id);
      const passend = pool.filter((k) => k.seltenheit === seltenheit && nichtImBrief(k));
      let k;
      const erlaubt = (x) => SELTEN.indexOf(x.seltenheit) <= hoechste;
      if (platz === 'frei') k = aus(passend.length ? passend : pool.filter((x) => nichtImBrief(x) && erlaubt(x)));
      else {
        const neuePassend = passend.filter((x) => !hat(x.id));
        const neueHoeher = pool.filter((x) => SELTEN.indexOf(x.seltenheit) >= mindest && erlaubt(x) && !hat(x.id));
        k = neuePassend.length ? aus(neuePassend) : neueHoeher.length ? aus(neueHoeher) : aus(passend.length ? passend : pool.filter((x) => nichtImBrief(x) && erlaubt(x)));
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
  eintragen(s, gegnerId, z, deckGroesse, heute = new Date().toISOString().slice(0, 10)) {
    const n = structuredClone(s);
    const vorher = n.sterne[gegnerId] || 0;
    const jetzt = rules.sterneFuer(z, deckGroesse);
    n.sterne[gegnerId] = Math.max(vorher, jetzt);
    if (!jetzt) n.niederlagen = { ...(n.niederlagen || {}), [gegnerId]: ((n.niederlagen || {})[gegnerId] || 0) + 1 };
    if (!n.gesehen.includes(gegnerId)) n.gesehen.push(gegnerId);
    // Erster Sieg gegen den letzten Gegner: Hammer & Siegel ist durchgespielt (Datum für die Urkunde)
    const finale = jetzt > 0 && gegnerId === reihenfolge.at(-1) && !n.durchgespielt;
    // Kapitel geschafft: gerade eben alle drei Gegner des Kapitels besiegt (das letzte Kapitel feiert das große Finale)
    const kap = kampagne.kapitel.findIndex((k) => k.gegner.includes(gegnerId));
    const alleBesiegt = (st) => kampagne.kapitel[kap].gegner.every((g) => (st.sterne[g] || 0) > 0);
    const kapitelFertig = kap >= 0 && kap < kampagne.kapitel.length - 1 && !alleBesiegt(s) && alleBesiegt(n) ? kap : null;
    if (finale) n.durchgespielt = heute;
    const freiVorher = rules.anfuehrerFrei(s);
    // Siegelbriefe: nach jedem Sieg einer (beim ersten Sieg mit sicherer Belohnungskarte), beim ersten Mal mit 3 Sternen ein großer dazu
    const briefe = [];
    if (jetzt > 0) briefe.push({ art: 'klein', gegner: gegnerId, belohnung: vorher === 0 });
    if (vorher < 3 && jetzt === 3) briefe.push({ art: 'gross', gegner: gegnerId });
    n.briefe = [...(n.briefe || []), ...briefe];
    return { stand: n, jetzt, briefe, finale, kapitelFertig, ersterSieg: vorher === 0 && jetzt > 0, neueAnfuehrer: rules.anfuehrerFrei(n).filter((a) => !freiVorher.includes(a)) };
  },
  /** Ein Konter wurde in einer Partie gesehen: ins Lexikon, und bei jedem fünften Eintrag ein Siegelbrief. */
  entdecke(s, lutherId, kircheId, gegnerId) {
    const paar = `${lutherId}>${kircheId}`;
    const lexikon = s.lexikon || [];
    if (lexikon.includes(paar) || !lexikonPaare().includes(paar)) return { stand: s, neu: false, brief: false };
    const n = { ...s, lexikon: [...lexikon, paar] };
    const brief = n.lexikon.length % LEXIKON_JE_BRIEF === 0;
    if (brief) n.briefe = [...(n.briefe || []), { art: 'klein', gegner: gegnerId, ausLexikon: true }];
    return { stand: n, neu: true, brief };
  },
  /** Wie viele Niederlagen fehlen noch, bis „Bestes Deck“ frei ist? 0: frei (auch, wenn man den Gegner schon besiegt hat). */
  bestesDeckNoch: (s, gegnerId) => ((s.sterne[gegnerId] || 0) > 0 ? 0 : Math.max(0, kampagne.bestesDeckNach - ((s.niederlagen || {})[gegnerId] || 0))),
  /** Einstellungen für das Startdeck gegen diesen Gegner (Größe nach Kapitel). */
  startDeck: (gegnerId) => {
    const kap = Math.max(0, kampagne.kapitel.findIndex((k) => k.gegner.includes(gegnerId)));
    return { groesse: kampagne.startDeck.groesse[kap], offenLassen: kampagne.startDeck.offen };
  },
  // ---------- Perspektivwechsel: die Kirche spielen ----------
  /** Frei, sobald das Kapitel kirchenSeite.abKapitel geschafft ist (alle drei Gegner besiegt). */
  kircheFrei: (s) => kampagne.kapitel[kampagne.kirchenSeite.abKapitel - 1].gegner.every((id) => (s.sterne[id] || 0) > 0),
  /** Karten der Kirche, die man kennt: aus den Decks aller Gegner, gegen die man gespielt hat (ohne Anführer). */
  kircheBesitz: (s) => [...new Set((s.gesehen || []).flatMap((id) => kampagne.gegner[id]?.deck || []))].filter((c) => !K(c).anfuehrer),
  /** Anführer der Kirche: die Kirchenvertreter, die man besiegt hat. */
  kircheAnfuehrerFrei: (s) => reihenfolge.filter((id) => (s.sterne[id] || 0) > 0).map((id) => kampagne.gegner[id].anfuehrer).filter(Boolean),
  /** Der erste Luther ist offen, jeder weitere nach einem Sieg gegen den vorigen. */
  kircheOffen: (s, id) => { const l = kampagne.kirchenSeite.gegner; const i = l.indexOf(id); return i === 0 || (s.kircheSiege || []).includes(l[i - 1]); },
  /** Ergebnis einer Partie als Kirche: erster Sieg gegen diesen Luther bringt Siegellack. */
  eintragenKirche(s, id, z) {
    const sieg = z.sieger === 'kirche';
    const ersterSieg = sieg && !(s.kircheSiege || []).includes(id);
    if (!ersterSieg) return { stand: s, sieg, ersterSieg, preis: false };
    const ks = kampagne.kirchenSeite;
    // Abschlusspreis: erster Sieg gegen den letzten Luther bringt einen großen Siegelbrief
    const preis = id === ks.gegner.at(-1);
    const briefe = preis ? [...(s.briefe || []), { art: 'gross', gegner: ks.briefGegner }] : s.briefe || [];
    return { stand: { ...s, kircheSiege: [...(s.kircheSiege || []), id], wachs: (s.wachs || 0) + ks.lackJeSieg, briefe }, sieg, ersterSieg, preis };
  },

  // ---------- Druckerwerkstatt ----------
  /** Höchste Seltenheit, die man drucken darf: wie bei den Siegelbriefen nach dem weitesten offenen Kapitel. */
  hoechsteDruckbar(s) {
    const kap = Math.max(0, ...reihenfolge.filter((id) => rules.offen(s, id)).map((id) => kampagne.kapitel.findIndex((k) => k.gegner.includes(id))));
    return KAPITEL_HOECHSTE[kap];
  },
  /** Kirchenkarten, die man kennt: aus den Decks der Gegner, gegen die man gespielt hat, und aus dem Lexikon. */
  bekannteKirche(s) {
    const k = new Set();
    for (const id of s.gesehen || []) { const g = kampagne.gegner[id]; [...(g?.deck || []), g?.anfuehrer].filter(Boolean).forEach((c) => k.add(c)); }
    for (const p of s.lexikon || []) k.add(p.split('>')[1]);
    return k;
  },
  /** Wunschkarten: Luthers Karten, die eine bekannte Kirchenkarte entkräften, die man noch (öfter) haben darf. */
  druckbar(s, besitz) {
    const bekannt = rules.bekannteKirche(s);
    const hoechste = SELTEN.indexOf(rules.hoechsteDruckbar(s));
    return lutherKarten.filter((k) => k.seltenheit && SELTEN.indexOf(k.seltenheit) <= hoechste && anzahl(besitz, k.id) < maxKopien(k.id)
      && (k.entkraeftet || []).some((c) => bekannt.has(c))).map((k) => k.id);
  },
  preis(kauf, s = null) {
    const w = kampagne.werkstatt;
    if (kauf.art === 'brief') return w.brief;
    if (kauf.art === 'karte') return w.karte[K(kauf.id).seltenheit];
    return w.pracht[(s?.pracht || {})[kauf.id] || 0];
  },
  /** Etwas in der Werkstatt kaufen. kauf: { art: 'brief' } | { art: 'karte', id } | { art: 'pracht', id }. Gibt den neuen Stand zurück oder null. */
  kaufe(s, kauf, besitz) {
    const preis = rules.preis(kauf, s);
    if (preis == null || (s.wachs || 0) < preis) return null;
    if (kauf.art === 'karte' && !rules.druckbar(s, besitz).includes(kauf.id)) return null;
    if (kauf.art === 'pracht' && (!besitz.includes(kauf.id) || ((s.pracht || {})[kauf.id] || 0) >= kampagne.werkstatt.pracht.length)) return null;
    const n = structuredClone(s);
    n.wachs -= preis;
    if (kauf.art === 'brief') n.briefe = [...(n.briefe || []), { art: 'klein', gegner: reihenfolge.filter((id) => rules.offen(s, id)).at(-1), ausWachs: true }];
    if (kauf.art === 'karte') n.karten.push(kauf.id);
    if (kauf.art === 'pracht') n.pracht = { ...(n.pracht || {}), [kauf.id]: ((n.pracht || {})[kauf.id] || 0) + 1 };
    return n;
  },
  /** Ist ein Abzeichen erfüllt? partie: { gegner, z, deck } nach einem Duell, sonst null (dann zählen nur Lexikon-Abzeichen). */
  abzeichenErfuellt(a, s, partie) {
    const b = a.bed;
    const lexikon = new Set(s.lexikon || []);
    if (b.lexikonMin) return lexikon.size >= b.lexikonMin;
    if (b.kircheSiege) return (s.kircheSiege || []).length >= b.kircheSiege;
    if (b.durchschaut) {
      const kirche = [...new Set(kampagne.gegner[b.durchschaut].deck)];
      return kirche.every((c) => [...lexikon].some((p) => p.endsWith(`>${c}`)));
    }
    if (!partie || partie.z.sieger !== 'luther') return false;
    const { gegner, z, deck } = partie;
    const typ = (art) => deck.filter((id) => K(id).typ === art).length;
    const kapitel = kampagne.kapitel.findIndex((k) => k.gegner.includes(gegner)) + 1;
    const treffer = z.log.reduce((n, e) => n + (e.seite === 'luther' && e.treffer ? e.treffer.length : 0), 0);
    return (!b.gegner || b.gegner === gegner)
      && (!b.abKapitel || kapitel >= b.abKapitel)
      && Object.entries(b.typMin || {}).every(([art, n]) => typ(art) >= n)
      && Object.entries(b.typMax || {}).every(([art, n]) => typ(art) <= n)
      && (!b.bundMin || deck.filter((id) => K(id).bund).length >= b.bundMin)
      && (!b.deckMax || deck.length <= b.deckMax)
      && (!b.trefferMin || treffer >= b.trefferMin)
      && (!b.zuNull || z.runden.every((r) => r.sieger === 'luther'))
      && (!b.ohneAnfuehrer || !z.log.some((e) => e.seite === 'luther' && e.art === 'spiel' && K(e.id).anfuehrer));
  },
  /** Neue Abzeichen vergeben: je Abzeichen Siegellack (ausgeben in der Druckerwerkstatt). */
  vergebeAbzeichen(s, partie = null) {
    const hat = new Set(s.abzeichen || []);
    const neue = kampagne.abzeichen.filter((a) => !hat.has(a.id) && rules.abzeichenErfuellt(a, s, partie));
    if (!neue.length) return { stand: s, neue: [] };
    const n = structuredClone(s);
    n.abzeichen = [...hat, ...neue.map((a) => a.id)];
    n.wachs = (n.wachs || 0) + neue.length * ABZEICHEN_WACHS;
    return { stand: n, neue };
  },
  /** Den ersten Brief öffnen: Karten in die Sammlung, Brief weg. */
  oeffne(s, besitz, rnd = Math.random) {
    const n = structuredClone(s);
    const brief = n.briefe.shift();
    if (!brief) return { stand: s, brief: null, karten: [] };
    const karten = briefRules.inhalt(brief, besitz, rnd);
    for (const k of karten) if (k.neu) n.karten.push(k.id);
    // Doppelte: Siegellack sammeln (ausgeben in der Druckerwerkstatt)
    n.wachs = (n.wachs || 0) + karten.filter((k) => !k.neu).length;
    return { stand: n, brief, karten };
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
  const neu = (s) => { stand = s; speichere(s); setzePracht(s.pracht); };
  setzePracht(stand.pracht);
  // Besitz mit Kopien: Karten aus der Geschichte einmal, aus Siegelbriefen dazu, höchstens maxKopien je Karte
  const besitz = () => { const aus = []; for (const id of [...ctx.karten().map((k) => k.id), ...stand.karten]) if (anzahl(aus, id) < maxKopien(id)) aus.push(id); return aus; };

  function uebersicht() {
    const frei = rules.anfuehrerFrei(stand);
    if (!frei.includes(stand.anfuehrer)) neu({ ...stand, anfuehrer: 'a-luther' });
    setzeInhalt(el, h('div', { class: 'kamp' },
      h('div', { class: 'kamp-kopf' },
        h('div', {}, h('p', { class: 'kicker' }, t.kampKicker), h('p', {}, t.kampText),
          stand.durchgespielt ? h('p', { class: 'kamp-durch' }, h('span', { class: 'kamp-durch-marke' }, t.kampDurchgespielt), ' ', t.kampDurchZiele,
            ' ', knopf(t.kampUrkundeAnsehen, () => zeigeFinale({ t, stand, besitz: besitz(), figuren: ctx.figuren }), 'still klein')) : null),
        h('div', { class: 'kamp-kopf-rechts' },
          h('p', { class: 'kamp-summe' }, fuelle(t.kampSterne, { n: rules.sterneSumme(stand), von: reihenfolge.length * 3 })),
          knopf(t.kampSoGehts, einfuehrung, 'still klein'))),
      // Immer ein nächstes Ziel vor Augen: Weg zum Gipfel, Siegellack, Sammlung, nächster Anführer
      zielLeiste({ t, stand, besitz: besitz(), figuren: ctx.figuren, wachsJeBrief: WACHS_JE_BRIEF, onSammlung: () => zeigeSammlung({ t, besitz: besitz() }), onLexikon: () => zeigeLexikon({ t, stand }), onAbzeichen: () => zeigeAbzeichen({ t, stand }),
        onWerkstatt: () => zeigeWerkstatt({ t, lage: () => ({ stand, besitz: besitz() }), regeln: rules,
          kaufen: (kauf) => { const n = rules.kaufe(stand, kauf, besitz()); if (n) { neu(n); melde(kaufMeldung(kauf)); } return n; },
          briefeOeffnen: () => briefeOeffnen(uebersicht) }) }),
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
        h('h3', {}, fuelle(t.kampKapitel, { n: i + 1, titel: kap.titel }), h('em', {}, ` ${kap.zeit}`),
          h('span', { class: `kamp-beute rar-${KAPITEL_HOECHSTE[i]}` }, t.kampBeute[i])),
        h('div', { class: 'kamp-gegner' }, kap.gegner.map((id) => {
          const g = kampagne.gegner[id];
          const offen = rules.offen(stand, id);
          return h('button', { type: 'button', class: `kamp-tafel${offen ? '' : ' zu'}${stand.sterne[id] ? ' besiegt' : ''}`, disabled: !offen, onclick: () => spiel(id) },
            h('span', { class: 'kamp-bild', 'aria-hidden': 'true', html: portraetHtml(g, ctx.figuren[g.figur] || {}) }),
            h('strong', {}, g.name), h('span', { class: 'klein' }, g.ort),
            offen ? sterneHtml(stand.sterne[id] || 0) : h('span', { class: 'klein' }, t.kampGesperrt),
            // Besiegte Gegner lohnen sich weiter: jeder Sieg bringt einen Siegelbrief
            stand.sterne[id] ? h('span', { class: 'kamp-nochmal' }, t.kampNochmalBrief) : null);
        })))),
      kircheAbschnitt(),
      h('div', { class: 'reihe fuss' }, h('span', {}), knopf(t.kampBeenden, () => fertig({}), 'still'))));
  }

  const kaufMeldung = (kauf) => (kauf.art === 'brief' ? t.kampWerkGekauftBrief : kauf.art === 'karte' ? fuelle(t.kampWerkGedruckt, { titel: K(kauf.id).titel })
    : fuelle(t.kampWerkVerschoenert, { titel: K(kauf.id).titel, stufe: t.kampWerkStufe[stand.pracht?.[kauf.id] || 0] }));

  /** Einführung (beim ersten Start von selbst, sonst über „So funktioniert’s“). */
  function einfuehrung() {
    zeigeEinfuehrung({ t, stand, besitz: besitz(), figuren: ctx.figuren, wachsJeBrief: WACHS_JE_BRIEF, fertig: () => { if (!stand.intro) neu({ ...stand, intro: true }); } });
  }

  /** Konter-Lexikon im Duell: neu? (dann fragt das Duell „Warum?“) und eintragen (Meldung, Briefe, Abzeichen). briefGegner: für Briefe aus dem Lexikon. */
  const lexikonHaken = (briefGegner) => ({
    konterNeu: (lutherId, kircheId) => rules.entdecke(stand, lutherId, kircheId, briefGegner).neu,
    entdecke: (lutherId, kircheId) => {
      const r = rules.entdecke(stand, lutherId, kircheId, briefGegner);
      if (!r.neu) return;
      neu(r.stand);
      melde(fuelle(r.brief ? t.kampLexikonBrief : t.kampLexikonNeu, { karte: K(lutherId).titel, gegen: K(kircheId).titel }));
      abzeichenMelden(rules.vergebeAbzeichen(stand));
    }
  });
  const abzeichenMelden = (a) => { if (a.neue.length) { neu(a.stand); setTimeout(() => melde(fuelle(t.kampAbzNeu, { titel: a.neue.map((x) => x.titel).join(t.und), n: a.neue.length * ABZEICHEN_WACHS })), 2600); } };

  /** Perspektivwechsel: Abschnitt in der Übersicht (gesperrt bis Kapitel 3, dann Anführerwahl und drei Luther-Gegner). */
  function kircheAbschnitt() {
    const ks = kampagne.kirchenSeite;
    if (!rules.kircheFrei(stand)) return h('section', { class: 'kamp-kapitel kamp-kirche zu' },
      h('h3', {}, ks.titel), h('p', { class: 'klein' }, h('span', { 'aria-hidden': 'true' }, '🔒 '), ks.zu));
    const fuehrer = rules.kircheAnfuehrerFrei(stand);
    const gewaehlt = fuehrer.includes(stand.kircheAnfuehrer) ? stand.kircheAnfuehrer : fuehrer[0];
    return h('section', { class: 'kamp-kapitel kamp-kirche' },
      h('h3', {}, ks.titel), h('p', {}, ks.text),
      h('p', { class: 'kicker' }, t.kircheAnfuehrerWahl),
      h('div', { class: 'kamp-anfuehrer kamp-kirche-fuehrer' }, fuehrer.map((a) => h('button', { type: 'button', class: `kamp-fuehrer kamp-kirche-wahl${a === gewaehlt ? ' gewaehlt' : ''}`, 'aria-pressed': String(a === gewaehlt),
        onclick: () => { neu({ ...stand, kircheAnfuehrer: a }); uebersicht(); } },
        h('span', { class: 'bk-bild', 'aria-hidden': 'true', html: bildHtml(kartenBild(K(a)).name) }), h('strong', {}, K(a).titel), h('em', {}, fuelle(t.kartenStaerke, { n: K(a).staerke }))))),
      h('p', { class: 'kicker kamp-kirche-gegner-titel' }, t.kircheGegnerTitel),
      h('div', { class: 'kamp-gegner' }, ks.gegner.map((id) => {
        const g = kampagne.lutherGegner[id];
        const offen = rules.kircheOffen(stand, id);
        const besiegt = (stand.kircheSiege || []).includes(id);
        return h('button', { type: 'button', class: `kamp-tafel${offen ? '' : ' zu'}${besiegt ? ' besiegt' : ''}`, disabled: !offen, onclick: () => spielKirche(id, gewaehlt) },
          h('span', { class: 'kamp-bild', 'aria-hidden': 'true', html: portraetHtml(g, ctx.figuren[g.figur] || {}) }),
          h('strong', {}, g.name), h('span', { class: 'klein' }, g.ort),
          h('span', { class: 'klein' }, besiegt ? t.kircheGeschafft : offen ? t.kircheOffen : t.kampGesperrt));
      })));
  }

  function spielKirche(id, anfuehrer) {
    duellView(el, { art: 'duell', gegner: id, kampagne: {
      seite: 'kirche', besitz: rules.kircheBesitz(stand), anfuehrer, deck: stand.kircheDeck,
      merkeDeck: (deck) => neu({ ...stand, kircheDeck: [...deck] }),
      ...lexikonHaken(kampagne.kirchenSeite.briefGegner),
      lackBonus: () => neu({ ...stand, wachs: (stand.wachs || 0) + kampagne.kirchenSeite.lackWarum }),
      zurueck: uebersicht,
      ergebnis: (z) => auswertungKirche(id, z)
    } }, ctx, () => uebersicht());
  }

  /** Ergebnis als Kirche: Runden, Siegellack beim ersten Sieg und die Gesprächsfrage (ohne Bewertung). */
  function auswertungKirche(id, z) {
    const g = kampagne.lutherGegner[id];
    const r = rules.eintragenKirche(stand, id, z);
    neu(r.stand);
    const abz = rules.vergebeAbzeichen(stand);
    neu(abz.stand);
    // Welche deiner Karten hat Luther entkräftet? (für das Gespräch)
    const getroffen = [...new Set(z.log.filter((e) => e.seite === 'luther' && e.treffer).flatMap((e) => e.treffer.map((c) => `${e.id}>${c}`)))];
    // Anzeige (auch nach dem Öffnen der Briefe erneut, ohne das Ergebnis noch einmal einzutragen)
    const zeigen = () => setzeInhalt(el, h('div', { class: `d-ende ${r.sieg ? 'sieg' : 'niederlage'} kirche-ende` },
      h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, ctx.figuren[g.figur] || {}) }),
        h('div', {}, h('p', { class: 'kicker' }, `${t.kircheKicker} · ${g.ort}`), h('h3', { class: 'd-ende-titel' }, r.sieg ? t.duellSieg : t.duellNiederlage), h('p', {}, r.sieg ? g.sieg : g.niederlage))),
      h('ul', { class: 'd-runden' }, z.runden.map((x) => h('li', { class: x.sieger === 'kirche' ? 'luther' : 'kirche' }, fuelle(t.duellRundeZeile, { n: x.runde, du: x.kirche, er: x.luther }),
        ' ', h('strong', {}, x.sieger === 'kirche' ? t.duellGewonnen : t.duellVerloren)))),
      r.ersterSieg ? h('p', { class: 'kamp-neu' }, fuelle(t.kircheLack, { n: kampagne.kirchenSeite.lackJeSieg })) : null,
      abz.neue.length ? h('div', { class: 'kamp-abz-neu', role: 'status' },
        h('p', { class: 'kicker' }, abz.neue.length > 1 ? t.kampAbzNeuMehr : t.kampAbzNeuEins),
        abz.neue.map((a) => h('div', { class: 'kamp-abz-zeile' }, siegelAbzeichen(a, true), h('div', {}, h('strong', {}, a.titel), h('span', {}, a.text)))),
        h('p', { class: 'klein' }, fuelle(t.kampAbzLack, { n: abz.neue.length * ABZEICHEN_WACHS }))) : null,
      r.preis ? h('p', { class: 'kamp-neu kirche-preis' }, t.kirchePreis) : null,
      stand.briefe.length ? h('div', { class: 'kamp-briefe' },
        h('button', { type: 'button', class: 'kamp-brief-knopf', onclick: () => briefeOeffnen(zeigen) },
          h('span', { class: 'kamp-brief-bild', 'aria-hidden': 'true' }, stand.briefe.slice(0, 5).map((b) => h('span', { class: `mini-brief${b.art === 'gross' ? ' gross' : ''}` }))),
          h('strong', {}, fuelle(t.kampBriefeOffen, { n: stand.briefe.length })))) : null,
      getroffen.length ? h('div', { class: 'kirche-getroffen' }, h('p', { class: 'kicker' }, t.kircheGetroffen),
        h('ul', {}, getroffen.map((p) => { const [l, c] = p.split('>'); return h('li', {}, h('strong', {}, K(c).titel), ' ← ', K(l).titel); }))) : null,
      h('div', { class: 'kirche-frage' }, h('p', { class: 'kicker' }, t.kircheFrageTitel), h('p', {}, g.frage)),
      h('div', { class: 'reihe fuss' }, knopf(t.duellNochmal, () => spielKirche(id, stand.kircheAnfuehrer || rules.kircheAnfuehrerFrei(stand)[0]), 'still'),
        knopf(t.kampZurUebersicht, uebersicht, 'haupt'))));
    zeigen();
  }

  function spiel(id) {
    duellView(el, { art: 'duell', gegner: id, kampagne: {
      besitz: besitz(), anfuehrer: stand.anfuehrer, deck: stand.deck,
      merkeDeck: (deck) => neu({ ...stand, deck: [...deck] }),
      // Deckbau: Startdeck immer, bestes Deck erst nach Niederlagen oder einem Sieg
      startDeck: rules.startDeck(id),
      bestesDeckNoch: rules.bestesDeckNoch(stand, id),
      // Gespeicherte Decks (Name und Karten), höchstens sechs
      get decks() { return stand.decks || []; },
      speichereDecks: (decks) => neu({ ...stand, decks }),
      zurueck: uebersicht,
      ergebnis: (z, deck) => auswertung(id, z, deck),
      ...lexikonHaken(id)
    } }, ctx, () => uebersicht());
  }

  function auswertung(id, z, deck) {
    const g = kampagne.gegner[id];
    const r = rules.eintragen(stand, id, z, deck.length);
    neu(r.stand);
    const abz = rules.vergebeAbzeichen(stand, { gegner: id, z, deck });
    neu(abz.stand);
    const sieg = z.sieger === 'luther';
    const zeichne = () => setzeInhalt(el, h('div', { class: `d-ende ${sieg ? 'sieg' : 'niederlage'}` },
      h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, ctx.figuren[g.figur] || {}) }),
        h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', { class: 'd-ende-titel' }, sieg ? t.duellSieg : t.duellNiederlage), h('p', {}, sieg ? g.sieg : g.niederlage))),
      h('ul', { class: 'd-runden' }, z.runden.map((x) => h('li', { class: x.sieger }, fuelle(t.duellRundeZeile, { n: x.runde, du: x.luther, er: x.kirche }),
        ' ', h('strong', {}, x.sieger === 'luther' ? t.duellGewonnen : t.duellVerloren)))),
      sieg ? h('div', { class: 'kamp-ergebnis' }, sterneHtml(r.jetzt), h('p', {}, fuelle(t.kampSterneJetzt, { n: r.jetzt })),
        h('ul', { class: 'klein' }, h('li', {}, t.kampStern1), h('li', {}, t.kampStern2), h('li', {}, fuelle(t.kampStern3, { n: kampagne.sterne.kleinDeck })))) : h('p', {}, t.kampNiederlageTipp),
      abz.neue.length ? h('div', { class: 'kamp-abz-neu', role: 'status' },
        h('p', { class: 'kicker' }, abz.neue.length > 1 ? t.kampAbzNeuMehr : t.kampAbzNeuEins),
        abz.neue.map((a) => h('div', { class: 'kamp-abz-zeile' }, siegelAbzeichen(a, true), h('div', {}, h('strong', {}, a.titel), h('span', {}, a.text)))),
        h('p', { class: 'klein' }, fuelle(t.kampAbzLack, { n: abz.neue.length * ABZEICHEN_WACHS }))) : null,
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
    if (r.finale) zeigeFinale({ t, stand, besitz: besitz(), figuren: ctx.figuren });
    else if (r.kapitelFertig != null) zeigeKapitelAbschluss({ t, kapitel: r.kapitelFertig, stand, figuren: ctx.figuren });
  }

  /** Alle ungeöffneten Siegelbriefe nacheinander öffnen. */
  function briefeOeffnen(danach) {
    if (!stand.briefe.length) { danach(); return; }
    zeigeSiegelbriefe({ t, wachs: WACHS_JE_BRIEF, anzahl: stand.briefe.length,
      oeffne: () => { const r = rules.oeffne(stand, besitz()); neu(r.stand); return r; },
      fertig: () => danach() });
  }

  uebersicht();
  if (!stand.intro) einfuehrung();
}
