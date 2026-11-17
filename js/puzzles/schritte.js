// Kleine Schritte, die in vielen Rätseln vorkommen: Auswahlfrage, Textseite, Gespräch.
import { h, setzeInhalt, knopf, rich, fuelle } from '../engine/ui.js';
import { erfuellt } from '../engine/state.js';

export const wahlRules = {
  /** Gibt zurück, ob die Antwort den Schritt abschließt. Bei freien Fragen zählt jede Antwort. */
  pruefe: (schritt, index) => Boolean(schritt.frei || schritt.optionen[index]?.richtig),
  loesung: (schritt) => (schritt.frei ? 0 : schritt.optionen.findIndex((o) => o.richtig))
};

export function wahl(el, schritt, ctx, fertig) {
  const t = ctx.t;
  let gewaehlt = null;
  let falsche = new Set();
  const zeichne = () => {
    const o = gewaehlt == null ? null : schritt.optionen[gewaehlt];
    const ok = gewaehlt != null && wahlRules.pruefe(schritt, gewaehlt);
    const wer = schritt.wer ? ctx.figuren[schritt.wer] : null;
    const zusatz = ctx.state.zuZweit && schritt.begruendung ? `${t.zuZweitBesprecht} ` : '';
    setzeInhalt(el, 
      schritt.begruendung ? h('p', { class: 'kicker' }, t.begruendung) : null,
      wer ? h('div', { class: 'sprechblase frage-blase' }, h('strong', { class: 'sprecher' }, fuelle(t.fragtDich, { name: wer.name })), h('p', { class: 'frage' }, '„', rich(schritt.frage), '“'))
        : null,
      wer && zusatz ? h('p', { class: 'kicker' }, zusatz) : null,
      wer ? null : h('p', { class: 'frage' }, zusatz, rich(schritt.frage)),
      wer?.echt ? h('p', { class: 'klein' }, t.nacherzaehlt) : null,
      schritt.info ? h('details', { class: 'info' }, h('summary', {}, schritt.info.knopf),
        h('div', { class: 'lesetext' }, h('h3', {}, schritt.info.titel), schritt.info.absaetze.map((a) => h('p', {}, a)))) : null,
      h('div', { class: 'optionen' }, schritt.optionen.map((op, i) =>
        h('button', { type: 'button', class: `option${gewaehlt === i ? (ok ? ' richtig' : ' falsch') : ''}`, disabled: ok || falsche.has(i),
          onclick: () => { gewaehlt = i; if (!wahlRules.pruefe(schritt, i)) falsche.add(i); zeichne(); } }, op.text))),
      h('div', { class: 'reihe fuss' },
        h('p', { class: `rueck${o && !ok ? ' offen' : ''}`, role: 'status' }, o ? rich(o.rueck || (ok ? t.richtig : t.nochEinmal)) : ''),
        ok ? knopf(t.weiter, () => fertig(schritt.speichert ? { [schritt.speichert]: o.wert } : {}), 'haupt') : null));
  };
  zeichne();
}

export function text(el, schritt, ctx, fertig) {
  const d = schritt.system ? ctx.systeme[schritt.system] : null;
  const absaetze = schritt.absaetze.filter((a) => erfuellt(ctx.state, a.wenn)).map((a) => {
    if (a.auswertung) return h('p', { class: 'auswertung' }, d.auswertung[ctx.sammel.stufe?.[schritt.system] || 1]);
    if (a.urteil) return h('p', {}, rich(d.urteil));
    return h(a.zitat ? 'blockquote' : 'p', {}, rich(a.text));
  });
  setzeInhalt(el, h('div', { class: 'lesetext' }, absaetze), h('div', { class: 'reihe fuss' }, h('span', {}), knopf(ctx.t.weiter, () => fertig({}), 'haupt')));
}

/** Zeilen eines Gesprächs, die zum Spielstand passen. */
export const zeilenFuer = (state, dialog) => dialog.zeilen.filter((z) => erfuellt(state, z.wenn));

export function gespraech(el, schritt, ctx, fertig) {
  const dialog = ctx.dialog(schritt.dialog);
  const zeilen = zeilenFuer(ctx.state, dialog);
  let i = 0;
  const zeichne = () => {
    const z = zeilen[i];
    const f = ctx.figuren[z.wer] || {};
    setzeInhalt(el, 
      h('div', { class: `sprechblase wer-${z.wer}` },
        f.name ? h('strong', { class: 'sprecher' }, f.name, f.echt ? h('em', {}, ` ${ctx.t.nacherzaehltKurz}`) : null) : null,
        h('p', {}, rich(z.text))),
      h('div', { class: 'reihe fuss' }, h('span', { class: 'klein' }, `${i + 1} / ${zeilen.length}`),
        knopf(ctx.t.weiter, () => { if (i < zeilen.length - 1) { i += 1; zeichne(); } else { ctx.gespraechEnde(dialog); fertig({}); } }, 'haupt')));
  };
  zeichne();
}
