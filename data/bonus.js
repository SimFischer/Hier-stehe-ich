// Bonusspiele: freiwillig, je höchstens fünf Minuten. „nach“ nennt die Station, nach der sie offen sind.
// Die Reihenfolge der IDs entspricht der Liste im Fortsetzungscode (js/engine/code.js).
export const bonus = {
  silben: {
    id: 'silben', titel: 'Silbenrätsel', nach: 's2', minuten: 3,
    kurz: 'Setze sechs Wörter aus Silben zusammen.',
    schritte: [
      { art: 'silben', titel: 'Silbenrätsel',
        anweisung: 'Beantworte jede Frage, indem du die Silben in der richtigen Reihenfolge antippst.',
        fragen: [
          { frage: 'In welcher Stadt trat Luther ins Kloster ein?', silben: ['Er', 'furt'] },
          { frage: 'Bei welchem Dorf geriet er ins Gewitter?', silben: ['Stot', 'tern', 'heim'] },
          { frage: 'Zu welchem Orden gehörte sein Kloster?', silben: ['Au', 'gus', 'ti', 'ner'] },
          { frage: 'Welche Heilige rief er im Gewitter an?', silben: ['An', 'na'] },
          { frage: 'Wie heißt der Ort, an dem die Seele gereinigt werden sollte?', silben: ['Fe', 'ge', 'feu', 'er'] },
          { frage: 'Was schenkt Gott, ohne dass man es verdient?', silben: ['Gna', 'de'] }
        ],
        falsch: 'Diese Silbe passt hier nicht. Das Wort beginnt von vorn.',
        ende: 'Alle sechs Wörter stehen. Du kennst dich aus.',
        hilfen: [
          'Sprich die Antwort leise vor dich hin und klatsche die Silben.',
          'Die Antworten sind: eine Stadt in Thüringen, ein Dorf mit drei Silben, ein Mönchsorden, ein kurzer Name, ein Ort mit Feuer, ein Geschenk.',
          'Erfurt, Stotternheim, Augustiner, Anna, Fegefeuer, Gnade.'
        ] }
    ]
  },
  presse: {
    id: 'presse', titel: 'Die Druckerpresse', nach: 's5', minuten: 3,
    kurz: 'Drucke in 45 Sekunden so viele Flugblätter wie möglich.',
    schritte: [
      { art: 'presse', titel: 'Die Druckerpresse', sekunden: 45,
        bilder: ['bonus-presse-teile-1', 'bonus-presse-teile-2', 'bonus-presse-teile-3', 'bonus-presse-teile-4'],
        anweisung: 'Ein Flugblatt braucht vier Handgriffe, immer in derselben Reihenfolge. Wie viele Blätter schaffst du in 45 Sekunden?',
        handgriffe: [
          { id: 'farbe', label: 'Einfärben' }, { id: 'bogen', label: 'Bogen einlegen' },
          { id: 'druck', label: 'Pressen' }, { id: 'ab', label: 'Abnehmen' }
        ],
        start: 'Los!', fehldruck: 'Fehldruck! Der Bogen ist verdorben. Fang wieder beim Einfärben an.',
        zaehler: 'Gedruckte Blätter: {n}', zeit: 'Noch {n} Sekunden',
        ende: 'Die Zeit ist um. Du hast {n} Blätter gedruckt. Mit der Feder hätte ein Schreiber in dieser Zeit kaum eine Zeile geschafft. Darum war die Druckerpresse so wichtig.',
        hilfen: [
          'Die Reihenfolge ist immer gleich. Lies die Knöpfe von links nach rechts.',
          'Erst kommt Farbe auf die Lettern, dann das Papier. Zum Schluss nimmst du das Blatt ab.',
          'Einfärben, Bogen einlegen, Pressen, Abnehmen. Und wieder von vorn.'
        ] }
    ]
  },
  entfuehrung: {
    id: 'entfuehrung', titel: 'Die Entführung', nach: 's6', minuten: 4,
    kurz: 'Bringe Luther ungesehen auf die Wartburg.',
    schritte: [
      { art: 'text', titel: 'Auf dem Heimweg',
        absaetze: [
          { text: 'Anfang Mai 1521. Luther ist auf dem Heimweg von Worms. Er ist vogelfrei: Jeder darf ihn gefangen nehmen.' },
          { text: 'Im Thüringer Wald halten Reiter seinen Wagen an. Es sieht aus wie ein Überfall. In Wahrheit schickt sie sein Kurfürst, Friedrich der Weise. Sie sollen Luther heimlich in Sicherheit bringen.' },
          { text: 'Du führst die Reiter. Niemand darf euch sehen.' }
        ] },
      { art: 'weg', titel: 'Durch den Wald', maxZuege: 16,
        anweisung: 'Tippe ein Nachbarfeld an, um weiterzureiten. Meide die Dörfer und erreiche die Burg, bevor es hell wird.',
        // S Start, Z Wartburg, W dichter Wald (kein Durchkommen), D Dorf (dort wird man gesehen), . Weg
        karte: ['S..W....', '.W.D.W..', '.W...WD.', '..DW....', 'W....W.Z'],
        legende: { S: 'Überfall', Z: 'Wartburg', W: 'Dickicht', D: 'Dorf', R: 'Reiter' },
        zuege: 'Schritte: {n} von {von}',
        gesehen: 'Hunde bellen, ein Fenster geht auf. Man hat euch gesehen. Zurück und noch einmal.',
        zuSpaet: 'Der Morgen graut, und ihr seid noch unterwegs. Versucht es noch einmal.',
        ende: 'Geschafft. Die Zugbrücke geht hoch. Niemand weiß, wo Luther ist.',
        hilfen: [
          'Reite nicht geradeaus. Zwischen Dickicht und Dörfern gibt es einen ruhigen Weg.',
          'Reite erst nach rechts, dann zwei Felder nach unten, dann weiter nach rechts.',
          'Zweimal rechts, zweimal runter, zweimal rechts, einmal runter, zweimal rechts, einmal runter, einmal rechts.'
        ] },
      { art: 'text', titel: 'Junker Jörg',
        absaetze: [
          { text: 'Viele glauben nun, Luther sei tot. Auf der Wartburg lässt er Haare und Bart wachsen und nennt sich Junker Jörg. Zehn Monate bleibt er dort.' }
        ] }
    ]
  },
  lutherrose: {
    id: 'lutherrose', titel: 'Die Lutherrose', nach: 's7', minuten: 3,
    kurz: 'Deute Luthers Wappen.',
    schritte: [
      { art: 'zuordnen', titel: 'Die Lutherrose', layout: 'liste', einzeln: true,
        anweisung: 'Die Lutherrose ist Luthers Wappen. Im Jahr 1530 hat er selbst erklärt, was die Teile bedeuten. Ordne zu.',
        falsch: 'Das gehört zu einem anderen Teil der Rose.',
        ziele: [
          { id: 'z-kreuz', label: 'Der Glaube an Jesus, der am Kreuz starb.' },
          { id: 'z-herz', label: 'Der Glaube sitzt im Herzen und macht es lebendig.' },
          { id: 'z-rose', label: 'Der Glaube schenkt Freude, Trost und Frieden.' },
          { id: 'z-blau', label: 'Diese Freude ist ein Anfang des Himmels.' },
          { id: 'z-ring', label: 'Das Glück bei Gott hat kein Ende und ist kostbar.' }
        ],
        items: [
          { id: 'i-ring', bild: 'rose-5', text: 'Goldener Ring', ziel: 'z-ring' },
          { id: 'i-kreuz', bild: 'rose-1', text: 'Schwarzes Kreuz', ziel: 'z-kreuz' },
          { id: 'i-blau', bild: 'rose-4', text: 'Blaues Feld', ziel: 'z-blau' },
          { id: 'i-herz', bild: 'rose-2', text: 'Rotes Herz', ziel: 'z-herz' },
          { id: 'i-rose', bild: 'rose-3', text: 'Weiße Rose', ziel: 'z-rose' }
        ],
        hilfen: [
          'Achte auf die Farben. Welche Farbe hat der Himmel? Was hat kein Ende?',
          'Ein Ring hat kein Ende. Blau ist die Farbe des Himmels. Weiß galt als Farbe der Engel.',
          'Kreuz: Glaube an Jesus. Herz: lebendiger Glaube. Rose: Freude und Frieden. Blau: Himmel. Ring: ohne Ende.'
        ] },
      { art: 'text', titel: 'Ein Zeichen bis heute',
        absaetze: [{ text: 'Die Lutherrose findest du bis heute an vielen evangelischen Kirchen und auf Gesangbüchern. Vielleicht entdeckst du sie auch in deiner Gemeinde.' }] }
    ]
  },
  gottesdienst: {
    id: 'gottesdienst', titel: 'Gottesdienst damals und danach', nach: 'f', minuten: 3,
    kurz: 'Was änderte sich im Gottesdienst durch die Reformation?',
    schritte: [
      { art: 'zuordnen', titel: 'Gottesdienst damals und danach', layout: 'zwei',
        anweisung: 'Durch die Reformation veränderte sich der Gottesdienst in den evangelischen Gemeinden. Was gehört wohin?',
        falsch: 'Das passt zur anderen Seite. Denk daran: Die Gemeinde soll verstehen und mitmachen.',
        ziele: [
          { id: 'alt', bild: 'bonus-gottesdienst-1500', label: 'Um 1500', unter: 'vor der Reformation' },
          { id: 'neu', bild: 'bonus-gottesdienst-1522', label: 'Evangelisch', unter: 'nach der Reformation' }
        ],
        items: [
          { id: 'i-latein', text: 'Die Sprache ist Latein.', ziel: 'alt' },
          { id: 'i-lieder', text: 'Die Gemeinde singt Lieder auf Deutsch.', ziel: 'neu' },
          { id: 'i-kelch', text: 'Beim Abendmahl bekommen alle Brot und Wein.', ziel: 'neu' },
          { id: 'i-brot', text: 'Die Gemeinde bekommt beim Abendmahl nur das Brot.', ziel: 'alt' },
          { id: 'i-predigt', text: 'Die Predigt erklärt die Bibel auf Deutsch.', ziel: 'neu' },
          { id: 'i-chor', text: 'Es singen vor allem Priester und Chor.', ziel: 'alt' }
        ],
        hilfen: [
          'Luther wollte, dass alle verstehen, was im Gottesdienst geschieht.',
          'Deutsch statt Latein, und die Gemeinde macht selbst mit: Das ist neu.',
          'Um 1500: Latein, nur Brot, Priester und Chor singen. Evangelisch: deutsche Lieder, Brot und Wein, Predigt auf Deutsch.'
        ] },
      { art: 'wahl', frage: 'Was war Luther am Gottesdienst am wichtigsten?',
        optionen: [
          { text: 'Dass er möglichst kurz ist.', rueck: 'Um die Länge ging es Luther nicht.' },
          { text: 'Dass alle das Wort Gottes hören und verstehen.', richtig: true, rueck: 'Ja. Darum Deutsch, darum die Predigt, darum Lieder für alle.' },
          { text: 'Dass die Kirche prächtig geschmückt ist.', rueck: 'Schmuck war Luther nicht wichtig. Es kam ihm auf das Wort an.' }
        ] }
    ]
  },
  reflexion: {
    id: 'reflexion', titel: 'Nachdenken', nach: 'f', minuten: 10, ohneMerker: true,
    kurz: 'Zwei Fragen zum Schluss, im Spiel oder auf Papier.',
    schritte: [
      { art: 'reflexion', titel: 'Nachdenken',
        anweisung: 'Zwei Fragen zum Schluss. Schreib hier oder auf Papier. Was du hier schreibst, wird nicht gespeichert.',
        fragen: [
          'Warum gibt es die evangelische Kirche? Erkläre es in drei Sätzen.',
          'Luther blieb bei dem, was er für richtig hielt. Wo würdest du heute sagen: „Hier stehe ich“?'
        ],
        platzhalter: 'Deine Gedanken …' }
    ]
  }
};
