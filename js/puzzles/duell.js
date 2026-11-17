// Kartenspiel „Disputation“: Spieltisch. Die Regeln stehen in duell-regeln.js.
import { h, setzeInhalt, knopf, kartenChip, fuelle } from '../engine/ui.js';
import { bildHtml, figurHtml } from '../engine/bilder.js';
import { disputation } from '../../data/disputation.js';
import { rules, K, wert, summe, entkraeftet, deckVorschlag } from './duell-regeln.js';

export { rules };
const PAUSE_KI = 950;

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  const R = disputation.regeln;
  const g = disputation.gegner[schritt.gegner];
  const fig = ctx.figuren[g.figur] || {};
  const besitz = ctx.karten().map((k) => k.id);
  const ersterKampf = !ctx.state.flags.some((f) => f.startsWith('duell:'));
  const passendesDeck = () => {
    if (besitz.length <= R.deckMax) return [...besitz];
    const vorher = (ctx.state.deck || []).filter((id) => besitz.includes(id)).slice(0, R.deckMax);
    return vorher.length >= R.deckMin ? vorher : deckVorschlag(besitz);
  };
  let deck = passendesDeck();
  let z = null;
  let phase = 'vor';
  let gewaehlt = null; // { seite, uid } für die Großansicht
  let werteVorher = new Map();
  let gezeigteRunden = 0;
  let banner = null;
  let timer = null;
  let besteStufe = 0;
  let neueKarte = null;
  let versuch = 0;

  const name = (id) => `„${K(id).titel}“`;
  // wer: im Satz (der Sprecher des Kaisers), Wer: am Satzanfang, wen: nach „gegen“.
  const wer = g.wer || g.name;
  const Wer = wer[0].toUpperCase() + wer.slice(1);
  const wen = g.wen || g.name;
  const lebt = () => el.isConnected;

  // ---------- Vorbereitung: Gegner, Regeln, Deck ----------
  function vorbereitung() {
    const zuViel = besitz.length > R.deckMax;
    const ok = deck.length >= Math.min(R.deckMin, besitz.length) && deck.length <= R.deckMax;
    const umschalten = (id) => { deck = deck.includes(id) ? deck.filter((x) => x !== id) : deck.length < R.deckMax ? [...deck, id] : deck; vorbereitung(); };
    setzeInhalt(el,
      h('div', { class: 'd-vor' },
        h('div', { class: 'd-gegner-kopf' },
          h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: figurHtml(fig) }),
          h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', {}, fuelle(t.duellGegen, { name: wen })), h('p', {}, g.einleitung))),
        h('details', { class: 'd-regeln', open: ersterKampf && versuch === 0 }, h('summary', {}, t.duellRegeln),
          h('ol', {}, disputation.regelText.map((r) => h('li', {}, r)))),
        h('h3', { class: 'zwischen' }, fuelle(t.duellSeinDeck, { name: wer })),
        h('p', { class: 'klein' }, t.duellSeinDeckText),
        h('div', { class: 'd-kirchendeck' }, [...new Set(g.deck)].map((id) => kartenChip(K(id), { mini: true, onclick: () => gross({ id }) }))),
        zuViel ? [
          h('h3', { class: 'zwischen' }, fuelle(t.duellDeinDeck, { n: deck.length, min: R.deckMin, max: R.deckMax })),
          h('p', { class: 'klein' }, t.duellDeckText),
          h('div', { class: 'hand d-sammlung' }, besitz.map((id) => kartenChip(K(id), { klein: true, gewaehlt: deck.includes(id), onclick: () => umschalten(id) })))
        ] : h('p', { class: 'klein' }, fuelle(t.duellAlleKarten, { n: deck.length })),
        h('div', { class: 'reihe fuss' }, h('span', {}), knopf(t.duellLos, starte, 'haupt', { disabled: !ok }))));
  }

  function starte() {
    ctx.merkeDeck(deck);
    versuch += 1;
    z = rules.start(g, deck, (Date.now() ^ (versuch * 2654435761)) >>> 0);
    phase = 'spiel'; gezeigteRunden = 0; banner = null; werteVorher = new Map();
    zeichne();
  }

  // ---------- Spieltisch ----------
  function brettKarte(seite, inst, letzte) {
    const k = K(inst.id);
    const w = wert(z, seite, inst);
    const vorher = werteVorher.get(inst.uid);
    const ent = entkraeftet(z, seite, inst);
    const klassen = ['bk', `typ-${k.typ}`, `rar-${k.seltenheit}`, seite,
      ent ? 'entkraeftet' : '', w > k.staerke ? 'plus' : w < k.staerke ? 'minus' : '',
      inst.uid === letzte ? 'neu' : '', vorher != null && vorher !== w ? 'pop' : '', ent && vorher != null && vorher !== 1 ? 'bricht' : ''];
    return h('button', { type: 'button', class: klassen.filter(Boolean).join(' '), onclick: () => gross({ id: inst.id, seite, uid: inst.uid }),
      'aria-label': `${k.titel}, ${fuelle(t.kartenStaerke, { n: w })}${ent ? `, ${t.duellEntkraeftet}` : ''}` },
      h('span', { class: 'bk-bild', 'aria-hidden': 'true', html: bildHtml(k.bild) }),
      h('span', { class: 'bk-name' }, k.titel),
      h('span', { class: 'bk-wert', 'aria-hidden': 'true' }, w !== k.staerke ? h('s', {}, String(k.staerke)) : null, String(w)),
      ent ? h('span', { class: 'bk-riss', 'aria-hidden': 'true' }) : null);
  }

  const edelsteine = (n) => h('span', { class: 'd-siege', 'aria-label': fuelle(t.duellRundenSiege, { n }) },
    Array.from({ length: R.siegeNoetig }, (_, i) => h('span', { class: `stein${i < n ? ' an' : ''}` })));

  function ereignisText(e) {
    if (!e) return phase === 'spiel' && z.phase === 'tausch' ? fuelle(t.duellTausch, { n: z.tausch }) : '';
    const wer = e.seite === 'kirche' ? Wer : t.duellDu;
    if (e.art === 'passe') return fuelle(t.duellPasst, { wer });
    let s = fuelle(e.seite === 'kirche' ? t.duellSpieltEr : t.duellSpieltDu, { wer, karte: name(e.id) });
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
    const amZug = z.phase === 'spiel' && z.am === 'luther' && !banner;
    const tausch = z.phase === 'tausch';
    const sl = summe(z, 'luther'); const sk = summe(z, 'kirche');

    const kopfKirche = h('div', { class: `d-kopf kirche${z.am === 'kirche' && z.phase === 'spiel' ? ' dran' : ''}` },
      h('span', { class: 'd-portrait klein', 'aria-hidden': 'true', html: figurHtml(fig) }),
      h('div', { class: 'd-name' }, h('strong', {}, g.name), edelsteine(k.siege)),
      h('span', { class: 'd-handzahl', 'aria-label': fuelle(t.duellHandZahl, { n: k.hand.length }) },
        Array.from({ length: Math.min(k.hand.length, 10) }, () => h('span', { class: 'ruecken', 'aria-hidden': 'true' })), h('em', {}, String(k.hand.length))),
      k.gepasst ? h('span', { class: 'd-pass' }, t.duellGepasst) : null,
      h('span', { class: `d-summe${sk > sl ? ' vorne' : ''}`, 'aria-label': fuelle(t.duellSumme, { n: sk }) }, String(sk)));
    const kopfLuther = h('div', { class: `d-kopf luther${amZug ? ' dran' : ''}` },
      h('div', { class: 'd-name' }, h('strong', {}, t.duellDuName), edelsteine(l.siege)),
      h('span', { class: 'd-runde' }, fuelle(t.duellRunde, { n: z.runde })),
      l.gepasst ? h('span', { class: 'd-pass' }, t.duellGepasst) : null,
      h('span', { class: `d-summe${sl > sk ? ' vorne' : ''}`, 'aria-label': fuelle(t.duellSumme, { n: sl }) }, String(sl)),
      tausch ? knopf(t.duellTauschFertig, () => { z = rules.beginne(z); zeichne(); }, 'haupt')
        : knopf(t.duellPassen, () => { z = rules.passe(z, 'luther'); gewaehlt = null; weiter(); }, 'warn', { disabled: !amZug }));

    const status = h('p', { class: `d-status${letzte?.treffer ? ' treffer' : letzte?.bann ? ' bann' : ''}`, role: 'status' },
      tausch ? fuelle(t.duellTausch, { n: z.tausch }) : banner ? '' : z.am === 'kirche' && z.phase === 'spiel' ? `${ereignisText(letzte)} ${fuelle(t.duellUeberlegt, { name: Wer })}`.trim()
        : `${ereignisText(letzte)} ${amZug ? t.duellDeinZug : ''}`.trim());

    const hand = h('div', { class: 'd-hand' }, l.hand.map((inst) => {
      const kk = K(inst.id);
      const neu = tausch && !werteVorher.has(`h${inst.uid}`) && werteVorher.size > 0;
      return kartenChip(kk, { klein: true, extra: `d-handkarte${neu ? ' neu' : ''}`, aus: !(amZug || tausch),
        onclick: () => { if (tausch) { if (z.tausch > 0) { z = rules.tausche(z, inst.uid); zeichne(); } } else gross({ id: inst.id, seite: 'luther', uid: inst.uid, hand: true }); } });
    }));

    setzeInhalt(el, h('div', { class: `d-tisch${banner ? ' mit-banner' : ''}` },
      kopfKirche,
      h('div', { class: 'd-reihe kirche', 'aria-label': fuelle(t.duellReihe, { name: g.name }) }, k.reihe.map((inst) => brettKarte('kirche', inst, letzteUid))),
      status,
      h('div', { class: 'd-reihe luther', 'aria-label': fuelle(t.duellReihe, { name: t.duellDuName }) }, l.reihe.map((inst) => brettKarte('luther', inst, letzteUid))),
      kopfLuther, hand,
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
      const r = z.runden[gezeigteRunden];
      gezeigteRunden += 1;
      banner = r;
    }
    zeichne();
  }

  function bannerEl() {
    const r = banner;
    const ende = z.phase === 'ende' && gezeigteRunden === z.runden.length;
    const text = r.sieger === 'luther' ? t.duellRundeDu : r.gleich ? t.duellRundeGleich : fuelle(t.duellRundeEr, { name: Wer });
    return h('div', { class: `d-banner ${r.sieger}`, role: 'alert' },
      h('p', { class: 'kicker' }, fuelle(t.duellRundeEnde, { n: r.runde })),
      h('strong', {}, text),
      h('p', { class: 'd-banner-zahl' }, h('span', {}, String(r.luther)), ' : ', h('span', {}, String(r.kirche))),
      knopf(ende ? t.duellErgebnis : t.duellNaechsteRunde, () => { banner = null; if (ende) ergebnis(); else zeichne(); }, 'haupt gross'));
  }

  // ---------- Großansicht einer Karte ----------
  function gross({ id, seite, uid, hand }) {
    document.querySelector('.d-gross')?.remove();
    const k = K(id);
    const inst = seite && uid ? z?.seiten[seite].reihe.find((x) => x.uid === uid) : null;
    const jetzt = inst ? wert(z, seite, inst) : null;
    const zu = () => huelle.remove();
    const vorsprung = hand ? rules.vorsprungNach(z, 'luther', uid) : null;
    const huelle = h('div', { class: 'd-gross', role: 'dialog', 'aria-label': k.titel, onclick: (e) => { if (e.target === huelle) zu(); } },
      h('div', { class: 'd-gross-karte' },
        kartenChip(k, { extra: 'gross' }),
        jetzt != null && jetzt !== k.staerke ? h('p', { class: 'klein' }, fuelle(t.duellJetzt, { n: jetzt })) : null,
        hand ? h('p', { class: 'klein' }, fuelle(vorsprung > 0 ? t.duellDannVorne : t.duellDannHinten, { n: Math.abs(vorsprung) })) : null,
        h('div', { class: 'reihe' }, knopf(t.zurueck, zu, 'still'),
          hand ? knopf(t.duellAusspielen, () => { zu(); z = rules.spiele(z, 'luther', uid); weiter(); }, 'haupt') : null)));
    el.append(huelle);
    huelle.querySelector('.haupt, button')?.focus();
  }

  // ---------- Ergebnis ----------
  function ergebnis() {
    const sieg = z.sieger === 'luther';
    const r = ctx.duellEnde(g.id, sieg);
    if (r?.neu) neueKarte = r.neu;
    besteStufe = Math.max(besteStufe, rules.stufe(z));
    const tipps = sieg ? [] : rules.verpasst(z, besitz, deck);
    const wo = (id) => { const c = K(id); return c.duell ? fuelle(t.duellWoSieg, { name: disputation.gegner[c.duell].name }) : fuelle(t.duellWoStation, { nr: ctx.station(c.station).nr, name: ctx.station(c.station).name }); };
    const tippText = (x) => ({ runde: t.duellTippRunde, hand: t.duellTippHand, deck: t.duellTippDeck, besitz: t.duellTippBesitz, fehlt: fuelle(t.duellTippFehlt, { wo: wo(x.karte) }) })[x.ort];
    setzeInhalt(el, h('div', { class: `d-ende ${sieg ? 'sieg' : 'niederlage'}` },
      h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: figurHtml(fig) }),
        h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', { class: 'd-ende-titel' }, sieg ? t.duellSieg : t.duellNiederlage), h('p', {}, sieg ? g.sieg : g.niederlage))),
      h('ul', { class: 'd-runden' }, z.runden.map((x) => h('li', { class: x.sieger }, fuelle(t.duellRundeZeile, { n: x.runde, du: x.luther, er: x.kirche }),
        ' ', h('strong', {}, x.sieger === 'luther' ? t.duellGewonnen : t.duellVerloren)))),
      neueKarte ? h('div', { class: 'd-belohnung' }, h('p', { class: 'kicker' }, t.duellBelohnung), kartenChip(K(neueKarte), { extra: 'glanz' })) : null,
      sieg ? null : h('div', { class: 'd-tipps' }, h('h3', {}, t.duellWasHilft),
        tipps.length ? h('ul', {}, tipps.map((x) => h('li', {},
          h('span', { class: 'mini-paar' }, kartenChip(K(x.kirche), { mini: true }), h('span', { 'aria-hidden': 'true' }, '←'), kartenChip(K(x.karte), { mini: true })),
          h('p', {}, fuelle(t.duellTippZeile, { karte: name(x.karte), gegen: name(x.kirche), n: K(x.kirche).staerke }), ' ', h('strong', {}, tippText(x))))))
          : h('p', {}, t.duellTippAllgemein)),
      h('div', { class: 'reihe fuss' }, knopf(t.duellNochmal, () => { phase = 'vor'; neueKarte = null; vorbereitung(); }, 'still'),
        knopf(t.weiter, () => fertig(schritt.gegner === 'worms' ? { stufe: { verhoer: besteStufe } } : {}), 'haupt'))));
    neueKarte = null;
  }

  if (phase === 'vor') vorbereitung();
}
