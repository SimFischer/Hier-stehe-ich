// Alle Karten an einer Stelle: Luthers Karten (Geschichte und Kampagne), Karten der Kirche, Anführer.
import { cards } from './cards.js';
import { disputation } from './disputation.js';
import { kampagne } from './kampagne.js';

export const lutherKarten = [...cards, ...kampagne.karten];
export const kirchenKarten = [...disputation.kirche, ...kampagne.kirche];
export const anfuehrerKarten = disputation.anfuehrer;
export const alleKarten = new Map([...lutherKarten, ...kirchenKarten, ...anfuehrerKarten].map((k) => [k.id, k]));
export const karte = (id) => alleKarten.get(id);
