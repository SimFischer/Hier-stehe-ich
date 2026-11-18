// Karten auswählen: zwei Thesen für den Beutel (Station 5) oder fünf Karten für das Verhör (Station 6).
import { h, setzeInhalt, knopf, rich, kartenChip, fuelle } from '../engine/ui.js';
import { wahlRules } from './schritte.js';

export const rules = {
  /** Karten, aus denen gewählt wird. */
  vorrat(schritt, alleKarten, beutel) {
    return schritt.quelle === 'thesen' ? alleKarten.filter((k) => k.art === 'these') : beutel;
  },
  umschalten(wahl, id, anzahl) {
    if (wahl.includes(id)) return wahl.filter((k) => k !== id);
    return wahl.length < anzahl ? [...wahl, id] : wahl;
  },
  fertig: (wahl, anzahl) => wahl.length === anzahl,
  /** Thesen, die nicht im Beutel sind und über eine Erinnerung nachgeholt werden können. */
  fehlend: (alleKarten, beutel) => alleKarten.filter((k) => k.art === 'these' && !beutel.some((b) => b.id === k.id)),
  erinnert: (karte, index) => wahlRules.pruefe(karte.frage, index)
};

export function view(el, schritt, ctx, fertig) {
  const t = ctx.t;
  const d = schritt.system ? ctx.systeme[schritt.system] : null;
  let wahl = [];
  let erinnere = null; // These, deren Frage gerade gestellt wird
  let rueck = '';

  const zeichne = () => {
    const beutel = ctx.karten();
    const vorrat = rules.vorrat(schritt, ctx.alleKarten, beutel);
    if (erinnere) {
      setzeInhalt(el, h('p', { class: 'frage' }, erinnere.frage.text),
        h('div', { class: 'optionen' }, erinnere.frage.optionen.map((o, i) => h('button', { type: 'button', class: 'option', onclick: () => {
          if (rules.erinnert(erinnere, i)) { ctx.gibKarte(erinnere.id); rueck = fuelle(t.erinnertJa, { titel: erinnere.titel }); erinnere = null; } else rueck = t.erinnertNein;
          zeichne();
        } }, o.text))),
        h('p', { class: 'rueck offen', role: 'status' }, rueck));
      return;
    }
    const fehlend = schritt.erinnerung ? rules.fehlend(ctx.alleKarten, beutel) : [];
    setzeInhalt(el, 
      h('p', { class: 'anweisung' }, rich(schritt.anweisung || d.deckEinleitung)),
      h('div', { class: `hand wahl${vorrat.length > 8 ? ' viele' : ''}` }, vorrat.map((k) => kartenChip(k,
        { klein: vorrat.length > 8, text: schritt.quelle === 'thesen', gewaehlt: wahl.includes(k.id), onclick: () => { wahl = rules.umschalten(wahl, k.id, schritt.anzahl); rueck = ''; zeichne(); } }))),
      fehlend.length ? h('div', { class: 'erinnerung' }, h('span', { class: 'klein' }, d.erinnerung),
        fehlend.map((k) => knopf(k.titel, () => { erinnere = k; rueck = ''; zeichne(); }, 'still klein'))) : null,
      h('div', { class: 'reihe fuss' },
        h('p', { class: 'rueck', role: 'status' }, rueck || fuelle(t.auswahlStand, { n: wahl.length, von: schritt.anzahl })),
        knopf(t.weiter, () => fertig({ [schritt.ergebnis]: wahl }), 'haupt', { disabled: !rules.fertig(wahl, schritt.anzahl) })));
  };
  zeichne();
}
