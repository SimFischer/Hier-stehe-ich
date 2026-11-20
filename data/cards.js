// Luthers Sammelkarten. art: argument | wissen | these. typ: Kartenart für Rahmen und Farbe.
// Werte für das Kartenspiel „Disputation“ (Regeln in js/puzzles/duell.js, Gegner in data/disputation.js):
//   staerke: Grundstärke im Spiel (1–6). Die Karten der Kirche sind viel stärker (bis 10).
//   seltenheit: gewoehnlich | selten | episch | legendaer (Rahmen im Album).
//   entkraeftet: Karten der Kirche, die nur noch Stärke 1 haben, solange diese Karte in deiner Reihe liegt.
//   staerkt: { gruppe, plus }: deine Karten dieser Kartenart werden stärker.
//   bund: +1 für jede andere Karte gleicher Kartenart in deiner Reihe.
//   zieht: Du ziehst sofort so viele Karten nach.  standhaft: Bann und Schwächen wirken nicht.
// station: wo man die Karte bekommt. duell: Belohnung für einen Sieg gegen diesen Gegner.
// These-Karten: „alt“ ist eine eigene Übertragung aus dem Lateinischen, „text“ die Fassung in heutigem Deutsch.
export const cards = [
  { id: 'k1', art: 'argument', station: 's1', bild: 'fig-pilger', typ: 'gottesbild', staerke: 1, seltenheit: 'gewoehnlich', zieht: 1,
    titel: 'Die Angst kennen', text: 'Um 1500 galt Gott vielen als strenger Richter. Wer die Angst der Leute kennt, kann ihr antworten.' },
  { id: 'k2', art: 'argument', station: 's2', bild: 'waage', typ: 'gottesbild', staerke: 3, seltenheit: 'gewoehnlich', entkraeftet: ['c-werke'],
    titel: 'Werke reichen nicht', text: 'Gute Werke allein bringen keinen Frieden mit Gott.' },
  { id: 'k3', art: 'argument', station: 's3', bild: 'rose-3', typ: 'gnade', staerke: 4, seltenheit: 'episch', entkraeftet: ['c-ablass', 'c-brief'],
    titel: 'Gnade ist ein Geschenk', text: 'Gott schenkt Gnade. Man kann sie nicht verdienen.' },
  { id: 'k4', art: 'argument', station: 's3', bild: 'stand-gott-offen', typ: 'gnade', staerke: 3, seltenheit: 'episch', entkraeftet: ['c-richter'],
    titel: 'Wie der Vater', text: 'Gott ist wie der Vater im Gleichnis: Er läuft dem Sohn entgegen.' },
  { id: 'k5', art: 'argument', station: 's3', bild: 'septembertestament', typ: 'bibel', staerke: 4, seltenheit: 'legendaer', entkraeftet: ['c-papst', 'c-tradition', 'c-konzil'],
    titel: 'Maßstab Bibel', text: 'Die Bibel ist der Maßstab für den Glauben.' },
  { id: 'k12', art: 'argument', station: 's3', bild: 'stand-luther-aufrecht', typ: 'gnade', staerke: 5, seltenheit: 'legendaer', entkraeftet: ['c-werke', 'c-fegefeuer', 'c-richter'], standhaft: true,
    titel: 'Allein aus Glauben', text: 'Der Mensch wird gerecht durch den Glauben, nicht durch eigene Leistung.' },
  { id: 'w1', art: 'wissen', station: 's4', bild: 'geldweg-fugger', typ: 'wissen', staerke: 3, seltenheit: 'selten', entkraeftet: ['c-petersdom'],
    titel: 'Weg des Geldes', text: 'Das Ablassgeld geht an Erzbischof Albrecht, das Bankhaus Fugger und den Petersdom.' },
  { id: 'w2', art: 'wissen', station: 's4', bild: 'ablassbrief', typ: 'wissen', staerke: 3, seltenheit: 'selten', entkraeftet: ['c-predigt', 'c-brief'],
    titel: 'Ohne Reue kein Erlass', text: 'Ohne echte Reue hilft kein Ablassbrief.' },
  { id: 'w3', art: 'wissen', station: 's4', bild: 'wandbild-4', typ: 'wissen', staerke: 3, seltenheit: 'selten', entkraeftet: ['c-fegefeuer'],
    titel: 'Gott entscheidet', text: 'Über die Verstorbenen entscheidet Gott allein.' },
  { id: 'k6', art: 'argument', station: 's4', bild: 'muenze', typ: 'gnade', staerke: 2, seltenheit: 'gewoehnlich', entkraeftet: ['c-ablass', 'c-ablassprediger', 'c-predigt'],
    titel: 'Nicht käuflich', text: 'Vergebung kann man nicht kaufen.' },
  { id: 'n1', art: 'argument', station: 's4', duell: 'tetzel', bild: 'fig-witwe', typ: 'menschen', staerke: 4, seltenheit: 'selten', entkraeftet: ['c-petersdom'], zieht: 1,
    titel: 'Die Not der Leute', text: 'Arme Leute geben ihr letztes Geld. Luther sieht ihre Not.' },
  { id: 't27', art: 'these', station: 's5', bild: 'ablasskasten', typ: 'these', staerke: 2, seltenheit: 'gewoehnlich', bund: true, entkraeftet: ['c-ablass', 'c-ablassprediger'], nr: 27, titel: 'These 27',
    alt: 'Menschenlehre predigt, wer sagt: Sobald die Münze im Kasten klingt, fliegt die Seele aus dem Fegefeuer.',
    text: 'Niemand kann eine Seele mit Geld freikaufen.',
    frage: { text: 'Worum ging es in These 27?', optionen: [
      { text: 'Niemand kann eine Seele mit Geld freikaufen.', richtig: true },
      { text: 'Münzen sollen aus Silber sein.' }, { text: 'Das Fegefeuer gibt es nicht.' }] } },
  { id: 't32', art: 'these', station: 's5', bild: 'flugblatt-latein', typ: 'these', staerke: 2, seltenheit: 'gewoehnlich', bund: true, entkraeftet: ['c-brief'], nr: 32, titel: 'These 32',
    alt: 'Wer glaubt, durch Ablassbriefe seines Heils sicher zu sein, wird mit seinen Lehrmeistern verdammt.',
    text: 'Wer sich auf den Brief verlässt, betrügt sich selbst.',
    frage: { text: 'Worum ging es in These 32?', optionen: [
      { text: 'Wer sich auf den Brief verlässt, betrügt sich selbst.', richtig: true },
      { text: 'Ablassbriefe müssen ordentlich gedruckt sein.' }, { text: 'Lehrer verdienen zu wenig.' }] } },
  { id: 't36', art: 'these', station: 's5', bild: 'werk-beichte', typ: 'these', staerke: 2, seltenheit: 'gewoehnlich', bund: true, entkraeftet: ['c-predigt'], nr: 36, titel: 'These 36',
    alt: 'Jeder Christ, der wahrhaft bereut, hat vollen Erlass von Strafe und Schuld, auch ohne Ablassbrief.',
    text: 'Echte Reue genügt. Einen Brief braucht es nicht.',
    frage: { text: 'Worum ging es in These 36?', optionen: [
      { text: 'Echte Reue genügt. Einen Brief braucht es nicht.', richtig: true },
      { text: 'Nur der Papst kann vergeben.' }, { text: 'Strafen dürfen nie erlassen werden.' }] } },
  { id: 't43', art: 'these', station: 's5', bild: 'werk-fasten', typ: 'these', staerke: 2, seltenheit: 'gewoehnlich', bund: true, entkraeftet: ['c-werke', 'c-ablassprediger'], nr: 43, titel: 'These 43',
    alt: 'Wer dem Armen gibt oder dem Bedürftigen leiht, handelt besser, als wer Ablass kauft.',
    text: 'Hilf lieber Menschen in Not, statt Ablass zu kaufen.',
    frage: { text: 'Worum ging es in These 43?', optionen: [
      { text: 'Hilf lieber Menschen in Not, statt Ablass zu kaufen.', richtig: true },
      { text: 'Arme sollen Ablass billiger bekommen.' }, { text: 'Geld verleihen ist Sünde.' }] } },
  { id: 't86', art: 'these', station: 's5', bild: 'geldweg-rom', typ: 'these', staerke: 2, seltenheit: 'gewoehnlich', bund: true, entkraeftet: ['c-petersdom'], nr: 86, titel: 'These 86',
    alt: 'Warum baut der Papst, der reicher ist als die Reichsten, die Peterskirche nicht von seinem eigenen Geld?',
    text: 'Der Papst ist reich. Er soll seinen Dom selbst bezahlen.',
    frage: { text: 'Worum ging es in These 86?', optionen: [
      { text: 'Der Papst ist reich. Er soll seinen Dom selbst bezahlen.', richtig: true },
      { text: 'Der Petersdom soll kleiner werden.' }, { text: 'Arme sollen beim Bauen helfen.' }] } },
  { id: 'k7', art: 'argument', station: 's5', bild: 'motiv-1', typ: 'kirche', staerke: 3, seltenheit: 'episch', entkraeftet: ['c-ordnung'],
    titel: 'Erneuern, nicht spalten', text: 'Luther will die Kirche erneuern, nicht spalten.' },
  { id: 'k8', art: 'argument', station: 's5', bild: 'stadt-knoten', typ: 'druck', staerke: 3, seltenheit: 'selten', entkraeftet: ['c-mehrheit'],
    titel: 'Viele haben es gelesen', text: 'In wenigen Wochen sprach man im ganzen Reich über die Thesen.' },
  { id: 'k13', art: 'argument', station: 's5', bild: 'bonus-presse-teile-4', typ: 'druck', staerke: 2, seltenheit: 'episch', staerkt: { gruppe: ['these', 'druck'], plus: 2 }, entkraeftet: ['c-verbrennung'],
    titel: 'Die Druckerpresse', text: 'Gedruckt erreichen Luthers Gedanken Tausende statt einiger Gelehrter.' },
  { id: 'n2', art: 'argument', station: 'sl', duell: 'eck', bild: 'fig-geselle', typ: 'menschen', staerke: 4, seltenheit: 'selten', entkraeftet: ['c-mehrheit'],
    titel: 'Rückhalt der Studenten', text: 'Etwa 200 Studenten aus Wittenberg begleiten Luther nach Leipzig.' },
  { id: 'k9', art: 'argument', station: 'sl', bild: 'fig-stand-3', typ: 'kirche', staerke: 4, seltenheit: 'episch', entkraeftet: ['c-konzil', 'c-hus', 'c-unfehlbar'],
    titel: 'Konzilien irren', text: 'Auch Konzilien können irren. Sie haben einander widersprochen.' },
  { id: 'k10', art: 'argument', station: 's6', bild: 'fig-luther-worms', typ: 'gewissen', staerke: 6, seltenheit: 'legendaer', entkraeftet: ['c-bann', 'c-widerrufe', 'c-bulle', 'c-ingolstadt'], standhaft: true,
    titel: 'Gewissen', text: 'Mein Gewissen ist an Gottes Wort gebunden.' },
  { id: 'k11', art: 'argument', station: 's7', bild: 'motiv-3', typ: 'bibel', staerke: 4, seltenheit: 'selten', entkraeftet: ['c-tradition', 'c-latein'],
    titel: 'Bibel für alle', text: 'Jeder soll die Bibel selbst lesen können.' },
  { id: 'k14', art: 'argument', station: 's7', bild: 'fig-marktfrau', typ: 'bibel', staerke: 3, seltenheit: 'selten', zieht: 1, staerkt: { gruppe: ['bibel'], plus: 1 },
    titel: 'Dem Volk aufs Maul', text: 'Luther hört, wie die Leute auf dem Markt reden. So schreibt er seine Bibel.' }
];
