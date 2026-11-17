// Sammelkarten. art: argument | wissen | these. typ: Kartenart für Rahmen und Farbe.
// staerke: Grundstärke 1–3. gegen: Bonus gegen Einwände dieser Art im Kartenduell in Worms (papst, konzil, ordnung, mehrheit).
// Die Werte sind so gesetzt, dass nur die passende Karte einen Einwand (Stärke 4) schlägt.
// These-Karten: „alt“ ist eine eigene Übertragung aus dem Lateinischen, „text“ die Fassung in heutigem Deutsch.
export const cards = [
  { id: 'k1', art: 'argument', station: 's1', bild: 'wandbild-2', typ: 'gottesbild', staerke: 1, titel: 'Strenger Richter', text: 'Um 1500 galt Gott vielen als strenger Richter.' },
  { id: 'k2', art: 'argument', station: 's2', bild: 'waage', typ: 'gottesbild', staerke: 1, titel: 'Werke reichen nicht', text: 'Gute Werke allein bringen keinen Frieden mit Gott.' },
  { id: 'k3', art: 'argument', station: 's3', bild: 'rose-3', typ: 'gnade', staerke: 2, gegen: { mehrheit: 2 }, titel: 'Gnade ist ein Geschenk', text: 'Gott schenkt Gnade. Man kann sie nicht verdienen.' },
  { id: 'k4', art: 'argument', station: 's3', bild: 'stand-gott-offen', typ: 'gnade', staerke: 2, titel: 'Wie der Vater', text: 'Gott ist wie der Vater im Gleichnis: Er läuft dem Sohn entgegen.' },
  { id: 'k5', art: 'argument', station: 's3', bild: 'septembertestament', typ: 'bibel', staerke: 2, gegen: { papst: 3, konzil: 2, mehrheit: 2 }, titel: 'Maßstab Bibel', text: 'Die Bibel ist der Maßstab für den Glauben.' },
  { id: 'w1', art: 'wissen', station: 's4', bild: 'geldweg-fugger', typ: 'wissen', staerke: 2, titel: 'Weg des Geldes', text: 'Das Ablassgeld geht an Erzbischof Albrecht, das Bankhaus Fugger und den Petersdom.' },
  { id: 'w2', art: 'wissen', station: 's4', bild: 'ablassbrief', typ: 'wissen', staerke: 2, titel: 'Ohne Reue kein Erlass', text: 'Ohne echte Reue hilft kein Ablassbrief.' },
  { id: 'w3', art: 'wissen', station: 's4', bild: 'wandbild-4', typ: 'wissen', staerke: 2, titel: 'Gott entscheidet', text: 'Über die Verstorbenen entscheidet Gott allein.' },
  { id: 'k6', art: 'argument', station: 's4', bild: 'muenze', typ: 'gnade', staerke: 2, titel: 'Nicht käuflich', text: 'Vergebung kann man nicht kaufen.' },
  { id: 't27', art: 'these', station: 's5', bild: 'ablasskasten', typ: 'these', staerke: 1, nr: 27, titel: 'These 27',
    alt: 'Menschenlehre predigt, wer sagt: Sobald die Münze im Kasten klingt, fliegt die Seele aus dem Fegefeuer.',
    text: 'Niemand kann eine Seele mit Geld freikaufen.',
    frage: { text: 'Worum ging es in These 27?', optionen: [
      { text: 'Niemand kann eine Seele mit Geld freikaufen.', richtig: true },
      { text: 'Münzen sollen aus Silber sein.' }, { text: 'Das Fegefeuer gibt es nicht.' }] } },
  { id: 't32', art: 'these', station: 's5', bild: 'flugblatt-latein', typ: 'these', staerke: 1, nr: 32, titel: 'These 32',
    alt: 'Wer glaubt, durch Ablassbriefe seines Heils sicher zu sein, wird mit seinen Lehrmeistern verdammt.',
    text: 'Wer sich auf den Brief verlässt, betrügt sich selbst.',
    frage: { text: 'Worum ging es in These 32?', optionen: [
      { text: 'Wer sich auf den Brief verlässt, betrügt sich selbst.', richtig: true },
      { text: 'Ablassbriefe müssen ordentlich gedruckt sein.' }, { text: 'Lehrer verdienen zu wenig.' }] } },
  { id: 't36', art: 'these', station: 's5', bild: 'werk-beichte', typ: 'these', staerke: 1, nr: 36, titel: 'These 36',
    alt: 'Jeder Christ, der wahrhaft bereut, hat vollen Erlass von Strafe und Schuld, auch ohne Ablassbrief.',
    text: 'Echte Reue genügt. Einen Brief braucht es nicht.',
    frage: { text: 'Worum ging es in These 36?', optionen: [
      { text: 'Echte Reue genügt. Einen Brief braucht es nicht.', richtig: true },
      { text: 'Nur der Papst kann vergeben.' }, { text: 'Strafen dürfen nie erlassen werden.' }] } },
  { id: 't43', art: 'these', station: 's5', bild: 'werk-fasten', typ: 'these', staerke: 1, gegen: { ordnung: 3 }, nr: 43, titel: 'These 43',
    alt: 'Wer dem Armen gibt oder dem Bedürftigen leiht, handelt besser, als wer Ablass kauft.',
    text: 'Hilf lieber Menschen in Not, statt Ablass zu kaufen.',
    frage: { text: 'Worum ging es in These 43?', optionen: [
      { text: 'Hilf lieber Menschen in Not, statt Ablass zu kaufen.', richtig: true },
      { text: 'Arme sollen Ablass billiger bekommen.' }, { text: 'Geld verleihen ist Sünde.' }] } },
  { id: 't86', art: 'these', station: 's5', bild: 'geldweg-rom', typ: 'these', staerke: 1, gegen: { papst: 3 }, nr: 86, titel: 'These 86',
    alt: 'Warum baut der Papst, der reicher ist als die Reichsten, die Peterskirche nicht von seinem eigenen Geld?',
    text: 'Der Papst ist reich. Er soll seinen Dom selbst bezahlen.',
    frage: { text: 'Worum ging es in These 86?', optionen: [
      { text: 'Der Papst ist reich. Er soll seinen Dom selbst bezahlen.', richtig: true },
      { text: 'Der Petersdom soll kleiner werden.' }, { text: 'Arme sollen beim Bauen helfen.' }] } },
  { id: 'k7', art: 'argument', station: 's5', bild: 'motiv-1', typ: 'kirche', staerke: 2, gegen: { ordnung: 3 }, titel: 'Erneuern, nicht spalten', text: 'Luther will die Kirche erneuern, nicht spalten.' },
  { id: 'k8', art: 'argument', station: 's5', bild: 'stadt-knoten', typ: 'druck', staerke: 2, gegen: { mehrheit: 3 }, titel: 'Viele haben es gelesen', text: 'In wenigen Wochen sprach man im ganzen Reich über die Thesen.' },
  { id: 'k9', art: 'argument', station: 's6', bild: 'fig-stand-3', typ: 'kirche', staerke: 2, gegen: { konzil: 3 }, titel: 'Konzilien irren', text: 'Auch Konzilien können irren. Sie haben einander widersprochen.' },
  { id: 'k10', art: 'argument', station: 's6', bild: 'fig-luther-worms', typ: 'gewissen', staerke: 3, titel: 'Gewissen', text: 'Mein Gewissen ist an Gottes Wort gebunden.' },
  { id: 'k11', art: 'argument', station: 's7', bild: 'motiv-3', typ: 'bibel', staerke: 2, titel: 'Bibel für alle', text: 'Jeder soll die Bibel selbst lesen können.' }
];
