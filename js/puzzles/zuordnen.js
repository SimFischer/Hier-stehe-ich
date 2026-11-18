// Zuordnen: erst ein Teil antippen, dann das Ziel. Wird für Wandbild, Thesen, Strafen und die vier „allein“ benutzt.
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';
import { bildHtml, kartenBild } from '../engine/bilder.js';

const mitBild = (x) => (x.bild ? h('span', { class: 'zu-bild', 'aria-hidden': 'true', html: bildHtml(x.bild) }) : null);

/** Baut Teile und Ziele. Für die Thesen kommen sie aus den Karten. */
export function aufbau(schritt, karten) {
  if (schritt.quelle !== 'thesen') return { items: schritt.items, ziele: schritt.ziele };
  const thesen = karten.filter((k) => k.art === 'these');
  const items = thesen.map((k) => ({ id: k.id, text: `${k.titel}: ${k.alt}`, ziel: `z-${k.id}` }));
  // Ziele in anderer Reihenfolge als die Thesen, aber immer gleich.
  const ziele = thesen.map((k) => ({ id: `z-${k.id}`, label: k.text }));
  return { items, ziele: [...ziele.slice(2), ...ziele.slice(0, 2)].reverse() };
}

export const rules = {
  start: (a) => ({ platz: {}, fehler: 0, letzte: null }),
  zug(z, a, { item, ziel }) {
    const it = a.items.find((i) => i.id === item);
    if (!it || z.platz[item]) return z;
    const n = { ...z, platz: { ...z.platz } };
    if (it.ziel === ziel) { n.platz[item] = ziel; n.letzte = { richtig: true }; }
    else { n.fehler += 1; n.letzte = { richtig: false, item, ziel }; }
    return n;
  },
  fertig: (z, a) => a.items.every((i) => z.platz[i.id])
};

/** Die Druckvorlage (Station 5): Thesenblatt an der Tür, daneben fünf Druckformen mit den kurzen Fassungen. */
function thesenView(el, schritt, ctx, fertig, a) {
  const t = ctx.t;
  let z = rules.start(a);
  let hinweis = '';
  let zuletzt = null; // gerade gedruckte These, für die Animation
  const these = (itemId) => ctx.karte(itemId);
  const zeichne = () => {
    const offen = a.items.filter((i) => !z.platz[i.id]);
    const jetzt = offen[0] || null;
    const k = jetzt ? these(jetzt.id) : null;
    const gedruckt = a.items.length - offen.length;
    const blatt = k ? h('div', { class: `th-blatt${z.letzte && !z.letzte.richtig ? ' wackelt' : ''}` },
      h('span', { class: 'th-nagel', 'aria-hidden': 'true' }),
      h('span', { class: 'th-bild', 'aria-hidden': 'true', html: bildHtml(kartenBild(k).name) }),
      h('div', { class: 'th-text' },
        h('p', { class: 'th-nr' }, h('span', { class: 'th-initiale' }, String(k.nr)), fuelle(t.thesenNr, { nr: k.nr })),
        h('p', { class: 'kicker' }, t.thesenAlt),
        h('blockquote', { class: 'th-alt' }, k.alt),
        h('p', { class: 'th-frage' }, t.thesenFrage)))
      : h('div', { class: 'th-blatt fertig' }, h('span', { class: 'th-nagel', 'aria-hidden': 'true' }),
        h('div', { class: 'th-text' }, h('p', { class: 'th-nr' }, t.thesenFertigTitel), h('p', {}, t.thesenFertigText)));
    const fortschritt = h('div', { class: 'th-fortschritt', 'aria-label': fuelle(t.thesenFortschritt, { n: gedruckt, von: a.items.length }) },
      a.items.map((i) => h('span', { class: `th-siegel${z.platz[i.id] ? ' an' : ''}${jetzt?.id === i.id ? ' jetzt' : ''}`, 'aria-hidden': 'true' }, String(these(i.id).nr))),
      h('span', { class: 'klein' }, fuelle(t.thesenFortschritt, { n: gedruckt, von: a.items.length })));
    const formen = h('div', { class: 'th-formen', role: 'group', 'aria-label': t.zuZiele }, a.ziele.map((zi) => {
      const drin = a.items.find((i) => z.platz[i.id] === zi.id);
      const kk = drin ? these(drin.id) : null;
      const falsch = z.letzte && !z.letzte.richtig && z.letzte.ziel === zi.id;
      return h('button', { type: 'button', class: `th-form${drin ? ' gedruckt' : ''}${drin && drin.id === zuletzt ? ' neu' : ''}${falsch ? ' falsch' : ''}`, disabled: Boolean(drin) || !jetzt,
        onclick: () => {
          const vorher = jetzt.id;
          z = rules.zug(z, a, { item: vorher, ziel: zi.id });
          hinweis = z.letzte.richtig ? '' : schritt.falsch;
          zuletzt = z.letzte.richtig ? vorher : null;
          zeichne();
        } },
        kk ? h('span', { class: 'th-stempel', 'aria-hidden': 'true' }, String(kk.nr)) : h('span', { class: 'th-lettern', 'aria-hidden': 'true' }),
        h('strong', {}, zi.label),
        kk ? h('em', {}, fuelle(t.thesenGedruckt, { nr: kk.nr })) : null);
    }));
    setzeInhalt(el,
      h('p', { class: 'anweisung' }, rich(schritt.anweisung)),
      h('div', { class: 'th-werkstatt' }, h('div', { class: 'th-links' }, blatt, fortschritt), formen),
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${hinweis ? ' offen' : ''}`, role: 'status' }, hinweis || (rules.fertig(z, a) ? t.zuFertig : t.thesenTipp)),
        rules.fertig(z, a) ? knopf(t.weiter, () => fertig({}), 'haupt') : null));
  };
  zeichne();
}

export function view(el, schritt, ctx, fertig) {
  const a = aufbau(schritt, ctx.alleKarten);
  if (schritt.layout === 'thesen') { thesenView(el, schritt, ctx, fertig, a); return; }
  const t = ctx.t;
  let z = rules.start(a);
  let wahl = null;
  let hinweis = '';

  const zeichne = () => {
    const offen = a.items.filter((i) => !z.platz[i.id]);
    // Stapel: Immer nur das nächste Teil liegt groß in der Hand.
    if (schritt.stapel) wahl = offen[0]?.id || null;
    const zeigen = schritt.stapel ? offen.slice(0, 1) : offen;
    const teile = h('div', { class: `zu-teile${a.items.some((i) => i.bild) ? ' bilder' : ''}${schritt.stapel ? ' stapel' : ''}`, role: 'group', 'aria-label': t.zuTeile },
      schritt.stapel && offen.length ? h('p', { class: 'klein' }, fuelle(t.zuStapel, { n: a.items.length - offen.length + 1, von: a.items.length })) : null,
      zeigen.map((i) => h('button', { type: 'button', class: `teil${wahl === i.id ? ' gewaehlt' : ''}${i.bild ? ' mit-bild' : ''}`, 'aria-pressed': String(wahl === i.id),
        onclick: () => { if (!schritt.stapel) { wahl = wahl === i.id ? null : i.id; hinweis = ''; zeichne(); } } }, mitBild(i), h('span', {}, i.text))));
    const ziele = h('div', { class: `zu-ziele layout-${schritt.layout}${a.items.some((i) => i.bild) ? ' bilder' : ''}`, role: 'group', 'aria-label': t.zuZiele },
      a.ziele.map((zi) => {
        const drin = a.items.filter((i) => z.platz[i.id] === zi.id);
        const voll = schritt.einzeln && drin.length > 0;
        return h('button', { type: 'button', class: `ziel${voll ? ' voll' : ''}${z.letzte && !z.letzte.richtig && z.letzte.ziel === zi.id ? ' falsch' : ''}`,
          disabled: voll || !wahl, onclick: () => {
            const it = a.items.find((i) => i.id === wahl);
            z = rules.zug(z, a, { item: wahl, ziel: zi.id });
            hinweis = z.letzte.richtig ? '' : (it.falsch || schritt.falsch);
            if (z.letzte.richtig) wahl = null;
            zeichne();
          } },
          mitBild(zi), h('span', { class: 'ziel-kopf' }, h('strong', {}, zi.label), zi.unter ? h('em', {}, zi.unter) : null),
          drin.map((i) => h('span', { class: `gelegt${i.bild ? ' mit-bild' : ''}` }, mitBild(i), h('span', {}, i.text))));
      }));
    const fuss = h('div', { class: 'reihe fuss' },
      h('p', { class: `rueck${hinweis ? ' offen' : ''}`, role: 'status' }, hinweis || (rules.fertig(z, a) ? t.zuFertig : wahl ? t.zuZielWaehlen : t.zuTeilWaehlen)),
      rules.fertig(z, a) ? knopf(t.weiter, () => fertig({}), 'haupt') : null);
    setzeInhalt(el, h('p', { class: 'anweisung' }, rich(schritt.anweisung)), h('div', { class: `zuord layout-${schritt.layout}` }, teile, ziele), fuss);
  };
  zeichne();
}
