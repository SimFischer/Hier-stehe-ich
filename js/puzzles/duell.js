// Kartenspiel „Disputation“: Spieltisch. Die Regeln stehen in duell-regeln.js.
// Drei Arten: Disputation in der Geschichte, geführte Übung (Gegner mit „tutorial“) und Kampagne (schritt.kampagne).
import { h, setzeInhalt, knopf, kartenChip, zeigeKartenDetail, fuelle, melde } from '../engine/ui.js';
import { bildHtml, figurHtml, portraetHtml, kartenBild, bildUrl } from '../engine/bilder.js';
import { disputation } from '../../data/disputation.js';
import { kampagne as kampagnenDaten } from '../../data/kampagne.js';
import { trenne } from '../../data/silben.js';
import { prachtKlasse } from '../engine/pracht.js';
import { warumFrage, belohne, WARUM_BONUS } from './warum.js';
import { rules, K, wert, summe, entkraeftet, deckVorschlag, deckGegen, startDeckGegen, anzahl } from './duell-regeln.js';

export { rules };
const PAUSE_KI = 950;
// Nach einem Konter: Stempel „Entkräftet!“ so lange zeigen, erst dann zieht die Kirche.
const STEMPEL_MS = 2300;

export const gegnerDaten = (id) => disputation.gegner[id] || kampagnenDaten.gegner[id] || kampagnenDaten.lutherGegner[id];

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  const kamp = schritt.kampagne || null; // { besitz, anfuehrer, ergebnis(z, deck), zurueck() }
  const R = { ...disputation.regeln, ...(kamp ? kampagnenDaten.regeln : {}) };
  const g = gegnerDaten(schritt.gegner);
  // Wer spielt welche Seite? Normal: du bist Luther. Perspektivwechsel (kamp.seite = 'kirche'): du bist die Kirche, der Computer Luther.
  const ICH = kamp?.seite || 'luther';
  const ER = ICH === 'luther' ? 'kirche' : 'luther';
  const alsKirche = ICH === 'kirche';
  const tutorial = g.tutorial || null;
  const fig = ctx.figuren[g.figur] || {};
  const besitz = kamp ? kamp.besitz : ctx.karten().map((k) => k.id);
  const ersterKampf = !ctx.state.flags.some((f) => f.startsWith('duell:'));
  const passendesDeck = () => {
    if (besitz.length <= R.deckMax) return [...besitz];
    const gemerkt = kamp ? kamp.deck : ctx.state.deck;
    // Gemerktes Deck nur, soweit man die Karten (und Kopien) noch hat
    const vorher = []; for (const id of gemerkt || []) if (anzahl(vorher, id) < anzahl(besitz, id) && vorher.length < R.deckMax) vorher.push(id);
    return vorher.length >= R.deckMin ? vorher : deckVorschlag(besitz, R);
  };
  let deck = passendesDeck();
  let autoInfo = null;       // Ergebnis von deckGegen (Erklärung der Konter)
  let speichernOffen = false;
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

  // ---------- Spielmodus: Die Partie bekommt eine eigene Fläche über der ganzen Seite ----------
  // Der Container hängt direkt an <body> (außerhalb von Rätselblatt und Leiste), damit nichts ihn in der Höhe begrenzt.
  // Leiste, Zielzeile und Blattkopf liegen darunter und sind solange inert. Der Spielstand z bleibt beim Verlassen erhalten.
  let buehne = null;
  const vollbildElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;
  const vollbildMoeglich = () => Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  function vollbildUmschalten() {
    try {
      const p = vollbildElement() ? (document.exitFullscreen || document.webkitExitFullscreen)?.call(document)
        : (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)?.call(document.documentElement);
      p?.catch?.(() => { /* abgelehnt oder nicht erlaubt: Der Spielmodus läuft ohne Vollbild weiter. */ });
    } catch { /* nicht unterstützt */ }
  }
  const VOLLBILD_AN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  const VOLLBILD_AUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  function vollbildKnopf() {
    if (!vollbildMoeglich()) return null;
    const an = Boolean(vollbildElement());
    return h('button', { type: 'button', class: 'd-icon d-vollbild', 'aria-pressed': String(an), 'aria-label': an ? t.spielVollbildAus : t.spielVollbild,
      title: an ? t.spielVollbildAus : t.spielVollbild, onclick: vollbildUmschalten, html: an ? VOLLBILD_AUS : VOLLBILD_AN });
  }
  const vollbildGeaendert = () => buehne?.querySelector('.d-vollbild')?.replaceWith(vollbildKnopf());
  const verlassenKnopf = () => h('button', { type: 'button', class: 'd-icon d-verlassen', 'aria-label': t.spielVerlassen, title: t.spielVerlassen,
    onclick: () => { clearTimeout(timer); vorbereitung(); } }, h('span', { 'aria-hidden': 'true' }, '✕'));
  function spielmodus(an) {
    const app = document.getElementById('app');
    if (an && !buehne) {
      buehne = h('div', { class: 'spielmodus', role: 'region', 'aria-label': t.spielFlaeche });
      document.body.append(buehne);
      document.documentElement.classList.add('im-spielmodus');
      if (app) app.inert = true;
      document.addEventListener('fullscreenchange', vollbildGeaendert); document.addEventListener('webkitfullscreenchange', vollbildGeaendert);
    } else if (!an && buehne) {
      buehne.remove(); buehne = null;
      document.documentElement.classList.remove('im-spielmodus');
      if (app) app.inert = false;
      document.removeEventListener('fullscreenchange', vollbildGeaendert); document.removeEventListener('webkitfullscreenchange', vollbildGeaendert);
      if (vollbildElement()) vollbildUmschalten();
    }
  }
  const laeuft = () => z && (z.phase !== 'ende' || banner);
  const fortsetzen = () => (laeuft() ? h('div', { class: 'd-fortsetzen' }, h('p', {}, t.duellLaeuft), knopf(t.duellFortsetzen, zeichne, 'haupt')) : null);

  // ---------- Vorbereitung: Gegner, Regeln, Deck ----------
  function vorbereitung() {
    spielmodus(false);
    if (tutorial) {
      setzeInhalt(el, h('div', { class: 'd-vor' },
        h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
          h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', {}, fuelle(t.duellGegen, { name: wen })), h('p', {}, g.einleitung))),
        fortsetzen(),
        h('p', {}, t.tutorialStart),
        h('div', { class: 'reihe fuss' }, h('span', {}), knopf(t.duellLos, starte, 'haupt'))));
      return;
    }
    const zuViel = besitz.length > R.deckMax;
    const ok = deck.length >= Math.min(R.deckMin, besitz.length) && deck.length <= R.deckMax;
    const sammlung = [...new Set(besitz)];
    const fuehrer = g.anfuehrer ? K(g.anfuehrer) : null;
    // Welche Karten des Gegners entkräftet diese Karte? (für die Marke „Kontert“ und den Filter)
    const gegnerKarten = new Set([...g.deck, g.anfuehrer].filter(Boolean));
    const konterGegen = (id) => (K(id).entkraeftet || []).filter((c) => gegnerKarten.has(c));
    // Als Kirche: Welche Argumente aus Luthers Deck entkräften diese Karte?
    const lutherGegen = (id) => (alsKirche ? g.deck.filter((l) => (K(l).entkraeftet || []).includes(id)) : []);
    /** Sammlung als eigene Ansicht: Antippen nimmt eine Kopie ins Deck. Was im Deck ist, ist deutlich markiert. */
    function sammlungOeffnen() {
      let nurKonter = false;
      const buehne = h('div', { class: 'd-auswahl', role: 'dialog', 'aria-modal': 'true', 'aria-label': t.duellKartenHinzu });
      document.body.append(buehne);
      const zu = () => { buehne.remove(); vorbereitung(); };
      const zeichneAuswahl = () => {
        const liste = sammlung.filter((id) => !nurKonter || konterGegen(id).length)
          .sort((a, b) => konterGegen(b).length - konterGegen(a).length || K(b).staerke - K(a).staerke);
        setzeInhalt(buehne, h('div', { class: 'd-auswahl-innen' },
          h('div', { class: 'd-auswahl-kopf' },
            h('div', {}, h('h2', {}, t.duellKartenHinzu), h('p', { class: `d-deck-zahl${ok2() ? ' ok' : ''}` }, fuelle(t.duellDeinDeck, { n: deck.length, min: R.deckMin, max: R.deckMax }))),
            h('div', { class: 'reihe' },
              alsKirche ? null : h('button', { type: 'button', class: `d-filter${nurKonter ? ' an' : ''}`, 'aria-pressed': String(nurKonter), onclick: () => { nurKonter = !nurKonter; zeichneAuswahl(); } }, '⚔ ', fuelle(t.duellNurKonter, { name: wen })),
              knopf(t.duellFertig, zu, 'haupt'))),
          h('p', { class: 'klein' }, t.duellAuswahlText),
          h('div', { class: 'd-auswahl-karten' }, liste.map((id) => {
            const imDeck = anzahl(deck, id), hat = anzahl(besitz, id), voll = imDeck >= hat;
            const konter = konterGegen(id);
            return h('span', { class: `d-auswahl-karte${imDeck ? ' im-deck' : ''}${voll ? ' voll' : ''}` },
              kartenChip(K(id), { klein: true, onclick: () => {
                if (voll) { melde(fuelle(t.duellSchonImDeck, { titel: K(id).titel })); return; }
                if (deck.length >= R.deckMax) { melde(t.duellDeckVoll); return; }
                deck = [...deck, id]; autoInfo = null; zeichneAuswahl();
              } }),
              imDeck ? h('span', { class: 'd-auswahl-stand' }, voll ? `✓ ${t.duellImDeck}` : `${imDeck}/${hat} ${t.duellImDeck}`) : hat > 1 ? h('span', { class: 'd-auswahl-stand frei' }, `0/${hat}`) : null,
              konter.length ? h('span', { class: 'd-auswahl-konter' }, '⚔ ', fuelle(t.duellKontert, { titel: konter.map((c) => K(c).titel).join(', ') })) : null,
              lutherGegen(id).length ? h('span', { class: 'd-auswahl-konter gefahr' }, '⚠ ', fuelle(t.kircheGefahr, { titel: lutherGegen(id).map((c) => K(c).titel).join(', ') })) : null,
              h('button', { type: 'button', class: 'karte-info', 'aria-label': fuelle(t.kartenInfo, { titel: K(id).titel }), onclick: () => gross({ id }) }, 'i'));
          }))));
      };
      const ok2 = () => deck.length >= Math.min(R.deckMin, besitz.length) && deck.length <= R.deckMax;
      zeichneAuswahl();
    }
    setzeInhalt(el,
      h('div', { class: 'd-vor' },
        h('div', { class: 'd-gegner-kopf' },
          h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
          h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', {}, fuelle(t.duellGegen, { name: wen })), h('p', {}, g.einleitung))),
        fortsetzen(),
        h('details', { class: 'd-regeln', open: ersterKampf && versuch === 0 }, h('summary', {}, t.duellRegeln),
          h('ol', {}, disputation.regelText.map((r) => h('li', {}, r)))),
        h('h3', { class: 'zwischen' }, fuelle(t.duellSeinDeck, { name: wer })),
        h('p', { class: 'klein' }, t.duellSeinDeckText),
        h('div', { class: 'd-kirchendeck' },
          fuehrer ? kartenChip(fuehrer, { mini: true, onclick: () => gross({ id: fuehrer.id }), gewaehlt: false }) : null,
          [...new Set(g.deck)].map((id) => kartenChip(K(id), { mini: true, onclick: () => gross({ id }) }))),
        fuehrer ? h('p', { class: 'klein' }, fuelle(t.duellAnfuehrerGegner, { name: fuehrer.titel })) : null,
        kamp?.anfuehrer || g.lutherAnfuehrer ? h('p', { class: 'klein' }, fuelle(t.duellAnfuehrerDu, { name: K(kamp?.anfuehrer || g.lutherAnfuehrer).titel })) : null,
        // Deckbau: oben das eigene Deck groß (mit freien Plätzen), die Sammlung öffnet sich über „Karten hinzufügen“
        zuViel ? [
          h('h3', { class: `zwischen d-deck-titel${ok ? ' ok' : ''}` }, fuelle(t.duellDeinDeck, { n: deck.length, min: R.deckMin, max: R.deckMax })),
          // Werkzeuge: bestes Deck gegen diesen Gegner (nur aus eigenen Karten), Decks speichern und laden
          alsKirche ? h('p', { class: 'd-kirche-tipp' }, t.kircheDeckTipp) : h('div', { class: 'd-deck-werkzeug' },
            // Startdeck: ein Teil der Konter ist drin, den Rest sucht man selbst. Bestes Deck: erst nach Niederlagen (Kampagne).
            h('button', { type: 'button', class: 'd-auto', onclick: () => {
              const r = startDeckGegen(besitz, g, R, kamp?.startDeck);
              deck = r.deck; autoInfo = r; vorbereitung();
              el.querySelector('.d-deck-info')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } }, h('span', { 'aria-hidden': 'true' }, '⚡'), fuelle(t.duellStartDeck, { name: wen })),
            kamp ? (kamp.bestesDeckNoch > 0
              ? h('span', { class: 'd-auto-zu' }, h('span', { 'aria-hidden': 'true' }, '🔒 '), fuelle(kamp.bestesDeckNoch === 1 ? t.duellBestesZuEins : t.duellBestesZu, { n: kamp.bestesDeckNoch }))
              : h('button', { type: 'button', class: 'd-auto bestes', onclick: () => {
                const r = deckGegen(besitz, g, R);
                deck = r.deck; autoInfo = r; vorbereitung();
                el.querySelector('.d-deck-info')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
              } }, h('span', { 'aria-hidden': 'true' }, '★'), fuelle(t.duellAuto, { name: wen }))) : null,
            kamp ? [
              (kamp.decks || []).map((d, i) => h('span', { class: 'd-gespeichert' },
                h('button', { type: 'button', class: 'd-laden', onclick: () => {
                  // Nur Karten, die man (noch) hat, in der Anzahl, die man hat
                  const neuDeck = []; for (const id of d.karten) if (anzahl(neuDeck, id) < anzahl(besitz, id) && neuDeck.length < R.deckMax) neuDeck.push(id);
                  deck = neuDeck; autoInfo = null; vorbereitung();
                } }, `📂 ${d.name}`),
                h('button', { type: 'button', class: 'd-loeschen', 'aria-label': fuelle(t.duellDeckLoeschen, { name: d.name }), onclick: () => { kamp.speichereDecks(kamp.decks.filter((_, j) => j !== i)); vorbereitung(); } }, '✕'))),
              speichernOffen
                ? h('form', { class: 'd-speichern', onsubmit: (e) => {
                  e.preventDefault();
                  const name = e.target.querySelector('input').value.trim().slice(0, 30) || fuelle(t.duellDeckStandardName, { name: wen });
                  kamp.speichereDecks([...(kamp.decks || []).filter((d) => d.name !== name), { name, karten: [...deck] }].slice(-6));
                  speichernOffen = false; melde(fuelle(t.duellDeckGespeichert, { name })); vorbereitung();
                } },
                  h('input', { type: 'text', maxlength: 30, placeholder: fuelle(t.duellDeckStandardName, { name: wen }), 'aria-label': t.duellDeckName }),
                  h('button', { type: 'submit', class: 'knopf haupt klein' }, t.duellSpeichern))
                : h('button', { type: 'button', class: 'd-speichern-knopf', onclick: () => { speichernOffen = true; vorbereitung(); el.querySelector('.d-speichern input')?.focus(); } }, '💾 ', t.duellDeckSpeichern)
            ] : null),
          // Nach dem automatischen Bauen: welcher Konter wogegen hilft und wofür noch einer fehlt
          autoInfo ? h('div', { class: 'd-deck-info' },
            h('strong', {}, fuelle(autoInfo.start ? t.duellStartTitel : t.duellAutoTitel, { name: wen })),
            autoInfo.abgedeckt.length ? h('ul', {}, autoInfo.abgedeckt.map((a) => h('li', {}, h('span', { class: 'gegen' }, K(a.kirche).titel), ' ← ', h('span', { class: 'mit' }, K(a.karte).titel)))) : null,
            autoInfo.offen?.length ? h('p', { class: 'offen' }, fuelle(t.duellStartOffen, { karten: autoInfo.offen.map((c) => `„${K(c).titel}“`).join(', ') })) : null,
            autoInfo.fehlt.length ? h('p', { class: 'fehlt' }, fuelle(t.duellAutoFehlt, { karten: autoInfo.fehlt.map((c) => `„${K(c).titel}“`).join(', ') })) : null) : null,
          h('p', { class: 'klein' }, alsKirche ? t.kircheDeckText : [t.duellDeckTextNeu, kamp ? [' ', t.kampKopienText] : null]),
          h('div', { class: 'd-deck' },
            [...new Set(deck)].sort((a, b) => K(b).staerke - K(a).staerke).map((id) => h('span', { class: 'd-deck-karte' },
              kartenChip(K(id), { klein: true, onclick: () => gross({ id }) }),
              anzahl(deck, id) > 1 ? h('span', { class: 'd-deck-anzahl' }, `×${anzahl(deck, id)}`) : null,
              konterGegen(id).length ? h('span', { class: 'd-konter-marke', title: konterGegen(id).map((c) => K(c).titel).join(', ') }, '⚔') : null,
              lutherGegen(id).length ? h('span', { class: 'd-konter-marke gefahr', title: fuelle(t.kircheGefahr, { titel: lutherGegen(id).map((c) => K(c).titel).join(', ') }) }, '⚠') : null,
              h('button', { type: 'button', class: 'd-deck-raus', 'aria-label': fuelle(t.duellRausnehmen, { titel: K(id).titel }), onclick: () => { deck.splice(deck.lastIndexOf(id), 1); deck = [...deck]; autoInfo = null; vorbereitung(); } }, '−'))),
            Array.from({ length: Math.max(0, R.deckMax - deck.length) }, (_, i) => h('button', { type: 'button', class: `d-deck-frei${i === 0 ? ' erster' : ''}`, onclick: sammlungOeffnen },
              h('span', { 'aria-hidden': 'true' }, '+'), i === 0 ? h('small', {}, t.duellKartenHinzu) : null))),
          h('div', { class: 'reihe' }, knopf(t.duellKartenHinzu, sammlungOeffnen, 'haupt'))
        ] : h('p', { class: 'klein' }, fuelle(t.duellAlleKarten, { n: deck.length })),
        h('div', { class: 'reihe fuss' }, kamp ? knopf(t.kampZurUebersicht, () => kamp.zurueck(), 'still') : h('span', {}), knopf(t.duellLos, starte, 'haupt', { disabled: !ok }))));
  }

  function starte() {
    if (!tutorial) (kamp ? kamp.merkeDeck : ctx.merkeDeck)(deck);
    versuch += 1; tutSchritt = 0;
    const seed = (Date.now() ^ (versuch * 2654435761)) >>> 0;
    z = alsKirche
      ? rules.start({ id: g.id, deck, anfuehrer: kamp.anfuehrer, regeln: g.regeln }, g.deck, seed, disputation.regeln, { anfuehrer: g.anfuehrer || null })
      : rules.start(g, deck, seed, disputation.regeln, { anfuehrer: kamp?.anfuehrer || g.lutherAnfuehrer || null });
    if (!z.tausch) z = rules.beginne(z);
    gezeigteRunden = 0; banner = null; werteVorher = new Map(); konter = null; handVorher = new Set(); tauschWahl = new Set(); tauschNeu = new Set();
    zeichne();
  }

  // ---------- Tutorial ----------
  const tut = () => (tutorial ? tutorial[tutSchritt] : null);
  // Erklärschritte (ohne „erwartet“) warten auf „Weiter“. Sie erscheinen, wenn du am Zug bist.
  const tutErklaert = () => tutorial && tut() && !tut().erwartet && z.am === ICH && z.phase === 'spiel';
  const tutErlaubt = (was) => !tutorial || (tut()?.erwartet === was);
  const tutWeiter = () => { if (tutorial) tutSchritt += 1; };

  // ---------- Spieltisch ----------
  // Aufbau wie bei einem Tablet-Kartenspiel: oben der Gegner, darunter seine Argumentreihe, in der Mitte der letzte Zug,
  // darunter deine Reihe, unten deine Hand. Rechts eine schmale Leiste mit Summen, Rundensiegen und „Passen“.
  // Die Kartengrößen rechnet das CSS aus Breite und Höhe der Reihe (--n = Zahl der Karten), siehe css/spielmodus.css.
  const FAEHIG = ['staerkt', 'schwaecht', 'bann', 'zieht', 'standhaft', 'bund', 'entkraeftet'];
  let konter = null; // Erklärung des letzten Konters: { nr: Länge des Logs, zeilen }
  let stempelBis = 0; // bis wann der Stempel steht (die Kirche wartet so lange)
  let frage = null;   // offener „Warum?“-Moment: { luther, kirche, uid } (die Kirche wartet, bis er beantwortet ist)
  const gefragt = new Set();
  let handVorher = new Set();
  let tauschWahl = new Set();
  let tauschNeu = new Set();

  function brettKarte(seite, inst, letzte) {
    const k = K(inst.id);
    const w = wert(z, seite, inst);
    const vorher = werteVorher.get(inst.uid);
    const ent = entkraeftet(z, seite, inst);
    const bild = kartenBild(k);
    const klassen = ['bk', `typ-${k.typ}`, `rar-${k.seltenheit}`, seite, seite === 'luther' ? prachtKlasse(k.id).trim() : '', bild.kunst ? 'mit-kunst' : '', k.anfuehrer ? 'ist-anfuehrer' : '',
      ent ? 'entkraeftet' : '', w > k.staerke ? 'plus' : w < k.staerke ? 'minus' : '',
      inst.uid === letzte ? 'neu' : '', vorher != null && vorher !== w ? 'pop' : '', ent && vorher != null && vorher !== 1 ? 'bricht' : ''];
    return h('button', { type: 'button', class: klassen.filter(Boolean).join(' '), onclick: () => gross({ id: inst.id, seite, uid: inst.uid }),
      'aria-label': `${k.titel}, ${fuelle(t.kartenStaerke, { n: w })}${ent ? `, ${t.duellEntkraeftet}` : ''}` },
      h('span', { class: 'bk-bild', 'aria-hidden': 'true', html: bildHtml(bild.name) }),
      h('span', { class: 'bk-name' }, trenne(k.titel)),
      h('span', { class: 'bk-wert', 'aria-hidden': 'true' }, w !== k.staerke ? h('s', {}, String(k.staerke)) : null, String(w)),
      FAEHIG.some((x) => k[x]) ? h('span', { class: 'bk-faehig', 'aria-hidden': 'true', title: t.duellFaehig }, '✦') : null,
      ent ? h('span', { class: 'bk-riss', 'aria-hidden': 'true' }) : null);
  }

  /** Anführer: Antippen zeigt ihn groß, Luther kann ihn dort ausspielen. */
  function anfuehrerKnopf(seite, amZug) {
    const a = z.seiten[seite].anfuehrer;
    if (!a) return null;
    const k = K(a.id);
    const bild = kartenBild(k);
    return h('button', { type: 'button', class: `d-anfuehrer ${seite}${amZug ? ' bereit' : ''}`, 'aria-label': fuelle(t.duellAnfuehrerName, { name: k.titel }),
      onclick: () => gross({ id: a.id, seite, uid: a.uid, anfuehrer: seite === ICH }) },
      h('span', { class: 'bk-bild', 'aria-hidden': 'true', html: bildHtml(bild.name) }),
      h('span', { class: 'd-anfuehrer-wert', 'aria-hidden': 'true' }, String(k.staerke)));
  }

  const edelsteine = (n) => h('span', { class: 'd-siege', 'aria-label': fuelle(t.duellRundenSiege, { n }) },
    Array.from({ length: R.siegeNoetig }, (_, i) => h('span', { class: `stein${i < n ? ' an' : ''}` })));

  function ereignisText(e) {
    if (!e) return '';
    const wer = e.seite === ER ? Wer : t.duellDu;
    if (e.art === 'passe') return fuelle(t.duellPasst, { wer });
    let s = fuelle(e.seite === ER ? t.duellSpieltEr : t.duellSpieltDu, { wer, karte: name(e.id) });
    if (K(e.id).anfuehrer) s += ' ' + t.duellAnfuehrerGespielt;
    if (e.treffer) s += ' ' + t.duellTrefferKurz;
    if (e.bann) s += ' ' + fuelle(t.duellBann, { karte: name(e.bann) });
    if (e.gezogen) s += ' ' + fuelle(e.seite === ER ? t.duellZiehtEr : t.duellZiehtDu, { n: e.gezogen });
    return s;
  }

  /** Was hat der letzte Zug entkräftet, und wie ändert sich die Stärke? Wird einmal pro Zug aus den Werten davor berechnet. */
  function konterZeilen(letzte) {
    if (konter?.nr === z.log.length) return konter.zeilen;
    const zeilen = [];
    const kr = z.seiten.kirche.reihe;
    if (letzte?.art === 'spiel' && letzte.treffer) for (const id of letzte.treffer) {
      const inst = kr.find((x) => x.id === id);
      zeilen.push(fuelle(t.duellKonter, { karte: name(letzte.id), gegen: name(id), vorher: (inst && werteVorher.get(inst.uid)) ?? K(id).staerke, jetzt: inst ? wert(z, 'kirche', inst) : 1 }));
    }
    if (letzte?.art === 'spiel' && letzte.seite === 'kirche') {
      const inst = kr.find((x) => x.uid === letzte.uid);
      const durch = inst && entkraeftet(z, 'kirche', inst);
      if (durch) zeilen.push(fuelle(t.duellSofort, { gegen: name(letzte.id), karte: name(durch), vorher: K(letzte.id).staerke }));
    }
    konter = { nr: z.log.length, zeilen };
    return zeilen;
  }

  /** Stempel „Entkräftet!“ über dem Tisch: welches Argument worauf antwortet. Liegt außerhalb des Tisches, damit Neuzeichnen ihn nicht abbricht. */
  function zeigeStempel(letzte) {
    const paare = [];
    if (letzte?.art === 'spiel' && letzte.treffer) for (const id of letzte.treffer) paare.push([letzte.id, id]);
    if (letzte?.art === 'spiel' && letzte.seite === 'kirche') {
      const inst = z.seiten.kirche.reihe.find((x) => x.uid === letzte.uid);
      const durch = inst && entkraeftet(z, 'kirche', inst);
      if (durch) paare.push([durch, letzte.id]);
    }
    if (!paare.length) return;
    document.querySelectorAll('.d-stempel').forEach((x) => x.remove());
    const s = h('div', { class: `d-stempel${alsKirche ? ' unten' : ''}`, 'aria-hidden': 'true' },
      h('strong', {}, t.duellStempel),
      paare.map(([l, c]) => h('span', {}, fuelle(t.duellStempelPaar, { karte: name(l), gegen: name(c) }))));
    document.body.append(s);
    stempelBis = Date.now() + STEMPEL_MS;
    setTimeout(() => s.remove(), STEMPEL_MS + 400);
  }

  /** „Warum?“-Moment: welches Argument antwortet auf die Aussage der Kirche? Richtig: Bonus für diese Runde. Danach ins Lexikon. */
  function zeigeFrage() {
    if (!frage || !lebt()) return;
    const f = warumFrage(frage.luther, frage.kirche);
    const ebene = h('div', { class: 'd-warum', role: 'dialog', 'aria-modal': 'true', 'aria-label': alsKirche ? t.warumTitelKirche : t.warumTitel });
    const fertig = () => {
      ebene.remove();
      const { luther, kirche } = frage; frage = null;
      kamp.entdecke(luther, kirche);
      zeichne();
    };
    const waehle = (id, knopfEl) => {
      const ja = id === f.luther;
      ebene.querySelectorAll('.d-warum-antwort').forEach((b) => { b.disabled = true; if (b.dataset.id === f.luther) b.classList.add('richtig'); });
      if (!ja) knopfEl.classList.add('falsch');
      // Als Luther: +2 auf die Konterkarte für diese Runde. Als Kirche: Siegellack (Luthers Karte soll nicht stärker werden).
      const inst = !alsKirche && frage.uid && z.seiten.luther.reihe.find((x) => x.uid === frage.uid);
      if (ja && inst) z = belohne(z, 'luther', frage.uid);
      if (ja && alsKirche) kamp.lackBonus?.();
      const lob = alsKirche ? fuelle(t.warumRichtigKirche, { karte: name(f.luther), n: kampagnenDaten.kirchenSeite.lackWarum })
        : inst ? fuelle(t.warumRichtig, { karte: name(f.luther), n: WARUM_BONUS }) : t.warumRichtigOhne;
      setzeInhalt(ebene.querySelector('.d-warum-fuss'),
        h('p', { class: ja ? 'gut' : 'schade' }, ja ? lob : fuelle(t.warumFalsch, { karte: name(f.luther) })),
        knopf(t.weiter, fertig, 'haupt'));
      ebene.querySelector('.d-warum-fuss .knopf')?.focus();
    };
    setzeInhalt(ebene, h('div', { class: 'd-warum-karte' },
      h('p', { class: 'kicker' }, alsKirche ? t.warumTitelKirche : t.warumTitel),
      h('p', { class: 'd-warum-kirche' }, h('strong', {}, `${name(f.kirche)}: `), f.frageText),
      h('p', { class: 'd-warum-frage' }, alsKirche ? t.warumFrageKirche : fuelle(t.warumFrage, { karte: name(f.luther) })),
      h('div', { class: 'd-warum-antworten' }, f.optionen.map((o) => h('button', { type: 'button', class: 'd-warum-antwort', 'data-id': o.id, onclick: (e) => waehle(o.id, e.currentTarget) }, o.text))),
      h('div', { class: 'd-warum-fuss' }, h('p', { class: 'klein' }, alsKirche ? fuelle(t.warumLohnKirche, { n: kampagnenDaten.kirchenSeite.lackWarum }) : fuelle(t.warumLohn, { n: WARUM_BONUS })))));
    document.body.append(ebene);
    ebene.querySelector('.d-warum-antwort')?.focus();
  }

  function zeichne() {
    if (!lebt()) { spielmodus(false); return; }
    clearTimeout(timer);
    spielmodus(true);
    setzeInhalt(el, h('p', { class: 'klein' }, t.duellImSpiel));
    if (z.phase === 'tausch') { tauschAnsicht(); return; }
    const l = z.seiten[ICH]; const k = z.seiten[ER]; // l: deine Seite, k: die Gegenseite
    // Konter-Lexikon (nur Kampagne): jedes Paar, das gerade wirkt
    if (kamp?.entdecke) for (const inst of z.seiten.kirche.reihe) {
      const durch = entkraeftet(z, 'kirche', inst); if (!durch) continue;
      const paar = `${durch}>${inst.id}`;
      if (kamp.konterNeu?.(durch, inst.id) && !gefragt.has(paar)) {
        if (!frage) { gefragt.add(paar); const l = z.seiten.luther.reihe.find((x) => x.id === durch); frage = { luther: durch, kirche: inst.id, uid: l?.uid };
          setTimeout(() => zeigeFrage(), Math.max(400, stempelBis - Date.now())); }
      } else if (!gefragt.has(paar) || !frage) kamp.entdecke(durch, inst.id);
    }
    const letzte = z.log.at(-1);
    const letzteUid = letzte?.art === 'spiel' ? letzte.uid : null;
    const amZug = z.phase === 'spiel' && z.am === ICH && !banner && !tutErklaert();
    const sl = summe(z, ICH); const sk = summe(z, ER);
    const ziel = tutorial && !banner && z.am === ICH ? tut()?.ziel : null;
    const leuchtet = (n) => (ziel === n ? ' tut-ziel' : '');
    const pass = (s) => (s.gepasst ? h('span', { class: 'd-pass' }, t.duellGepasst) : null);

    // Oben: der Gegner, kompakt in einer Zeile
    const kopf = h('div', { class: `d-kopf ${ER}${z.am === ER && z.phase === 'spiel' ? ' dran' : ''}` },
      verlassenKnopf(),
      h('span', { class: 'd-portrait klein', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
      h('div', { class: 'd-name' }, h('strong', {}, g.name), h('span', { class: 'd-runde' }, fuelle(t.duellRunde, { n: z.runde }))),
      anfuehrerKnopf(ER, false),
      h('span', { class: 'd-handzahl', 'aria-label': fuelle(t.duellHandZahl, { n: k.hand.length }) },
        Array.from({ length: Math.min(k.hand.length, 10) }, () => h('span', { class: 'ruecken', 'aria-hidden': 'true' })), h('em', {}, String(k.hand.length))),
      pass(k), vollbildKnopf());

    const reihe = (seite, liste, beschriftung) => h('div', { class: `d-reihe ${seite}${leuchtet(`reihe-${seite}`)}`, 'aria-label': fuelle(t.duellReihe, { name: beschriftung }) },
      h('div', { class: 'd-karten', style: `--n: ${Math.max(1, liste.length)}` }, liste.map((inst) => brettKarte(seite, inst, letzteUid))));

    // Rechte Leiste: Summe und Rundensiege je Seite, dazwischen „Passen“
    const stand = (seite, wert, vorne, siege, gepasst) => h('div', { class: `d-stand ${seite}` },
      h('span', { class: `d-summe${vorne ? ' vorne' : ''}${leuchtet('summen')}`, 'aria-label': fuelle(t.duellSumme, { n: wert }) }, String(wert)),
      edelsteine(siege), gepasst);
    const passen = knopf(t.duellPassen, () => { if (!tutErlaubt('passe')) return; z = rules.passe(z, ICH); tutWeiter(); weiter(); },
      `warn d-passen${leuchtet('passen')}`, { disabled: !amZug || !tutErlaubt('passe') });

    // Mitte: letzter Zug und, falls es einen Konter gab, was er bewirkt
    const neuerZug = konter?.nr !== z.log.length;
    const zeilen = konterZeilen(letzte);
    if (neuerZug && zeilen.length) zeigeStempel(letzte);
    const text = banner ? '' : z.am === ER && z.phase === 'spiel' ? `${ereignisText(letzte)} ${fuelle(t.duellUeberlegt, { name: Wer })}`.trim()
      : `${ereignisText(letzte)} ${amZug ? t.duellDeinZug : ''}`.trim();
    const mitte = h('div', { class: `d-mitte${letzte?.treffer ? ' treffer' : letzte?.bann ? ' bann' : ''}`, role: 'status' },
      h('span', { class: 'd-status' }, text), zeilen.map((x) => h('span', { class: 'd-konter' }, x)));

    // Unten: deine Hand. Antippen öffnet immer die Großansicht, dort steht „Ausspielen“.
    const hand = h('div', { class: 'd-hand', style: `--n: ${Math.max(1, l.hand.length)}` }, l.hand.map((inst) => {
      const neu = handVorher.size > 0 && !handVorher.has(inst.uid);
      const gesperrt = !amZug || (tutorial && !tutErlaubt(inst.id));
      return kartenChip(K(inst.id), { klein: true, extra: `d-handkarte${neu ? ' neu' : ''}${gesperrt ? ' wartet' : ''}${leuchtet(inst.id)}`,
        onclick: () => gross({ id: inst.id, seite: ICH, uid: inst.uid, hand: true }) });
    }));
    const du = h('div', { class: `d-du${amZug ? ' dran' : ''}` }, h('strong', {}, t.duellDu), anfuehrerKnopf(ICH, amZug));

    // Erklärkasten der Übung
    const schritt = tutorial && !banner && z.am === ICH && z.phase === 'spiel' ? tut() : null;
    const coach = schritt ? h('div', { class: `tut-box${schritt.erwartet ? ' aufgabe' : ''}`, role: 'status' },
      h('span', { class: 'd-portrait klein', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
      h('div', {}, h('strong', {}, g.name), h('p', {}, schritt.text),
        schritt.erwartet ? null : knopf(t.weiter, () => { tutWeiter(); zeichne(); }, 'haupt klein'))) : null;

    setzeInhalt(buehne, h('div', { class: `d-tisch${alsKirche ? ' als-kirche' : ''}${banner ? ' mit-banner' : ''}${tutorial ? ' mit-tutorial' : ''}`, style: tischStil },
      kopf,
      reihe(ER, k.reihe, g.name),
      stand(ER, sk, sk > sl, k.siege, null),
      mitte, passen,
      reihe(ICH, l.reihe, t.duellDuName),
      stand(ICH, sl, sl > sk, l.siege, pass(l)),
      hand, du,
      coach,
      banner ? bannerEl() : null));

    // Werte merken, damit Änderungen beim nächsten Zeichnen aufleuchten.
    werteVorher = new Map();
    for (const s of ['luther', 'kirche']) for (const inst of z.seiten[s].reihe) werteVorher.set(inst.uid, wert(z, s, inst));
    handVorher = new Set(l.hand.map((x) => x.uid));

    if (!banner && !frage && z.phase === 'spiel' && z.am === ER) timer = setTimeout(kiZug, Math.max(PAUSE_KI, stempelBis - Date.now()));
  }

  // ---------- Kartentausch vor dem Start ----------
  // Regel unverändert (rules.tausche): Jede getauschte Karte geht ins Deck, an ihre Stelle kommt eine neue.
  // Hier wählt man zuerst aus und tauscht dann alle gewählten auf einmal.
  function tauschAnsicht() {
    const l = z.seiten[ICH];
    const moeglich = Math.min(z.tausch, l.deck.length);
    tauschWahl = new Set([...tauschWahl].filter((uid) => l.hand.some((x) => x.uid === uid)));
    const waehle = (uid) => { if (tauschWahl.has(uid)) tauschWahl.delete(uid); else if (tauschWahl.size < moeglich) tauschWahl.add(uid); tauschAnsicht(); };
    const tauschen = () => {
      const vorher = new Set(l.hand.map((x) => x.uid));
      for (const uid of tauschWahl) z = rules.tausche(z, uid, ICH);
      tauschWahl = new Set();
      tauschNeu = new Set(z.seiten[ICH].hand.map((x) => x.uid).filter((u) => !vorher.has(u)));
      tauschAnsicht();
    };
    const los = () => { tauschWahl = new Set(); tauschNeu = new Set(); handVorher = new Set(); z = rules.beginne(z); zeichne(); };
    const karten = l.hand.map((inst) => {
      const kk = K(inst.id); const an = tauschWahl.has(inst.uid); const neu = tauschNeu.has(inst.uid);
      return h('div', { class: `d-tausch-karte${an ? ' gewaehlt' : ''}${neu ? ' neu' : ''}` },
        kartenChip(kk, { gewaehlt: an, extra: 'd-handkarte', aus: !an && tauschWahl.size >= moeglich, onclick: () => waehle(inst.uid) }),
        an ? h('span', { class: 'd-tausch-marke', 'aria-hidden': 'true' }, `↻ ${t.tauschMarke}`) : neu ? h('span', { class: 'd-tausch-marke neu', 'aria-hidden': 'true' }, t.tauschNeu) : null,
        h('button', { type: 'button', class: 'karte-info', 'aria-label': fuelle(t.kartenInfo, { titel: kk.titel }), onclick: () => gross({ id: inst.id }) }, 'i'));
    });
    setzeInhalt(buehne, h('div', { class: `d-tisch d-tausch${alsKirche ? ' als-kirche' : ''}`, style: tischStil },
      h('div', { class: 'd-kopf kirche' }, verlassenKnopf(),
        h('span', { class: 'd-portrait klein', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
        h('div', { class: 'd-name' }, h('strong', {}, fuelle(t.duellGegen, { name: wen })), h('span', { class: 'd-runde' }, g.ort)), vollbildKnopf()),
      h('div', { class: 'd-tausch-kopf' },
        h('h2', {}, moeglich ? fuelle(t.tauschTitel, { n: tauschWahl.size, max: moeglich }) : t.tauschStarthand),
        h('p', {}, t.tauschText),
        h('p', { class: 'd-tausch-rest' }, moeglich ? fuelle(t.tauschRest, { n: z.tausch }) : t.tauschKeiner)),
      h('div', { class: 'd-tausch-hand', style: `--n: ${Math.max(1, l.hand.length)}` }, karten),
      h('div', { class: 'd-tausch-fuss' },
        moeglich ? knopf(`${t.tauschAusfuehren} (${tauschWahl.size})`, tauschen, 'still', { disabled: !tauschWahl.size }) : null,
        knopf(t.tauschLos, los, 'haupt'))));
  }

  function kiZug() {
    if (!lebt() || z.phase !== 'spiel' || z.am !== ER) return;
    z = rules.fuehreAus(z, ER === 'kirche' ? rules.kiZug(z) : rules.kiZugLuther(z), ER);
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
    const text = r.sieger === ICH ? t.duellRundeDu : r.gleich ? t.duellRundeGleich : fuelle(t.duellRundeEr, { name: Wer });
    return h('div', { class: `d-banner ${r.sieger}`, role: 'alert' },
      h('p', { class: 'kicker' }, fuelle(t.duellRundeEnde, { n: r.runde })),
      h('strong', {}, text),
      h('p', { class: 'd-banner-zahl' }, h('span', {}, String(r[ICH])), ' : ', h('span', {}, String(r[ER]))),
      // Endeten mehrere Runden auf einmal (zum Beispiel, weil beide keine Karten mehr haben), folgt das nächste Banner.
      knopf(ende ? t.duellErgebnis : t.duellNaechsteRunde, () => { banner = null; if (ende) ergebnis(); else weiter(); }, 'haupt gross'));
  }

  // ---------- Großansicht einer Karte ----------
  function gross({ id, seite, uid, hand, anfuehrer }) {
    const k = K(id);
    const inst = seite && uid ? z?.seiten[seite].reihe.find((x) => x.uid === uid) : null;
    const jetzt = inst ? wert(z, seite, inst) : null;
    const darf = Boolean(z) && rules.kann(z, ICH) && !banner && !tutErklaert();
    const spielbar = (hand || anfuehrer) && darf && tutErlaubt(id);
    const durch = inst ? entkraeftet(z, seite, inst) : null;
    const vorsprung = spielbar ? rules.vorsprungNach(z, ICH, uid) : null;
    zeigeKartenDetail(k, {
      zusatz: [k.anfuehrer ? t.duellAnfuehrerRegel : null, jetzt != null && jetzt !== k.staerke ? fuelle(t.duellJetzt, { n: jetzt }) : null,
        spielbar ? fuelle(vorsprung > 0 ? t.duellDannVorne : t.duellDannHinten, { n: Math.abs(vorsprung) }) : null,
        durch ? fuelle(t.duellEntkraeftetDurch, { karte: name(durch) }) : null,
        (hand || anfuehrer) && !spielbar ? (darf ? t.tutorialAndereKarte : t.duellWarte) : null],
      knoepfe: spielbar ? [knopf(t.duellAusspielen, () => { z = rules.spiele(z, ICH, uid); tutWeiter(); weiter(); }, 'haupt')] : []
    });
  }

  // ---------- Ergebnis ----------
  function ergebnis() {
    const sieg = z.sieger === 'luther';
    spielmodus(false);
    if (kamp) { kamp.ergebnis(z, deck, () => { vorbereitung(); }); return; }
    const r = ctx.duellEnde(g.id, sieg);
    if (r?.neu) neueKarte = r.neu;
    besteStufe = Math.max(besteStufe, rules.stufe(z));
    const tipps = sieg || tutorial ? [] : rules.verpasst(z, besitz, deck);
    const wo = (id) => { const c = K(id); return c.duell ? fuelle(t.duellWoSieg, { name: disputation.gegner[c.duell].name }) : fuelle(t.duellWoStation, { nr: ctx.station(c.station).nr, name: ctx.station(c.station).name }); };
    const tippText = (x) => ({ runde: t.duellTippRunde, hand: t.duellTippHand, deck: t.duellTippDeck, besitz: t.duellTippBesitz, fehlt: fuelle(t.duellTippFehlt, { wo: wo(x.karte) }) })[x.ort];
    // In der Geschichte (schritt.geschichte) ist eine Niederlage vorgesehen: Die Kirche war mächtiger.
    // Dann erklärt das Ergebnis die Machtverhältnisse statt „Verloren“, und die Tipps liegen zugeklappt darunter.
    const geschichte = Boolean(schritt.geschichte) && !sieg && !tutorial;
    const tippListe = tipps.length ? h('ul', {}, tipps.map((x) => h('li', {},
      h('span', { class: 'mini-paar' }, kartenChip(K(x.kirche), { mini: true }), h('span', { 'aria-hidden': 'true' }, '←'), kartenChip(K(x.karte), { mini: true })),
      h('p', {}, fuelle(t.duellTippZeile, { karte: name(x.karte), gegen: name(x.kirche), n: K(x.kirche).staerke }), ' ', h('strong', {}, tippText(x))))))
      : h('p', {}, t.duellTippAllgemein);
    setzeInhalt(el, h('div', { class: `d-ende ${sieg ? 'sieg' : geschichte ? 'geschichte' : 'niederlage'}` },
      h('div', { class: 'd-gegner-kopf' }, h('span', { class: 'd-portrait', 'aria-hidden': 'true', html: portraetHtml(g, fig) }),
        h('div', {}, h('p', { class: 'kicker' }, g.ort), h('h3', { class: 'd-ende-titel' }, sieg ? t.duellSieg : geschichte ? t.duellGeschichteTitel : t.duellNiederlage), h('p', {}, sieg ? g.sieg : g.niederlage))),
      geschichte ? h('div', { class: 'd-geschichte' },
        h('p', { class: 'd-macht' }, t.duellGeschichteMacht),
        h('p', { class: 'd-mut' }, t.duellGeschichteMut)) : null,
      h('ul', { class: 'd-runden' }, z.runden.map((x) => h('li', { class: x.sieger }, fuelle(t.duellRundeZeile, { n: x.runde, du: x.luther, er: x.kirche }),
        ' ', h('strong', {}, x.sieger === 'luther' ? t.duellGewonnen : geschichte ? t.duellRundeKirche : t.duellVerloren)))),
      neueKarte ? h('div', { class: 'd-belohnung' }, h('p', { class: 'kicker' }, t.duellBelohnung), kartenChip(K(neueKarte), { extra: 'glanz', onclick: () => zeigeKartenDetail(K(neueKarte)) })) : null,
      sieg || tutorial ? null : geschichte ? h('details', { class: 'd-tipps zu' }, h('summary', {}, t.duellTippsNeuerVersuch), tippListe)
        : h('div', { class: 'd-tipps' }, h('h3', {}, t.duellWasHilft), tippListe),
      h('div', { class: 'reihe fuss' }, knopf(t.duellNochmal, () => { neueKarte = null; vorbereitung(); }, 'still'),
        knopf(t.weiter, () => fertig(schritt.gegner === 'worms' ? { stufe: { verhoer: besteStufe } } : {}), 'haupt'))));
    neueKarte = null;
  }

  vorbereitung();
}
