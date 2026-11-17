// Spielsystem „Das Verhör“ (Station 6). Regeln in js/puzzles/verhoer.js.
// Die Einwände des Sprechers sind nacherzählt, keine wörtlichen Zitate.
export const verhoer = {
  handGroesse: 5, punkteGut: 2, punkteHalb: 1, saalFiguren: 12,
  stufen: [{ ab: 0, stufe: 1 }, { ab: 3, stufe: 2 }, { ab: 6, stufe: 3 }],
  deckEinleitung: 'Morgen stellt der Sprecher des Kaisers vier harte Fragen. Wähle fünf Karten für Luther. Überlege: Was wird man ihm vorwerfen?',
  erinnerung: 'Dir fehlt eine These? Erinnere dich: Beantworte eine Frage dazu, dann liegt die Karte bereit.',
  einwaende: [
    { id: 'papst', text: 'Martin Luther! Was der rechte Glaube ist, entscheidet der Papst. So war es immer. Mit welchem Recht widersprichst du?',
      gut: { k5: 'Das trifft. Über den Glauben entscheidet die Bibel, nicht ein Mensch. Einige Fürsten nicken.' },
      halb: { t86: 'Der Reichtum des Papstes ärgert viele im Saal. Aber die Frage war: Wer entscheidet über den Glauben?' },
      sonst: 'Das beantwortet nicht, wer über den Glauben entscheidet. Der Saal bleibt kühl.' },
    { id: 'konzil', text: 'Über diese Fragen haben Konzilien längst entschieden. Hunderte Bischöfe! Willst du klüger sein als sie alle?',
      gut: { k9: 'Ein starker Punkt. Konzilien haben einander widersprochen. Also können sie irren. Unruhe im Saal.' },
      halb: { k5: 'Die Bibel als Maßstab passt auch hier. Doch der Sprecher hakt nach: Und wer legt sie aus?' },
      sonst: 'Das sagt nichts darüber, ob Konzilien irren können. Der Sprecher lächelt.' },
    { id: 'ordnung', text: 'Deine Bücher bringen Unruhe ins Reich. Du spaltest die Kirche. Ist dir die Ordnung nichts wert?',
      gut: { k7: 'Das sitzt. Luther schrieb zuerst höflich an seinen Erzbischof. Er wollte erneuern, nicht spalten.' },
      halb: { t43: 'Den Armen helfen statt Ablass kaufen: Das klingt nicht nach einem Unruhestifter. Die Sorge um die Ordnung bleibt aber.' },
      sonst: 'Das nimmt dem Vorwurf der Spaltung nichts. Einige Bischöfe schütteln den Kopf.' },
    { id: 'allein', text: 'Du stehst allein gegen alle. Seit über tausend Jahren glauben Christen anders. Kann ein Einzelner recht haben?',
      gut: { k8: 'Allein? Im ganzen Reich haben Menschen die Thesen gelesen. Viele im Saal wissen das genau.' },
      halb: { k5: 'Nicht die Mehrheit entscheidet, sondern die Schrift. Ein guter Gedanke. Aber ist Luther wirklich allein?',
              k3: 'Gnade als Geschenk hat viele überzeugt. Den Vorwurf beantwortet das nur halb.' },
      sonst: 'Das zeigt nicht, dass Luther mit seiner Sicht nicht allein ist.' }
  ],
  auswertung: {
    1: 'Der Saal blieb kühl. Die Vorwürfe waren schwer, und die Karten passten selten.',
    2: 'Manche im Saal sind nachdenklich geworden. Nicht jeder Einwand wurde entkräftet.',
    3: 'Viele im Saal sind beeindruckt. Auf jeden Vorwurf gab es eine Antwort mit Gewicht.'
  },
  urteil: 'Am Urteil ändert das nichts. Der Kaiser bleibt dabei: Luther soll bestraft werden. Gute Gründe schützen ihn nicht vor der Strafe.'
};
