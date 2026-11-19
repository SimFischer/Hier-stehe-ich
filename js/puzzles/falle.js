// „Ecks Falle“ (Leipziger Disputation): Eck treibt Luther mit Fangfragen Schritt für Schritt in die Enge.
// Oben die Regeln (in Node testbar), unten die Anzeige. Inhalte: data/puzzles.js (Schritt art: 'falle').
// Drei Arten von Antworten: stand (bei der Bibel bleiben: ein Schritt weiter in die Falle), aus (ausweichen: Eck fragt
// noch einmal, einmal je Frage), nach (nachgeben: widerspricht Luthers Lehre, kostet Gewissen, man wählt neu).
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';
import { figurHtml } from '../engine/bilder.js';

export const rules = {
  start: () => ({ nr: 0, stufe: 0, publikum: 0, gewissen: 3, aus: false, ausgewichen: 0, nachgegeben: 0, verlauf: [], letzte: null, ende: false }),
  /** Antworten, die gerade möglich sind: Ausweichen geht je Frage nur einmal. */
  moeglich: (z, s) => (z.ende ? [] : s.fragen[z.nr].antworten.map((a, i) => ({ ...a, i })).filter((a) => !(a.art === 'aus' && z.aus))),
  antworte(z, s, index) {
    const f = s.fragen[z.nr];
    const a = f?.antworten[index];
    if (z.ende || !a || (a.art === 'aus' && z.aus)) return z;
    const n = { ...z, letzte: { art: a.art, rueck: a.rueck, nr: z.nr } };
    if (a.art === 'stand') {
      n.stufe += 1; n.publikum = Math.min(3, z.publikum + 1); n.aus = false;
      n.verlauf = [...z.verlauf, { thema: f.thema, text: f.kurz || a.text }];
      n.nr += 1; n.ende = n.nr >= s.fragen.length; if (n.ende) n.nr = s.fragen.length - 1;
    } else if (a.art === 'aus') { n.aus = true; n.ausgewichen += 1; n.publikum = Math.max(-3, z.publikum - 1); }
    else { n.gewissen = Math.max(0, z.gewissen - 1); n.nachgegeben += 1; n.publikum = Math.max(-3, z.publikum - 1); }
    return n;
  },
  /** Auswertung: 3 ohne Ausweichen und Nachgeben, 2 mit wenigen Umwegen, 1 sonst. */
  stufe: (z) => { const umwege = z.ausgewichen + z.nachgegeben; return umwege === 0 ? 3 : umwege <= 2 ? 2 : 1; }
};

const FALLE = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M4 36h32M8 36V12M14 36V8M20 36V6M26 36V8M32 36V12M6 12c4-8 24-8 28 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
const KERZE = '<svg viewBox="0 0 20 40" aria-hidden="true"><path class="flamme" d="M10 2c4 6 5 9 0 14-5-5-4-8 0-14z"/><rect x="6" y="17" width="8" height="21" rx="2" class="wachs"/></svg>';

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let z = rules.start();
  // Reihenfolge der Antworten je Frage einmal mischen, damit die richtige nicht immer an derselben Stelle steht.
  const reihen = schritt.fragen.map((f) => f.antworten.map((_, i) => i).sort(() => Math.random() - 0.5));
  const figur = (id, klasse) => h('span', { class: `ef-figur ${klasse}`, 'aria-hidden': 'true', html: figurHtml(ctx.figuren[id]) });

  const zeichne = () => {
    const f = schritt.fragen[z.nr];
    const moeglich = rules.moeglich(z, schritt).map((a) => a.i);
    const letzte = z.letzte;
    // Weg in die Falle: Luther steht auf der Station, die er schon erreicht hat
    const weg = h('ol', { class: 'ef-weg', 'aria-label': fuelle(t.falleWeg, { n: z.stufe, von: schritt.fragen.length }) },
      schritt.stationen.map((name, i) => h('li', { class: `ef-station${i < z.stufe ? ' hinter' : ''}${i === z.stufe ? ' hier' : ''}${i === schritt.stationen.length - 1 ? ' falle' : ''}` },
        h('span', { class: 'ef-punkt' }, i === schritt.stationen.length - 1 ? h('span', { class: 'ef-falle-icon', html: FALLE }) : String(i + 1)),
        h('span', { class: 'ef-stationsname' }, name),
        i === z.stufe ? h('span', { class: 'ef-luther-marke' }, t.falleLuther) : null)));

    const saal = h('div', { class: 'ef-saal', 'aria-label': fuelle(t.falleSaal, { n: z.publikum }) },
      h('span', {}, schritt.saal.links),
      h('span', { class: 'ef-saal-balken', 'aria-hidden': 'true' }, h('span', { class: 'ef-saal-marke', style: `left:${50 + z.publikum * (50 / 3)}%` })),
      h('span', {}, schritt.saal.rechts));

    const gewissen = h('div', { class: 'ef-gewissen', 'aria-label': fuelle(t.falleGewissenStand, { n: z.gewissen }) },
      h('span', { class: 'ef-gewissen-titel' }, t.falleGewissen),
      h('span', { class: 'ef-kerzen' }, [0, 1, 2].map((i) => h('span', { class: `ef-kerze${i < z.gewissen ? '' : ' aus'}`, html: KERZE }))));

    const antworten = h('div', { class: 'ef-antworten', role: 'group', 'aria-label': t.falleWas },
      reihen[z.nr].map((i) => {
        const a = f.antworten[i];
        const weg = !z.ende && !moeglich.includes(i);
        const falsch = letzte && letzte.nr === z.nr && f.antworten[i].art === letzte.art && letzte.art !== 'stand';
        return h('button', { type: 'button', class: `ef-antwort${weg ? ' weg' : ''}${falsch ? ` war-${letzte.art}` : ''}`, disabled: weg || z.ende,
          onclick: () => { z = rules.antworte(z, schritt, i); zeichne(); } }, a.text);
      }));

    const frageBlase = h('div', { class: `ef-blase${letzte?.art === 'aus' && letzte.nr === z.nr ? ' nachhaken' : ''}`, role: 'status' },
      h('strong', {}, ctx.figuren.eck.name), letzte?.art === 'aus' && letzte.nr === z.nr ? h('em', { class: 'ef-nachhaken' }, t.falleNachhaken) : null,
      h('p', {}, f.frage));

    const rueck = letzte ? h('p', { class: `ef-rueck ${letzte.art}`, role: 'status' }, letzte.rueck) : h('p', { class: 'ef-rueck' }, t.falleWas);

    setzeInhalt(el,
      z.nr === 0 && !letzte ? h('p', { class: 'anweisung' }, rich(schritt.anweisung)) : h('p', { class: 'kicker' }, fuelle(t.falleFrage, { n: z.nr + 1, von: schritt.fragen.length })),
      weg,
      h('div', { class: 'ef-buehne' },
        h('div', { class: 'ef-seite eck' }, figur('eck', 'eck')),
        h('div', { class: 'ef-mitte' }, frageBlase, antworten, rueck),
        h('div', { class: 'ef-seite luther' }, figur('luther', 'luther'), gewissen)),
      saal,
      z.ende ? zuschnapp() : null);
    if (z.ende) requestAnimationFrame(() => el.querySelector('.ef-ende')?.classList.add('zu'));
  };

  /** Ende: Die Falle schnappt zu. Kette der Antworten, was danach geschah, Auswertung. */
  function zuschnapp() {
    const stufe = rules.stufe(z);
    return h('div', { class: 'ef-ende', role: 'dialog', 'aria-label': schritt.zuschnapp.titel },
      h('div', { class: 'ef-ende-karte' },
        h('span', { class: 'ef-ende-icon', html: FALLE }),
        h('h3', {}, schritt.zuschnapp.titel),
        h('p', {}, schritt.zuschnapp.text),
        h('p', { class: 'ef-kette-titel' }, schritt.kette),
        h('ol', { class: 'ef-kette' }, z.verlauf.map((v) => h('li', {}, h('strong', {}, v.thema), v.text))),
        h('p', { class: 'ef-auswertung' }, schritt.auswertung[stufe]),
        h('div', { class: 'ef-danach' }, h('strong', {}, t.falleDanach), h('ul', {}, schritt.danach.map((d) => h('li', {}, d)))),
        h('div', { class: 'reihe mitte' }, knopf(t.nochmal, () => { z = rules.start(); zeichne(); }, 'still'), knopf(t.weiter, () => fertig({}), 'haupt'))));
  }

  zeichne();
}
