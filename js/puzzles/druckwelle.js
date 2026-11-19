// Spielsystem „Die Druckwelle“: Kettenreaktion der Druckereien gegen die Verbote der Kirche.
// Oben die Regeln (in Node testbar), unten die Anzeige. Daten und Texte: data/systems/druckwelle.js.
import { h, setzeInhalt, knopf, fuelle } from '../engine/ui.js';
import { bildUrl } from '../engine/bilder.js';

const nachbarn = (d, id) => d.wege.filter((w) => w.includes(id)).map((w) => (w[0] === id ? w[1] : w[0]));
const kennt = (s) => s.f === 'latein' || s.f === 'deutsch';

export const rules = {
  nachbarn,
  kennt,
  /** Sprache der Blätter in dieser Woche: erst Latein, dann Deutsch. */
  sprache: (z, d) => d.sprachen[z.runde - 1],
  start(d) {
    return { runde: 1, boten: d.boten, ende: false, droht: [], verboten: 0, zuSpaet: 0, lateinAnteil: null, ereignis: null,
      st: Object.fromEntries(d.staedte.map((c) => [c.id, { f: c.id === d.start ? 'latein' : 'kein', volk: 0 }])) };
  },
  /** Bringt ein Bote hier etwas Neues hin? Nachbar einer Stadt mit Thesen, nicht verboten, und noch nicht in dieser Sprache. */
  ziel(z, d, id) {
    const s = z.st[id];
    if (z.ende || s.f === 'verbot') return false;
    const neu = s.f === 'kein' || (s.f === 'latein' && rules.sprache(z, d) === 'deutsch');
    return neu && nachbarn(d, id).some((n) => kennt(z.st[n]));
  },
  ziele: (z, d) => d.staedte.map((c) => c.id).filter((id) => rules.ziel(z, d, id)),
  kann: (z, d, id) => z.boten > 0 && rules.ziel(z, d, id),
  /** Woher läuft der Bote? Aus einer Nachbarstadt mit Thesen, deutsche zuerst (für die Anzeige). */
  quelle(z, d, id) {
    const n = nachbarn(d, id).filter((x) => kennt(z.st[x]));
    return n.find((x) => z.st[x].f === 'deutsch') || n[0] || null;
  },
  /** Ein Bote bringt das Blatt der Woche in eine Stadt. */
  zug(z, d, id) {
    if (!rules.kann(z, d, id)) return z;
    const n = structuredClone(z);
    n.boten -= 1;
    n.st[id] = rules.sprache(z, d) === 'deutsch' ? { f: 'deutsch', volk: 1, seit: z.runde } : { f: 'latein', volk: 0 };
    return n;
  },
  /** Wo will die Kirche als Nächstes verbieten? Die wertvollsten Städte an der Grenze der Ausbreitung, Druckereien zuerst. */
  kircheZiele(z, d) {
    const wert = (c) => (c.druckerei ? 20 : 0) + c.volk;
    const rand = d.staedte.filter((c) => z.st[c.id].f === 'kein' && nachbarn(d, c.id).some((n) => kennt(z.st[n])));
    return rand.sort((a, b) => wert(b) - wert(a)).slice(0, d.verboteJeWoche || 1).map((c) => c.id);
  },
  /** Wochenende: 1. Das angekündigte Verbot greift (oder kommt zu spät). 2. In deutschen Städten reden mehr Leute davon.
   *  3. Jede Druckerei mit deutschen Blättern druckt nach und schickt an alle Nachbarn. 4. Neue Woche, neue Ankündigung. */
  rundeEnde(z, d) {
    if (z.ende) return z;
    const n = structuredClone(z);
    const e = { verbot: [], zuSpaet: [], gedruckt: [], phase: null };
    for (const id of z.droht) {
      if (n.st[id].f === 'kein') { n.st[id] = { f: 'verbot', volk: 0 }; e.verbot.push(id); n.verboten += 1; }
      else { e.zuSpaet.push(id); n.zuSpaet += 1; }
    }
    for (const c of d.staedte) if (z.st[c.id].f === 'deutsch') n.st[c.id].volk = Math.min(d.volkStufen, z.st[c.id].volk + 1);
    for (const c of d.staedte) {
      if (!c.druckerei || z.st[c.id].f !== 'deutsch' || z.runde - (z.st[c.id].seit ?? 0) < (d.setzen ?? 0)) continue;
      for (const nb of nachbarn(d, c.id)) {
        const s = n.st[nb];
        if (s.f === 'kein' || s.f === 'latein') { n.st[nb] = { f: 'deutsch', volk: 1, seit: z.runde }; e.gedruckt.push([c.id, nb]); }
      }
    }
    if (n.runde === 1) n.lateinAnteil = rules.anteil(n, d);
    n.runde += 1;
    if (n.runde > d.runden) { n.ende = true; n.runde = d.runden; n.boten = 0; n.droht = []; }
    else {
      n.boten = d.boten;
      const sprache = rules.sprache(n, d);
      if (sprache !== rules.sprache(z, d)) { e.phase = sprache; if (n.st[d.start].f !== 'deutsch') n.st[d.start] = { f: 'deutsch', volk: 1, seit: z.runde }; }
      n.droht = n.runde >= d.kircheAb ? rules.kircheZiele(n, d) : [];
      if (n.runde === d.kircheAb) e.phase = 'kirche';
    }
    n.ereignis = e;
    return n;
  },
  /** Wie viele von 100 Menschen kennen die Thesen? Latein: die Gelehrten. Deutsch: dazu nach und nach alle. */
  anteil(z, d) {
    let summe = 0, alle = 0;
    for (const c of d.staedte) {
      alle += c.gelehrte + c.volk;
      const s = z.st[c.id];
      if (kennt(s)) summe += c.gelehrte;
      if (s.f === 'deutsch') summe += (c.volk * s.volk) / d.volkStufen;
    }
    return Math.round((summe / alle) * 100);
  },
  stufe(z, d) { const a = rules.anteil(z, d); return [...d.stufen].reverse().find((s) => a >= s.ab).stufe; },
  zaehle: (z, f) => Object.values(z.st).filter((s) => s.f === f).length
};

// ---------- Anzeige ----------
// Eine einzige Handlung: leuchtende Stadt antippen, ein Bote läuft mit dem Blatt hin.
// Am Wochenende fliegen gedruckte Blätter von den Druckereien in die Nachbarstädte. Die Sprache wechselt von selbst
// (Woche 1 Latein, dann Deutsch). Zwischenkarten erklären jeden neuen Abschnitt in zwei Sätzen.
const ICON = {
  presse: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21h16M6 21V9h12v12M9 9V4h6v5M12 4V2M8 13h8M8 16h8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  buch: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5c3-1 5.5-.8 8 1 2.5-1.8 5-2 8-1v14c-3-1-5.5-.8-8 1-2.5-1.8-5-2-8-1zM12 6v14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  leute: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="8" r="2.6" fill="currentColor"/><circle cx="17" cy="8" r="2.6" fill="currentColor"/><circle cx="12" cy="6.5" r="3" fill="currentColor"/><path d="M2 20c0-4 2.5-6.5 5-6.5s5 2.5 5 6.5M12 20c0-4 2.5-6.5 5-6.5s5 2.5 5 6.5M6.5 20c0-5 2.5-8 5.5-8s5.5 3 5.5 8" fill="currentColor"/></svg>',
  siegel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  blatt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l4 4v16H6z" fill="#fbf4e2" stroke="#3a2717" stroke-width="1.6"/><path d="M9 9h7M9 12h7M9 15h5" stroke="#3a2717" stroke-width="1.4"/></svg>',
  bote: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="4" r="2.4" fill="currentColor"/><path d="M12 7l-3 5 3 2-1 7M12 7l3 4 3 1M9 12l-4 1M12 14l4 3 1 4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
const PAUSE = (ms) => new Promise((r) => setTimeout(r, ms));

export function view(el, schritt, ctx, fertig) {
  const d = ctx.systeme[schritt.system];
  const t = ctx.t, T = d.text;
  let z = rules.start(d);
  let meldung = [];          // Was zuletzt passiert ist (ein, zwei Sätze)
  let karteOffen = 'latein'; // Zwischenkarte, die gerade gezeigt wird
  let laeuft = false;        // Während einer Animation sind Eingaben gesperrt
  // Stadtlagen stehen in Prozent der ganzen Karte. Gezeigt wird ein Ausschnitt.
  const aus = d.karte.ausschnitt;
  const lage = (c) => ({ ...c, x: ((c.x - aus.x) / aus.b) * 100 + (c.versatz?.[0] || 0), y: ((c.y - aus.y) / aus.b) * 100 + (c.versatz?.[1] || 0) });
  const orte = d.staedte.map(lage);
  const ort = (id) => orte.find((c) => c.id === id);
  const namen = (ids) => ids.map((id) => ort(id).name).join(t.und);
  const kartenStil = bildUrl(d.karte.bild) ? `background-image:url("${bildUrl(d.karte.bild)}");background-size:${10000 / aus.b}% auto;background-position:${(aus.x / (100 - aus.b)) * 100}% ${(aus.y / (100 - aus.b)) * 100}%` : '';
  const setzt = (c) => c.druckerei && z.st[c.id].f === 'deutsch' && z.runde - (z.st[c.id].seit ?? 0) < (d.setzen ?? 0);
  let karte = null;

  /** Anteil der Leser, getrennt nach Gelehrten und allen anderen (für die Leiste oben). */
  function teile() {
    let gel = 0, volk = 0, alle = 0;
    for (const c of d.staedte) {
      alle += c.gelehrte + c.volk; const s = z.st[c.id];
      if (rules.kennt(s)) gel += c.gelehrte;
      if (s.f === 'deutsch') volk += (c.volk * s.volk) / d.volkStufen;
    }
    return { gel: (gel / alle) * 100, volk: (volk / alle) * 100 };
  }

  function stadtKnopf(c) {
    const s = z.st[c.id];
    const ziel = !laeuft && !karteOffen && rules.kann(z, d, c.id);
    const droht = z.droht.includes(c.id);
    const klassen = ['dw-stadt', `f-${s.f}`, `v${s.volk || 0}`, c.druckerei ? 'druckerei' : '', c.oben ? 'oben' : '', ziel ? 'ziel' : '', droht ? 'droht' : '', setzt(c) ? 'setzt' : ''];
    const icon = s.f === 'deutsch' ? ICON.leute : s.f === 'latein' ? ICON.buch : s.f === 'verbot' ? ICON.siegel : '';
    return h('button', { type: 'button', class: klassen.filter(Boolean).join(' '), style: `left:${c.x}%;top:${c.y}%`, 'data-id': c.id, disabled: z.ende,
      'aria-label': `${c.name}, ${T.zustand[s.f]}${c.druckerei ? `, ${T.druckerei}` : ''}${droht ? `, ${T.droht}` : ''}`,
      onclick: () => tippe(c.id) },
      droht ? h('span', { class: 'dw-droht' }, T.droht) : null,
      h('span', { class: 'dw-punkt', html: icon }),
      c.druckerei ? h('span', { class: 'dw-presse', title: T.druckerei, html: ICON.presse }) : null,
      h('span', { class: 'dw-name' }, c.name));
  }

  function zeichne() {
    const linien = d.wege.map(([a, b]) => {
      const an = z.st[a].f === 'deutsch' && z.st[b].f === 'deutsch';
      const zu = z.st[a].f === 'verbot' || z.st[b].f === 'verbot';
      return `<line x1="${ort(a).x}" y1="${ort(a).y}" x2="${ort(b).x}" y2="${ort(b).y}" class="dw-linie${an ? ' an' : ''}${zu ? ' zu' : ''}"/>`;
    }).join('');
    karte = h('div', { class: 'reich dw-karte', style: kartenStil },
      h('div', { class: 'reich-linien', 'aria-hidden': 'true', html: `<svg viewBox="0 0 100 100" preserveAspectRatio="none">${linien}</svg>` }),
      orte.map(stadtKnopf),
      karteOffen ? zwischenkarte() : null,
      z.ende ? h('div', { class: 'dw-zwischen ende' }, h('div', { class: 'dw-zwischen-karte dw-ende' }, ...auswertung())) : null);

    const { gel, volk } = teile();
    const sprache = rules.sprache(z, d);
    const kopf = h('div', { class: 'dw-kopf' },
      h('span', { class: 'dw-woche' }, fuelle(T.woche, { n: z.runde, von: d.runden }), ' ', h('em', { class: `dw-sprache ${sprache}` }, T.sprache[sprache])),
      h('span', { class: 'dw-boten', 'aria-label': `${T.boten}: ${z.boten}` }, T.boten,
        Array.from({ length: d.boten }, (_, i) => h('span', { class: `dw-bote-icon${i < z.boten ? '' : ' weg'}`, 'aria-hidden': 'true', html: ICON.bote }))),
      h('div', { class: 'dw-leser' },
        h('strong', {}, fuelle(T.leser, { n: rules.anteil(z, d) })),
        h('span', { class: 'dw-balken', 'aria-hidden': 'true' },
          h('span', { class: 'gel', style: `width:${gel}%` }), h('span', { class: 'volk', style: `width:${volk}%` }))));

    const seite = h('div', { class: 'reich-seite dw-seite' });
    if (z.ende) seite.append(h('p', { class: 'dw-aufgabe' }, d.auswertung[rules.stufe(z, d)]));
    else {
      const aufgabe = z.boten ? (sprache === 'latein' ? T.zielLatein : T.zielDeutsch) : T.keineBoten;
      seite.append(h('p', { class: 'dw-aufgabe' }, aufgabe));
      if (z.droht.length) seite.append(h('p', { class: 'dw-warnung' }, fuelle(T.drohtText, { orte: namen(z.droht) })));
      for (const m of meldung) seite.append(h('p', { class: `dw-meldung ${m.art || ''}` }, m.text));
      seite.append(h('ul', { class: 'dw-legende' },
        h('li', {}, h('span', { class: 'dw-mini presse', html: ICON.presse }), T.legende.druckerei),
        h('li', {}, h('span', { class: 'dw-mini f-latein', html: ICON.buch }), T.legende.latein),
        h('li', {}, h('span', { class: 'dw-mini f-deutsch', html: ICON.leute }), T.legende.deutsch),
        z.runde >= d.kircheAb ? h('li', {}, h('span', { class: 'dw-mini f-verbot', html: ICON.siegel }), T.legende.verbot) : null),
      knopf(T.wocheEnde, wocheEnde, `${z.boten && rules.ziele(z, d).length ? 'still' : 'haupt'} dw-weiter`, { disabled: laeuft || Boolean(karteOffen) }));
    }
    setzeInhalt(el, kopf, h('div', { class: 'reich-rahmen dw-rahmen' }, karte, seite));
  }

  function zwischenkarte() {
    const p = d.phasen[karteOffen];
    return h('div', { class: `dw-zwischen ${karteOffen}`, role: 'dialog', 'aria-label': p.titel },
      h('div', { class: 'dw-zwischen-karte' }, h('h3', {}, p.titel), h('p', {}, p.text),
        knopf(T.weiter, () => { karteOffen = null; zeichne(); }, 'haupt')));
  }

  /** Antippen: leuchtende Stadt bekommt einen Boten, sonst ein Satz, warum nicht. */
  async function tippe(id) {
    if (laeuft || karteOffen || z.ende) return;
    const c = ort(id); const s = z.st[id];
    if (!rules.kann(z, d, id)) {
      const text = s.f === 'verbot' ? T.istGesperrt : s.f === 'deutsch' || (s.f === 'latein' && rules.sprache(z, d) === 'latein') ? T.schonDa
        : s.f === 'latein' && z.boten ? T.schonLatein : !z.boten ? T.keineBoten : T.zuWeit;
      meldung = [{ text: fuelle(text, { stadt: c.name }), art: 'info' }];
      zeichne(); return;
    }
    laeuft = true; zeichne();
    await fliege([[rules.quelle(z, d, id), id]], 'bote', 650);
    z = rules.zug(z, d, id); laeuft = false; meldung = [];
    zeichne();
    karte.querySelector(`[data-id="${id}"]`)?.classList.add('neu');
  }

  /** Blätter (oder ein Bote) fliegen entlang der Wege. */
  async function fliege(paare, art, dauer) {
    if (!paare.length || !karte?.isConnected) return;
    const flieger = paare.filter(([a]) => a).map(([a, b]) => {
      const f = h('span', { class: `dw-flieger ${art}`, 'aria-hidden': 'true', html: art === 'bote' ? ICON.bote : ICON.blatt, style: `left:${ort(a).x}%;top:${ort(a).y}%;transition-duration:${dauer}ms` });
      karte.append(f); return [f, b];
    });
    await PAUSE(30);
    for (const [f, b] of flieger) { f.style.left = `${ort(b).x}%`; f.style.top = `${ort(b).y}%`; }
    await PAUSE(dauer + 60);
    flieger.forEach(([f]) => f.remove());
  }

  /** Wochenende: Verbote, Nachdruck, neue Woche. Mit kleiner Vorführung auf der Karte. */
  async function wocheEnde() {
    if (laeuft || karteOffen) return;
    const vorher = z;
    z = rules.rundeEnde(z, d);
    const e = z.ereignis;
    laeuft = true;
    // Erst die Verbote (Siegel), dann die gedruckten Blätter fliegen lassen
    const zeitweise = z; z = vorher; zeichne();
    for (const id of e.verbot) karte.querySelector(`[data-id="${id}"]`)?.classList.add('stempel');
    for (const id of e.zuSpaet) { const b = karte.querySelector(`[data-id="${id}"]`); if (b) { b.classList.add('zu-spaet'); b.append(h('span', { class: 'dw-zuspaet' }, T.zuSpaetKurz)); } }
    if (e.verbot.length || e.zuSpaet.length) await PAUSE(900);
    await fliege(e.gedruckt, 'blatt', 900);
    z = zeitweise; laeuft = false;
    meldung = [];
    if (e.verbot.length) meldung.push({ text: fuelle(T.verbot, { orte: namen(e.verbot) }), art: 'verbot' });
    if (e.zuSpaet.length) meldung.push({ text: fuelle(T.zuSpaet, { orte: namen(e.zuSpaet) }), art: 'gut' });
    if (e.gedruckt.length) meldung.push({ text: fuelle(T.gedruckt, { orte: namen([...new Set(e.gedruckt.map(([, b]) => b))]) }), art: 'gut' });
    else if (d.staedte.some((c) => setzt(c))) meldung.push({ text: T.setztNoch });
    karteOffen = e.phase || null;
    zeichne();
    for (const [, b] of e.gedruckt) karte.querySelector(`[data-id="${b}"]`)?.classList.add('neu');
  }

  function auswertung() {
    const stufe = rules.stufe(z, d);
    const ende = rules.anteil(z, d);
    const balken = (wert, text, klasse) => h('div', { class: 'dw-vergleich-zeile' }, h('span', {}, text),
      h('span', { class: 'dw-balken gross' }, h('span', { class: klasse, style: `width:${wert}%` })), h('strong', {}, String(wert)));
    return [
      h('h3', {}, T.ende),
      h('div', { class: 'dw-vergleich' }, balken(z.lateinAnteil ?? 0, T.nachLatein, 'gel'), balken(ende, T.amEnde, 'volk')),
      h('p', { class: 'dw-lehre' }, d.lehre),
      h('p', {}, fuelle(d.verbote, { verboten: z.verboten, zuSpaet: z.zuSpaet }), ' ', d.reaktion),
      h('div', { class: 'reihe' }, knopf(t.nochmal, () => { z = rules.start(d); meldung = []; karteOffen = 'latein'; zeichne(); }, 'still'),
        knopf(t.weiter, () => fertig({ stufe: { druck: stufe } }), 'haupt'))
    ];
  }

  zeichne();
}
