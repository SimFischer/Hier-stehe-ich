// Bonusspiele: freiwillig, je höchstens fünf Minuten. „nach“ nennt die Station, nach der sie offen sind.
// Die Reihenfolge der IDs entspricht der Liste im Fortsetzungscode (js/engine/code.js).
export const bonus = {
  silben: {
    id: 'silben', titel: 'Silbenrätsel', nach: 's2', bild: 'kunst-k1', minuten: 3,
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
    id: 'presse', titel: 'Die Druckerpresse', nach: 's5', bild: 'kunst-k13', minuten: 3,
    kurz: 'Drucke in 45 Sekunden so viele Flugblätter wie möglich.',
    schritte: [
      { art: 'presse', titel: 'Die Druckerpresse', sekunden: 45,
        bilder: ['bonus-presse-teile-1', 'bonus-presse-teile-2', 'bonus-presse-teile-3', 'bonus-presse-teile-4'],
        anweisung: 'Ein Flugblatt braucht vier Handgriffe: einfärben, Bogen einlegen, pressen, abnehmen. Drücke immer dann, wenn der Zeiger im grünen Feld steht. Wie viele Blätter schaffst du in 45 Sekunden?',
        schritte: ['Einfärben', 'Bogen einlegen', 'Pressen', 'Abnehmen'],
        // Zeiger: Durchläufe pro Sekunde; Zone: Breite in Prozent. Beides wird mit jedem Blatt schwieriger.
        takt: { start: 0.55, plus: 0.05, max: 1.3 }, zone: { start: 30, minus: 2, min: 12 }, strafe: 2,
        start: 'Los!', knopf: 'Drücken!', fehldruck: 'Daneben! Der Bogen ist verdorben. Das kostet 2 Sekunden.',
        zaehler: 'Gedruckte Blätter: {n}', zeit: 'Noch {n} Sekunden', bestwert: 'Dein Bestwert: {n}', jetzt: 'Jetzt: {schritt}',
        ende: 'Die Zeit ist um. Du hast {n} Blätter gedruckt. Ein Schreiber mit der Feder hätte in dieser Zeit kaum eine Zeile geschafft. Darum war die Druckerpresse so wichtig.',
        hilfen: [
          'Warte, bis der Zeiger im grünen Feld ist. Dann tippe auf „Drücken!“ oder drücke die Leertaste.',
          'Nicht zu früh tippen. Lieber einmal abwarten, bis der Zeiger zurückkommt.',
          'Jeder Treffer ist ein Handgriff. Vier Treffer ergeben ein Blatt. Ein Fehler kostet zwei Sekunden.'
        ] }
    ]
  },
  entfuehrung: {
    id: 'entfuehrung', titel: 'Die Entführung', nach: 's6', bild: 'kunst-r4', minuten: 4,
    kurz: 'Bringe Luther ungesehen auf die Wartburg.',
    schritte: [
      { art: 'text', titel: 'Auf dem Heimweg',
        absaetze: [
          { text: 'Anfang Mai 1521. Luther ist auf dem Heimweg von Worms. Er ist vogelfrei: Jeder darf ihn gefangen nehmen.' },
          { text: 'Im Thüringer Wald halten Reiter seinen Wagen an. Es sieht aus wie ein Überfall. In Wahrheit schickt sie sein Kurfürst, Friedrich der Weise. Sie sollen Luther heimlich in Sicherheit bringen.' },
          { text: 'Du führst die Reiter. Niemand darf euch sehen.' }
        ] },
      { art: 'fahrt', titel: 'Durch den Wald',
        anweisung: 'Lenke den Wagen mit Luther auf den Waldwegen zur Wartburg. Die Spitzel reiten auf festen Wegen (gestrichelt). Bleib aus ihrem Blickfeld. Pfeiltasten oder Finger auf einen Weg halten.',
        // Welt 1600 × 1200, Wege und Burg sind im Bild (bonus-wald) gemalt und liegen genau auf diesen Strecken. Der Wagen fährt nur auf den Wegen (Strecken von Punkt zu Punkt, Breite in wegBreite).
        // Wachen reiten auf den Wegen hin und her oder stehen und schwenken den Blick.
        welt: { w: 1600, h: 1200, bild: 'bonus-wald', wegeImBild: true }, wagen: 'bonus-wagen', spitzel: 'bonus-reiter', burg: 'stadt-knoten',
        start: { x: 110, y: 598 }, ziel: { x: 1465, y: 598, r: 70 }, tempo: 170, wegBreite: 76,
        wege: [
          [[110, 598], [406, 598]], [[406, 598], [406, 252]], [[406, 598], [406, 938]],
          [[406, 252], [794, 252]], [[406, 598], [794, 598]], [[406, 938], [794, 938]],
          [[794, 252], [794, 598]], [[794, 598], [794, 938]],
          [[794, 252], [1190, 252]], [[794, 598], [1190, 598]], [[794, 938], [1190, 938]],
          [[1190, 252], [1190, 598]], [[1190, 598], [1190, 938]], [[1190, 598], [1420, 598]]
        ],
        rast: [{ x: 110, y: 598 }, { x: 406, y: 770 }, { x: 1000, y: 938 }, { x: 1350, y: 598 }],
        sicht: { weite: 230, winkel: 32 },
        wachen: [
          { weg: [[406, 598], [1050, 598]], tempo: 140 },
          { weg: [[794, 252], [794, 938]], tempo: 120 },
          { weg: [[1190, 252], [1190, 938]], tempo: 150 },
          { weg: [[406, 252], [1190, 252]], tempo: 110 }
        ],
        // Schwer: schnellere Spitzel mit weiterem Blick, ein Reiter im Süden, zwei Posten an den Kreuzungen im Osten
        // und nur zwei Rastplätze. Durch kommt, wer den Weg plant: über den Süden und dann durch die Mitte.
        schwer: {
          rast: [{ x: 110, y: 598 }, { x: 406, y: 770 }, { x: 1350, y: 598 }],
          sicht: { weite: 250, winkel: 34 },
          wachen: [
            { weg: [[406, 598], [1050, 598]], tempo: 175 },
            { weg: [[794, 252], [794, 938]], tempo: 150 },
            { weg: [[1190, 252], [1190, 938]], tempo: 188 },
            { weg: [[406, 252], [1190, 252]], tempo: 138 },
            { weg: [[450, 938], [1150, 938]], tempo: 110 },
            { posten: [1190, 938], von: 180, bis: 270, schwenk: 0.7 },
            { posten: [1190, 252], von: 90, bis: 180, schwenk: 0.6 }
          ]
        },
        stufeFrage: 'Wie schwer soll die Fahrt sein?',
        stufen: [
          { id: 'leicht', knopf: 'Leicht', kurz: 'Vier Spitzel, drei Rastplätze' },
          { id: 'schwer', knopf: 'Schwer', kurz: 'Sieben Spitzel und Posten, nur ein Rastplatz unterwegs' }
        ],
        stufeName: { leicht: 'Leicht', schwer: 'Schwer' },
        zeit: 'Zeit: {n} s', erwischt: 'Gesehen: {n}', bestwert: 'Bestzeit: {n} s', startKnopf: 'Los!',
        gesehen: 'Ein Spitzel hat euch gesehen! Zurück zum letzten Rastplatz.',
        rastErreicht: 'Rastplatz erreicht. Wer jetzt gesehen wird, beginnt hier.',
        ende: 'Geschafft! Die Zugbrücke geht hoch. Niemand weiß, wo Luther ist.',
        hilfen: [
          'Die gestrichelten Linien zeigen, wo die Spitzel reiten. Die roten Kegel zeigen, wohin sie schauen. Warte an einer Abzweigung, bis einer vorbei ist.',
          'Fahre hinter einem Spitzel her, dann sieht er dich nicht. Die hellen Kreise auf den Wegen sind Rastplätze.',
          'Nimm den unteren Weg: erst nach unten, dann nach rechts bis zur Ecke, dann nach oben und zur Burg. Warte jeweils, bis der Spitzel auf der Kreuzung weitergeritten ist.'
        ] },
      { art: 'text', titel: 'Junker Jörg',
        absaetze: [
          { text: 'Viele glauben nun, Luther sei tot. Auf der Wartburg lässt er Haare und Bart wachsen und nennt sich Junker Jörg. Zehn Monate bleibt er dort.' }
        ] }
    ]
  },
  lutherrose: {
    id: 'lutherrose', titel: 'Die Lutherrose', nach: 's7', bild: 'ruecken-luther', minuten: 3,
    kurz: 'Deute Luthers Wappen.',
    schritte: [
      { art: 'rose', titel: 'Die Rose zusammensetzen',
        anweisung: 'Setze Luthers Wappen zusammen: von außen nach innen. Tippe das Teil an, das als Nächstes kommt.',
        schichten: [
          { id: 'ring', bild: 'rose-5', label: 'Goldener Ring', groesse: 100 },
          { id: 'blau', bild: 'rose-4', label: 'Blaues Feld', groesse: 88 },
          { id: 'rose', bild: 'rose-3', label: 'Weiße Rose', groesse: 72 },
          { id: 'herz', bild: 'rose-2', label: 'Rotes Herz', groesse: 46 },
          { id: 'kreuz', bild: 'rose-1', label: 'Schwarzes Kreuz', groesse: 26 }
        ],
        falsch: 'Das liegt weiter innen. Was umschließt noch alles andere?',
        ende: 'Fertig. So sah Luthers Siegel aus.',
        hilfen: [
          'Ganz außen liegt das, was alles umschließt.',
          'Erst der Ring, dann das blaue Feld. In der Mitte liegt das Kreuz.',
          'Ring, blaues Feld, weiße Rose, rotes Herz, schwarzes Kreuz.'
        ] },
      { art: 'zuordnen', titel: 'Die Lutherrose', layout: 'liste', einzeln: true, stapel: true,
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
    id: 'gottesdienst', bild: 'kunst-r8', titel: 'Gottesdienst damals und danach', nach: 'f', minuten: 3,
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
          { id: 'i-predigt', text: 'Die Predigt steht im Mittelpunkt und erklärt die Bibel.', ziel: 'neu' },
          { id: 'i-chor', text: 'Es singen vor allem Priester und Chor.', ziel: 'alt' }
        ],
        hilfen: [
          'Luther wollte, dass alle verstehen, was im Gottesdienst geschieht.',
          'Deutsch statt Latein, und die Gemeinde macht selbst mit: Das ist neu.',
          'Um 1500: Latein, nur Brot, Priester und Chor singen. Evangelisch: deutsche Lieder, Brot und Wein, Predigt im Mittelpunkt.'
        ] },
      { art: 'wahl', frage: 'Was war Luther am Gottesdienst am wichtigsten?',
        optionen: [
          { text: 'Dass er möglichst kurz ist.', rueck: 'Um die Länge ging es Luther nicht.' },
          { text: 'Dass alle das Wort Gottes hören und verstehen.', richtig: true, rueck: 'Ja. Darum Deutsch, darum die Predigt, darum Lieder für alle.' },
          { text: 'Dass die Kirche prächtig geschmückt ist.', rueck: 'Schmuck war Luther nicht wichtig. Es kam ihm auf das Wort an.' }
        ] }
    ]
  }
};
