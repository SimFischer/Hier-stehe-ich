// Spielsystem „Die Druckwelle“ (Station 5). Regeln in js/puzzles/druckwelle.js.
// Ablauf: Woche 1 gibt es die Thesen nur auf Latein, ab Woche 2 Luthers deutsche Schrift. Druckereien drucken nach
// und schicken am Wochenende von selbst an alle Nachbarn weiter (Kettenreaktion). Ab Woche 3 kündigt die Kirche
// jede Woche ein Verbot an. Wer die Stadt vorher erreicht, ist schneller: Gedrucktes lässt sich nicht mehr einsammeln.
// gelehrte/volk sind Gewichte ohne Einheit, keine historischen Einwohnerzahlen (siehe docs/FACHPRUEFUNG.md).
// x/y: Lage in Prozent der ganzen Karte karte-reich (aus den Geodaten). Gezeigt wird der Ausschnitt unten. oben: Name über dem Punkt.
// versatz: Der Punkt wird in der Anzeige etwas verschoben, damit eng benachbarte Städte antippbar bleiben.
export const druckwelle = {
  runden: 6, boten: 2, start: 'wittenberg', kircheAb: 3, verboteJeWoche: 2,
  // Setzen braucht Zeit: Eine Druckerei druckt erst eine Woche, nachdem die deutschen Blätter angekommen sind.
  setzen: 1,
  sprachen: ['latein', 'deutsch', 'deutsch', 'deutsch', 'deutsch', 'deutsch'],
  // Nach so vielen Wochen mit deutschen Blättern redet in einer Stadt jeder davon.
  volkStufen: 3,
  karte: { bild: 'karte-reich', ausschnitt: { x: 16, y: 34, b: 54 } },
  stufen: [{ ab: 0, stufe: 1 }, { ab: 60, stufe: 2 }, { ab: 90, stufe: 3 }],

  // Kurze Texte für die Ansicht
  text: {
    woche: 'Woche {n} von {von}', boten: 'Boten', leser: 'Von 100 Menschen kennen {n} die Thesen',
    gelehrte: 'nur Gelehrte (Latein)', alle: 'alle (Deutsch)',
    zielLatein: 'Tippe eine leuchtende Stadt an. Ein Bote bringt die Thesen hin.',
    zielDeutsch: 'Tippe leuchtende Städte an. Bring die deutschen Blätter zu den Druckereien!',
    keineBoten: 'Deine Boten sind unterwegs. Beende die Woche und schau, was passiert.',
    wocheEnde: 'Woche beenden', weiter: 'Weiter',
    legende: { druckerei: 'Druckerei: setzt eine Woche lang, dann druckt sie nach und schickt weiter', latein: 'Latein: nur die Gelehrten lesen mit', deutsch: 'Deutsch: alle reden mit', verbot: 'Verbot: hier ist es zu spät' },
    druckerei: 'Druckerei', setzt: 'setzt die Lettern', droht: 'Verbot droht', zuSpaetKurz: 'zu spät!',
    zustand: { kein: 'noch ohne Thesen', latein: 'die Gelehrten lesen Latein', deutsch: 'alle reden mit', verbot: 'verboten' },
    sprache: { latein: 'Latein', deutsch: 'Deutsch' }, bote: 'Bote', ende: 'So weit kamen die Thesen', nachLatein: 'nach Woche 1 (Latein)', amEnde: 'am Ende',
    zuWeit: '{stadt} ist zu weit weg. Boten laufen nur in Nachbarstädte von Orten, die die Thesen schon kennen.',
    schonDa: 'In {stadt} sind die Thesen schon.', schonLatein: 'In {stadt} lesen die Gelehrten schon mit. Jetzt fehlt die deutsche Fassung.',
    istGesperrt: 'In {stadt} hat die Kirche die Schriften verboten.',
    gedruckt: 'Die Druckereien haben nachgedruckt: neu in {orte}.', setztNoch: 'Die Druckereien setzen noch die Lettern. Nächste Woche drucken sie nach.',
    verbot: 'Verbot in {orte}! Dort kommen die Blätter nicht mehr hin.', zuSpaet: 'Zu spät für ein Verbot in {orte}: Die Blätter sind schon da.',
    drohtText: 'Die Kirche will die Schriften in {orte} verbieten. Bist du vor dem Wochenende dort, ist es zu spät dafür.'
  },
  // Zwischenkarten beim Wechsel der Phase
  phasen: {
    latein: { titel: 'Woche 1: Die Thesen auf Latein', text: 'Luther hat seine Thesen auf Latein geschrieben, in der Sprache der Gelehrten. Schick deine zwei Boten los und schau, wer sie lesen kann.' },
    deutsch: { titel: 'Luther schreibt auf Deutsch', text: 'Im Frühjahr 1518 erscheint Luthers „Sermon von Ablass und Gnade“ auf Deutsch. Jetzt kann jeder mitreden. Und wo eine Druckerei die Blätter bekommt, druckt sie nach und schickt sie weiter.' },
    kirche: { titel: 'Die Kirche wehrt sich', text: 'Die Kirche will Luthers Schriften verbieten. Jede Woche droht in zwei Städten ein Verbot. Bring die Blätter vorher hin: Was gedruckt und verteilt ist, kann niemand mehr einsammeln.' }
  },
  staedte: [
    { id: 'wittenberg', name: 'Wittenberg', x: 60.98, y: 44.63, oben: true, versatz: [5, -8], gelehrte: 2, volk: 3, druckerei: true },
    { id: 'magdeburg', name: 'Magdeburg', x: 54.28, y: 42.33, oben: true, versatz: [-5, -5], gelehrte: 1, volk: 7 },
    { id: 'leipzig', name: 'Leipzig', x: 59.19, y: 49.21, versatz: [3, 6], gelehrte: 2, volk: 7, druckerei: true },
    { id: 'erfurt', name: 'Erfurt', x: 50.19, y: 52.37, gelehrte: 2, volk: 7 },
    { id: 'nuernberg', name: 'Nürnberg', x: 50.52, y: 65.64, gelehrte: 1, volk: 13, druckerei: true },
    { id: 'augsburg', name: 'Augsburg', x: 49.32, y: 75.08, gelehrte: 1, volk: 12, druckerei: true },
    { id: 'frankfurt', name: 'Frankfurt', x: 34.51, y: 59.92, gelehrte: 1, volk: 9, druckerei: true },
    { id: 'koeln', name: 'Köln', x: 23, y: 52.71, gelehrte: 2, volk: 13 },
    { id: 'strassburg', name: 'Straßburg', x: 28.29, y: 73.2, gelehrte: 1, volk: 10, druckerei: true },
    { id: 'basel', name: 'Basel', x: 27.2, y: 82.14, gelehrte: 2, volk: 6, druckerei: true }
  ],
  wege: [
    ['wittenberg', 'leipzig'], ['wittenberg', 'magdeburg'], ['leipzig', 'magdeburg'], ['leipzig', 'erfurt'],
    ['erfurt', 'frankfurt'], ['erfurt', 'nuernberg'], ['nuernberg', 'augsburg'],
    ['nuernberg', 'frankfurt'], ['frankfurt', 'koeln'], ['frankfurt', 'strassburg'], ['strassburg', 'basel'], ['augsburg', 'basel']
  ],
  auswertung: {
    1: 'Die Gelehrten streiten, aber auf den Märkten weiß kaum jemand davon. Die Kirche konnte die Sache noch klein halten.',
    2: 'In vielen Städten reden die Leute über die Thesen. Wo deutsche Blätter in eine Druckerei kamen, ging es von selbst weiter.',
    3: 'Das ganze Reich redet von Luther. Druckerpresse und deutsche Sprache waren schneller als jedes Verbot.'
  },
  // Was die Runde gezeigt hat: Latein gegen Deutsch, Verbote gegen Druck
  vergleich: 'Nach der Woche auf Latein kannten {latein} von 100 Menschen die Thesen. Am Ende waren es {ende}.',
  verbote: 'Die Kirche hat {verboten} Städte rechtzeitig gesperrt. {zuSpaet}-mal kam ihr Verbot zu spät.',
  lehre: 'Latein lasen nur die Gelehrten. Deutsch verstand jeder, und jede Druckerei machte aus einem Blatt viele.',
  reaktion: 'In Rom und am Hof des Kaisers heißt es bald: Das können wir nicht mehr übergehen.'
};
