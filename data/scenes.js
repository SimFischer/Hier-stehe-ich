// Szenen und Hotspots. x und y sind Prozentwerte im Bild (4:3) und bezeichnen den unteren Mittelpunkt des Hotspots.
// objekt: Gegenstand als Bild in der Szene (breite in Prozent). zeigt: Bild, das beim Ansehen neben dem Text erscheint.
// art: ansehen | gespraech | raetsel. optional: für den Kernpfad nicht nötig (zählt in der Zeitschätzung halb).
export const scenes = [
  {
    id: 'druckerei', name: 'Die Druckerei', zeit: 'Wittenberg, Herbst 1522', bild: { typ: 'werkstatt', datei: 'bg-druckerei' },
    einstieg: [
      { wenn: { done: 'f' }, text: 'Deine Flugschrift hängt zum Trocknen an der Leine. Die Presse ruht.' },
      { wenn: { done: 's7' }, text: 'Alle sieben Platten liegen bereit. Jetzt wird gesetzt und gedruckt.' },
      { wenn: { done: 'p' }, text: 'Die Presse wartet. Auf der Karte findest du die Orte, an denen alles geschah.' },
      { text: 'Wittenberg, Herbst 1522. Du bist Lehrling in einer Druckerei. Heute Morgen ist der Setzkasten umgestürzt. Der Meister sieht nicht glücklich aus.' }
    ],
    ziel: [
      { wenn: { done: 'f' }, text: 'Geschafft! Über den Titel oben kommst du zum Menü.' },
      { wenn: { done: 's7' }, text: 'Geh zum Setzkasten und setze deine Flugschrift.' },
      { wenn: { done: 'p' }, text: 'Öffne die Karte und reise zu einem Ort.' },
      { text: 'Sprich mit dem Meister und sieh dir den Setzkasten an.' }
    ],
    hotspots: [
      { id: 'meister', label: 'Meister', figur: 'meister', x: 88, y: 90, art: 'gespraech', ziel: 'meister', zeigtWenn: { nichtDone: 'p' } },
      { id: 'meister2', label: 'Meister', figur: 'meister', x: 88, y: 90, art: 'gespraech', ziel: 'meister-zwischen', zeigtWenn: { done: 'p' } },
      { id: 'setzkasten', label: 'Setzkasten', x: 51, y: 70, art: 'ansehen', zeigtWenn: { nichtDone: 's7' },
        text: 'Lettern liegen überall auf dem Boden. Sieben Fächer für Druckplatten sind leer. Jede Platte zeigte ein Bild aus Luthers Leben.' },
      { id: 'setzen', label: 'Setzkasten', x: 51, y: 70, art: 'raetsel', ziel: 'finale', zeigtWenn: { done: 's7', nichtDone: 'f' } },
      { id: 'regal', label: 'Regal', x: 72, y: 42, zeigt: 'septembertestament', art: 'ansehen', merken: true, optional: true,
        text: 'Ein dickes Buch, ganz neu: Luthers Neues Testament auf Deutsch. Es ist im September erschienen. Der Meister sagt, es komme von Lotter drüben.' }
    ]
  },
  {
    id: 'kirche', name: 'Eine Dorfkirche', zeit: 'um 1500', bild: { typ: 'kirche', datei: 'bg-kirche' },
    einstieg: [{ text: 'Um 1500. Eine Dorfkirche, kühl und still. An der Wand war einmal ein großes Bild. Seine Teile sind durcheinandergeraten.' }],
    ziel: [
      { wenn: { done: 's1' }, text: 'Hier ist alles erledigt. Öffne die Karte.' },
      { wenn: { flag: 'g:pilger' }, text: 'Ordne das Wandbild an der Wand.' },
      { text: 'Sprich mit dem Pilger.' }
    ],
    hotspots: [
      { id: 'pilger', label: 'Pilger', figur: 'pilger', x: 46, y: 92, art: 'gespraech', ziel: 'pilger' },
      { id: 'altar', label: 'Seitenaltar', x: 23, y: 64, zeigt: 'weg-reliquien', art: 'ansehen', merken: true, optional: true,
        text: 'Ein Kästchen mit Reliquien. Das sind Überreste von Heiligen. Viele Menschen pilgern weit, um so etwas zu sehen.' },
      { id: 'wandbild', label: 'Wandbild', x: 68, y: 50, art: 'raetsel', ziel: 'wandbild', wenn: { flag: 'g:pilger' }, zeigtWenn: { nichtDone: 's1' },
        gesperrt: 'Das Bild ist ein einziges Durcheinander. Der Pilger weiß vielleicht mehr.' }
    ]
  },
  {
    id: 'stotternheim', name: 'Bei Stotternheim', zeit: '2. Juli 1505', bild: { typ: 'feld', datei: 'bg-stotternheim-1' }, weiter: 'kloster',
    film: [
      { text: '2. Juli 1505. Ein Student wandert nach Erfurt. Er heißt Martin Luder und ist 21 Jahre alt.' },
      { text: 'Bei dem Dorf Stotternheim zieht ein Gewitter auf. Weit und breit gibt es keinen Schutz.' },
      { blitz: true, bild: 'bg-stotternheim-2', text: 'Ein Blitz schlägt dicht neben ihm ein. Er stürzt zu Boden.' },
      { bild: 'bg-stotternheim-2', text: 'In Todesangst ruft er die heilige Anna an. Er verspricht, Mönch zu werden.' },
      { text: 'Am 17. Juli 1505 tritt er in Erfurt ins Kloster ein. Sein Vater ist entsetzt.' }
    ]
  },
  {
    id: 'kloster', name: 'Im Erfurter Kloster', zeit: '1505', bild: { typ: 'kloster', datei: 'bg-kloster' },
    einstieg: [{ text: 'Das Kloster der Augustiner in Erfurt. Hier lebt Bruder Martin jetzt. Der Tag beginnt mitten in der Nacht.' }],
    ziel: [
      { wenn: { done: 's2' }, text: 'Hier ist alles erledigt. Öffne die Karte.' },
      { wenn: { flag: 'g:mitbruder' }, text: 'Probiere die Waage im Kreuzgang aus.' },
      { text: 'Sprich mit dem Mönch.' }
    ],
    hotspots: [
      { id: 'mitbruder', label: 'Mönch', figur: 'mitbruder', x: 88, y: 94, art: 'gespraech', ziel: 'mitbruder' },
      { id: 'tafel', label: 'Betpult', x: 35, y: 60, art: 'ansehen', merken: true, optional: true,
        text: 'Der Tagesplan: sieben Gebetszeiten, die erste um zwei Uhr nachts. Dazu Fasten, Schweigen, Arbeit und Beichte.' },
      { id: 'zelle', label: 'Zelle', x: 20, y: 66, art: 'ansehen', optional: true,
        text: 'Eine Pritsche, ein Betpult, eine Kerze. Bruder Martin schläft oft kaum. Er fürchtet, nicht genug getan zu haben.' },
      { id: 'waage', label: 'Waage', x: 63, y: 69, objekt: { bild: 'waage', breite: 21 }, art: 'raetsel', ziel: 'waage', wenn: { flag: 'g:mitbruder' }, zeigtWenn: { nichtDone: 's2' },
        gesperrt: 'Eine große Waage. Wozu steht sie hier? Frag den Mönch.' }
    ]
  },
  {
    id: 'turmzimmer', name: 'Das Turmzimmer', zeit: 'Wittenberg, um 1515–1518', bild: { typ: 'stube', datei: 'bg-turmzimmer' },
    einstieg: [{ text: 'Wittenberg, einige Jahre später. Luther ist jetzt Professor für die Bibel und arbeitet im Turm des Klosters. Wann genau er hier seine Entdeckung machte, weiß niemand sicher.' }],
    ziel: [
      { wenn: { done: 's3' }, text: 'Hier ist alles erledigt. Öffne die Karte.' },
      { wenn: { flag: ['h:turmzimmer.bibel', 'h:turmzimmer.zettel'] }, text: 'Geh zur freien Fläche und stelle die Standbilder.' },
      { text: 'Sieh dir die Bibel und den Zettel an.' }
    ],
    hotspots: [
      { id: 'luther', label: 'Doktor Luther', figur: 'luther', x: 56, y: 94, art: 'ansehen', optional: true,
        text: 'Doktor Luther bemerkt dich nicht. Er liest immer wieder denselben Satz. Dann atmet er tief auf.' },
      { id: 'bibel', label: 'Bibel', x: 31, y: 48, art: 'ansehen', gibt: 'k5', merken: true,
        text: 'Der Brief des Paulus an die Römer. Ein Satz ist unterstrichen: „Der Gerechte wird aus Glauben leben.“ Luther versteht: Gottes Gerechtigkeit ist kein Strafgericht. Sie ist ein Geschenk.' },
      { id: 'zettel', label: 'Zettel', x: 24, y: 64, art: 'ansehen', gibt: 'k4', merken: true,
        text: 'Ein Zettel mit einer Geschichte von Jesus. Ein Sohn verprasst sein Erbe und kommt arm zurück. Der Vater läuft ihm entgegen und feiert ein Fest. „So ist Gott“, steht darunter.' },
      { id: 'brief', label: 'Unterschrift', x: 87, y: 50, art: 'ansehen', merken: true, optional: true,
        text: 'Ein Brief, unterschrieben mit „Eleutherius“. Das ist Griechisch und heißt „der Freie“. Aus Martin Luder wird in diesen Jahren Martin Luther.' },
      { id: 'buehne', label: 'Freie Fläche', x: 74, y: 78, art: 'raetsel', ziel: 'standbild', wenn: { flag: ['h:turmzimmer.bibel', 'h:turmzimmer.zettel'] }, zeigtWenn: { nichtDone: 's3' },
        gesperrt: 'Hier ist Platz für ein Standbild. Aber wovon? Sieh dich erst um.' }
    ]
  },
  {
    id: 'jueterbog', name: 'Der Markt von Jüterbog', zeit: '1517', bild: { typ: 'markt', datei: 'bg-jueterbog' },
    einstieg: [{ text: 'Jüterbog, 1517. In Wittenberg ist der Ablasshandel verboten. Also laufen viele über die Grenze hierher. Auf dem Markt predigt der Mönch Johann Tetzel.' }],
    ziel: [
      { wenn: { done: 's4' }, text: 'Hier ist alles erledigt. Öffne die Karte.' },
      { wenn: { flag: ['h:jueterbog.brief', 'h:jueterbog.kasten', 'g:kaplan'] }, text: 'Du weißt genug. Läute die Glocke und sprich mit den Leuten.' },
      { text: 'Bereite dich vor: Untersuche Brief und Kasten und sprich mit dem Kaplan.' }
    ],
    hotspots: [
      { id: 'tetzel', label: 'Tetzel', figur: 'tetzel', x: 17, y: 72, art: 'ansehen', merken: true, optional: true,
        text: 'Tetzel predigt mit lauter Stimme. Man sagt, er habe gereimt: „Wenn das Geld im Kasten klingt, die Seele aus dem Feuer springt.“ Ob er es genau so sagte, ist nicht belegt.' },
      { id: 'brief', label: 'Ablassbrief', x: 86, y: 66, zeigt: 'ablassbrief', art: 'ansehen', gibt: 'w2', merken: true,
        text: 'Ein gedruckter Brief mit einem freien Feld für den Namen. Er verspricht: Die Strafen für deine Sünden werden erlassen. Eigentlich gehört Reue dazu. Doch davon ist auf dem Markt kaum die Rede.' },
      { id: 'kasten', label: 'Ablasskasten', x: 38, y: 80, objekt: { bild: 'ablasskasten', breite: 12 }, zeigt: 'geldweg-fugger', art: 'ansehen', gibt: 'w1', merken: true,
        text: 'Die Truhe hat drei Schlösser. Wohin geht das Geld? Eine Hälfte bekommt Erzbischof Albrecht. Er hat Schulden beim Bankhaus Fugger. Die andere Hälfte geht nach Rom, für den Bau des Petersdoms.' },
      { id: 'kaplan', label: 'Kaplan', figur: 'kaplan', x: 62, y: 88, art: 'gespraech', ziel: 'kaplan' },
      { id: 'glocke', label: 'Glocke läuten', x: 56, y: 24, art: 'raetsel', ziel: 'marktplatz', wenn: { flag: ['h:jueterbog.brief', 'h:jueterbog.kasten', 'g:kaplan'] }, zeigtWenn: { nichtDone: 's4' },
        gesperrt: 'Noch nicht. Erst solltest du wissen, worum es hier geht.' }
    ]
  },
  {
    id: 'schreibstube', name: 'Luthers Schreibstube', zeit: 'Wittenberg, 31. Oktober 1517', bild: { typ: 'stube', abend: true, datei: 'bg-schreibstube' },
    einstieg: [{ text: 'Wittenberg, 31. Oktober 1517. Luther hat von Jüterbog gehört. Er hat 95 Thesen über den Ablass geschrieben: Sätze, über die man streiten soll.' }],
    ziel: [
      { wenn: { done: 's5' }, text: 'Hier ist alles erledigt. Öffne die Karte.' },
      { wenn: { flag: 'h:schreibstube.brief' }, text: 'Nimm dir das Thesenblatt vor.' },
      { text: 'Sieh dir den Brief auf dem Tisch an.' }
    ],
    hotspots: [
      { id: 'brief', label: 'Brief', x: 60, y: 61, art: 'ansehen', gibt: 'k7', merken: true,
        text: 'Ein Brief an Erzbischof Albrecht, höflich im Ton. Luther bittet ihn, die Ablasspredigten zu prüfen. Die Thesen legt er bei. Er will die Kirche erneuern, nicht spalten.' },
      { id: 'zettel', label: 'Hinweiszettel', x: 73, y: 46, art: 'ansehen', merken: true, optional: true,
        text: 'Was wir wissen: Am 31. Oktober 1517 schickt Luther diesen Brief ab. Was erzählt wird: Er habe die Thesen an die Tür der Schlosskirche genagelt. Das ist möglich, aber nicht sicher belegt.' },
      { id: 'thesen', label: 'Thesenblatt', x: 46, y: 59, art: 'raetsel', ziel: 'druckwelle', wenn: { flag: 'h:schreibstube.brief' }, zeigtWenn: { nichtDone: 's5' },
        gesperrt: 'Ein eng beschriebenes Blatt auf Latein. Lies zuerst den Brief daneben.' }
    ]
  },
  {
    id: 'herberge', name: 'Eine Herberge in Worms', zeit: 'April 1521, in der Nacht', bild: { typ: 'stube', nacht: true, datei: 'bg-herberge' },
    einstieg: [{ text: 'Worms, April 1521. Vor Kaiser und Reich soll Luther seine Bücher widerrufen, also zurücknehmen. Er hat einen Tag Bedenkzeit bekommen. Du sitzt in seiner Herberge.' }],
    ziel: [
      { wenn: { done: 's6' }, text: 'Hier ist alles erledigt. Öffne die Karte.' },
      { wenn: { flag: ['h:herberge.buecher', 'h:herberge.bann'] }, text: 'Setz dich an den Tisch und wähle die Argumente für morgen.' },
      { text: 'Sieh dir die Bücher und das Schreiben aus Rom an.' }
    ],
    hotspots: [
      { id: 'buecher', label: 'Bücherstapel', x: 55, y: 55, art: 'ansehen', gibt: 'k9', merken: true,
        text: 'Luthers Bücher, ein ganzer Stapel. In einem steht: Auch Konzilien, die großen Versammlungen der Kirche, haben sich schon geirrt. Sie haben einander sogar widersprochen.' },
      { id: 'bann', label: 'Schreiben aus Rom', x: 87, y: 64, art: 'ansehen', merken: true,
        text: 'Eine Abschrift aus Rom. Im Januar 1521 hat Papst Leo X. den Kirchenbann über Luther verhängt. Luther ist damit aus der Kirche ausgeschlossen.' },
      { id: 'fenster', label: 'Fenster', x: 51, y: 40, art: 'ansehen', optional: true,
        text: 'Draußen stehen Leute bis tief in die Nacht. Manche rufen Luther Mut zu. Andere warten auf seinen Sturz.' },
      { id: 'tisch', label: 'Tisch', x: 45, y: 66, art: 'raetsel', ziel: 'verhoer', wenn: { flag: ['h:herberge.buecher', 'h:herberge.bann'] }, zeigtWenn: { nichtDone: 's6' },
        gesperrt: 'Hier wird die Antwort für morgen vorbereitet. Sieh dich erst im Zimmer um.' }
    ]
  },
  { id: 'saal', name: 'Der Saal im Bischofshof', zeit: 'Worms, 18. April 1521', bild: { typ: 'saal', datei: 'bg-saal' }, hotspots: [] },
  {
    id: 'wartburg', name: 'Auf der Wartburg', zeit: 'Winter 1521/22', bild: { typ: 'stube', winter: true, datei: 'bg-wartburg' },
    einstieg: [{ text: 'Die Wartburg bei Eisenach, Winter 1521/22. Hier versteckt sich Luther. Er nennt sich Junker Jörg. In nur elf Wochen übersetzt er das Neue Testament.' }],
    ziel: [
      { wenn: { done: 's7' }, text: 'Hier ist alles erledigt. Zurück in die Druckerei!' },
      { wenn: { flag: 'h:wartburg.alt' }, text: 'Geh ans Schreibpult und übersetze selbst.' },
      { text: 'Sieh dir die alte Bibel im Regal an.' }
    ],
    hotspots: [
      { id: 'junker', label: 'Junker Jörg', figur: 'junker', x: 85, y: 94, art: 'ansehen', optional: true,
        text: 'Junker Jörg schreibt, streicht durch und schreibt neu. Er sucht Wörter, die jeder versteht.' },
      { id: 'alt', label: 'Alte Bibel', x: 72, y: 47, art: 'ansehen', merken: true,
        text: 'Eine deutsche Bibel von 1483. Es gab also schon Übersetzungen. Aber sie klingen steif, Wort für Wort aus dem Latein. Und jede Gegend spricht anders.' },
      { id: 'notiz', label: 'Notiz', x: 61, y: 56, art: 'ansehen', merken: true, optional: true,
        text: 'Später, im Jahr 1530, erklärt Luther seine Art zu übersetzen. Man müsse den Leuten „auf das Maul sehen“. Also zuhören, wie sie wirklich reden.' },
      { id: 'pult', label: 'Schreibpult', x: 49, y: 55, art: 'raetsel', ziel: 'uebersetzung', wenn: { flag: 'h:wartburg.alt' }, zeigtWenn: { nichtDone: 's7' },
        gesperrt: 'Feder und Papier liegen bereit. Sieh dir erst an, wie Bibeln bisher klangen.' }
    ]
  }
];
