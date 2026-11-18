// Kartenspiel „Disputation“: Spieltisch. Die Regeln stehen in duell-regeln.js.
// Drei Arten: Disputation in der Geschichte, geführte Übung (Gegner mit „tutorial“) und Kampagne (schritt.kampagne).
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle } from '../engine/ui.js';
import { bildHtml, figurHtml, portraetHtml, kartenBild, bildUrl } from '../engine/bilder.js';
import { disputation } from '../../data/disputation.js';
import { kampagne as kampagnenDaten } from '../../data/kampagne.js';
import { rules, K, wert, summe, entkraeftet, deckVorschlag } from './duell-regeln.js';

export { rules };
const PAUSE_KI = 950;

export const gegnerDaten = (id) => disputation.gegner[id] || kampagnenDaten.gegner[id];

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  const kamp = schritt.kampagne || null; // { besitz, anfuehrer, ergebnis(z, deck), zurueck() }
  const R = { ...disputation.regeln, ...(kamp ? kampagnenDaten.regeln : {}) };
  const g = gegnerDaten(schritt.gegner);
  const tutorial = g.tutorial || null;
  const fig = ctx.figuren[g.figur] || {};
  const besitz = kamp ? kamp.besitz : ctx.karten().map((k) => k.id);
  const ersterKampf = !ctx.state.flags.some((f) => f.startsWith('duell:'));
  const passendesDeck = () => {
    if (besitz.length <= R.deckMax) return [...besitz];
    const gemerkt = kamp ? kamp.deck : ctx.state.deck;
    const vorher = (gemerkt || []).filter((id) => besitz.includes(id)).slice(0, R.deckMax);
    return vorher.length >= R.deckMin ? vorher : deckVorschlag(besitz, R);
  };
  let deck = passendesDeck();
  let z = null;
  let werteVorher = new Map();
  let gezeigteRunden = 0;
  let banner = null;
  let timer = null;
  let besteStufe = 0;
  let neueKarte = null;
  let versuch = 0;
  let tutSchritt = 0;

  const name = (id) => `„${K(id).titel}“`;
  // wer: im Satz (der Sprecher des Kaisers), Wer: am Satzanfang, wen: nach „gegen“.
  const wer = g.wer || g.name;
  const Wer = wer[0].toUpperCase() + wer.slice(1);
  const wen = g.wen || g.name;
  const lebt = () => el.isConnected;
  // Eigene Bilder für Tisch und Kartenrücken, falls vorhanden (data/assets.js).
  const url = (n) => (bildUrl(n) ? `url("${bildUrl(n)}")` : 'none');
  const tischStil = `--tisch: ${url('tisch-disputation')}; --ruecken: ${url('ruecken-kirche')}`;

  // ---------- Vorbereitung: Gegner, Regeln, Deck ----------
  function vorbereitung() {
    if (tutorial) {
      setzeInhalt(el, h('div', { class: 'd-vor' },
        h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
          h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', {}, fuelle(t.duellGegen, { name: wen })), h('p', {}, g.einleitung))),
        h('p', {}, t.tutorialStart),
        h('div', { class: 'reihe fuss' }, h('span', {}), knopf(t.duellLos, starte, 'haupt'))));
      return;
    }
    const zuViel = besitz.length > R.deckMax;
    const ok = deck.length >= Math.min(R.deckMin, besitz.length) && deck.length <= R.deckMax;
    const umschalten = (id) => { deck = deck.includes(id) ? deck.filter((x) => x !== id) : deck.length < R.deckMax ? [...deck, id] : deck; vorbereitung(); };
    const fuehrer = g.anfuehrer ? K(g.anfuehrer) : null;
    setzeInhalt(el,
      h('div', { class: 'd-vor' },
        h('div', { class: 'd-gegner-kopf' },
          h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
          h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', {}, fuelle(t.duellGegen, { name: wen })), h('p', {}, g.einleitung))),
        h('details', { class: 'd-regeln', open: ersterKampf && versuch === 0 }, h('summary', {}, t.duellRegeln),
          h('ol', {}, disputation.regelText.map((r) => h('li', {}, r)))),
        h('h3', { class: 'zwischen' }, fuelle(t.duellSeinDeck, { name: wer })),
        h('p', { class: 'klein' }, t.duellSeinDeckText),
        h('div', { class: 'd-kirchendeck' },
          fuehrer ? kartenChip(fuehrer, { mini: true, onclick: () => gross({ id: fuehrer.id }), gewaehlt: false }) : null,
          [...new Set(g.deck)].map((id) => kartenChip(K(id), { mini: true, onclick: () => gross({ id }) }))),
        fuehrer ? h('p', { class: 'klein' }, fuelle(t.duellAnfuehrerGegner, { name: fuehrer.titel })) : null,
        kamp?.anfuehrer || g.lutherAnfuehrer ? h('p', { class: 'klein' }, fuelle(t.duellAnfuehrerDu, { name: K(kamp?.anfuehrer || g.lutherAnfuehrer).titel })) : null,
        zuViel ? [
          h('h3', { class: 'zwischen' }, fuelle(t.duellDeinDeck, { n: deck.length, min: R.deckMin, max: R.deckMax })),
          h('p', { class: 'klein' }, t.duellDeckText),
          h('div', { class: 'hand d-sammlung' }, besitz.map((id) => h('span', { class: 'karte-huelle' }, kartenChip(K(id), { klein: true, gewaehlt: deck.includes(id), onclick: () => umschalten(id) }),
            h('button', { type: 'button', class: 'karte-info', 'aria-label': fuelle(t.kartenInfo, { titel: K(id).titel }), onclick: () => gross({ id }) }, 'i'))))
        ] : h('p', { class: 'klein' }, fuelle(t.duellAlleKarten, { n: deck.length })),
        h('div', { class: 'reihe fuss' }, kamp ? knopf(t.kampZurUebersicht, () => kamp.zurueck(), 'still') : h('span', {}), knopf(t.duellLos, starte, 'haupt', { disabled: !ok }))));
  }

  function starte() {
    if (!tutorial) (kamp ? kamp.merkeDeck : ctx.merkeDeck)(deck);
    versuch += 1; tutSchritt = 0;
    z = rules.start(g, deck, (Date.now() ^ (versuch * 2654435761)) >>> 0, disputation.regeln, { anfuehrer: kamp?.anfuehrer || g.lutherAnfuehrer || null });
    if (!z.tausch) z = rules.beginne(z);
    gezeigteRunden = 0; banner = null; werteVorher = new Map();
    zeichne();
  }

  // ---------- Tutorial ----------
  const tut = () => (tutorial ? tutorial[tutSchritt] : null);
  // Erklärschritte (ohne „erwartet“) warten auf „Weiter“. Sie erscheinen, wenn du am Zug bist.
  const tutErklaert = () => tutorial && tut() && !tut().erwartet && z.am === 'luther' && z.phase === 'spiel';
  const tutErlaubt = (was) => !tutorial || (tut()?.erwartet === was);
  const tutWeiter = () => { if (tutorial) tutSchritt += 1; };

  // ---------- Spieltisch ----------
  function brettKarte(seite, inst, letzte) {
    const k = K(inst.id);
    const w = wert(z, seite, inst);
    const vorher = werteVorher.get(inst.uid);
    const ent = entkraeftet(z, seite, inst);
    const bild = kartenBild(k);
    const klassen = ['bk', `typ-${k.typ}`, `rar-${k.seltenheit}`, seite, bild.kunst ? 'mit-kunst' : '', k.anfuehrer ? 'ist-anfuehrer' : '',
      ent ? 'entkraeftet' : '', w > k.staerke ? 'plus' : w < k.staerke ? 'minus' : '',
      inst.uid === letzte ? 'neu' : '', vorher != null && vorher !== w ? 'pop' : '', ent && vorher != null && vorher !== 1 ? 'bricht' : ''];
    return h('button', { type: 'button', class: klassen.filter(Boolean).join(' '), onclick: () => gross({ id: inst.id, seite, uid: inst.uid }),
      'aria-label': `${k.titel}, ${fuelle(t.kartenStaerke, { n: w })}${ent ? `, ${t.duellEntkraeftet}` : ''}` },
      h('span', { class: 'bk-bild', 'aria-hidden': 'true', html: bildHtml(bild.name) }),
      h('span', { class: 'bk-name' }, k.titel),
      h('span', { class: 'bk-wert', 'aria-hidden': 'true' }, w !== k.staerke ? h('s', {}, String(k.staerke)) : null, String(w)),
      ent ? h('span', { class: 'bk-riss', 'aria-hidden': 'true' }) : null);
  }

  /** Anführer neben dem Namen: Antippen zeigt ihn groß, Luther kann ihn dort ausspielen. */
  function anfuehrerKnopf(seite, amZug) {
    const a = z.seiten[seite].anfuehrer;
    if (!a) return null;
    const k = K(a.id);
    const bild = kartenBild(k);
    return h('button', { type: 'button', class: `d-anfuehrer ${seite}${amZug ? ' bereit' : ''}`, 'aria-label': fuelle(t.duellAnfuehrerName, { name: k.titel }),
      onclick: () => gross({ id: a.id, seite, uid: a.uid, anfuehrer: seite === 'luther' && amZug }) },
      h('span', { class: 'bk-bild', 'aria-hidden': 'true', html: bildHtml(bild.name) }),
      h('span', { class: 'd-anfuehrer-wert', 'aria-hidden': 'true' }, String(k.staerke)));
  }

  const edelsteine = (n) => h('span', { class: 'd-siege', 'aria-label': fuelle(t.duellRundenSiege, { n }) },
    Array.from({ length: R.siegeNoetig }, (_, i) => h('span', { class: `stein${i < n ? ' an' : ''}` })));

  function ereignisText(e) {
    if (!e) return z.phase === 'tausch' ? fuelle(t.duellTausch, { n: z.tausch }) : '';
    const wer = e.seite === 'kirche' ? Wer : t.duellDu;
    if (e.art === 'passe') return fuelle(t.duellPasst, { wer });
    let s = fuelle(e.seite === 'kirche' ? t.duellSpieltEr : t.duellSpieltDu, { wer, karte: name(e.id) });
    if (K(e.id).anfuehrer) s += ' ' + t.duellAnfuehrerGespielt;
    if (e.treffer) s += ' ' + fuelle(t.duellTreffer, { karte: e.treffer.map(name).join(', ') });
    if (e.bann) s += ' ' + fuelle(t.duellBann, { karte: name(e.bann) });
    if (e.gezogen) s += ' ' + fuelle(e.seite === 'kirche' ? t.duellZiehtEr : t.duellZiehtDu, { n: e.gezogen });
    return s;
  }

  function zeichne() {
    if (!lebt()) return;
    clearTimeout(timer);
    const l = z.seiten.luther; const k = z.seiten.kirche;
    const letzte = z.log.at(-1);
    const letzteUid = letzte?.art === 'spiel' ? letzte.uid : null;
    const amZug = z.phase === 'spiel' && z.am === 'luther' && !banner && !tutErklaert();
    const tausch = z.phase === 'tausch';
    const sl = summe(z, 'luther'); const sk = summe(z, 'kirche');
    const ziel = tutorial && !banner && z.am === 'luther' ? tut()?.ziel : null;
    const leuchtet = (name) => (ziel === name ? ' tut-ziel' : '');

    const kopfKirche = h('div', { class: `d-kopf kirche${z.am === 'kirche' && z.phase === 'spiel' ? ' dran' : ''}` },
      h('span', { class: 'd-portrait klein', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
      h('div', { class: 'd-name' }, h('strong', {}, g.name), edelsteine(k.siege)),
      anfuehrerKnopf('kirche', false),
      h('span', { class: 'd-handzahl', 'aria-label': fuelle(t.duellHandZahl, { n: k.hand.length }) },
        Array.from({ length: Math.min(k.hand.length, 10) }, () => h('span', { class: 'ruecken', 'aria-hidden': 'true' })), h('em', {}, String(k.hand.length))),
      k.gepasst ? h('span', { class: 'd-pass' }, t.duellGepasst) : null,
      h('span', { class: `d-summe${sk > sl ? ' vorne' : ''}${leuchtet('summen')}`, 'aria-label': fuelle(t.duellSumme, { n: sk }) }, String(sk)));
    const kopfLuther = h('div', { class: `d-kopf luther${amZug ? ' dran' : ''}` },
      h('div', { class: 'd-name' }, h('strong', {}, t.duellDuName), edelsteine(l.siege)),
      anfuehrerKnopf('luther', amZug),
      h('span', { class: 'd-runde' }, fuelle(t.duellRunde, { n: z.runde })),
      l.gepasst ? h('span', { class: 'd-pass' }, t.duellGepasst) : null,
      h('span', { class: `d-summe${sl > sk ? ' vorne' : ''}${leuchtet('summen')}`, 'aria-label': fuelle(t.duellSumme, { n: sl }) }, String(sl)),
      tausch ? knopf(t.duellTauschFertig, () => { z = rules.beginne(z); zeichne(); }, 'haupt')
        : knopf(t.duellPassen, () => { if (!tutErlaubt('passe')) return; z = rules.passe(z, 'luther'); tutWeiter(); weiter(); }, `warn${leuchtet('passen')}`, { disabled: !amZug || !tutErlaubt('passe') }));

    const status = h('p', { class: `d-status${letzte?.treffer ? ' treffer' : letzte?.bann ? ' bann' : ''}`, role: 'status' },
      tausch ? fuelle(t.duellTausch, { n: z.tausch }) : banner ? '' : z.am === 'kirche' && z.phase === 'spiel' ? `${ereignisText(letzte)} ${fuelle(t.duellUeberlegt, { name: Wer })}`.trim()
        : `${ereignisText(letzte)} ${amZug ? t.duellDeinZug : ''}`.trim());

    const hand = h('div', { class: 'd-hand' }, l.hand.map((inst) => {
      const kk = K(inst.id);
      const neu = tausch && !werteVorher.has(`h${inst.uid}`) && werteVorher.size > 0;
      return kartenChip(kk, { klein: true, extra: `d-handkarte${neu ? ' neu' : ''}${leuchtet(inst.id)}`, aus: !(amZug || tausch) || (tutorial && !tutErlaubt(inst.id)),
        onclick: () => { if (tausch) { if (z.tausch > 0) { z = rules.tausche(z, inst.uid); zeichne(); } } else gross({ id: inst.id, seite: 'luther', uid: inst.uid, hand: true }); } });
    }));

    // Erklärkasten der Übung
    const schritt = tutorial && !banner && z.am === 'luther' && z.phase === 'spiel' ? tut() : null;
    const coach = schritt ? h('div', { class: `tut-box${schritt.erwartet ? ' aufgabe' : ''}`, role: 'status' },
      h('span', { class: 'd-portrait klein', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
      h('div', {}, h('strong', {}, g.name), h('p', {}, schritt.text),
        schritt.erwartet ? null : knopf(t.weiter, () => { tutWeiter(); zeichne(); }, 'haupt klein'))) : null;

    setzeInhalt(el, h('div', { class: `d-tisch${banner ? ' mit-banner' : ''}${tutorial ? ' mit-tutorial' : ''}`, style: tischStil },
      kopfKirche,
      h('div', { class: `d-reihe kirche${leuchtet('reihe-kirche')}`, 'aria-label': fuelle(t.duellReihe, { name: g.name }) }, k.reihe.map((inst) => brettKarte('kirche', inst, letzteUid))),
      status,
      h('div', { class: `d-reihe luther${leuchtet('reihe-luther')}`, 'aria-label': fuelle(t.duellReihe, { name: t.duellDuName }) }, l.reihe.map((inst) => brettKarte('luther', inst, letzteUid))),
      kopfLuther, hand,
      coach,
      banner ? bannerEl() : null));

    // Werte merken, damit Änderungen beim nächsten Zeichnen aufleuchten.
    werteVorher = new Map();
    for (const s of ['luther', 'kirche']) for (const inst of z.seiten[s].reihe) werteVorher.set(inst.uid, wert(z, s, inst));
    for (const inst of l.hand) werteVorher.set(`h${inst.uid}`, 1);

    if (!banner && z.phase === 'spiel' && z.am === 'kirche') timer = setTimeout(kiZug, PAUSE_KI);
  }

  function kiZug() {
    if (!lebt() || z.phase !== 'spiel' || z.am !== 'kirche') return;
    z = rules.fuehreAus(z, rules.kiZug(z), 'kirche');
    weiter();
  }

  /** Nach jedem Zug: Rundenende als Banner zeigen, sonst neu zeichnen. */
  function weiter() {
    if (z.runden.length > gezeigteRunden) {
      banner = z.runden[gezeigteRunden];
      gezeigteRunden += 1;
    }
    zeichne();
  }

  function bannerEl() {
    const r = banner;
    const ende = z.phase === 'ende' && gezeigteRunden >= z.runden.length;
    const text = r.sieger === 'luther' ? t.duellRundeDu : r.gleich ? t.duellRundeGleich : fuelle(t.duellRundeEr, { name: Wer });
    return h('div', { class: `d-banner ${r.sieger}`, role: 'alert' },
      h('p', { class: 'kicker' }, fuelle(t.duellRundeEnde, { n: r.runde })),
      h('strong', {}, text),
      h('p', { class: 'd-banner-zahl' }, h('span', {}, String(r.luther)), ' : ', h('span', {}, String(r.kirche))),
      // Endeten mehrere Runden auf einmal (zum Beispiel, weil beide keine Karten mehr haben), folgt das nächste Banner.
      knopf(ende ? t.duellErgebnis : t.duellNaechsteRunde, () => { banner = null; if (ende) ergebnis(); else weiter(); }, 'haupt gross'));
  }

  // ---------- Großansicht einer Karte ----------
  function gross({ id, seite, uid, hand, anfuehrer }) {
    const k = K(id);
    const inst = seite && uid ? z?.seiten[seite].reihe.find((x) => x.uid === uid) : null;
    const jetzt = inst ? wert(z, seite, inst) : null;
    const spielbar = (hand || anfuehrer) && z && tutErlaubt(id);
    const vorsprung = spielbar ? rules.vorsprungNach(z, 'luther', uid) : null;
    zeigeKartenDetail(k, {
      zusatz: [k.anfuehrer ? t.duellAnfuehrerRegel : null, jetzt != null && jetzt !== k.staerke ? fuelle(t.duellJetzt, { n: jetzt }) : null,
        spielbar ? fuelle(vorsprung > 0 ? t.duellDannVorne : t.duellDannHinten, { n: Math.abs(vorsprung) }) : null,
        (hand || anfuehrer) && !spielbar ? t.tutorialAndereKarte : null],
      knoepfe: spielbar ? [knopf(t.duellAusspielen, () => { z = rules.spiele(z, 'luther', uid); tutWeiter(); weiter(); }, 'haupt')] : []
    });
  }

  // ---------- Ergebnis ----------
  function ergebnis() {
    const sieg = z.sieger === 'luther';
    if (kamp) { kamp.ergebnis(z, deck, () => { vorbereitung(); }); return; }
    const r = ctx.duellEnde(g.id, sieg);
    if (r?.neu) neueKarte = r.neu;
    besteStufe = Math.max(besteStufe, rules.stufe(z));
    const tipps = sieg || tutorial ? [] : rules.verpasst(z, besitz, deck);
    const wo = (id) => { const c = K(id); return c.duell ? fuelle(t.duellWoSieg, { name: disputation.gegner[c.duell].name }) : fuelle(t.duellWoStation, { nr: ctx.station(c.station).nr, name: ctx.station(c.station).name }); };
    const tippText = (x) => ({ runde: t.duellTippRunde, hand: t.duellTippHand, deck: t.duellTippDeck, besitz: t.duellTippBesitz, fehlt: fuelle(t.duellTippFehlt, { wo: wo(x.karte) }) })[x.ort];
    setzeInhalt(el, h('div', { class: `d-ende ${sieg ? 'sieg' : 'niederlage'}` },
      h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
        h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', { class: 'd-ende-titel' }, sieg ? t.duellSieg : t.duellNiederlage), h('p', {}, sieg ? g.sieg : g.niederlage))),
      h('ul', { class: 'd-runden' }, z.runden.map((x) => h('li', { class: x.sieger }, fuelle(t.duellRundeZeile, { n: x.runde, du: x.luther, er: x.kirche }),
        ' ', h('strong', {}, x.sieger === 'luther' ? t.duellGewonnen : t.duellVerloren)))),
      neueKarte ? h('div', { class: 'd-belohnung' }, h('p', { class: 'kicker' }, t.duellBelohnung), kartenChip(K(neueKarte), { extra: 'glanz', onclick: () => zeigeKartenDetail(K(neueKarte)) })) : null,
      sieg || tutorial ? null : h('div', { class: 'd-tipps' }, h('h3', {}, t.duellWasHilft),
        tipps.length ? h('ul', {}, tipps.map((x) => h('li', {},
          h('span', { class: 'mini-paar' }, kartenChip(K(x.kirche), { mini: true }), h('span', { 'aria-hidden': 'true' }, '←'), kartenChip(K(x.karte), { mini: true })),
          h('p', {}, fuelle(t.duellTippZeile, { karte: name(x.karte), gegen: name(x.kirche), n: K(x.kirche).staerke }), ' ', h('strong', {}, tippText(x))))))
          : h('p', {}, t.duellTippAllgemein)),
      h('div', { class: 'reihe fuss' }, knopf(t.duellNochmal, () => { neueKarte = null; vorbereitung(); }, 'still'),
        knopf(t.weiter, () => fertig(schritt.gegner === 'worms' ? { stufe: { verhoer: besteStufe } } : {}), 'haupt'))));
    neueKarte = null;
  }

  vorbereitung();
}
