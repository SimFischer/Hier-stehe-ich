// Aufbau des Spiels: Stationen, Reihenfolge, Druckplatten, Figuren.
// Alle Figuren außer Luther, Tetzel und dem Sprecher des Kaisers sind erfunden.
export const game = {
  titel: 'Hier stehe ich',
  untertitel: 'Ein Lehrling. Sieben Druckplatten. Ein Mönch, über den alle reden.',
  start: 'druckerei',
  stationen: [
    { id: 'p', nr: 0, name: 'Die Druckerei', ort: 'Wittenberg', zeit: 'Herbst 1522', szene: 'druckerei', minuten: 2, offen: [],
      fertigWenn: { flag: ['g:meister', 'h:druckerei.setzkasten'] },
      abschluss: 'Der Meister gibt dir seine Karte. Tippe oben auf „Karte“ und wähle einen Ort.' },
    { id: 's1', nr: 1, name: 'Eine Kirche um 1500', ort: 'Ein Dorf in Sachsen', zeit: 'um 1500', szene: 'kirche', raetsel: 'wandbild',
      karten: ['k1'], platte: 'Flamme', minuten: 3, offen: ['p'],
      abschluss: 'Du schneidest die erste Platte: eine Flamme. Sie steht für die Angst vor dem Fegefeuer.' },
    { id: 's2', nr: 2, name: 'Gewitter und Kloster', ort: 'Stotternheim und Erfurt', zeit: '1505', szene: 'stotternheim', raetsel: 'waage',
      karten: ['k2'], platte: 'Blitz', minuten: 5, offen: ['p'],
      abschluss: 'Die Platte mit dem Blitz ist fertig. Sie steht für Luthers Weg ins Kloster.' },
    { id: 's3', nr: 3, name: 'Das Turmzimmer', ort: 'Wittenberg', zeit: 'um 1515–1518', szene: 'turmzimmer', raetsel: 'standbild',
      karten: ['k3', 'k4', 'k5'], platte: 'Buch', minuten: 5, offen: ['s1', 's2'],
      abschluss: 'Die dritte Platte zeigt ein offenes Buch. In der Bibel fand Luther seine Antwort.' },
    { id: 's4', nr: 4, name: 'Der Markt von Jüterbog', ort: 'Jüterbog', zeit: '1517', szene: 'jueterbog', raetsel: 'marktplatz',
      karten: ['w1', 'w2', 'w3', 'k6'], platte: 'Münze', minuten: 6, offen: ['s3'],
      abschluss: 'Die Platte mit der Münze ist fertig. Luther hört von Jüterbog und greift zur Feder.' },
    { id: 's5', nr: 5, name: 'Die 95 Thesen', ort: 'Wittenberg', zeit: '31. Oktober 1517', szene: 'schreibstube', raetsel: 'druckwelle',
      karten: ['k7', 'k8'], platte: 'Feder', minuten: 6, offen: ['s4'],
      abschluss: 'Die Platte mit der Feder ist fertig. 1521 muss Luther sich vor dem Kaiser verantworten.' },
    { id: 's6', nr: 6, name: 'Vor Kaiser und Reich', ort: 'Worms', zeit: 'April 1521', szene: 'herberge', raetsel: 'verhoer',
      karten: ['k9', 'k10'], platte: 'Waage', minuten: 7, offen: ['s5'],
      abschluss: 'Auf dem Heimweg wird Luther zum Schein überfallen. Sein Kurfürst lässt ihn auf die Wartburg bringen. Dort ist er sicher.' },
    { id: 's7', nr: 7, name: 'Auf der Wartburg', ort: 'bei Eisenach', zeit: 'Winter 1521/22', szene: 'wartburg', raetsel: 'uebersetzung',
      karten: ['k11'], platte: 'Burg', minuten: 4, offen: ['s6'],
      abschluss: 'Im März 1522 kehrt Luther nach Wittenberg zurück. Im September erscheint sein Neues Testament. Alle sieben Platten sind da. Zurück in die Druckerei!' },
    { id: 'f', nr: 8, name: 'Die Flugschrift', ort: 'Wittenberg', zeit: 'Herbst 1522', szene: 'druckerei', raetsel: 'finale', minuten: 3, offen: ['s7'],
      abschluss: 'Deine Flugschrift ist gedruckt. Der Meister nickt. Das ist bei ihm ein großes Lob.' }
  ],
  // echt: historische Person. Ihre Sätze im Spiel sind nacherzählt und werden so gekennzeichnet.
  figuren: {
    erz: { name: '' },
    ich: { name: 'Du', farbe: '#3E5B45' },
    meister: { name: 'Meister', farbe: '#6B4A2B' },
    pilger: { name: 'Pilger', farbe: '#7A6A4F' },
    mitbruder: { name: 'Bruder Johannes', farbe: '#2B2622' },
    luther: { name: 'Martin Luther', farbe: '#1F1A17', echt: true },
    kaplan: { name: 'Kaplan', farbe: '#4A3F55' },
    tetzel: { name: 'Johann Tetzel', farbe: '#D8CDB8', echt: true },
    baeuerin: { name: 'Bäuerin', farbe: '#A6432E' },
    kaufmann: { name: 'Kaufmann', farbe: '#3F5870' },
    junge: { name: 'Junge', farbe: '#C8963E' },
    geselle: { name: 'Geselle', farbe: '#5E7350' },
    witwe: { name: 'Witwe', farbe: '#4B4640' },
    sprecher: { name: 'Sprecher des Kaisers', farbe: '#2F2A3A', echt: true },
    junker: { name: 'Junker Jörg', farbe: '#5A3B2A', echt: true },
    marktfrau: { name: 'Marktfrau', farbe: '#A6432E' },
    kind: { name: 'Kind', farbe: '#C8963E' },
    handwerker: { name: 'Zimmermann', farbe: '#6B4A2B' }
  },
  // Rechenwerte für die Zeitprüfung
  zeit: { woerterProMinute: 130 }
};
