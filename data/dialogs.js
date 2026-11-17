// Gespräche. wer: Schlüssel aus game.figuren ('erz' = Erzähltext, 'ich' = Spielfigur).
// Zeilen mit „wenn“ erscheinen nur, wenn die Bedingung erfüllt ist: So merken sich Figuren, was vorher geschah.
// Sätze echter Personen (Tetzel, Sprecher des Kaisers) sind Nacherzählung, keine Zitate.
export const dialogs = [
  { id: 'meister', zeilen: [
    { wer: 'meister', text: 'Da bist du ja. Sieh dir das an! Der Setzkasten liegt am Boden.' },
    { wer: 'meister', text: 'Ich soll eine Flugschrift drucken. Über Doktor Luther, von dem alle reden.' },
    { wer: 'meister', text: 'Aber sieben Druckplatten sind zerbrochen. Jede erzählte ein Stück von seinem Weg.' },
    { wer: 'ich', text: 'Und wer macht die neu?' },
    { wer: 'meister', text: 'Du. Geh dorthin, wo alles geschah. Frag die Leute und schau genau hin.' },
    { wer: 'meister', text: 'Für jeden Ort schneidest du eine neue Platte. Hier ist meine Karte.' }
  ] },
  { id: 'meister-zwischen', zeilen: [
    { wer: 'meister', wenn: { done: 'f' }, text: 'Gute Arbeit. Morgen drucken wir hundert Stück davon.' },
    { wer: 'meister', wenn: { done: 's7', nichtDone: 'f' }, text: 'Alle sieben Platten? Dann ran an den Setzkasten!' },
    { wer: 'meister', wenn: { nichtDone: 's7' }, text: 'Noch fehlen Platten. Die Presse wartet nicht ewig.' },
    { wer: 'meister', wenn: { nichtDone: 's7' }, text: 'Sieh auf die Karte. Und sammle gute Gründe, du wirst sie brauchen.' }
  ] },
  { id: 'pilger', zeilen: [
    { wer: 'pilger', text: 'Gott zum Gruß. Ich bin seit drei Wochen unterwegs.' },
    { wer: 'ich', text: 'Warum gehst du so weit?' },
    { wer: 'pilger', text: 'Aus Angst. Nach dem Tod wartet das Gericht. Gott sieht jede Sünde.' },
    { wer: 'pilger', text: 'Viele müssen erst ins Fegefeuer. Dort wird die Seele gereinigt. Das tut weh und dauert lange.' },
    { wer: 'pilger', text: 'Also pilgere ich, bete und spende.' },
    { wer: 'pilger', text: 'Das Bild dort zeigte den Weg der Seele. Hilfst du mir, es zu ordnen?' }
  ] },
  { id: 'mitbruder', zeilen: [
    { wer: 'mitbruder', text: 'Du suchst Bruder Martin? Er ist in der Kapelle. Schon wieder.' },
    { wer: 'mitbruder', text: 'Alle erzählen vom Gewitter. Aber ich glaube, er rang schon vorher mit Gott.' },
    { wer: 'mitbruder', text: 'Er will alles richtig machen. Er fastet, wacht und beichtet stundenlang.' },
    { wer: 'mitbruder', text: 'Trotzdem findet er keine Ruhe. Immer fragt er: Reicht das vor Gott?' },
    { wer: 'mitbruder', text: 'Komm, ich zeige es dir. Dort steht eine Waage.' }
  ] },
  { id: 'kaplan', zeilen: [
    { wer: 'kaplan', text: 'Ich bin Kaplan in dieser Stadt. Mir ist nicht wohl bei dem Lärm.' },
    { wer: 'kaplan', text: 'Die Kirche lehrt: Wir dürfen für die Toten beten.' },
    { wer: 'kaplan', text: 'Aber wann eine Seele frei wird, liegt bei Gott. Nicht bei einer Münze.', gibt: 'w3' }
  ] },
  { id: 'tetzel-auswertung', zeilen: [
    { wer: 'tetzel', text: 'Ich habe den Ablass nicht erfunden. Papst und Erzbischof haben mich beauftragt.' },
    { wer: 'tetzel', text: 'Die Menschen haben Angst um ihre Toten. Ich gebe ihnen etwas in die Hand.' },
    { wer: 'tetzel', text: 'Und das Geld baut die Kirche des heiligen Petrus. Ist das etwa schlecht?' },
    { wer: 'erz', text: 'Tetzel glaubt, was er sagt. Luther sieht es anders: Der Brief wiegt die Menschen in falscher Sicherheit.' },
    { wer: 'erz', text: 'Tetzel mustert dich. Vor allen Leuten will er zeigen, wer die besseren Argumente hat.' }
  ] },
  { id: 'baeuerin-finale', zeilen: [
    { wer: 'erz', text: 'Die Tür geht auf. Eine Bäuerin tritt ein. Du kennst sie vom Markt in Jüterbog.' },
    { wer: 'baeuerin', wenn: { rat: 'behalten' }, text: 'Ich habe die Groschen behalten. Ich bete jeden Abend für Mutter. Mir ist leichter.' },
    { wer: 'baeuerin', wenn: { rat: 'armen' }, text: 'Ich habe das Geld der Nachbarin gegeben. Ihr Mann ist krank. Es fühlte sich richtig an.' },
    { wer: 'baeuerin', wenn: { rat: 'kaufen' }, text: 'Ich habe den Brief gekauft. Ruhig bin ich davon nicht geworden.' },
    { wer: 'baeuerin', wenn: { rat: '' }, text: 'Ich habe lange überlegt, was ich mit den Groschen tun soll.' },
    { wer: 'baeuerin', text: 'Jetzt will ich wissen, was dieser Luther sagt. Druckst du mir ein Blatt, das ich verstehe?' }
  ] },
  { id: 'meister-finale', zeilen: [
    { wer: 'meister', text: 'Sieben Platten. Das hätte ich dir nicht zugetraut.' },
    { wer: 'meister', wenn: { stufe: { markt: 3 } }, text: 'In Jüterbog hast du den Leuten gut zugehört, sagt man.' },
    { wer: 'meister', wenn: { stufe: { markt: [0, 1] } }, text: 'In Jüterbog war die Angst stärker als deine Worte. So ist das mit der Angst.' },
    { wer: 'meister', wenn: { stufe: { druck: 3 } }, text: 'Und die Thesen liefen durchs Reich wie ein Feuer. Auf Deutsch, versteht sich.' },
    { wer: 'meister', wenn: { stufe: { druck: [0, 1] } }, text: 'Merk dir für unser Handwerk: Latein lesen nur die Gelehrten.' },
    { wer: 'meister', wenn: { stufe: { verhoer: 3 } }, text: 'In Worms hattest du die richtigen Gründe zur Hand.' },
    { wer: 'meister', text: 'Jetzt setz deine eigene Flugschrift. Kurz muss sie sein, und jeder soll sie verstehen.' }
  ] }
];
