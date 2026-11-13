// Argumentebeutel. art: argument | wissen | these
// These-Karten: „alt“ ist eine eigene Übertragung aus dem Lateinischen, „text“ die Fassung in heutigem Deutsch.
export const cards = [
  { id: 'k1', art: 'argument', station: 's1', titel: 'Strenger Richter', text: 'Um 1500 galt Gott vielen als strenger Richter.' },
  { id: 'k2', art: 'argument', station: 's2', titel: 'Werke reichen nicht', text: 'Gute Werke allein bringen keinen Frieden mit Gott.' },
  { id: 'k3', art: 'argument', station: 's3', titel: 'Gnade ist ein Geschenk', text: 'Gott schenkt Gnade. Man kann sie nicht verdienen.' },
  { id: 'k4', art: 'argument', station: 's3', titel: 'Wie der Vater', text: 'Gott ist wie der Vater im Gleichnis: Er läuft dem Sohn entgegen.' },
  { id: 'k5', art: 'argument', station: 's3', titel: 'Maßstab Bibel', text: 'Die Bibel ist der Maßstab für den Glauben.' },
  { id: 'w1', art: 'wissen', station: 's4', titel: 'Weg des Geldes', text: 'Das Ablassgeld geht an Erzbischof Albrecht, das Bankhaus Fugger und den Petersdom.' },
  { id: 'w2', art: 'wissen', station: 's4', titel: 'Ohne Reue kein Erlass', text: 'Ohne echte Reue hilft kein Ablassbrief.' },
  { id: 'w3', art: 'wissen', station: 's4', titel: 'Gott entscheidet', text: 'Über die Verstorbenen entscheidet Gott allein.' },
  { id: 'k6', art: 'argument', station: 's4', titel: 'Nicht käuflich', text: 'Vergebung kann man nicht kaufen.' },
  { id: 't27', art: 'these', station: 's5', nr: 27, titel: 'These 27',
    alt: 'Menschenlehre predigt, wer sagt: Sobald die Münze im Kasten klingt, fliegt die Seele aus dem Fegefeuer.',
    text: 'Niemand kann eine Seele mit Geld freikaufen.',
    frage: { text: 'Worum ging es in These 27?', optionen: [
      { text: 'Niemand kann eine Seele mit Geld freikaufen.', richtig: true },
      { text: 'Münzen sollen aus Silber sein.' }, { text: 'Das Fegefeuer gibt es nicht.' }] } },
  { id: 't32', art: 'these', station: 's5', nr: 32, titel: 'These 32',
    alt: 'Wer glaubt, durch Ablassbriefe seines Heils sicher zu sein, wird mit seinen Lehrmeistern verdammt.',
    text: 'Wer sich auf den Brief verlässt, betrügt sich selbst.',
    frage: { text: 'Worum ging es in These 32?', optionen: [
      { text: 'Wer sich auf den Brief verlässt, betrügt sich selbst.', richtig: true },
      { text: 'Ablassbriefe müssen ordentlich gedruckt sein.' }, { text: 'Lehrer verdienen zu wenig.' }] } },
  { id: 't36', art: 'these', station: 's5', nr: 36, titel: 'These 36',
    alt: 'Jeder Christ, der wahrhaft bereut, hat vollen Erlass von Strafe und Schuld, auch ohne Ablassbrief.',
    text: 'Echte Reue genügt. Einen Brief braucht es nicht.',
    frage: { text: 'Worum ging es in These 36?', optionen: [
      { text: 'Echte Reue genügt. Einen Brief braucht es nicht.', richtig: true },
      { text: 'Nur der Papst kann vergeben.' }, { text: 'Strafen dürfen nie erlassen werden.' }] } },
  { id: 't43', art: 'these', station: 's5', nr: 43, titel: 'These 43',
    alt: 'Wer dem Armen gibt oder dem Bedürftigen leiht, handelt besser, als wer Ablass kauft.',
    text: 'Hilf lieber Menschen in Not, statt Ablass zu kaufen.',
    frage: { text: 'Worum ging es in These 43?', optionen: [
      { text: 'Hilf lieber Menschen in Not, statt Ablass zu kaufen.', richtig: true },
      { text: 'Arme sollen Ablass billiger bekommen.' }, { text: 'Geld verleihen ist Sünde.' }] } },
  { id: 't86', art: 'these', station: 's5', nr: 86, titel: 'These 86',
    alt: 'Warum baut der Papst, der reicher ist als die Reichsten, die Peterskirche nicht von seinem eigenen Geld?',
    text: 'Der Papst ist reich. Er soll seinen Dom selbst bezahlen.',
    frage: { text: 'Worum ging es in These 86?', optionen: [
      { text: 'Der Papst ist reich. Er soll seinen Dom selbst bezahlen.', richtig: true },
      { text: 'Der Petersdom soll kleiner werden.' }, { text: 'Arme sollen beim Bauen helfen.' }] } },
  { id: 'k7', art: 'argument', station: 's5', titel: 'Erneuern, nicht spalten', text: 'Luther will die Kirche erneuern, nicht spalten.' },
  { id: 'k8', art: 'argument', station: 's5', titel: 'Viele haben es gelesen', text: 'In wenigen Wochen kannte das ganze Reich die Thesen.' },
  { id: 'k9', art: 'argument', station: 's6', titel: 'Konzilien irren', text: 'Auch Konzilien können irren. Sie haben einander widersprochen.' },
  { id: 'k10', art: 'argument', station: 's6', titel: 'Gewissen', text: 'Mein Gewissen ist an Gottes Wort gebunden.' },
  { id: 'k11', art: 'argument', station: 's7', titel: 'Bibel für alle', text: 'Jeder soll die Bibel selbst lesen können.' }
];
