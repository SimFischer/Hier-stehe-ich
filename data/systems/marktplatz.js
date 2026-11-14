// Spielsystem „Der Marktplatz“ (Station 4). Alle Zahlen und Texte stehen hier, die Regeln in js/puzzles/marktplatz.js.
// pos: 0 = weit weg vom Kasten, 3 = kauft. Nach Runde 1 und 2 rücken alle Unentschlossenen einen Schritt vor.
export const marktplatz = {
  runden: 3, gespraecheJeRunde: 2, kaufenAb: 3, statisten: 4, kastenBild: 'ablasskasten',
  stufen: [{ ab: 0, stufe: 1 }, { ab: 3, stufe: 2 }, { ab: 5, stufe: 3 }],
  einleitung: 'Sechs Menschen, jeder mit einem eigenen Grund. Du hast drei Runden mit je zwei Gesprächen. Hör zu und antworte mit einer Karte.',
  glocke: 'Die Glocke schlägt. Tetzel predigt weiter. Wer noch unentschlossen ist, rückt näher an den Kasten.',
  nahAmKasten: 'nah am Kasten',
  figuren: [
    { id: 'baeuerin', start: 1,
      anliegen: 'Meine Mutter ist im Winter gestorben. Ich will sie aus dem Fegefeuer holen. Drei Groschen habe ich.',
      ja: { w3: 'Es liegt bei Gott, sagst du? Dann kann der Kasten es nicht versprechen.',
            k4: 'Ein Vater, der entgegenläuft. Dann ist Mutter bei ihm gut aufgehoben.' },
      nein: 'Das mag sein. Aber es hilft meiner Mutter nicht.' },
    { id: 'kaufmann', start: 0,
      anliegen: 'Ich habe gerechnet. Eine Wallfahrt nach Rom kostet mich Monate. Der Brief kostet einen Gulden. Ein gutes Geschäft.',
      ja: { w1: 'Moment. Die Hälfte tilgt die Schulden des Erzbischofs? Das ist kein Geschäft für meine Seele.' },
      nein: 'Schöne Worte. Aber meine Rechnung stimmt trotzdem.' },
    { id: 'pilger', start: 1,
      anliegen: 'Du schon wieder! Wir kennen uns aus der Kirche. Meine Angst vor dem Gericht ist nicht kleiner geworden.',
      ja: { k3: 'Geschenkt? Nicht verdient? So habe ich das noch nie gehört.',
            k4: 'Ein Vater, kein Richter. Darüber muss ich nachdenken.' },
      nein: 'Das nimmt mir die Angst nicht.' },
    { id: 'junge', start: 2,
      anliegen: 'Ich hab am Sonntag was vor. Wenn ich jetzt den Brief kaufe, ist es schon vergeben. Oder?',
      ja: { w2: 'Ohne Reue gilt er nicht? Im Voraus bereuen geht ja schlecht. Mist.' },
      nein: 'Hä? Was hat das mit meinem Plan zu tun?' },
    { id: 'geselle', start: 0,
      anliegen: 'In Wittenberg ist das verboten. Darum sind wir alle hergelaufen. Wenn alle kaufen, kaufe ich auch.',
      ja: { k2: 'Stimmt schon. Mein Meister spendet ständig und schläft trotzdem schlecht.',
            w1: 'Unser Geld geht an ein Bankhaus? Davon hat keiner etwas gesagt.' },
      nein: 'Kann sein. Aber die anderen kaufen doch auch.' },
    { id: 'witwe', start: 1,
      anliegen: 'Das ist mein letztes Geld. Aber was soll ich im Alter damit? Besser, es rettet meine Seele.',
      ja: { w1: 'Für Schulden und einen Dom in Rom? Dann behalte ich mein Brot.',
            k3: 'Wenn Gott schenkt, braucht er meine letzten Münzen nicht.' },
      nein: 'Ach, Kind. Ich bin alt. Ich will sicher sein.' }
  ],
  // Karten, die bei niemandem passen, bekommen eine eigene Erklärung.
  sonderNein: { k1: 'Ein strenger Richter? Eben! Genau darum kaufe ich ja.' },
  auswertung: {
    1: 'Der Kasten ist schwer geworden. Die Angst der Leute war stärker als deine Worte. Jetzt weißt du, wie ernst diese Angst ist.',
    2: 'Einige sind ins Grübeln gekommen, andere haben gekauft. So war es wohl auch damals.',
    3: 'Fast alle denken nach. Du hast ihre Sorgen ernst genommen und die passenden Gründe gefunden.'
  }
};
