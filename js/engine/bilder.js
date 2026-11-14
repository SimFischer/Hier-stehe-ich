// Bilder aus assets/. Steht ein Bild nicht im Register (data/assets.js), springt die Platzhaltergrafik ein.
// Nur Zeichenketten, kein Zugriff auf den Bildschirm: auch in Node nutzbar.
import { assets } from '../../data/assets.js';
import { szeneSvg, figurSvg, kopfSvg, standSvg, motivSvg } from './platzhalter.js';

const ORDNER = 'assets/';
const svgUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const hatBild = (name) => Boolean(name && assets[name]);
// Adressen für CSS müssen vollständig sein: Dort gelten relative Pfade ab dem Ordner css/.
const voll = (pfad) => (typeof document === 'undefined' ? pfad : new URL(pfad, document.baseURI).href);
export const bildUrl = (name) => (hatBild(name) ? voll(ORDNER + assets[name].datei) : null);

/** Bild als HTML. Breite und Höhe stehen dabei, damit beim Laden nichts springt. */
export function bildHtml(name, klasse = '') {
  if (!hatBild(name)) return '';
  const b = assets[name];
  return `<img src="${ORDNER}${b.datei}" width="${b.w}" height="${b.h}" alt="" class="${klasse}" decoding="async" draggable="false">`;
}

export const szeneHtml = (bild = {}) => bildHtml(bild.datei, 'szenenbild') || szeneSvg(bild);
export const szeneUrl = (bild = {}) => bildUrl(bild.datei) || svgUrl(szeneSvg(bild));
export const figurHtml = (figur = {}) => bildHtml(figur.bild, 'figurbild') || figurSvg(figur.farbe);
export const statistHtml = (nr) => bildHtml(`fig-statist-${(nr % 4) + 1}`, 'figurbild') || figurSvg();
/** Reichsstand im Saal: sechs Typen, die sich auf den Plätzen wiederholen. */
export const standHtmlSaal = (platz, nickt) => bildHtml(`fig-stand-${(platz % 6) + 1}${nickt ? '-nickend' : ''}`, 'figurbild') || kopfSvg(nickt);
export const standbildHtml = (wer, haltung) => bildHtml(`stand-${wer}-${haltung}`, 'figurbild') || standSvg(wer, haltung);
export const motivHtml = (motiv) => bildHtml(motiv.bild, '') || motivSvg(motiv.id);
export const motivUrl = (motiv) => bildUrl(motiv.bild) || svgUrl(motivSvg(motiv.id));
