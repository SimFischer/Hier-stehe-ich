// Die Waage der Werke: Sie hebt sich, aber sie kippt nie.
import { h, setzeInhalt, knopf, rich } from '../engine/ui.js';
import { bildHtml } from '../engine/bilder.js';

export const rules = {
  start: () => ({ gelegt: [], mehr: 0, summe: 0 }),
  zug(z, s, { werk }) {
    const n = { ...z, gelegt: [...z.gelegt] };
    if (werk === 'mehr') {
      if (!rules.alle(z, s)) return z;
      n.mehr += 1;
      // Jedes „noch mehr“ bringt weniger und bleibt unter der Grenze.
      n.summe = Math.min(s.grenze, z.summe + s.mehr.gewicht / n.mehr);
    } else {
      const w = s.werke.find((x) => x.id === werk);
      if (!w || z.gelegt.includes(werk)) return z;
      n.gelegt.push(werk); n.summe += w.gewicht;
    }
    return n;
  },
  alle: (z, s) => z.gelegt.length === s.werke.length,
  kippt: (z, s) => z.summe >= s.last,
  fertig: (z, s) => rules.alle(z, s)
};

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let z = rules.start();
  let text = '';
  const zeichne = () => {
    const winkel = -14 * (1 - z.summe / schritt.last);
    const waage = h('div', { class: 'waage', style: `--winkel:${winkel}deg`, role: 'img', 'aria-label': t.waageBild },
      h('div', { class: 'waage-balken' },
        h('div', { class: 'schale links' }, h('span', { class: 'icon', html: bildHtml(schritt.lastBild) }), h('span', {}, t.waageLast)),
        h('div', { class: 'schale rechts' }, h('span', {}, z.gelegt.length ? z.gelegt.map((id) => schritt.werke.find((w) => w.id === id).label).join(' · ') : t.waageLeer))),
      h('div', { class: 'waage-fuss' }));
    const knoepfe = h('div', { class: 'reihe mitte' },
      schritt.werke.map((w) => knopf([h('span', { class: 'icon', 'aria-hidden': 'true', html: bildHtml(w.bild) }), w.label], () => { z = rules.zug(z, schritt, { werk: w.id }); text = w.text; zeichne(); }, '', { disabled: z.gelegt.includes(w.id) })),
      rules.alle(z, schritt) ? knopf(schritt.mehr.label, () => { z = rules.zug(z, schritt, { werk: 'mehr' }); text = schritt.mehr.text; zeichne(); }, 'still') : null);
    setzeInhalt(el, h('p', { class: 'anweisung' }, rich(schritt.anweisung)), waage, knoepfe,
      h('div', { class: 'reihe fuss' },
        h('p', { class: 'rueck', role: 'status' }, rules.alle(z, schritt) && z.mehr > 0 ? `${text} ${schritt.ende}` : text),
        rules.fertig(z, schritt) ? knopf(t.weiter, () => fertig({}), 'haupt') : null));
  };
  zeichne();
}
