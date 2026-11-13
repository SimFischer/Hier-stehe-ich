// Spielsystem „Die Druckwelle“ (Station 5). Regeln in js/puzzles/druckwelle.js.
// gelehrte/volk sind Gewichte ohne Einheit, keine historischen Einwohnerzahlen.
// x/y: Lage auf der Karte in Prozent. knoten: Handelsknoten, druckt nach und gibt die deutsche Fassung an alle Nachbarn weiter.
export const druckwelle = {
  runden: 6, boten: 3, start: 'wittenberg',
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
    { id: 'wittenberg', name: 'Wittenberg', x: 72, y: 22, gelehrte: 2, volk: 2 },
    { id: 'magdeburg', name: 'Magdeburg', x: 56, y: 14, gelehrte: 1, volk: 8 },
    { id: 'leipzig', name: 'Leipzig', x: 68, y: 38, gelehrte: 2, volk: 7, knoten: true },
    { id: 'erfurt', name: 'Erfurt', x: 50, y: 40, gelehrte: 2, volk: 8 },
    { id: 'nuernberg', name: 'Nürnberg', x: 56, y: 62, gelehrte: 1, volk: 14, knoten: true },
    { id: 'augsburg', name: 'Augsburg', x: 52, y: 82, gelehrte: 1, volk: 12 },
    { id: 'frankfurt', name: 'Frankfurt', x: 30, y: 50, gelehrte: 1, volk: 8 },
    { id: 'koeln', name: 'Köln', x: 14, y: 34, gelehrte: 2, volk: 14 },
    { id: 'strassburg', name: 'Straßburg', x: 22, y: 72, gelehrte: 1, volk: 10 },
    { id: 'basel', name: 'Basel', x: 26, y: 90, gelehrte: 2, volk: 6 }
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
