// Spielsystem „Das Verhör“ (Station 6). Regeln in js/puzzles/verhoer.js.
// Die Einwände des Sprechers sind nacherzählt, keine wörtlichen Zitate.
// Jeder Einwand ist eine Karte mit Stärke und Art. Deine Karte zählt: Stärke + Bonus gegen diese Art (data/cards.js).
// Mehr als die Einwandstärke: Treffer. Gleich: Unentschieden. Weniger: Der Einwand bleibt stehen.
// antworten: Rückmeldung zu einzelnen Karten. sonst: Rückmeldung für alle anderen.
export const verhoer = {
  handGroesse: 5, punkteGut: 2, punkteHalb: 1, saalFiguren: 12,
  stufen: [{ ab: 0, stufe: 1 }, { ab: 3, stufe: 2 }, { ab: 6, stufe: 3 }],
  deckEinleitung: 'Morgen spielt der Sprecher des Kaisers vier Einwände gegen Luther aus, jeder mit Stärke 4. Wähle fünf Karten für deine Hand. Achte auf „Stark gegen“: Papst, Konzil, Ordnung und Mehrheit.',
  duellEinleitung: 'Der Sprecher legt einen Einwand auf den Tisch. Spiele die Karte, die ihn entkräftet.',
  erinnerung: 'Dir fehlt eine These? Erinnere dich: Beantworte eine Frage dazu, dann liegt die Karte bereit.',
  einwaende: [
    { id: 'papst', art: 'papst', staerke: 4, bild: 'fig-stand-4', titel: 'Der Papst entscheidet', text: 'Martin Luther! Was der rechte Glaube ist, entscheidet der Papst. So war es immer. Mit welchem Recht widersprichst du?',
      antworten: { k5: 'Das trifft. Über den Glauben entscheidet die Bibel, nicht ein Mensch. Einige Fürsten nicken.', t86: 'Der Reichtum des Papstes ärgert viele im Saal. Aber die Frage war: Wer entscheidet über den Glauben?' },
      sonst: 'Das beantwortet nicht, wer über den Glauben entscheidet. Der Saal bleibt kühl.' },
    { id: 'konzil', art: 'konzil', staerke: 4, bild: 'fig-stand-3', titel: 'Die Konzilien haben entschieden', text: 'Über diese Fragen haben Konzilien längst entschieden. Hunderte Bischöfe! Willst du klüger sein als sie alle?',
      antworten: { k9: 'Ein starker Punkt. Konzilien haben einander widersprochen. Also können sie irren. Unruhe im Saal.', k5: 'Die Bibel als Maßstab passt auch hier. Doch der Sprecher hakt nach: Und wer legt sie aus?' },
      sonst: 'Das sagt nichts darüber, ob Konzilien irren können. Der Sprecher lächelt.' },
    { id: 'ordnung', art: 'ordnung', staerke: 4, bild: 'fig-kaiser', titel: 'Du störst die Ordnung', text: 'Deine Bücher bringen Unruhe ins Reich. Du spaltest die Kirche. Ist dir die Ordnung nichts wert?',
      antworten: { k7: 'Das sitzt. Luther schrieb zuerst höflich an seinen Erzbischof. Er wollte erneuern, nicht spalten.', t43: 'Den Armen helfen statt Ablass kaufen: Das klingt nicht nach einem Unruhestifter. Die Sorge um die Ordnung bleibt aber.' },
      sonst: 'Das nimmt dem Vorwurf der Spaltung nichts. Einige Bischöfe schütteln den Kopf.' },
    { id: 'allein', art: 'mehrheit', staerke: 4, bild: 'fig-stand-1', titel: 'Du stehst allein', text: 'Du stehst allein gegen alle. Seit über tausend Jahren glauben Christen anders. Kann ein Einzelner recht haben?',
      antworten: { k8: 'Allein? Im ganzen Reich haben Menschen die Thesen gelesen. Viele im Saal wissen das genau.', k5: 'Nicht die Mehrheit entscheidet, sondern die Schrift. Ein guter Gedanke. Aber ist Luther wirklich allein?', k3: 'Gnade als Geschenk hat viele überzeugt. Den Vorwurf beantwortet das nur halb.' },
      sonst: 'Das zeigt nicht, dass Luther mit seiner Sicht nicht allein ist.' }
  ],
  auswertung: {
    1: 'Der Saal blieb kühl. Die Vorwürfe waren schwer, und die Karten passten selten.',
    2: 'Manche im Saal sind nachdenklich geworden. Nicht jeder Einwand wurde entkräftet.',
    3: 'Viele im Saal sind beeindruckt. Auf jeden Vorwurf gab es eine Antwort mit Gewicht.'
  },
  urteil: 'Am Urteil ändert das nichts. Der Kaiser bleibt dabei: Luther soll bestraft werden. Gute Gründe schützen ihn nicht vor der Strafe.'
};
