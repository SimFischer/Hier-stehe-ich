// Platzhaltergrafik als SVG, bis die fertigen Bilder aus docs/ASSET-PROMPTS.md in assets/ liegen.
// Farben folgen dem Stilrahmen. Nur Zeichenketten, kein Zugriff auf den Bildschirm.
const F = { pergament: '#efe3c8', ocker: '#c8963e', rot: '#a6432e', gruen: '#3e5b45', tinte: '#1f1a17', blau: '#3f5870', holz: '#7a5a38', stein: '#b9ad97', dunkel: '#3a332c' };
const svg = (inhalt, vb = '0 0 400 300') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice">${inhalt}</svg>`;
const schraffur = `<defs><pattern id="sch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="6" stroke="${F.tinte}" stroke-width="1" opacity=".18"/></pattern></defs>`;
const r = (x, y, w, h, f, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${F.tinte}" stroke-width="2" ${extra}/>`;
const fenster = (x, y, licht) => `<path d="M${x} ${y + 70} v-45 a22 22 0 0 1 44 0 v45 z" fill="${licht}" stroke="${F.tinte}" stroke-width="3"/><path d="M${x + 22} ${y + 3} v67 M${x} ${y + 38} h44" stroke="${F.tinte}" stroke-width="2"/>`;
const boden = (y, f) => `<rect x="0" y="${y}" width="400" height="${300 - y}" fill="${f}"/><rect x="0" y="${y}" width="400" height="${300 - y}" fill="url(#sch)"/><line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${F.tinte}" stroke-width="3"/>`;

const szenen = {
  werkstatt: () => `<rect width="400" height="300" fill="#d9c49c"/>${boden(205, F.holz)}${fenster(40, 40, '#f4e2a8')}
    ${r(250, 60, 120, 110, F.holz)}${r(258, 68, 104, 20, '#5d4429')}${r(258, 98, 104, 20, '#5d4429')}${r(258, 128, 104, 20, '#5d4429')}
    ${r(150, 90, 70, 115, '#5d4429')}${r(140, 80, 90, 14, F.holz)}<line x1="185" y1="50" x2="185" y2="80" stroke="${F.tinte}" stroke-width="6"/>${r(160, 46, 50, 8, F.tinte)}
    <path d="M0 30 Q200 55 400 28" fill="none" stroke="${F.tinte}" stroke-width="2"/>${[90, 120, 300, 335].map((x) => r(x, 36, 22, 30, F.pergament)).join('')}`,
  kirche: () => `<rect width="400" height="300" fill="${F.stein}"/>${boden(210, '#8f8571')}
    <path d="M0 0 h400 v40 Q300 90 200 40 Q100 90 0 40z" fill="#9c917c" stroke="${F.tinte}" stroke-width="3"/>${fenster(40, 70, '#9fb4c7')}
    ${r(240, 60, 130, 110, '#e4d8bf')}<rect x="240" y="60" width="130" height="110" fill="url(#sch)"/>
    ${r(150, 150, 60, 60, '#8c7a5b')}${r(165, 128, 30, 22, F.ocker)}<path d="M180 100 v28 M170 110 h20" stroke="${F.tinte}" stroke-width="4"/>`,
  feld: () => `<rect width="400" height="300" fill="#5d6b7a"/><path d="M0 60 Q80 20 160 55 T400 40 V0 H0z" fill="#3b4450"/><path d="M0 90 Q120 60 260 95 T400 80 V40 H0z" fill="#4a5562" opacity=".8"/>
    <path d="M0 200 Q200 170 400 205 V300 H0z" fill="#6f7d4c" stroke="${F.tinte}" stroke-width="3"/><path d="M150 300 Q200 230 260 196 L280 198 Q240 240 230 300z" fill="#bca77a" stroke="${F.tinte}" stroke-width="2"/>
    <path d="M320 196 v-50" stroke="${F.tinte}" stroke-width="6"/><circle cx="320" cy="130" r="28" fill="${F.gruen}" stroke="${F.tinte}" stroke-width="3"/>
    ${r(60, 170, 14, 24, F.stein)}<path d="M60 170 l7 -22 l7 22z" fill="${F.rot}" stroke="${F.tinte}" stroke-width="2"/>`,
  kloster: () => `<rect width="400" height="300" fill="#cfc4ad"/>${boden(210, '#a59a84')}
    ${[20, 110, 290].map((x) => `<path d="M${x} 210 v-120 a40 40 0 0 1 80 0 v120" fill="#e9dfc8" stroke="${F.tinte}" stroke-width="4"/>`).join('')}
    ${r(195, 70, 80, 140, '#8f8571')}${r(205, 150, 60, 14, F.holz)}${r(250, 120, 8, 30, F.pergament)}${r(40, 60, 40, 55, F.holz)}`,
  stube: (o) => `<rect width="400" height="300" fill="${o.nacht ? '#5b5144' : o.abend ? '#b99a6a' : '#c9ac7c'}"/><rect width="400" height="300" fill="url(#sch)"/>${boden(215, o.nacht ? '#4a3c2c' : F.holz)}
    ${fenster(300, 45, o.nacht ? '#27324a' : o.winter ? '#e8eef2' : o.abend ? '#e9a35a' : '#f4e2a8')}
    ${r(110, 150, 150, 14, '#5d4429')}${r(120, 164, 10, 51, '#5d4429')}${r(240, 164, 10, 51, '#5d4429')}
    ${r(150, 132, 40, 18, F.pergament)}${r(205, 136, 26, 14, F.rot)}<path d="M228 150 v-34" stroke="${F.tinte}" stroke-width="2"/><ellipse cx="228" cy="112" rx="4" ry="7" fill="${F.ocker}"/>
    ${r(30, 60, 60, 100, '#5d4429')}${[70, 95, 120].map((y) => r(36, y, 48, 16, F.blau)).join('')}`,
  markt: () => `<rect width="400" height="300" fill="#bcd0dc"/>
    ${[[0, 90, F.pergament], [80, 70, '#d9c49c'], [170, 95, F.pergament], [250, 60, '#cdb98f'], [330, 85, F.pergament]].map(([x, y, f]) => `${r(x, y, 80, 215 - y, f)}<path d="M${x - 4} ${y} l44 -40 l44 40z" fill="${F.rot}" stroke="${F.tinte}" stroke-width="3"/><rect x="${x}" y="${y}" width="80" height="${215 - y}" fill="url(#sch)"/>`).join('')}
    ${boden(215, '#a59a84')}${r(40, 190, 70, 25, F.holz)}<path d="M75 190 v-80 M55 130 h40" stroke="${F.rot}" stroke-width="7"/>
    <path d="M285 60 l-12 26 h24z" fill="${F.ocker}" stroke="${F.tinte}" stroke-width="2"/>`,
  saal: () => `<rect width="400" height="300" fill="#a8946f"/><rect width="400" height="300" fill="url(#sch)"/>${boden(220, '#6d5435')}
    ${[130, 200, 270, 340].map((x) => fenster(x, 30, '#d9cba4')).join('')}
    <path d="M20 220 v-150 h80 v150z" fill="${F.rot}" stroke="${F.tinte}" stroke-width="3"/><path d="M10 70 h100 l-10 -24 h-80z" fill="${F.ocker}" stroke="${F.tinte}" stroke-width="3"/>${r(40, 150, 40, 70, F.ocker)}
    ${[180, 196, 212].map((y, i) => r(140 + i * 10, y - 30, 240 - i * 10, 12, '#5d4429')).join('')}`
};

/** Hintergrund einer Szene als SVG-Text. */
export function szeneSvg(bild = {}) { return svg(schraffur + (szenen[bild.typ] || szenen.stube)(bild)); }

/** Einfache Figur: Kopf und Gewand in einer Farbe. */
export function figurSvg(farbe = F.dunkel) {
  return svg(`<ellipse cx="30" cy="96" rx="22" ry="4" fill="${F.tinte}" opacity=".25"/><path d="M12 96 Q10 46 30 38 Q50 46 48 96z" fill="${farbe}" stroke="${F.tinte}" stroke-width="3"/><circle cx="30" cy="24" r="13" fill="#e6c9a3" stroke="${F.tinte}" stroke-width="3"/><path d="M17 20 Q30 4 43 20" fill="${farbe}" stroke="${F.tinte}" stroke-width="3"/>`, '0 0 60 100');
}

/** Kopf eines Reichsstands im Saal. Zustimmung wird durch Farbe und Haken gezeigt. */
export function kopfSvg(nickt) {
  return svg(`<path d="M6 44 Q6 26 20 24 Q34 26 34 44z" fill="${nickt ? F.gruen : '#6f675c'}" stroke="${F.tinte}" stroke-width="2"/><circle cx="20" cy="14" r="9" fill="#e6c9a3" stroke="${F.tinte}" stroke-width="2"/>${nickt ? `<path d="M13 34 l5 5 l9 -10" fill="none" stroke="${F.pergament}" stroke-width="3"/>` : ''}`, '0 0 40 46');
}

/** Standbild-Figuren: Luther (gebeugt, kniend, aufrecht) und Gott (streng, offen) als helle Gestalt ohne Gesicht. */
export function standSvg(wer, haltung) {
  if (wer === 'gott') {
    const arme = haltung === 'offen' ? 'M36 70 L8 54 M64 70 L92 54' : 'M36 70 L30 100 M64 68 L78 30';
    return svg(`<circle cx="50" cy="60" r="46" fill="#f6e7a8" opacity=".55"/><path d="M30 170 Q30 80 50 60 Q70 80 70 170z" fill="#fbf4dc" stroke="${F.ocker}" stroke-width="3"/><circle cx="50" cy="42" r="15" fill="#fbf4dc" stroke="${F.ocker}" stroke-width="3"/><path d="${arme}" fill="none" stroke="${F.ocker}" stroke-width="8" stroke-linecap="round"/>`, '0 0 100 180');
  }
  const formen = {
    aufrecht: `<path d="M34 170 Q32 80 50 62 Q68 80 66 170z" fill="${F.tinte}"/><circle cx="50" cy="44" r="14" fill="#e6c9a3" stroke="${F.tinte}" stroke-width="3"/>`,
    gebeugt: `<path d="M30 170 Q24 110 52 86 Q74 100 62 170z" fill="${F.tinte}"/><circle cx="64" cy="78" r="14" fill="#e6c9a3" stroke="${F.tinte}" stroke-width="3"/>`,
    kniend: `<path d="M22 170 Q28 118 50 104 Q70 118 78 170z" fill="${F.tinte}"/><circle cx="52" cy="88" r="14" fill="#e6c9a3" stroke="${F.tinte}" stroke-width="3"/><path d="M50 120 L70 108" stroke="#e6c9a3" stroke-width="7" stroke-linecap="round"/>`
  };
  return svg(formen[haltung] || formen.aufrecht, '0 0 100 180');
}

const motive = {
  feder: `<path d="M30 80 Q28 50 50 40 Q72 50 70 80z" fill="${F.tinte}"/><circle cx="50" cy="28" r="11" fill="none" stroke="${F.tinte}" stroke-width="4"/><path d="M62 62 L88 30 Q84 50 66 66z" fill="${F.tinte}"/><path d="M20 86 h60" stroke="${F.tinte}" stroke-width="4"/>`,
  presse: `<path d="M20 90 V20 h60 V90 M20 34 h60 M50 20 V8 M38 8 h24 M30 62 h40 v12 h-40z M50 34 v28" fill="none" stroke="${F.tinte}" stroke-width="5"/>`,
  buch: `<path d="M50 30 Q30 18 10 26 V78 Q30 70 50 82 Q70 70 90 78 V26 Q70 18 50 30z M50 30 V82" fill="none" stroke="${F.tinte}" stroke-width="5"/><path d="M50 4 v14 M30 8 l6 12 M70 8 l-6 12" stroke="${F.tinte}" stroke-width="3"/>`,
  waage: `<path d="M50 12 V86 M30 90 h40 M16 28 h68 M16 28 l-10 26 h20z M84 28 l-10 26 h20z" fill="none" stroke="${F.tinte}" stroke-width="5"/>`
};
/** Bild für die Flugschrift. */
export function motivSvg(id) { return svg(`<rect width="100" height="100" fill="${F.pergament}"/>${motive[id] || motive.buch}`, '0 0 100 100'); }
