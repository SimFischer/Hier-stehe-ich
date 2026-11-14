// Spielsystem „Die Druckwelle“ (Station 5). Regeln in js/puzzles/druckwelle.js.
// gelehrte/volk sind Gewichte ohne Einheit, keine historischen Einwohnerzahlen.
// x/y: Lage in Prozent der ganzen Karte karte-reich (aus den Geodaten). Gezeigt wird der Ausschnitt unten. oben: Name über dem Punkt.
// versatz: Der Punkt wird in der Anzeige etwas verschoben, damit eng benachbarte Städte antippbar bleiben.
// knoten: Handelsknoten, druckt nach und gibt die deutsche Fassung an alle Nachbarn weiter.
export const druckwelle = {
  runden: 6, boten: 3, start: 'wittenberg',
  karte: { bild: 'karte-reich', ausschnitt: { x: 16, y: 34, b: 54 } },
  deutschJeRunde: [1, 1, 1, 1, 1, 1],
  // Nach so vielen Wochen hat in einer deutschen Stadt jeder davon gehört.
  volkStufen: 4,
  // An wie viele Nachbarn eine deutsche Stadt am Wochenende weitergibt.
  weiter: { knoten: 9, klein: 0 },
  stufen: [{ ab: 0, stufe: 1 }, { ab: 50, stufe: 2 }, { ab: 90, stufe: 3 }],
  einleitung: 'Jetzt verteilst du die Thesen: sechs Wochen, drei Boten pro Woche. Ein Bote läuft von einer Stadt mit Thesen in eine Nachbarstadt.',
  regeln: [
    'Latein: Nur die Gelehrten der Stadt lesen mit.',
    'Deutsch: Alle verstehen es. Jede Woche hören mehr Leute davon.',
    'Knotenpunkte (eckig) drucken Deutsches nach und beliefern alle Nachbarn.',
    'Pro Woche ist nur ein deutsches Blatt fertig.'
  ],
  staedte: [
    { id: 'wittenberg', name: 'Wittenberg', x: 60.98, y: 44.63, oben: true, versatz: [5, -8], gelehrte: 2, volk: 2 },
    { id: 'magdeburg', name: 'Magdeburg', x: 54.28, y: 42.33, oben: true, versatz: [-5, -5], gelehrte: 1, volk: 8 },
    { id: 'leipzig', name: 'Leipzig', x: 59.19, y: 49.21, versatz: [3, 6], gelehrte: 2, volk: 7, knoten: true },
    { id: 'erfurt', name: 'Erfurt', x: 50.19, y: 52.37, gelehrte: 2, volk: 8 },
    { id: 'nuernberg', name: 'Nürnberg', x: 50.52, y: 65.64, gelehrte: 1, volk: 14, knoten: true },
    { id: 'augsburg', name: 'Augsburg', x: 49.32, y: 75.08, gelehrte: 1, volk: 12 },
    { id: 'frankfurt', name: 'Frankfurt', x: 34.51, y: 59.92, gelehrte: 1, volk: 8 },
    { id: 'koeln', name: 'Köln', x: 23, y: 52.71, gelehrte: 2, volk: 14 },
    { id: 'strassburg', name: 'Straßburg', x: 28.29, y: 73.2, gelehrte: 1, volk: 10 },
    { id: 'basel', name: 'Basel', x: 27.2, y: 82.14, gelehrte: 2, volk: 6 }
  ],
  wege: [
    ['wittenberg', 'leipzig'], ['wittenberg', 'magdeburg'], ['leipzig', 'magdeburg'], ['leipzig', 'erfurt'],
    ['erfurt', 'frankfurt'], ['erfurt', 'nuernberg'], ['nuernberg', 'augsburg'],
    ['nuernberg', 'frankfurt'], ['frankfurt', 'koeln'], ['frankfurt', 'strassburg'], ['strassburg', 'basel'], ['augsburg', 'basel']
  ],
  wochenende: 'Die Woche ist um. Wo deutsche Blätter liegen, spricht es sich herum. Die Knotenpunkte drucken nach.',
  auswertung: {
    1: 'Die Gelehrten streiten, aber auf den Märkten weiß kaum jemand davon. Auf Latein blieb die Sache klein.',
    2: 'In vielen Städten reden die Leute über die Thesen. Wo deutsche Blätter ankamen, ging es wie von selbst weiter.',
    3: 'Das ganze Reich redet von Luther. Druckerpresse und deutsche Sprache haben die Thesen überallhin getragen.'
  },
  reaktion: 'In Rom und am Hof des Kaisers heißt es bald: Das können wir nicht mehr übergehen.',
  vergleich: 'In {latein} Städten lasen nur die Gelehrten mit. In {deutsch} Städten redeten bald alle darüber.'
};
