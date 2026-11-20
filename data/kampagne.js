// Kartenspiel „Hammer & Siegel“ (Spiel im Spiel): eine Kampagne mit zwölf Gegnern in vier Kapiteln.
// Öffnet sich nach dem Finale. Regeln wie in der Disputation (js/puzzles/duell-regeln.js), Ablauf in js/puzzles/kampagne.js.
// Was echte Personen im Spiel vertreten, ist nacherzählt. Es sind keine wörtlichen Zitate.
// Neue Karten haben dieselben Felder wie data/cards.js. Bilder: kunst-<id> (docs/ASSET-PROMPTS-3.md), bis dahin das Ersatzbild in „bild“.
export const kampagne = {
  // Luthers Karten, die es nur in der Kampagne gibt (als Belohnung nach einem Sieg)
  karten: [
    { id: 'r1', typ: 'wissen', bild: 'motiv-1', staerke: 4, seltenheit: 'selten', staerkt: { gruppe: ['bibel', 'wissen'], plus: 1 },
      titel: 'Griechisch und Hebräisch', text: 'Die Bibel in ihren alten Sprachen lesen: Das lernt man jetzt in Wittenberg.' },
    { id: 'r2', typ: 'druck', bild: 'flugblatt-deutsch', staerke: 3, seltenheit: 'selten', zieht: 1, entkraeftet: ['c-spott'],
      titel: 'Cranachs Bilder', text: 'Der Maler Lucas Cranach macht Luthers Gesicht im ganzen Reich bekannt.' },
    { id: 'r3', typ: 'menschen', bild: 'fig-bote', staerke: 3, seltenheit: 'gewoehnlich', zieht: 1,
      titel: 'Spalatins Briefe', text: 'Georg Spalatin, Sekretär des Kurfürsten, hält die Verbindung zwischen Luther und dem Hof.' },
    { id: 'r4', typ: 'menschen', bild: 'fig-stand-2', staerke: 6, seltenheit: 'legendaer', standhaft: true, entkraeftet: ['c-reichsacht', 'c-ketzerprozess', 'c-landsknechte'],
      titel: 'Schutz des Kurfürsten', text: 'Friedrich der Weise schützt Luther vor Kaiser und Papst, ohne sich offen zu ihm zu bekennen.' },
    { id: 'r5', typ: 'menschen', bild: 'fig-marktfrau', staerke: 4, seltenheit: 'episch', staerkt: { gruppe: ['menschen'], plus: 1 },
      titel: 'Ein offenes Haus', text: 'Bei Luthers essen Studenten, Gäste und Arme mit am Tisch.' },
    { id: 'r6', typ: 'kirche', bild: 'fig-mitbruder', staerke: 3, seltenheit: 'selten', entkraeftet: ['c-weihe', 'c-ordnung'],
      titel: 'Neue Kirchenordnungen', text: 'Johannes Bugenhagen ordnet die Gemeinden in vielen Städten Norddeutschlands neu.' },
    { id: 'r7', typ: 'bibel', bild: 'septembertestament', staerke: 3, seltenheit: 'selten', bund: true,
      titel: 'Der Kleine Katechismus', text: '1529: Der Glaube in kurzen Fragen und Antworten, für Kinder und Eltern.' },
    { id: 'r8', typ: 'gnade', bild: 'bonus-gottesdienst-1522', staerke: 3, seltenheit: 'gewoehnlich', zieht: 1, entkraeftet: ['c-messe'],
      titel: 'Deutsche Lieder', text: 'Im Gottesdienst singt die Gemeinde jetzt selbst, und zwar auf Deutsch.' },
    { id: 'r9', typ: 'gnade', bild: 'stand-luther-aufrecht', staerke: 5, seltenheit: 'episch', entkraeftet: ['c-gehorsam', 'c-werke', 'c-zoelibat'],
      titel: 'Freiheit eines Christenmenschen', text: '1520: Ein Christ ist frei durch den Glauben. Aus Liebe dient er seinem Nächsten.' },
    { id: 'r10', typ: 'kirche', bild: 'fig-stand-2-nickend', staerke: 4, seltenheit: 'episch', entkraeftet: ['c-kurie', 'c-papst'],
      titel: 'An den christlichen Adel', text: '1520: Luther ruft die Fürsten auf, die Kirche zu erneuern.' },
    { id: 'r11', typ: 'kirche', bild: 'bonus-gottesdienst-1522', staerke: 4, seltenheit: 'episch', entkraeftet: ['c-weihe', 'c-gehorsam'],
      titel: 'Priestertum aller Getauften', text: 'Jeder getaufte Christ darf beten, die Bibel lesen und von Gott erzählen.' },
    { id: 'r12', typ: 'menschen', bild: 'ablasskasten', staerke: 3, seltenheit: 'selten', entkraeftet: ['c-ablassprediger', 'c-ablass'],
      titel: 'Der Gemeine Kasten', text: 'In Wittenberg sammelt eine gemeinsame Kasse Geld für die Armen der Stadt.' },
    { id: 'r13', typ: 'druck', bild: 'flugblatt-deutsch', staerke: 2, seltenheit: 'gewoehnlich', bund: true, entkraeftet: ['c-verbrennung'],
      titel: 'Flugschriften', text: 'Kleine, billige Hefte tragen Luthers Gedanken in jede Stadt.' },
    { id: 'r14', typ: 'menschen', bild: 'fig-handwerker', staerke: 2, seltenheit: 'gewoehnlich', bund: true,
      titel: 'Einer liest vor', text: 'Viele können nicht lesen. Auf dem Markt liest einer vor, die anderen hören zu.' },
    { id: 'r15', typ: 'gewissen', bild: 'platte-1', staerke: 5, seltenheit: 'episch', entkraeftet: ['c-bulle', 'c-bann'],
      titel: 'Die Bulle im Feuer', text: 'Im Dezember 1520 wirft Luther die Drohschrift des Papstes in Wittenberg ins Feuer.' },
    { id: 'r16', typ: 'gnade', bild: 'platte-7', staerke: 4, seltenheit: 'selten', standhaft: true,
      titel: 'Ein feste Burg', text: 'Luthers bekanntestes Lied: Gott ist wie eine sichere Burg.' },
    { id: 'r17', typ: 'bibel', bild: 'septembertestament', staerke: 6, seltenheit: 'legendaer', entkraeftet: ['c-latein'], staerkt: { gruppe: ['bibel'], plus: 1 },
      titel: 'Das Septembertestament', text: 'Im September 1522 erscheint Luthers Neues Testament auf Deutsch.' },
    { id: 'r18', typ: 'wissen', bild: 'motiv-1', staerke: 3, seltenheit: 'selten', entkraeftet: ['c-unfehlbar'], staerkt: { gruppe: ['wissen'], plus: 1 },
      titel: 'Universität Wittenberg', text: 'Professoren und Studenten streiten hier offen darüber, was in der Bibel steht.' },
    // Erweiterung 20.11.2026: was aus der Reformation wurde (1520 bis 1534). Jede Karte entkräftet eine passende Kirchenkarte oder stärkt eine Gruppe.
    { id: 'r19', typ: 'wissen', bild: 'motiv-1', staerke: 4, seltenheit: 'episch', staerkt: { gruppe: ['bibel', 'wissen'], plus: 1 }, entkraeftet: ['c-ketzer'],
      titel: 'Loci communes', text: '1521 fasst Philipp Melanchthon die neue Lehre zum ersten Mal geordnet zusammen. Das Buch wird zum Lehrbuch für Studenten.' },
    { id: 'r20', typ: 'menschen', bild: 'fig-witwe', staerke: 4, seltenheit: 'episch', standhaft: true, entkraeftet: ['c-ingolstadt', 'c-widerrufe'],
      titel: 'Argula von Grumbach', text: '1523 verteidigt die bayerische Adlige einen Studenten gegen die Universität Ingolstadt, mit Bibelstellen. Ihr Brief wird oft gedruckt.' },
    { id: 'r21', typ: 'druck', bild: 'fig-handwerker', staerke: 2, seltenheit: 'gewoehnlich', bund: true, entkraeftet: ['c-spott'],
      titel: 'Die Wittenbergisch Nachtigall', text: '1523 besingt der Nürnberger Schuhmacher Hans Sachs Luther als Nachtigall, die den neuen Tag ankündigt.' },
    { id: 'r22', typ: 'menschen', bild: 'fig-stand-3', staerke: 4, seltenheit: 'selten', zieht: 1, entkraeftet: ['c-kurie'],
      titel: 'Ulrich von Hutten', text: 'Der Ritter und Gelehrte greift ab 1520 die Geldgier Roms an, und zwar auf Deutsch, damit alle es lesen können.' },
    { id: 'r23', typ: 'menschen', bild: 'fig-luther-junker', staerke: 5, seltenheit: 'episch', standhaft: true, entkraeftet: ['c-edikt', 'c-reichsacht', 'c-ketzerprozess'],
      titel: 'Junker Jörg', text: '1521/22 lebt Luther versteckt auf der Wartburg, mit Bart und Ritterkleidung. Dort übersetzt er das Neue Testament.' },
    { id: 'r24', typ: 'bibel', bild: 'septembertestament', staerke: 7, seltenheit: 'legendaer', staerkt: { gruppe: ['bibel'], plus: 1 }, entkraeftet: ['c-latein'],
      titel: 'Die ganze Bibel auf Deutsch', text: '1534 erscheint in Wittenberg die ganze Bibel auf Deutsch. Luther hat sie mit Freunden wie Melanchthon übersetzt.' },
    { id: 'r25', typ: 'kirche', bild: 'bonus-gottesdienst-1522', staerke: 3, seltenheit: 'selten', zieht: 1, entkraeftet: ['c-messe'],
      titel: 'Die Deutsche Messe', text: '1526: Luthers Ordnung für einen Gottesdienst auf Deutsch. Die Gemeinde versteht die Lesungen und singt mit.' },
    { id: 'r26', typ: 'menschen', bild: 'kunst-a-katharina', staerke: 3, seltenheit: 'selten', bund: true, entkraeftet: ['c-zoelibat'],
      titel: 'Pfarrer dürfen heiraten', text: '1525 heiratet Luther die frühere Nonne Katharina von Bora. Evangelische Pfarrer dürfen eine Familie gründen.' },
    { id: 'r27', typ: 'wissen', bild: 'fig-junge', staerke: 2, seltenheit: 'gewoehnlich', staerkt: { gruppe: ['wissen'], plus: 1 },
      titel: 'Schulen für alle', text: '1524 ruft Luther die Städte auf, Schulen zu gründen, für Jungen und Mädchen. Jeder soll die Bibel selbst lesen können.' },
    { id: 'r28', typ: 'menschen', bild: 'fig-stand-5', staerke: 5, seltenheit: 'episch', entkraeftet: ['c-edikt', 'c-landsknechte'],
      titel: 'Die Protestation', text: '1529 widersprechen evangelische Fürsten und Städte in Speyer einem Beschluss gegen die Reformation. Seitdem heißen sie Protestanten.' },
    { id: 'r29', typ: 'wissen', bild: 'kunst-a-melanchthon', staerke: 6, seltenheit: 'legendaer', standhaft: true, entkraeftet: ['c-ketzer', 'c-hus'],
      titel: 'Das Augsburger Bekenntnis', text: '1530 legen evangelische Fürsten dem Kaiser in Augsburg ihren Glauben dar. Melanchthon hat das Bekenntnis geschrieben.' },
    { id: 'r30', typ: 'kirche', bild: 'fig-statist-2', staerke: 3, seltenheit: 'gewoehnlich', entkraeftet: ['c-weihe'],
      titel: 'Die Gemeinde urteilt', text: '1523 schreibt Luther: Eine christliche Gemeinde darf prüfen, was gepredigt wird, und ihren Pfarrer selbst berufen.' }
  ],
  // Karten der Kirche, die es nur in der Kampagne gibt
  kirche: [
    { id: 'c-ablassprediger', typ: 'rom', gruppe: 'ablass', bild: 'fig-tetzel', staerke: 4, seltenheit: 'gewoehnlich', bund: true,
      titel: 'Der Ablassprediger', text: 'Überall im Land werben Prediger für den Ablass.' },
    { id: 'c-bulle', typ: 'rom', gruppe: 'amt', bild: 'ablassbrief', staerke: 7, seltenheit: 'episch', schwaecht: { gruppe: ['druck'], minus: 1 },
      titel: 'Die Bannandrohung', text: '1520 droht der Papst Luther den Bann an. Er soll in 60 Tagen widerrufen.' },
    { id: 'c-verbrennung', typ: 'rom', gruppe: 'amt', bild: 'platte-1', staerke: 6, seltenheit: 'selten', schwaecht: { gruppe: ['druck', 'these'], minus: 2 },
      titel: 'Bücher ins Feuer', text: 'Luthers Schriften werden in mehreren Städten öffentlich verbrannt.' },
    { id: 'c-reichsacht', typ: 'rom', gruppe: 'reich', bild: 'fig-kaiser', staerke: 8, seltenheit: 'episch', bann: true,
      titel: 'Die Reichsacht', text: 'Wer geächtet ist, hat keinen Schutz mehr. Niemand darf ihm helfen.' },
    { id: 'c-gehorsam', typ: 'rom', gruppe: 'lehre', bild: 'fig-stand-4', staerke: 7, seltenheit: 'selten',
      titel: 'Gehorsam', text: 'Ein guter Christ gehorcht der Kirche und ihren Bischöfen.' },
    { id: 'c-kurie', typ: 'rom', gruppe: 'amt', bild: 'geldweg-rom', staerke: 8, seltenheit: 'episch',
      titel: 'Die Kurie in Rom', text: 'Am Hof des Papstes wird entschieden, was in der ganzen Kirche gilt.' },
    { id: 'c-weihe', typ: 'rom', gruppe: 'amt', bild: 'bonus-gottesdienst-1500', staerke: 7, seltenheit: 'selten',
      titel: 'Nur geweihte Priester', text: 'Nur ein geweihter Priester darf die Messe feiern und die Bibel auslegen.' },
    { id: 'c-latein', typ: 'rom', gruppe: 'lehre', bild: 'flugblatt-latein', staerke: 7, seltenheit: 'selten',
      titel: 'Die Bibel auf Latein', text: 'Die Bibel der Kirche ist lateinisch. Laien sollen sie nicht selbst auslegen.' },
    { id: 'c-unfehlbar', typ: 'rom', gruppe: 'amt', bild: 'fig-stand-4-abgewandt', staerke: 9, seltenheit: 'episch',
      titel: 'Die Kirche irrt nicht', text: 'Was die römische Kirche lehrt, kann im Glauben nicht falsch sein.' },
    { id: 'c-ketzerprozess', typ: 'rom', gruppe: 'amt', bild: 'fig-stand-5-abgewandt', staerke: 6, seltenheit: 'selten', zieht: 1,
      titel: 'Der Ketzerprozess', text: 'Wer als Ketzer verurteilt wird, muss um sein Leben fürchten.' },
    { id: 'c-widerrufe', typ: 'rom', gruppe: 'amt', bild: 'fig-sprecher', staerke: 6, seltenheit: 'selten', schwaecht: { gruppe: ['gnade'], minus: 1 },
      titel: 'Widerrufe!', text: 'Immer wieder verlangt man von Luther: Nimm alles zurück!' },
    { id: 'c-landsknechte', typ: 'rom', gruppe: 'reich', bild: 'fig-kaiser', staerke: 7, seltenheit: 'selten', staerkt: { gruppe: ['reich'], plus: 1 },
      titel: 'Die Macht des Kaisers', text: 'Der Kaiser hat Soldaten und viele Fürsten hinter sich.' },
    // Erweiterung 20.11.2026
    { id: 'c-edikt', typ: 'rom', gruppe: 'reich', bild: 'fig-kaiser', staerke: 6, seltenheit: 'episch', schwaecht: { gruppe: ['druck'], minus: 1 },
      titel: 'Das Wormser Edikt', text: 'Mai 1521: Luther wird geächtet. Niemand darf seine Schriften drucken, verkaufen oder lesen.' },
    { id: 'c-ingolstadt', typ: 'rom', gruppe: 'lehre', bild: 'fig-student', staerke: 6, seltenheit: 'selten',
      titel: 'Abschwören!', text: '1523 muss der Student Arsacius Seehofer in Ingolstadt Luthers Lehre abschwören. Sonst droht ihm Strafe.' },
    { id: 'c-spott', typ: 'rom', gruppe: 'lehre', bild: 'fig-mitbruder', staerke: 5, seltenheit: 'gewoehnlich', schwaecht: { gruppe: ['menschen'], minus: 1 },
      titel: 'Der große lutherische Narr', text: '1522 verspottet der Mönch Thomas Murner Luther in einem Buch als großen Narren.' },
    { id: 'c-messe', typ: 'rom', gruppe: 'lehre', bild: 'bonus-gottesdienst-1500', staerke: 6, seltenheit: 'selten',
      titel: 'Die Messe auf Latein', text: 'Im Gottesdienst spricht der Priester Latein. Die meisten Leute verstehen kaum etwas und schauen nur zu.' },
    { id: 'c-zoelibat', typ: 'rom', gruppe: 'amt', bild: 'fig-kaplan', staerke: 6, seltenheit: 'selten',
      titel: 'Ehelos bleiben', text: 'Priester, Mönche und Nonnen dürfen nicht heiraten. So hat es die Kirche festgelegt.' }
  ],
  // Anführer, die du freispielst (Sterne gesamt). Der Anführer liegt neben dem Deck und kann einmal je Disputation gespielt werden.
  anfuehrer: [
    { id: 'a-luther', ab: 0 }, { id: 'a-melanchthon', ab: 5 }, { id: 'a-friedrich', ab: 12 }, { id: 'a-katharina', ab: 20 }
  ],
  // Sterne: 1 für einen Sieg, 1 für einen Sieg ohne verlorene Runde, 1 für einen Sieg mit höchstens kleinDeck Karten.
  sterne: { kleinDeck: 10 },
  regeln: { deckMin: 8, deckMax: 12 },
  // Deckbau: „Startdeck“ gibt es immer (Konter gegen die schwächeren Karten, die stärksten bleiben offen).
  // Im ersten Kapitel etwas größer, damit der Einstieg gelingt. „Bestes Deck“ wird frei nach so vielen Niederlagen
  // gegen diesen Gegner oder sobald man ihn einmal besiegt hat.
  startDeck: { groesse: [11, 10, 10, 10], offen: 3 },
  bestesDeckNach: 2,
  // Druckerwerkstatt: Siegellack ausgeben. Ein Siegelbrief ist am günstigsten; Wunschkarten (nur Konter gegen Karten,
  // die man schon kennt) kosten nach Seltenheit; Prachtausgaben verschönern eigene Karten (Stufe 1 koloriert, Stufe 2 mit Gold).
  // Perspektivwechsel: Man spielt die Kirche gegen einen Computer-Luther. Frei, sobald Kapitel 3 geschafft ist (abKapitel).
  // Karten: alle Kirchenkarten, denen man in der Kampagne begegnet ist; Anführer: die Kirchenvertreter, die man besiegt hat.
  // Luthers Decks enthalten nur Argumente, die es im jeweiligen Jahr schon gab. frage: Gesprächsanlass nach der Partie (ohne Bewertung).
  // Balance (Simulation, Kirche spielt klug): lutherPlus macht Luthers Argumente stärker („sie überzeugen viele“). Wer nur die stärksten
  // Kirchenkarten nimmt, verliert später fast immer; wer Karten wählt, die Luther nicht entkräften kann, gewinnt meist (92/100, 18/77, 3/40 %).
  kirchenSeite: {
    abKapitel: 3, lackJeSieg: 3,
    titel: 'Perspektivwechsel: Du bist die Kirche',
    text: 'Jetzt verteidigst du die Kirche gegen Martin Luther. Du spielst mit den Karten der Kirche, die du in deinen Disputationen kennengelernt hast. Achte darauf, welche deiner Karten Luther entkräften kann.',
    zu: 'Frei, sobald du Kapitel 3 „Der Streit der Schriften“ geschafft hast.',
    gegner: ['l-moench', 'l-leipzig', 'l-worms']
  },
  lutherGegner: {
    'l-moench': { id: 'l-moench', figur: 'luther', name: 'Der junge Luther', wen: 'den jungen Luther', wer: 'der junge Luther', ort: 'Wittenberg, 1517', seite: 'luther', regeln: { handLuther: 8, handKirche: 6, lutherPlus: 2 },
      deck: ['k2', 'k3', 'k4', 'w1', 'w2', 'w3', 'k6', 't27', 't36', 't43', 'n1'],
      einleitung: 'Ein Mönch und Professor in Wittenberg greift den Ablasshandel an. Halte dagegen, was die Kirche lehrt.',
      sieg: 'Der junge Mönch kommt mit seinen Thesen nicht durch.', niederlage: 'Seine Thesen überzeugen. Welche deiner Karten hat er entkräftet?',
      frage: 'Welches Argument der Kirche war in dieser Partie am stärksten? Warum hat es Luther trotzdem nicht überzeugt?' },
    'l-leipzig': { id: 'l-leipzig', figur: 'luther', name: 'Professor Luther', wen: 'Professor Luther', wer: 'Professor Luther', ort: 'Leipzig, 1519', seite: 'luther', anfuehrer: 'a-melanchthon', regeln: { handLuther: 8, handKirche: 6, lutherPlus: 3 },
      deck: ['k5', 'k9', 'k8', 'n2', 'k12', 'k3', 'w2', 'k7', 'r18', 'k2', 'w1'],
      einleitung: 'In Leipzig streitet Luther über Papst und Konzilien. An seiner Seite: Philipp Melanchthon.',
      sieg: 'Du hast die Lehre der Kirche verteidigt. Luther bleibt trotzdem bei seiner Meinung.', niederlage: 'Luther beruft sich auf die Bibel. Welche deiner Karten konnte er damit entkräften?',
      frage: 'Die Kirche beruft sich auf Papst, Konzilien und Tradition, Luther auf die Bibel. Welche Begründung findest du überzeugender, und warum?' },
    'l-worms': { id: 'l-worms', figur: 'luther', portrait: 'kunst-a-luther', name: 'Luther in Worms', wen: 'Luther in Worms', wer: 'Luther', ort: 'Worms, 1521', seite: 'luther', anfuehrer: 'a-friedrich',
      deck: ['k10', 'r15', 'r10', 'r11', 'r9', 'k13', 'r13', 'r22', 'k12', 'k5', 'k9', 'r2'], regeln: { handLuther: 8, handKirche: 6, lutherPlus: 2 },
      einleitung: 'Vor Kaiser und Reich soll Luther widerrufen. Er hat starke Argumente und einen mächtigen Beschützer.',
      sieg: 'Die Kirche behält das letzte Wort, auf diesem Reichstag. Doch Luthers Schriften sind längst gedruckt.', niederlage: 'Luther widerruft nicht. Welches seiner Argumente war am schwersten zu beantworten?',
      frage: 'Stell dir vor, du bist ein Vertreter der Kirche in Worms. Was hättest du Luther gesagt? Und was hätte er geantwortet?' }
  },
  // Abschluss nach dem ersten Sieg gegen den Papst: Urkunde (nur zum Ansehen) und ein historischer Ausklang.
  // Wichtig: Luther hat Rom nicht „besiegt“. Der Ausklang ordnet ein, was seine Argumente bewirkt haben.
  finale: {
    titel: 'Meister der Disputation',
    einleitung: 'Du hast jede Karte Roms mit einem Argument beantwortet, vom Novizenmeister in Erfurt bis zum Papst in Rom.',
    ausklangTitel: 'Und wie ging es wirklich weiter?',
    ausklang: [
      '1521 belegt Papst Leo X. Luther mit dem Bann, auf dem Reichstag in Worms verhängt der Kaiser die Reichsacht. Besiegt hat Luther Rom nicht.',
      'Aber seine Argumente verbreiten sich durch den Buchdruck schneller, als man sie verbieten kann. Es entstehen evangelische Kirchen, die Christen im Westen Europas sind seitdem getrennt.',
      'Heute arbeiten katholische und evangelische Christen in vielem zusammen. 2017, 500 Jahre nach den Thesen, haben sie in Deutschland gemeinsam an die Reformation erinnert.'
    ],
    urkunde: 'Hiermit wird bezeugt, dass in der Disputation „Hammer & Siegel“ alle zwölf Gegner mit guten Argumenten beantwortet wurden.'
  },
  werkstatt: { brief: 5, karte: { gewoehnlich: 8, selten: 12, episch: 20, legendaer: 30 }, pracht: [3, 8] },
  // Siegel-Abzeichen: Aufgaben, die zu immer neuen Decks anregen. Jedes bringt Siegellack (js/puzzles/kampagne.js, ABZEICHEN_WACHS).
  // bed: gegner (nur gegen ihn), abKapitel (Gegner ab diesem Kapitel, 1–4), typMin/typMax (Karten einer Art im Deck), bundMin, deckMax,
  // trefferMin (Konter in einer Partie), zuNull (keine Runde verloren), ohneAnfuehrer, durchschaut (für jede Karte dieses Gegners
  // einen Konter im Lexikon), lexikonMin. Alle Bedingungen außer durchschaut und lexikonMin verlangen einen Sieg.
  abzeichen: [
    { id: 'thesen', symbol: 'these', titel: 'Thesenanschlag', text: 'Besiege Tetzel mit mindestens fünf Thesen im Deck.', bed: { gegner: 'k-tetzel', typMin: { these: 5 } } },
    { id: 'presse', symbol: 'druck', titel: 'Die Presse rollt', text: 'Besiege einen Gegner ab Kapitel 2 mit mindestens fünf Druck-Karten im Deck.', bed: { abKapitel: 2, typMin: { druck: 5 } } },
    { id: 'schrift', symbol: 'bibel', titel: 'Allein die Schrift', text: 'Besiege einen Gegner ab Kapitel 2 mit mindestens fünf Bibel-Karten im Deck.', bed: { abKapitel: 2, typMin: { bibel: 5 } } },
    { id: 'stimmen', symbol: 'menschen', titel: 'Viele Stimmen', text: 'Besiege einen Gegner ab Kapitel 2 mit mindestens sechs Karten der Art Menschen.', bed: { abKapitel: 2, typMin: { menschen: 6 } } },
    { id: 'gelehrt', symbol: 'wissen', titel: 'Gelehrtenstreit', text: 'Besiege einen Gegner ab Kapitel 2 mit mindestens sechs Wissen-Karten im Deck.', bed: { abKapitel: 2, typMin: { wissen: 6 } } },
    { id: 'bund', symbol: 'menschen', titel: 'Gemeinsam stark', text: 'Besiege einen Gegner ab Kapitel 2 mit mindestens fünf Bund-Karten im Deck.', bed: { abKapitel: 2, bundMin: 5 } },
    { id: 'ohne-bibel', symbol: 'wissen', titel: 'Leipzig ohne Bibel', text: 'Besiege Johann Eck ohne eine einzige Bibel-Karte im Deck.', bed: { gegner: 'k-eck', typMax: { bibel: 0 } } },
    { id: 'gepaeck', symbol: 'druck', titel: 'Leichtes Gepäck', text: 'Besiege Hieronymus Emser mit nur acht Karten im Deck.', bed: { gegner: 'k-emser', deckMax: 8 } },
    { id: 'kontermeister', symbol: 'gewissen', titel: 'Kontermeister', text: 'Entkräfte in einer gewonnenen Partie vier Karten der Kirche.', bed: { trefferMin: 4 } },
    { id: 'ohne-kratzer', symbol: 'gottesbild', titel: 'Ohne Kratzer', text: 'Besiege einen Gegner ab Kapitel 3, ohne eine Runde zu verlieren.', bed: { abKapitel: 3, zuNull: true } },
    { id: 'allein', symbol: 'gewissen', titel: 'Auf eigenen Füßen', text: 'Besiege einen Gegner ab Kapitel 3, ohne deinen Anführer auszuspielen.', bed: { abKapitel: 3, ohneAnfuehrer: true } },
    { id: 'tetzel-durchschaut', symbol: 'rom', titel: 'Tetzel durchschaut', text: 'Finde für jede Karte Tetzels einen Konter (Konter-Lexikon).', bed: { durchschaut: 'k-tetzel' } },
    { id: 'eck-durchschaut', symbol: 'rom', titel: 'Eck durchschaut', text: 'Finde für jede Karte Johann Ecks einen Konter (Konter-Lexikon).', bed: { durchschaut: 'k-eck' } },
    { id: 'kaiser-durchschaut', symbol: 'rom', titel: 'Den Kaiser durchschaut', text: 'Finde für jede Karte Kaiser Karls einen Konter (Konter-Lexikon).', bed: { durchschaut: 'k-karl' } },
    { id: 'gelehrter', symbol: 'gnade', titel: 'Konter-Gelehrter', text: 'Entdecke 30 Konter im Konter-Lexikon.', bed: { lexikonMin: 30 } },
    { id: 'rom', symbol: 'kirche', titel: 'Bis nach Rom', text: 'Besiege Papst Leo X.', bed: { gegner: 'k-leo' } }
  ],
  // Einführung beim ersten Start: sechs Tafeln mit Bild (art bestimmt das Bild, siehe js/puzzles/kampagne-extras.js)
  einfuehrung: [
    { art: 'weg', titel: 'Argumentiere dich nach oben!', text: 'Die Geschichte ist geschafft. Jetzt beginnt dein eigenes Spiel: Zwölf Gegner stehen zwischen dir und dem Gipfel. Ganz oben warten der Kaiser und der Papst.' },
    { art: 'karten', titel: 'Deine Karten kommen mit', text: 'Alle Argumente, die du in der Geschichte gesammelt hast, gehören dir. Vor jeder Partie stellst du daraus dein Deck zusammen: acht bis zwölf Karten.' },
    { art: 'briefe', titel: 'Siegelbriefe voller Karten', text: 'Jeder Sieg bringt einen Siegelbrief mit drei Karten. Mit drei Sternen gibt es einen großen dazu. Epische Karten gibt es erst ab Kapitel 2, legendäre erst ab Kapitel 3: Wer weiterkommt, findet die stärksten Karten.' },
    { art: 'lack', titel: 'Nichts geht verloren: Siegellack', text: 'Gewöhnliche und seltene Karten darfst du zweimal haben, epische und legendäre einmal. Bekommst du mehr, wird daraus Siegellack. In der Druckerwerkstatt tauschst du ihn gegen Siegelbriefe (fünf Siegellack), Wunschkarten oder Prachtausgaben.' },
    { art: 'anfuehrer', titel: 'Anführer freischalten', text: 'Für Sterne bekommst du neue Anführer: Melanchthon, Friedrich den Weisen und Katharina von Bora. Deinen Anführer spielst du einmal pro Partie, und er ist stark.' },
    { art: 'wieder', titel: 'Stecken geblieben?', text: 'Spiel frühere Gegner noch einmal: Jeder Sieg bringt einen neuen Siegelbrief, und dein Deck wird stärker. Schau genau hin, welche Karte welche entkräftet. Wer das herausfindet, schlägt auch den Kaiser.' }
  ],
  kapitel: [
    // geschafft: was historisch am Ende des Kapitels steht; weiter: Ausblick auf das nächste Kapitel (Kapitel-Abschluss)
    { titel: 'Kloster und Markt', zeit: 'bis 1517', gegner: ['k-novize', 'k-prediger', 'k-tetzel'],
      geschafft: 'Im Herbst 1517 veröffentlicht Luther seine 95 Thesen gegen den Ablasshandel. In wenigen Wochen kennt man sie in ganz Deutschland.',
      weiter: 'Jetzt meldet sich Rom: Gelehrte des Papstes und ein Kardinal stellen Luther zur Rede.' },
    { titel: 'Rom antwortet', zeit: '1518 bis 1519', gegner: ['k-prierias', 'k-cajetan', 'k-eck'],
      geschafft: 'In Augsburg verlangt Kardinal Cajetan den Widerruf, in Leipzig streitet Luther mit Johann Eck. Luther bleibt bei seinen Argumenten.',
      weiter: 'Nun wird mit Schriften gestritten: Flugschriften, Spottbilder und eine Bannandrohung aus Rom.' },
    { titel: 'Der Streit der Schriften', zeit: '1520 bis 1521', gegner: ['k-emser', 'k-aleander', 'k-albrecht'],
      geschafft: '1520 schreibt Luther seine großen Reformationsschriften. Die Bannandrohung des Papstes verbrennt er öffentlich vor dem Elstertor in Wittenberg.',
      weiter: 'In Worms stehen Luther Kaiser und Reich gegenüber. Am Ende wartet der Papst selbst.' },
    { titel: 'Kaiser und Papst', zeit: '1521 bis 1522', gegner: ['k-georg', 'k-karl', 'k-leo'] }
  ],
  // belohnungen: Beim ersten Sieg gegen diesen Gegner enthält der Siegelbrief sicher eine dieser Karten (js/puzzles/kampagne.js, briefRules).
  gegner: {
    'k-novize': { id: 'k-novize', figur: 'novize', name: 'Der Novizenmeister', wen: 'den Novizenmeister', ort: 'Erfurt, 1506', anfuehrer: 'a-novize',
      deck: ['c-werke', 'c-richter', 'c-fegefeuer', 'c-brief', 'c-ketzer', 'c-gehorsam', 'c-ketzer', 'c-brief'], belohnungen: ['r9', 'r8', 'r14'],
      einleitung: 'Im Kloster lernen die jungen Mönche, was die Kirche lehrt. Der Novizenmeister prüft dich.',
      sieg: 'Der Novizenmeister nickt. Du hast gut zugehört und noch besser geantwortet.', niederlage: 'Der Novizenmeister lächelt. Übung macht den Meister.' },
    'k-prediger': { id: 'k-prediger', figur: 'prediger', name: 'Ein Ablassprediger', wen: 'einen Ablassprediger', ort: 'Unterwegs, 1517',
      deck: ['c-ablassprediger', 'c-ablassprediger', 'c-brief', 'c-brief', 'c-ablass', 'c-fegefeuer', 'c-petersdom', 'c-predigt', 'c-richter'], belohnungen: ['r12', 'r13', 'r2'],
      einleitung: 'Von Dorf zu Dorf ziehen Prediger mit Kasten und Kreuz. Dieser hier wirbt für den Ablass.',
      sieg: 'Der Prediger zieht weiter. Heute hat niemand gekauft.', niederlage: 'Die Leute stehen Schlange am Kasten.' },
    'k-tetzel': { id: 'k-tetzel', figur: 'tetzel', name: 'Johann Tetzel', ort: 'Jüterbog, 1517', anfuehrer: 'a-tetzel',
      deck: ['c-predigt', 'c-ablassprediger', 'c-brief', 'c-ablass', 'c-fegefeuer', 'c-richter', 'c-petersdom', 'c-werke', 'c-ketzer'], belohnungen: ['r18', 'r2', 'r7'],
      einleitung: 'Tetzel ist ein geübter Prediger. Diesmal hat er seine besten Karten dabei.',
      sieg: 'Tetzel packt den Kasten ein. Die Leute denken nach.', niederlage: 'Tetzel bleibt der Meister des Marktplatzes.' },
    'k-prierias': { id: 'k-prierias', figur: 'prierias', name: 'Silvester Prierias', ort: 'Rom, 1518', anfuehrer: 'a-prierias',
      deck: ['c-unfehlbar', 'c-papst', 'c-kurie', 'c-gehorsam', 'c-latein', 'c-tradition', 'c-ketzer', 'c-werke', 'c-brief'], belohnungen: ['r11', 'r1', 'r7'],
      einleitung: 'Prierias ist Theologe am Hof des Papstes. Für ihn kann die römische Kirche im Glauben nicht irren.',
      sieg: 'In Rom merkt man: Dieser Mönch lässt sich nicht einfach abweisen.', niederlage: 'Rom hat gesprochen. Noch fehlen dir Antworten.' },
    'k-cajetan': { id: 'k-cajetan', figur: 'cajetan', name: 'Kardinal Cajetan', ort: 'Augsburg, 1518', anfuehrer: 'a-cajetan',
      deck: ['c-gehorsam', 'c-papst', 'c-kurie', 'c-widerrufe', 'c-tradition', 'c-bann', 'c-ketzerprozess', 'c-ablass', 'c-konzil'], belohnungen: ['r16', 'r6', 'r3', 'r19'],
      einleitung: 'Im Oktober 1518 verhört der Kardinal Luther in Augsburg. Er verlangt nur eines: den Widerruf.',
      sieg: 'Luther widerruft nicht und verlässt Augsburg heimlich in der Nacht.', niederlage: 'Der Kardinal bleibt hart. Die Lage wird gefährlich.' },
    'k-eck': { id: 'k-eck', figur: 'eck', name: 'Johann Eck', ort: 'Leipzig, 1519', anfuehrer: 'a-eck',
      deck: ['c-eck', 'c-konzil', 'c-papst', 'c-hus', 'c-tradition', 'c-ketzer', 'c-unfehlbar', 'c-bann', 'c-ingolstadt'], belohnungen: ['r15', 'r10', 'r5', 'r20'],
      einleitung: 'Revanche in Leipzig: Diesmal kennst du Ecks Karten. Und du hast Antworten.',
      sieg: 'Diesmal hast du Eck geschlagen. Die Studenten jubeln.', niederlage: 'Eck ist und bleibt ein gefährlicher Gegner.' },
    'k-emser': { id: 'k-emser', figur: 'emser', name: 'Hieronymus Emser', ort: 'Dresden, 1520', anfuehrer: 'a-emser', regeln: { handKirche: 8 },
      deck: ['c-latein', 'c-verbrennung', 'c-gehorsam', 'c-weihe', 'c-spott', 'c-tradition', 'c-widerrufe', 'c-hus', 'c-bulle'], belohnungen: ['r13', 'r23', 'r17', 'r7', 'r21'],
      einleitung: 'Emser ist Sekretär von Herzog Georg. Er streitet in vielen Schriften gegen Luther.',
      sieg: 'Die Federn sind gespitzt, doch deine Argumente stehen.', niederlage: 'Emsers Schriften überzeugen viele Leser.' },
    'k-aleander': { id: 'k-aleander', figur: 'aleander', name: 'Hieronymus Aleander', ort: 'Worms, 1521', anfuehrer: 'a-aleander',
      deck: ['c-bulle', 'c-verbrennung', 'c-bann', 'c-ketzerprozess', 'c-papst', 'c-kurie', 'c-widerrufe', 'c-reichsacht', 'c-konzil'], belohnungen: ['r4', 'r1', 'r10', 'r22'],
      einleitung: 'Aleander ist der Gesandte des Papstes in Worms. Er treibt das Urteil gegen Luther voran.',
      sieg: 'Aleander ist verärgert. Viele Fürsten hören Luther zu.', niederlage: 'Aleander setzt sich durch. Das Urteil rückt näher.' },
    'k-albrecht': { id: 'k-albrecht', figur: 'albrecht', name: 'Albrecht von Mainz', ort: 'Mainz, 1521', anfuehrer: 'a-albrecht', regeln: { handKirche: 8 },
      deck: ['c-ablass', 'c-ablassprediger', 'c-petersdom', 'c-brief', 'c-zoelibat', 'c-kurie', 'c-weihe', 'c-messe', 'c-richter', 'c-landsknechte'], belohnungen: ['r10', 'r5', 'r16', 'r25', 'r26'],
      einleitung: 'Der Erzbischof ließ den Ablass predigen, um seine Schulden zu bezahlen. Er hat viel Geld und viel Macht.',
      sieg: 'Der Erzbischof muss nachgeben. Sein Ablasshandel bringt kaum noch etwas ein.', niederlage: 'Geld und Macht sind auf Albrechts Seite.' },
    'k-georg': { id: 'k-georg', figur: 'georg', name: 'Herzog Georg von Sachsen', ort: 'Dresden, 1522', anfuehrer: 'a-georg', regeln: { handKirche: 9 },
      deck: ['c-latein', 'c-verbrennung', 'c-landsknechte', 'c-mehrheit', 'c-ordnung', 'c-messe', 'c-ketzerprozess', 'c-weihe', 'c-edikt'], belohnungen: ['r17', 'r14', 'r6', 'r27', 'r30'],
      einleitung: 'Herzog Georg bleibt beim alten Glauben. In seinem Land ist Luthers Bibel verboten.',
      sieg: 'Selbst im Land des Herzogs lesen manche heimlich Luthers Bibel.', niederlage: 'Der Herzog lässt Luthers Bücher einsammeln.' },
    'k-karl': { id: 'k-karl', figur: 'kaiser', name: 'Kaiser Karl V.', ort: 'Worms, 1521', anfuehrer: 'a-karl', regeln: { handKirche: 8 },
      deck: ['c-papst', 'c-konzil', 'c-ordnung', 'c-mehrheit', 'c-edikt', 'c-tradition', 'c-hus', 'c-reichsacht', 'c-landsknechte', 'c-richter'], belohnungen: ['r1', 'r9', 'r11', 'r28'],
      einleitung: 'Der junge Kaiser will Reich und Kirche zusammenhalten. Er hat die Macht des ganzen Reichs.',
      sieg: 'Du hast die stärkeren Argumente. Der Kaiser bleibt trotzdem bei seinem Urteil.', niederlage: 'Die Macht des Kaisers ist zu groß.' },
    'k-leo': { id: 'k-leo', figur: 'leo', name: 'Papst Leo X.', ort: 'Rom, 1521', anfuehrer: 'a-leo', regeln: { handKirche: 10 },
      deck: ['c-papst', 'c-kurie', 'c-unfehlbar', 'c-bulle', 'c-bann', 'c-konzil', 'c-tradition', 'c-zoelibat', 'c-weihe', 'c-latein', 'c-ablass'], belohnungen: ['r5', 'r15', 'r11', 'r24', 'r29'],
      einleitung: 'Der letzte und stärkste Gegner: der Papst selbst, mit allen Karten der Kirche von Rom.',
      sieg: 'Meisterhaft! Du kennst jede Karte Roms und ihre Antwort. Die letzte Disputation ist gewonnen.', niederlage: 'Rom ist mächtig. Stell dein Deck neu zusammen und versuch es noch einmal.' }
  }
};
