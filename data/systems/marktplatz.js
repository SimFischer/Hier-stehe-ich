// Spielsystem „Der Marktplatz“ (Station 4). Alle Zahlen und Texte stehen hier, die Regeln in js/puzzles/marktplatz.js.
// pos: 0 = weit weg vom Kasten, 3 = kauft. Nach Runde 1 und 2 rücken alle Unentschlossenen einen Schritt vor.
export const marktplatz = {
  runden: 3, gespraecheJeRunde: 2, kaufenAb: 3, statisten: 4, kastenBild: 'ablasskasten',
  stufen: [{ ab: 0, stufe: 1 }, { ab: 3, stufe: 2 }, { ab: 5, stufe: 3 }],
  einleitung: 'Sechs Menschen, jeder mit einem eigenen Grund. Du hast drei Runden mit je zwei Gesprächen. Hör zu und wähle eine Antwort.',
  glocke: 'Die Glocke schlägt. Wer noch unentschlossen ist, rückt näher an den Kasten.',
  nahAmKasten: 'nah am Kasten',
  // antworten: passt = die Person wird nachdenklich. rueck: was die Person darauf sagt.
  figuren: [
    { id: 'baeuerin', start: 1,
      anliegen: 'Meine Mutter ist im Winter gestorben. Ich will sie aus dem Fegefeuer holen. Drei Groschen habe ich.',
      antworten: [
        { text: 'Kauf lieber zwei Briefe, dann ist es ganz sicher.', rueck: 'Zwei? Ich habe doch nur drei Groschen.' },
        { text: 'Über deine Mutter entscheidet Gott, nicht ein Kasten.', passt: true, rueck: 'Es liegt bei Gott, sagst du? Dann kann der Kasten es nicht versprechen.' },
        { text: 'Gott ist streng. Da hilft nur bezahlen.', rueck: 'Das fürchte ich ja. Also zahle ich.' }
      ] },
    { id: 'kaufmann', start: 0,
      anliegen: 'Ich habe gerechnet. Eine Wallfahrt nach Rom kostet mich Monate. Der Brief kostet ein paar Gulden. Ein gutes Geschäft.',
      antworten: [
        { text: 'Stimmt, das ist wirklich günstig.', rueck: 'Eben. Ich kaufe gleich zwei.' },
        { text: 'Gott ist ein strenger Richter. Sei lieber sicher.', rueck: 'Ein strenger Richter? Genau darum kaufe ich ja.' },
        { text: 'Rechne nach, wohin dein Geld geht: an den Erzbischof, die Fugger und nach Rom.', passt: true, rueck: 'Moment. Die Hälfte tilgt die Schulden des Erzbischofs? Das ist kein Geschäft für meine Seele.' }
      ] },
    { id: 'pilger', start: 1,
      anliegen: 'Du schon wieder! Wir kennen uns aus der Kirche. Meine Angst vor dem Gericht ist nicht kleiner geworden.',
      antworten: [
        { text: 'Gnade kann man nicht verdienen. Gott schenkt sie.', passt: true, rueck: 'Geschenkt? Nicht verdient? So habe ich das noch nie gehört.' },
        { text: 'Geh noch eine Wallfahrt, dann reicht es bestimmt.', rueck: 'Noch eine? Meine Füße sind wund, und die Angst ist geblieben.' },
        { text: 'Kauf den Brief, dann hast du es schriftlich.', rueck: 'Ein Stück Papier gegen meine Angst? Ich weiß nicht.' }
      ] },
    { id: 'junge', start: 2,
      anliegen: 'Ich hab am Sonntag was vor. Wenn ich jetzt den Brief kaufe, ist es schon vergeben. Oder?',
      antworten: [
        { text: 'Gute Idee, dann bist du auf der sicheren Seite.', rueck: 'Siehst du! Ich wusste es.' },
        { text: 'Der Brief gilt nur für Erwachsene.', rueck: 'Das hab ich noch nie gehört. Erfindest du das gerade?' },
        { text: 'Ohne echte Reue hilft kein Brief.', passt: true, rueck: 'Ohne Reue gilt er nicht? Im Voraus bereuen geht ja schlecht. Mist.' }
      ] },
    { id: 'geselle', start: 0,
      anliegen: 'Bei uns in Wittenberg darf Tetzel nicht predigen. Darum sind wir alle hergelaufen. Wenn alle kaufen, kaufe ich auch.',
      antworten: [
        { text: 'Nur weil alle kaufen, ist es nicht richtig. Gute Werke allein bringen keinen Frieden.', passt: true, rueck: 'Stimmt schon. Mein Meister spendet ständig und schläft trotzdem schlecht.' },
        { text: 'Dann kauf eben auch einen.', rueck: 'Na also. Mitmachen ist einfacher.' },
        { text: 'Was in Wittenberg verboten ist, ist überall verboten.', rueck: 'Hier in Jüterbog aber nicht. Darum sind wir ja hier.' }
      ] },
    { id: 'witwe', start: 1,
      anliegen: 'Das ist mein letztes Geld. Aber was soll ich im Alter damit? Besser, es rettet meine Seele.',
      antworten: [
        { text: 'Gib alles, dann ist deine Seele sicher.', rueck: 'Ach, Kind. Genau das habe ich vor.' },
        { text: 'Gott braucht dein Geld nicht. Er schenkt seine Gnade.', passt: true, rueck: 'Wenn Gott schenkt, braucht er meine letzten Münzen nicht.' },
        { text: 'Kauf nur einen halben Brief.', rueck: 'Einen halben? So etwas gibt es doch gar nicht.' }
      ] }
  ],
  auswertung: {
    1: 'Der Kasten ist schwer geworden. Die Angst der Leute war stärker als deine Worte. Jetzt weißt du, wie ernst diese Angst ist.',
    2: 'Einige sind ins Grübeln gekommen, andere haben gekauft. So war es wohl auch damals.',
    3: 'Fast alle denken nach. Du hast ihre Sorgen ernst genommen und die passenden Gründe gefunden.'
  }
};
