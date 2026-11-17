// Das Kartenspiel „Disputation“: Karten der Kirche, Gegner, Regeln. Spiellogik in js/puzzles/duell.js.
// Leitidee: Die Kirche hatte die Argumenthoheit. Ihre Karten sind stark (bis 10), Luthers Karten schwach (1–6).
// Luther gewinnt nur, wenn er die richtigen Erkenntnisse gesammelt hat: Sie entkräften Karten der Kirche (auf Stärke 1).
// Die Karten der Kirche geben Positionen wieder, wie sie damals vertreten wurden. Es sind keine wörtlichen Zitate.
// gruppe: für Fähigkeiten, die mehrere Karten betreffen. Fähigkeiten wie in data/cards.js, dazu
//   schwaecht: { gruppe, minus }: Karten des Gegners dieser Kartenart werden schwächer (mindestens 1).
//   bann: Die stärkste Karte des Gegners (nicht standhaft) verlässt die Reihe.
export const disputation = {
  regeln: { handStart: 6, nachziehen: 2, tausch: 2, handMax: 10, siegeNoetig: 2, deckMin: 8, deckMax: 12, trefferZieht: 1 },
  kirche: [
    { id: 'c-richter', typ: 'rom', gruppe: 'angst', bild: 'wandbild-2', staerke: 9, seltenheit: 'episch',
      titel: 'Gott, der strenge Richter', text: 'Gott wägt jede Sünde. Am Ende steht das Gericht.' },
    { id: 'c-fegefeuer', typ: 'rom', gruppe: 'angst', bild: 'platte-1', staerke: 7, seltenheit: 'selten', schwaecht: { gruppe: ['gnade'], minus: 1 },
      titel: 'Angst vor dem Fegefeuer', text: 'Nach dem Tod müssen die Seelen gereinigt werden. Das kann lange dauern.' },
    { id: 'c-werke', typ: 'rom', gruppe: 'lehre', bild: 'weg-wallfahrt', staerke: 7, seltenheit: 'selten',
      titel: 'Gute Werke zählen', text: 'Wer fastet, betet, pilgert und spendet, tut etwas für sein Heil.' },
    { id: 'c-ablass', typ: 'rom', gruppe: 'ablass', bild: 'weg-ablass', staerke: 8, seltenheit: 'episch',
      titel: 'Der Ablasshandel', text: 'Die Kirche erlässt Strafen für Sünden. Wer spendet, bekommt einen Ablass.' },
    { id: 'c-brief', typ: 'rom', gruppe: 'ablass', bild: 'ablassbrief', staerke: 5, seltenheit: 'gewoehnlich',
      titel: 'Der Ablassbrief', text: 'Schwarz auf weiß gedruckt: Deine Strafen sind erlassen.' },
    { id: 'c-predigt', typ: 'rom', gruppe: 'ablass', bild: 'fig-tetzel', staerke: 3, seltenheit: 'selten', staerkt: { gruppe: ['ablass'], plus: 2 },
      titel: 'Tetzels Predigt', text: 'Ein mitreißender Prediger zieht die Menschen zum Kasten.' },
    { id: 'c-petersdom', typ: 'rom', gruppe: 'ablass', bild: 'geldweg-rom', staerke: 6, seltenheit: 'gewoehnlich',
      titel: 'Für den Petersdom', text: 'Das Geld hilft, in Rom die größte Kirche der Christenheit zu bauen.' },
    { id: 'c-papst', typ: 'rom', gruppe: 'amt', bild: 'fig-stand-4', staerke: 10, seltenheit: 'legendaer',
      titel: 'Der Papst entscheidet', text: 'Der Papst ist der Nachfolger des Petrus. Er entscheidet, was im Glauben gilt.' },
    { id: 'c-konzil', typ: 'rom', gruppe: 'amt', bild: 'fig-stand-3-abgewandt', staerke: 9, seltenheit: 'episch',
      titel: 'Die Konzilien', text: 'Hunderte Bischöfe haben gemeinsam beraten und entschieden.' },
    { id: 'c-tradition', typ: 'rom', gruppe: 'amt', bild: 'weg-reliquien', staerke: 8, seltenheit: 'selten',
      titel: 'Tausend Jahre Tradition', text: 'Seit über tausend Jahren glauben Christen so. Soll das alles falsch sein?' },
    { id: 'c-hus', typ: 'rom', gruppe: 'amt', bild: 'weg-heilige', staerke: 7, seltenheit: 'selten',
      titel: 'Wie Jan Hus', text: 'Das Konzil von Konstanz verurteilte Hus 1415 als Ketzer. Du redest wie er.' },
    { id: 'c-eck', typ: 'rom', gruppe: 'amt', bild: 'fig-stand-6', staerke: 5, seltenheit: 'legendaer', staerkt: { gruppe: ['alle'], plus: 1 },
      titel: 'Johann Eck', text: 'Ein glänzender Gelehrter und Redner. Er treibt seine Gegner in die Enge.' },
    { id: 'c-ketzer', typ: 'rom', gruppe: 'amt', bild: 'fig-stand-2-abgewandt', staerke: 4, seltenheit: 'gewoehnlich', zieht: 1,
      titel: 'Ketzer!', text: 'Wer der Kirche widerspricht, gilt schnell als Ketzer.' },
    { id: 'c-bann', typ: 'rom', gruppe: 'amt', bild: 'fig-stand-5', staerke: 6, seltenheit: 'episch', bann: true,
      titel: 'Der Kirchenbann', text: 'Der Papst schließt Luther aus der Kirche aus.' },
    { id: 'c-ordnung', typ: 'rom', gruppe: 'reich', bild: 'fig-kaiser', staerke: 8, seltenheit: 'episch',
      titel: 'Ruhe und Ordnung', text: 'Streit um den Glauben bringt Unruhe ins ganze Reich.' },
    { id: 'c-mehrheit', typ: 'rom', gruppe: 'reich', bild: 'fig-stand-1', staerke: 8, seltenheit: 'selten',
      titel: 'Alle gegen einen', text: 'Kaiser, Fürsten und Bischöfe sind sich einig. Und du?' }
  ],
  // figur: aus game.figuren. belohnung: Karte für den ersten Sieg.
  gegner: {
    tetzel: {
      id: 'tetzel', figur: 'tetzel', name: 'Johann Tetzel', ort: 'Jüterbog, 1517', belohnung: 'n1',
      deck: ['c-predigt', 'c-brief', 'c-brief', 'c-ablass', 'c-fegefeuer', 'c-richter', 'c-petersdom', 'c-werke', 'c-ketzer'],
      einleitung: 'Tetzel will dich vor allen Leuten widerlegen. Dieses Streitgespräch ist erfunden, die Argumente sind es nicht.',
      sieg: 'Tetzel packt seinen Kasten zusammen. Die Leute haben genau zugehört.',
      niederlage: 'Tetzel lacht. Seine Karten waren heute stärker. Sammle mehr Erkenntnisse und fordere ihn später erneut heraus.'
    },
    eck: {
      id: 'eck', figur: 'eck', name: 'Johann Eck', ort: 'Leipzig, 1519', belohnung: 'n2',
      deck: ['c-eck', 'c-konzil', 'c-papst', 'c-hus', 'c-tradition', 'c-ketzer', 'c-werke', 'c-bann', 'c-richter'],
      einleitung: 'Eck ist der beste Redner der Gegenseite. Er will zeigen: Wer dem Papst widerspricht, ist ein Ketzer.',
      sieg: 'Eck schweigt einen Moment. Die Wittenberger Studenten jubeln.',
      niederlage: 'Eck hat dich in die Enge getrieben. Gegen Konzilien und Papst fehlten dir die passenden Karten.'
    },
    worms: {
      id: 'worms', figur: 'sprecher', name: 'Sprecher des Kaisers', wer: 'der Sprecher des Kaisers', wen: 'den Sprecher des Kaisers', ort: 'Worms, 1521',
      deck: ['c-papst', 'c-konzil', 'c-ordnung', 'c-mehrheit', 'c-bann', 'c-tradition', 'c-hus', 'c-richter'],
      einleitung: 'Vor Kaiser und Reich spielt der Sprecher die stärksten Karten der Kirche aus. Stell dein Deck mit Bedacht zusammen.',
      sieg: 'Unruhe im Saal. Viele Fürsten sind beeindruckt. Auf jede starke Karte hatte Luther eine Antwort.',
      niederlage: 'Der Sprecher behält die Oberhand. Luther widerruft trotzdem nicht.'
    },
    frei: {
      id: 'frei', figur: 'sprecher', name: 'Die ganze Kirche', wer: 'die ganze Kirche', wen: 'die ganze Kirche', ort: 'Freie Disputation',
      deck: ['c-papst', 'c-konzil', 'c-ordnung', 'c-mehrheit', 'c-bann', 'c-eck', 'c-ablass', 'c-predigt', 'c-richter', 'c-tradition', 'c-hus', 'c-fegefeuer'],
      einleitung: 'Alle starken Karten der Kirche in einem Deck. Schaffst du es mit deiner ganzen Sammlung?',
      sieg: 'Meisterhaft! Du kennst jede Karte und ihre Antwort.',
      niederlage: 'Knapp daneben. Stell dein Deck neu zusammen und versuch es noch einmal.'
    }
  },
  regelText: [
    'Ihr spielt abwechselnd eine Karte in eure Reihe. Die Stärken werden zusammengezählt.',
    'Wenn du nichts mehr spielen willst, tippe auf „Passen“. Dein Gegner darf dann weiterspielen.',
    'Haben beide gepasst, gewinnt die höhere Summe die Runde. Bei Gleichstand gewinnt die Kirche: Sie hat die Argumenthoheit.',
    'Wer zwei Runden gewinnt, gewinnt die Disputation. Deine übrigen Karten nimmst du in die nächste Runde mit.',
    'Entkräften: Manche deiner Karten machen eine starke Karte der Kirche schwach. Solange deine Karte liegt, zählt die Kirchenkarte nur 1.',
    'Treffer: Entkräftest du eine Karte, die schon liegt, ziehst du sofort eine Karte nach.'
  ],
  hilfen: [
    'Tippe die Karten der Kirche an und lies, wie stark sie sind. Dann such in deiner Hand eine Karte, die sie entkräftet.',
    'Spiel deine Konterkarten erst, wenn die starke Kirchenkarte liegt. Eine Runde darfst du auch verloren geben, um Karten zu sparen.'
  ],
  // Rätsel, die nur aus einer Disputation bestehen: Revanche, Nebenort Leipzig, freie Disputation.
  // nach: Station, nach der sie auf der Karte erscheinen. szene: Der Eintrag führt zu einem Ort statt direkt ins Spiel.
  // merker: Das Spiel zählt als Bonusspiel (Fortsetzungscode). Sonst bleibt nichts gespeichert außer dem Sieg.
  liste: ['leipzig', 'duell-tetzel', 'duell-worms', 'frei'],
  raetsel: {
    leipzig: { id: 'leipzig', titel: 'Die Leipziger Disputation', nach: 's5', szene: 'leipzig', merker: true, minuten: 8,
      kurz: 'Neuer Ort: Luther gegen Johann Eck, 1519.',
      schritte: [
        { art: 'duell', gegner: 'eck', titel: 'Luther gegen Eck', szene: 'leipzig',
          hilfen: ['Eck spielt die Karten der Gelehrten: Konzilien, Papst, Tradition.', 'Gegen „Die Konzilien“ und „Wie Jan Hus“ hilft nur eine Karte. Du findest sie in Worms (Station 6).', '„Maßstab Bibel“ entkräftet Papst und Tradition. „Konzilien irren“ entkräftet Konzilien und Hus. „Gewissen“ schützt vor dem Bann.'] },
        { art: 'text', titel: 'Was in Leipzig geschah',
          absaetze: [
            { text: 'Die Disputation dauerte fast drei Wochen. Eck trieb Luther in die Enge.' },
            { text: 'Am Ende sagte Luther: Auch ein Konzil kann irren. Manche Sätze von Jan Hus seien gut christlich.' },
            { text: 'Damit war der Bruch mit Rom kaum noch aufzuhalten. Ein Jahr später drohte der Papst Luther mit dem Bann.' }
          ] }
      ] },
    'duell-tetzel': { id: 'duell-tetzel', titel: 'Revanche gegen Tetzel', nach: 's4', minuten: 5,
      kurz: 'Fordere Tetzel mit deinen neuen Karten heraus.',
      schritte: [{ art: 'duell', gegner: 'tetzel', titel: 'Revanche gegen Tetzel', szene: 'jueterbog' }] },
    'duell-worms': { id: 'duell-worms', titel: 'Noch einmal in Worms', nach: 's6', minuten: 6,
      kurz: 'Spiel die Disputation vor dem Reichstag noch einmal.',
      schritte: [{ art: 'duell', gegner: 'worms', titel: 'Vor Kaiser und Reich', szene: 'saal' }] },
    frei: { id: 'frei', titel: 'Die große Disputation', nach: 'f', merker: true, minuten: 8,
      kurz: 'Alle starken Karten der Kirche gegen deine ganze Sammlung.',
      schritte: [{ art: 'duell', gegner: 'frei', titel: 'Die große Disputation', szene: 'saal' }] }
  }
};
