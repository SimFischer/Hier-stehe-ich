// Spielsystem „Die Druckwelle“. Oben die Regeln (in Node testbar), unten die Anzeige.
import { h, setzeInhalt, knopf, fuelle } from '../engine/ui.js';
import { bildUrl } from '../engine/bilder.js';

const nachbarn = (d, id) => d.wege.filter((w) => w.includes(id)).map((w) => (w[0] === id ? w[1] : w[0]));

export const rules = {
  nachbarn,
  start(d) {
    return { runde: 1, boten: d.boten, deutsch: d.deutschJeRunde[0], ende: false,
      st: Object.fromEntries(d.staedte.map((c) => [c.id, { f: c.id === d.start ? 'latein' : 'kein', volk: 0 }])) };
  },
  erreichbar: (z, d, id) => z.st[id].f !== 'kein' || nachbarn(d, id).some((n) => z.st[n].f !== 'kein'),
  kann(z, d, { stadt, fassung }) {
    if (z.ende || z.boten < 1 || !rules.erreichbar(z, d, stadt)) return false;
    return fassung === 'latein' ? z.st[stadt].f === 'kein' : z.deutsch > 0 && z.st[stadt].f !== 'deutsch';
  },
  /** Ein Bote bringt eine Fassung in eine Stadt. */
  zug(z, d, a) {
    if (!rules.kann(z, d, a)) return z;
    const n = structuredClone(z);
    n.boten -= 1;
    if (a.fassung === 'deutsch') { n.deutsch -= 1; n.st[a.stadt] = { f: 'deutsch', volk: 1 }; }
    else n.st[a.stadt].f = 'latein';
    return n;
  },
  /** Wochenende: Deutsche Städte drucken nach. Knoten beliefern alle Nachbarn, kleine Städte einen. */
  rundeEnde(z, d) {
    if (z.ende) return z;
    const n = structuredClone(z);
    const deutsche = d.staedte.filter((c) => z.st[c.id].f === 'deutsch');
    const neu = [];
    for (const c of deutsche) {
      n.st[c.id].volk = Math.min(d.volkStufen, n.st[c.id].volk + 1);
      const ziele = nachbarn(d, c.id).filter((id) => z.st[id].f !== 'deutsch');
      for (const id of ziele.slice(0, c.knoten ? d.weiter.knoten : d.weiter.klein)) if (n.st[id].f !== 'deutsch') { n.st[id] = { f: 'deutsch', volk: 1 }; neu.push(id); }
    }
    n.neu = neu;
    n.runde += 1;
    if (n.runde > d.runden) { n.ende = true; n.runde = d.runden; n.boten = 0; }
    else { n.boten = d.boten; n.deutsch = d.deutschJeRunde[n.runde - 1]; }
    return n;
  },
  /** Wie viele von 100 Menschen haben von den Thesen gehört? */
  anteil(z, d) {
    let summe = 0, alle = 0;
    for (const c of d.staedte) {
      alle += c.gelehrte + c.volk;
      const s = z.st[c.id];
      if (s.f !== 'kein') summe += c.gelehrte;
      if (s.f === 'deutsch') summe += (c.volk * s.volk) / d.volkStufen;
    }
    return Math.round((summe / alle) * 100);
  },
  stufe(z, d) { const a = rules.anteil(z, d); return [...d.stufen].reverse().find((s) => a >= s.ab).stufe; },
  zaehle: (z, f) => Object.values(z.st).filter((s) => s.f === f).length
};

export function view(el, schritt, ctx, fertig) {
  const d = ctx.systeme[schritt.system];
  const t = ctx.t;
  let z = rules.start(d);
  let wahl = null;
  let meldung = d.einleitung;
  // Stadtlagen stehen in Prozent der ganzen Karte. Gezeigt wird ein Ausschnitt.
  const aus = d.karte.ausschnitt;
  const lage = (c) => ({ ...c, x: ((c.x - aus.x) / aus.b) * 100 + (c.versatz?.[0] || 0), y: ((c.y - aus.y) / aus.b) * 100 + (c.versatz?.[1] || 0) });
  const orte = d.staedte.map(lage);
  const ort = (id) => orte.find((c) => c.id === id);
  const kartenStil = bildUrl(d.karte.bild) ? `background-image:url("${bildUrl(d.karte.bild)}");background-size:${10000 / aus.b}% auto;background-position:${(aus.x / (100 - aus.b)) * 100}% ${(aus.y / (100 - aus.b)) * 100}%` : '';

  const zeichne = () => {
    const linien = d.wege.map(([a, b]) => `<line x1="${ort(a).x}" y1="${ort(a).y}" x2="${ort(b).x}" y2="${ort(b).y}" class="${z.st[a].f === 'deutsch' && z.st[b].f === 'deutsch' ? 'linie aktiv' : 'linie'}"/>`).join('');
    const karte = h('div', { class: 'reich', style: kartenStil },
      h('div', { class: 'reich-linien', 'aria-hidden': 'true', html: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${linien}</svg>` }),
      ...orte.map((c) => {
        const s = z.st[c.id];
        const zeichen = s.f === 'deutsch' ? t.druckKurzDeutsch : s.f === 'latein' ? t.druckKurzLatein : '';
        const zustand = s.f === 'deutsch' ? t.druckDeutsch : s.f === 'latein' ? t.druckLatein : t.druckKein;
        return h('button', { type: 'button', style: `left:${c.x}%;top:${c.y}%`, disabled: z.ende,
          class: `stadt f-${s.f} v${s.volk}${c.knoten ? ' knoten' : ''}${c.oben ? ' oben' : ''}${wahl === c.id ? ' gewaehlt' : ''}${rules.erreichbar(z, d, c.id) ? ' erreichbar' : ''}`,
          'aria-label': `${c.name}, ${zustand}${c.knoten ? ', ' + t.druckKnoten : ''}`, onclick: () => { wahl = c.id; meldung = ''; zeichne(); } },
          h('span', { class: 'punkt' }, zeichen), h('span', { class: 'name' }, c.name));
      }));

    const kopf = h('div', { class: 'zaehler' },
      h('span', {}, fuelle(t.druckWoche, { n: z.runde, von: d.runden })),
      h('span', {}, fuelle(t.druckBoten, { n: z.boten })),
      h('span', {}, fuelle(t.druckFrei, { n: z.ende ? 0 : z.deutsch })),
      h('strong', {}, fuelle(t.druckAnteil, { n: rules.anteil(z, d) })));

    const seite = h('div', { class: 'reich-seite' });
    if (z.ende) {
      const stufe = rules.stufe(z, d);
      seite.append(h('p', { class: 'auswertung' }, d.auswertung[stufe]),
        h('p', {}, fuelle(d.vergleich, { latein: rules.zaehle(z, 'latein'), deutsch: rules.zaehle(z, 'deutsch') })),
        h('p', {}, d.reaktion),
        h('div', { class: 'reihe' }, knopf(t.nochmal, () => { z = rules.start(d); wahl = null; meldung = d.einleitung; zeichne(); }, 'still'),
          knopf(t.weiter, () => fertig({ stufe: { druck: stufe } }), 'haupt')));
    } else {
      if (meldung) seite.append(h('p', {}, meldung));
      if (wahl) {
        const c = ort(wahl); const s = z.st[wahl];
        const erreichbar = rules.erreichbar(z, d, wahl);
        seite.append(h('h3', {}, c.name),
          h('p', { class: 'klein' }, !erreichbar ? t.druckZuWeit : s.f === 'deutsch' ? t.druckSchonDeutsch : s.f === 'latein' ? t.druckSchonLatein : c.knoten ? t.druckKnotenText : t.druckKleinText),
          h('div', { class: 'reihe' },
            knopf(t.druckSchickeLatein, () => { z = rules.zug(z, d, { stadt: wahl, fassung: 'latein' }); meldung = ''; zeichne(); }, '', { disabled: !rules.kann(z, d, { stadt: wahl, fassung: 'latein' }) }),
            knopf(t.druckSchickeDeutsch, () => { z = rules.zug(z, d, { stadt: wahl, fassung: 'deutsch' }); meldung = ''; zeichne(); }, 'haupt', { disabled: !rules.kann(z, d, { stadt: wahl, fassung: 'deutsch' }) })));
      } else if (!meldung) seite.append(h('p', {}, t.druckWaehle));
      seite.append(h('ul', { class: 'regeln' }, d.regeln.map((r) => h('li', {}, r))),
        knopf(z.boten ? t.druckWocheEnde : t.druckWocheEndeLeer, () => {
          z = rules.rundeEnde(z, d); wahl = null;
          meldung = z.ende ? '' : `${d.wochenende} ${z.neu.length ? fuelle(t.druckNeu, { orte: z.neu.map((id) => ort(id).name).join(', ') }) : ''}`;
          zeichne();
        }, z.boten ? 'still' : 'haupt'));
    }
    setzeInhalt(el, kopf, h('div', { class: 'reich-rahmen' }, karte, seite));
  };
  zeichne();
}
