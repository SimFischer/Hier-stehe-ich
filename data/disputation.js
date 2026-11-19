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
  // Anführer: liegen neben dem Deck und können einmal je Disputation wie eine Karte gespielt werden (wie bei Gwent).
  anfuehrer: [
    { id: 'a-novize', anfuehrer: true, typ: 'rom', gruppe: 'lehre', bild: 'fig-mitbruder', staerke: 3, seltenheit: 'legendaer', zieht: 1,
      titel: 'Der Novizenmeister', text: 'Er bringt den jungen Mönchen bei, was die Kirche lehrt.' },
    { id: 'a-tetzel', anfuehrer: true, typ: 'rom', gruppe: 'ablass', bild: 'fig-tetzel', staerke: 5, seltenheit: 'legendaer', staerkt: { gruppe: ['ablass'], plus: 1 },
      titel: 'Johann Tetzel', text: 'Der Dominikaner predigt den Ablass für den Bau des Petersdoms.' },
    { id: 'a-prierias', anfuehrer: true, typ: 'rom', gruppe: 'amt', bild: 'fig-stand-4', staerke: 6, seltenheit: 'legendaer', schwaecht: { gruppe: ['bibel'], minus: 1 },
      titel: 'Silvester Prierias', text: 'Der Theologe des Papstes schreibt 1518 als Erster in Rom gegen Luther.' },
    { id: 'a-cajetan', anfuehrer: true, typ: 'rom', gruppe: 'amt', bild: 'fig-stand-3', staerke: 7, seltenheit: 'legendaer', standhaft: true,
      titel: 'Kardinal Cajetan', text: 'Im Oktober 1518 verhört er Luther in Augsburg und verlangt den Widerruf.' },
    { id: 'a-eck', anfuehrer: true, typ: 'rom', gruppe: 'amt', bild: 'fig-eck', staerke: 6, seltenheit: 'legendaer', staerkt: { gruppe: ['amt'], plus: 1 },
      titel: 'Professor Eck', text: 'Der Theologe aus Ingolstadt fordert Luther 1519 in Leipzig heraus.' },
    { id: 'a-emser', anfuehrer: true, typ: 'rom', gruppe: 'lehre', bild: 'fig-stand-6', staerke: 5, seltenheit: 'legendaer', schwaecht: { gruppe: ['druck'], minus: 1 },
      titel: 'Hieronymus Emser', text: 'Der Sekretär von Herzog Georg streitet in vielen Schriften gegen Luther.' },
    { id: 'a-aleander', anfuehrer: true, typ: 'rom', gruppe: 'amt', bild: 'fig-sprecher', staerke: 6, seltenheit: 'legendaer', bann: true,
      titel: 'Nuntius Aleander', text: 'Der Gesandte des Papstes treibt 1521 in Worms das Urteil gegen Luther voran.' },
    { id: 'a-albrecht', anfuehrer: true, typ: 'rom', gruppe: 'ablass', bild: 'geldweg-albrecht', staerke: 7, seltenheit: 'legendaer', staerkt: { gruppe: ['ablass'], plus: 2 },
      titel: 'Albrecht von Mainz', text: 'Der Erzbischof ließ den Ablass predigen. Luther schickte ihm 1517 seine Thesen.' },
    { id: 'a-georg', anfuehrer: true, typ: 'rom', gruppe: 'reich', bild: 'fig-stand-1', staerke: 7, seltenheit: 'legendaer', schwaecht: { gruppe: ['menschen'], minus: 1 },
      titel: 'Herzog Georg', text: 'Er bleibt beim alten Glauben und verbietet Luthers Bibel in seinem Land.' },
    { id: 'a-karl', anfuehrer: true, typ: 'rom', gruppe: 'reich', bild: 'fig-kaiser', staerke: 8, seltenheit: 'legendaer', standhaft: true, staerkt: { gruppe: ['reich'], plus: 1 },
      titel: 'Kaiser Karl V.', text: 'Der junge Kaiser will die Einheit von Reich und Kirche bewahren.' },
    { id: 'a-leo', anfuehrer: true, typ: 'rom', gruppe: 'amt', bild: 'fig-stand-4-nickend', staerke: 9, seltenheit: 'legendaer', standhaft: true, staerkt: { gruppe: ['amt'], plus: 1 },
      titel: 'Papst Leo X.', text: 'Der Papst aus der Familie Medici verhängt im Januar 1521 den Bann über Luther.' },
    { id: 'a-luther', anfuehrer: true, typ: 'gewissen', bild: 'fig-luther-worms', staerke: 5, seltenheit: 'legendaer', standhaft: true,
      titel: 'Martin Luther', text: 'Mönch, Doktor der Theologie und Professor in Wittenberg.' },
    { id: 'a-melanchthon', anfuehrer: true, typ: 'wissen', bild: 'fig-student', staerke: 3, seltenheit: 'legendaer', zieht: 2,
      titel: 'Philipp Melanchthon', text: 'Der junge Professor für Griechisch wird Luthers engster Mitarbeiter.' },
    { id: 'a-friedrich', anfuehrer: true, typ: 'menschen', bild: 'fig-stand-2', staerke: 6, seltenheit: 'legendaer', standhaft: true, entkraeftet: ['c-reichsacht', 'c-bann'],
      titel: 'Friedrich der Weise', text: 'Der Kurfürst von Sachsen lässt Luther nach dem Reichstag heimlich auf die Wartburg bringen.' },
    { id: 'a-katharina', anfuehrer: true, typ: 'menschen', bild: 'fig-marktfrau', staerke: 4, seltenheit: 'legendaer', staerkt: { gruppe: ['menschen'], plus: 2 },
      titel: 'Katharina von Bora', text: 'Die frühere Nonne heiratet 1525 Luther und führt das große Haus.' }
  ],
  // figur: aus game.figuren. belohnung: Karte für den ersten Sieg. anfuehrer: Karte, die der Gegner einmal spielen kann.
  // siegAls: Ein Sieg zählt wie ein Sieg gegen diesen Gegner (Revanche).
  gegner: {
    uebung: {
      id: 'uebung', figur: 'mitbruder', portrait: 'kunst-a-novize', name: 'Bruder Johannes', ort: 'Erfurt, 1505', uebung: true,
      // Feste Reihenfolge, damit die geführte Partie immer gleich abläuft
      deck: ['c-werke', 'c-ketzer', 'c-richter', 'c-brief'], deckLuther: ['k1', 'k2', 'k4', 'w3', 'k3', 'k6'],
      regeln: { handStart: 4, tausch: 0, nachziehen: 1 }, skript: ['c-werke', 'passe', 'c-richter', 'c-ketzer', 'passe'],
      // Geführte Partie: Jeder Schritt erklärt etwas. erwartet: Karte, die du spielen sollst, oder 'passe'. ziel: was aufleuchtet.
      tutorial: [
        { ziel: 'summen', text: 'Das ist der Spieltisch. Oben spielt Bruder Johannes, unten spielst du. Die runden Zahlen sind die Summen eurer Reihen.' },
        { ziel: 'k1', erwartet: 'k1', text: 'Tippe auf die Karte „Die Angst kennen“. Du siehst sie groß und kannst lesen, was sie kann. Dann tippe auf „Ausspielen“.' },
        { ziel: 'reihe-kirche', text: 'Johannes legt „Gute Werke zählen“ mit Stärke 7. Die Kirche hat starke Karten. Aber du hast eine Antwort.' },
        { ziel: 'k2', erwartet: 'k2', text: 'Spiel „Werke reichen nicht“. Sie entkräftet „Gute Werke zählen“. Diese Karte zählt dann nur noch 1.' },
        { ziel: 'reihe-luther', text: 'Treffer! Die Kirchenkarte lag schon, darum ziehst du eine Karte nach. Johannes hat gepasst. Du liegst vorne.' },
        { ziel: 'passen', erwartet: 'passe', text: 'Tippe auf „Passen“. Haben beide gepasst, endet die Runde. Die höhere Summe gewinnt sie.' },
        { ziel: 'reihe-kirche', text: 'Runde 2. Wer zwei Runden gewinnt, gewinnt die Disputation. Johannes spielt seine stärkste Karte: Stärke 9.' },
        { ziel: 'k4', erwartet: 'k4', text: '„Wie der Vater“ entkräftet „Gott, der strenge Richter“. Spiel sie aus.' },
        { ziel: 'summen', text: 'Johannes liegt wieder vorne. Achtung: Bei Gleichstand gewinnt die Kirche. Sie hat die Argumenthoheit.' },
        { ziel: 'w3', erwartet: 'w3', text: 'Spiel „Gott entscheidet“. Dann liegst du vorne.' },
        { ziel: 'passen', erwartet: 'passe', text: 'Johannes hat gepasst. Passe auch, dann gewinnst du. Tipp für später: Heb starke Karten für die nächste Runde auf.' }
      ],
      einleitung: 'Im Kloster üben die Mönche das Streiten nach Regeln. Bruder Johannes zeigt dir, wie eine Disputation geht.',
      sieg: 'Bruder Johannes lacht. Gut gemacht! So geht eine Disputation.', niederlage: 'Noch einmal von vorn. Bruder Johannes erklärt es dir.'
    },
    tetzel: {
      id: 'tetzel', figur: 'tetzel', name: 'Johann Tetzel', ort: 'Jüterbog, 1517', belohnung: 'n1', anfuehrer: 'a-tetzel',
      deck: ['c-predigt', 'c-ablassprediger', 'c-brief', 'c-ablass', 'c-fegefeuer', 'c-richter', 'c-petersdom', 'c-werke', 'c-ketzer'],
      einleitung: 'Tetzel will dich vor allen Leuten widerlegen. Die Menge glaubt ihm, und er spielt seine eigene Karte aus. Dieses Streitgespräch ist erfunden, die Argumente nicht.',
      sieg: 'Tetzel packt seinen Kasten zusammen. Die Leute haben genau zugehört.',
      niederlage: 'Tetzel lacht. Die Menschen glauben ihm mehr als dir. Noch fehlen dir Karten. Mit den Thesen kannst du später unter „Disputation“ Revanche nehmen.'
    },
    tetzel2: {
      id: 'tetzel2', siegAls: 'tetzel', figur: 'tetzel', name: 'Johann Tetzel', ort: 'Jüterbog, Ende 1517', belohnung: 'n1', anfuehrer: 'a-tetzel',
      deck: ['c-predigt', 'c-ablassprediger', 'c-brief', 'c-ablass', 'c-fegefeuer', 'c-richter', 'c-petersdom', 'c-werke', 'c-ketzer'],
      einleitung: 'Die Thesen sind gedruckt und gehen von Hand zu Hand. Tetzel hört davon und will dagegenhalten. Jetzt hast du neue Karten.',
      sieg: 'Die gedruckten Thesen haben gewirkt. Tetzel verkauft kaum noch Briefe.',
      niederlage: 'Tetzel hält sich noch. Stell dein Deck neu zusammen: Die Thesen sind deine stärkste Waffe.'
    },
    eck: {
      id: 'eck', figur: 'eck', name: 'Johann Eck', ort: 'Leipzig, 1519', belohnung: 'n2', anfuehrer: 'a-eck',
      deck: ['c-eck', 'c-konzil', 'c-papst', 'c-hus', 'c-tradition', 'c-ketzer', 'c-werke', 'c-bann', 'c-richter'],
      einleitung: 'Eck ist der beste Redner der Gegenseite. Er will zeigen: Wer dem Papst widerspricht, ist ein Ketzer.',
      sieg: 'Eck schweigt einen Moment. Die Wittenberger Studenten jubeln.',
      niederlage: 'Eck hat dich in die Enge getrieben. Gegen Konzilien und Papst fehlte dir eine Antwort. Doch in der Niederlage findet Luther sie.'
    },
    worms: {
      id: 'worms', figur: 'sprecher', portrait: 'fig-sprecher-kein', name: 'Sprecher des Kaisers', wer: 'der Sprecher des Kaisers', wen: 'den Sprecher des Kaisers', ort: 'Worms, 1521', anfuehrer: 'a-karl',
      // In Worms steht Luther selbst als Anführer auf deiner Seite.
      lutherAnfuehrer: 'a-luther',
      deck: ['c-papst', 'c-konzil', 'c-ordnung', 'c-mehrheit', 'c-bann', 'c-tradition', 'c-hus', 'c-richter'],
      einleitung: 'Vor Kaiser und Reich spielt der Sprecher die stärksten Karten der Kirche aus. Der Kaiser selbst steht hinter ihm. Doch auf deiner Seite steht Luther: Ihn kannst du einmal ausspielen.',
      sieg: 'Unruhe im Saal. Viele Fürsten sind beeindruckt: Auf jede starke Karte hatte Luther eine Antwort. Er hat die stärkeren Argumente.',
      niederlage: 'Der Sprecher behält die Oberhand. Luther widerruft trotzdem nicht.'
    }
  },
  regelText: [
    'Ihr spielt abwechselnd eine Karte in eure Reihe. Die Stärken werden zusammengezählt.',
    'Wenn du nichts mehr spielen willst, tippe auf „Passen“. Dein Gegner darf dann weiterspielen.',
    'Haben beide gepasst, gewinnt die höhere Summe die Runde. Bei Gleichstand gewinnt die Kirche: Sie hat die Argumenthoheit.',
    'Wer zwei Runden gewinnt, gewinnt die Disputation. Deine übrigen Karten nimmst du in die nächste Runde mit.',
    'Entkräften: Manche deiner Karten machen eine starke Karte der Kirche schwach. Solange deine Karte liegt, zählt die Kirchenkarte nur 1.',
    'Treffer: Entkräftest du eine Karte, die schon liegt, ziehst du sofort eine Karte nach.',
    'Anführer: Manche Gegner haben eine besondere Karte neben dem Deck. Sie können sie einmal in der ganzen Disputation spielen.'
  ],
  hilfen: [
    'Tippe die Karten der Kirche an und lies, wie stark sie sind. Dann such in deiner Hand eine Karte, die sie entkräftet.',
    'Spiel deine Konterkarten erst, wenn die starke Kirchenkarte liegt. Eine Runde darfst du auch verloren geben, um Karten zu sparen.'
  ],
  // Rätsel, die nur aus einer Disputation bestehen: Übung, Revanchen und das Kartenspiel „Hammer & Siegel“.
  // nach: Station, nach der sie auf der Karte erscheinen. szene: Der Eintrag führt zu einem Ort statt direkt ins Spiel.
  // merker: Das Spiel zählt als Bonusspiel (Fortsetzungscode). Sonst bleibt nichts gespeichert außer dem Sieg.
  liste: ['uebung', 'duell-tetzel', 'duell-eck', 'duell-worms', 'kampagne'],
  raetsel: {
    uebung: { id: 'uebung', titel: 'Übung: So geht die Disputation', nach: 's2', minuten: 3, bild: 'kunst-a-novize',
      kurz: 'Bruder Johannes erklärt dir das Kartenspiel Schritt für Schritt.',
      schritte: [{ art: 'duell', gegner: 'uebung', titel: 'Übung mit Bruder Johannes', szene: 'kloster' }] },
    'duell-tetzel': { id: 'duell-tetzel', titel: 'Revanche gegen Tetzel', nach: 's5', minuten: 5, bild: 'kunst-a-tetzel',
      kurz: 'Mit den Thesen hast du jetzt starke Karten. Fordere Tetzel noch einmal heraus.',
      schritte: [{ art: 'duell', gegner: 'tetzel2', titel: 'Revanche gegen Tetzel', szene: 'jueterbog' }] },
    'duell-eck': { id: 'duell-eck', titel: 'Revanche gegen Eck', nach: 'sl', minuten: 6, bild: 'kunst-a-eck',
      kurz: 'Die Kartenpartie gegen Eck: Findest du eine Antwort auf die Konzilien?',
      schritte: [{ art: 'duell', gegner: 'eck', titel: 'Revanche gegen Eck', szene: 'leipzig' }] },
    'duell-worms': { id: 'duell-worms', titel: 'Noch einmal in Worms', nach: 's6', minuten: 6, bild: 'kunst-a-karl',
      kurz: 'Spiel die Disputation vor dem Reichstag noch einmal.',
      schritte: [{ art: 'duell', gegner: 'worms', titel: 'Vor Kaiser und Reich', szene: 'saal' }] },
    kampagne: { id: 'kampagne', titel: 'Hammer & Siegel', nach: 'f', merker: true, minuten: 30, bild: 'kunst-a-luther', bildGegner: 'kunst-a-karl',
      kurz: 'Das Kartenspiel der Reformation: Luthers Hammer gegen das Siegel Roms. Zwölf Gegner, neue Karten, Anführer.',
      schritte: [{ art: 'kampagne', titel: 'Hammer & Siegel', szene: 'saal' }] }
  }
};
