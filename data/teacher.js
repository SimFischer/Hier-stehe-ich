// Redaktionelle Inhalte des Lehrkräftekompendiums. Stationen, Zeiten, Karten und Lösungen kommen aus den Spieldaten.
export const teacher = {
  titel: 'Lehrkräftekompendium', untertitel: 'Hier stehe ich · Luther-Lernspiel für Klasse 7',
  zurueck: 'Zum Spiel', drucken: 'Anleitung drucken / Als PDF speichern',
  nav: { schnellstart: 'Schnellstart', ablauf: 'Ablauf', leitfaden: 'Leitfaden', bonus: 'Bonusspiele', disputation: 'Kartenspiel', loesungen: 'Lösungen', faq: 'Fragen', fach: 'Fachhinweise' },
  spalten: { station: 'Station', zeit: 'Zeit', minuten: '{n} min', ziel: 'Lernziele', raetsel: 'Rätsel', karten: 'Karten', material: 'Bezug zur Einheit', hinweis: 'Achte auf', nach: 'offen nach' },
  summe: 'Kernpfad zusammen: rund {n} Minuten (Planwerte). Die Schätzung aus Textmenge und Bedienschritten steht im README.',
  schnellstart: {
    titel: 'Schnellstart',
    punkte: [
      'iPads austeilen, die Adresse des Spiels öffnen. Quer- und Hochformat gehen beide.',
      'Allein oder zu zweit starten. Zu zweit beginnen die Abschlussfragen mit „Besprecht kurz“.',
      'Die Klasse braucht kein Konto und keinen Namen. Der Spielstand bleibt auf dem Gerät.',
      'Wer nicht fertig wird, notiert den Fortsetzungscode aus dem Menü (Tipp auf den Titel). Er gilt auf jedem Gerät.',
      'Lehrkraftmodus: den Titel fünf Sekunden halten oder Umschalt + Enter. Dort kannst du Stationen anspringen oder als gelöst markieren.',
      'Am Ende zeigen zwei Gruppen ihre Flugschrift. Über „Als Bild teilen“ lässt sie sich auf die Pinnwand laden.'
    ]
  },
  ablauf: {
    titel: 'Zwei Wege in die Stunde',
    varianten: [
      { name: 'Einzelstunde (45 Minuten)', schritte: ['2 min Einstieg: Rolle und Auftrag nennen', 'rund 40 min Kernpfad', '3 min Abschluss: zwei Flugschriften zeigen'],
        hinweis: 'Der Kernpfad ist knapp bemessen. Plane ein, dass langsame Gruppen in der nächsten Stunde mit dem Code weitermachen. Oder springe im Lehrkraftmodus über Station 1 und 2.' },
      { name: 'Doppelstunde (90 Minuten)', schritte: ['5 min Einstieg', 'rund 45 min Kernpfad', '20 min Bonusspiele nach Tempo', '10 min Nachdenken (im Spiel oder auf Papier)', '10 min Flugschriften teilen und kommentieren: zwei Dinge, die gelungen sind, ein Tipp'] }
    ]
  },
  lernziele: [
    'Luthers Lebensstationen 1505–1522 ordnen und Orte zuordnen',
    'erklären, warum Menschen um 1500 Fegefeuer und Gericht fürchteten und was ein Ablassbrief versprach',
    'Luthers Wandel im Gottesbild beschreiben: vom strengen Richter zum gnädigen Gott',
    'mindestens drei Thesen in eigenen Worten wiedergeben und Luthers Kritik am Ablass nennen',
    'erklären, warum Luther in Worms nicht widerrief und welche Folgen das hatte',
    'begründen, warum Luther die Bibel ins Deutsche übersetzte',
    'die vier „allein“ den Positionen der damaligen Kirche gegenüberstellen'
  ],
  leitfadenTitel: 'Leitfaden zu den Stationen',
  stationen: {
    p: { material: 'Einstieg, kein eigener Inhalt', hinweis: 'Die Karte gibt es erst nach dem Gespräch mit dem Meister und dem Blick auf den Setzkasten.' },
    s1: { material: 'Stunde 7: Jenseitsvorstellung im Mittelalter (Bildbeschreibung)', hinweis: 'Station 1 und 2 sind beide von Anfang an offen. So stauen sich die Gruppen nicht.' },
    s2: { material: 'Stunde 1/2: Text „Ein Leben im Aufbruch“, Steckbrief, Gegenüberstellung der Lehren (gute Werke)', hinweis: 'Die Waage kann nicht kippen: Immer wenn sie fast ausgeglichen ist, fällt eine neue Sünde hinein. Genau das ist die Erkenntnis. Manche suchen lange nach einer Lösung: Dann hilft die Hilfe 3.' },
    s3: { material: 'Stunde 2/3: Lied „Nun freut euch“, Gleichnis vom verlorenen Sohn, Standbilder', hinweis: 'Das Standbild hat mehrere richtige Lösungen. Die Rückmeldung erklärt, sie bewertet nicht streng. Das Lied ist von 1523 und wird im Spiel als späterer Rückblick benannt.' },
    s4: { material: 'Stunde 3: Ablasstext, Tetzel-Spruch', hinweis: 'Am Markt wählt man für jede Person eine von drei Antworten. Wer zuerst mit den Menschen nah am Kasten spricht, erreicht mehr. Danach folgt die erste Disputation gegen Tetzel. Sie ist erfunden, die Argumente nicht. Wer verliert, spielt trotzdem weiter und kann später eine Revanche spielen. Der Rat an die Bäuerin hat keine falsche Antwort und kehrt im Finale wieder.' },
    s5: { material: 'Stunde 3–6: AB 95 Thesen, Material 1–3; Aufgabe „Wer fertig ist“', hinweis: 'Die Druckwelle zeigt den Unterschied zwischen Latein und Deutsch. Frag danach: Was hat mehr gebracht, ein lateinisches oder ein deutsches Blatt?' },
    s6: { material: 'M 6/M 7 Reichstag zu Worms; Silbenrätsel (Kirchenbann, Reichsacht)', hinweis: 'Das Verhör ist eine Disputation gegen den Sprecher des Kaisers. Vorher baut man ein Deck aus höchstens zwölf Karten und sieht die Karten des Gegners. Ein Sieg ergibt Stufe 3, eine gewonnene Runde Stufe 2. Wer „Widerrufen“ wählt, sieht, was dann gefehlt hätte, und wählt neu. Das Urteil des Kaisers bleibt in jedem Fall gleich. M 7 legt Luther „hier stehe ich“ in den Mund; das Finale löst die Legende auf.' },
    s7: { material: 'M 8 „Luther übersetzt die Bibel“ (Psalm 23)', hinweis: 'Auf der Wartburg entstand das Neue Testament, nicht Psalm 23. Das Spiel sagt das offen und nutzt den Psalm als Übung, weil die Klasse ihn aus M 8 kennt.' },
    f: { material: 'AB „Gegenüberstellung der Lehren“, AB 11 „Forderungen der Reformation“', hinweis: 'Gnade und Glaube liegen für Klasse 7 nah beieinander. Die Rückmeldung im Spiel erklärt den Unterschied. Für die Flugschrift gilt: keine vollen Namen in die Schlagzeile.' }
  },
  disputation: {
    titel: 'Das Kartenspiel „Disputation“',
    absaetze: [
      'Die Karten der Kirche sind stark (bis 10), Luthers Karten schwach (1 bis 6). So wird erfahrbar: Die Kirche hatte die Argumenthoheit. Bei Gleichstand gewinnt sie.',
      'Luther gewinnt nur mit den passenden Erkenntnissen. Eine Karte wie „Wie der Vater“ entkräftet „Gott, der strenge Richter“: Solange sie liegt, zählt die Kirchenkarte nur 1.',
      'Gespielt wird wie bei bekannten Sammelkartenspielen: abwechselnd legen, passen, zwei Runden gewinnen. Vor Worms baut man ein Deck aus höchstens zwölf Karten und sieht dabei die Karten des Gegners.',
      'Nach einer Niederlage zeigt das Spiel, welche Karte geholfen hätte und wo es sie gibt. Leipzig ist bewusst früh offen: Ohne „Konzilien irren“ aus Worms ist Eck kaum zu schlagen.',
      'Tetzel und Worms gehören zum Kernpfad. Auch nach einer Niederlage geht es weiter. In Worms bestimmt das Ergebnis nur die Auswertung, nicht das Urteil. Revanche, Leipzig und die große Disputation sind freiwillig.',
      'Gesprächsimpuls danach: Warum reicht ein starkes, aber unpassendes Argument nicht? Welche Karte war für dich die wichtigste und warum?'
    ]
  },
  bonusTitel: 'Bonusspiele',
  bonusText: 'Alle Bonusspiele sind freiwillig. Sie stehen unten auf der Karte und öffnen sich nach der genannten Station.',
  loesungenTitel: 'Lösungen',
  loesungenText: 'Die Lösungen werden aus den Spieldaten erzeugt. Öffne sie bewusst: Wer mitliest, sieht sie auch.',
  loesungenOeffnen: 'Lösungen zeigen', loesungenDruck: 'Geöffnete Lösungen werden mitgedruckt. Geschlossene nicht.',
  faqTitel: 'Häufige Fragen', suche: 'In den Fragen suchen', keineTreffer: 'Keine Frage passt zu dieser Suche.',
  faq: [
    { f: 'Eine Gruppe wird nicht fertig. Was nun?', a: 'Im Menü (Tipp auf den Titel) steht der Fortsetzungscode. Die Gruppe schreibt ihn auf und gibt ihn in der nächsten Stunde auf der Startseite ein. Er merkt sich fertige Stationen, nicht den Zwischenstand in einem Rätsel.' },
    { f: 'Ein Code wird nicht angenommen.', a: 'Der Code hat acht Zeichen. Die Buchstaben O und I und die Ziffern 0 und 1 kommen nicht vor. Bei einem Tippfehler meldet das Spiel, dass der Code nicht stimmt.' },
    { f: 'Eine Gruppe hängt in einem Rätsel fest.', a: 'Oben rechts im Rätsel gibt es drei Hilfen: erst eine Richtung, dann eine Teillösung, dann die Lösung mit Erklärung. Du kannst die Station auch im Lehrkraftmodus als gelöst markieren.' },
    { f: 'Kann man etwas falsch machen und hängen bleiben?', a: 'Nein. Markt und Druckwelle haben drei Ergebnisstufen und immer eine Auswertung. Eine verlorene Disputation hält niemanden auf. Man kann alles noch einmal spielen.' },
    { f: 'Wie öffne ich den Lehrkraftmodus?', a: 'Halte den Titel „Hier stehe ich“ fünf Sekunden gedrückt oder drücke Umschalt + Enter. Der Modus ist nicht durch ein Passwort geschützt.' },
    { f: 'Was sind die Karten?', a: 'Jede Erkenntnis aus einer Station wird eine Sammelkarte mit Bild, Stärke, Seltenheit und Fähigkeit. Der Beutel zeigt das Album: Luthers Karten und die Karten der Kirche, die man schon gesehen hat. Ausgespielt werden sie in den Disputationen gegen Tetzel, Eck und in Worms.' },
    { f: 'Kann man eine Disputation verlieren?', a: 'Ja, und das ist gewollt. Danach zeigt das Spiel, welche Karte geholfen hätte und an welcher Station es sie gibt. Im Kernpfad geht es nach einer Niederlage trotzdem weiter.' },
    { f: 'Was zeigt der Lehrkraftmodus?', a: 'Fertige Stationen, die erreichte Stufe in den drei Spielsystemen, genutzte Hilfen und erledigte Bonusspiele. Alles bezieht sich nur auf dieses eine Gerät.' },
    { f: 'Gibt es eine Übersicht über die ganze Klasse?', a: 'Nein, mit Absicht. Das Spiel hat keinen Server. Es werden keine Daten gesendet oder gesammelt.' },
    { f: 'Wie kommt die Flugschrift auf die Pinnwand?', a: '„Als Bild teilen“ öffnet das Teilen-Menü des iPads. Von dort lässt sich das Bild speichern oder hochladen. „Drucken / PDF“ öffnet den Druckdialog.' },
    { f: 'Was sagen Tetzel und der Sprecher des Kaisers?', a: 'Ihre Sätze sind nacherzählt und so gekennzeichnet. Es sind keine wörtlichen Zitate. Beide vertreten ihre Sicht sachlich.' },
    { f: 'Ist das Spiel für katholische Schülerinnen und Schüler geeignet?', a: 'Ja. Die damalige Kirche ist nicht der Bösewicht. Das Finale sagt ausdrücklich, dass es Ablass gegen Geld heute nicht mehr gibt und die Kirchen zusammenarbeiten.' },
    { f: 'Die Bilder sehen sehr einfach aus.', a: 'Das sind Platzhalter. Die Liste der geplanten Bilder steht in docs/ASSET-PROMPTS.md.' },
    { f: 'Braucht das Spiel Internet?', a: 'Nur zum Laden der Seite. Danach werden keine Daten mehr abgerufen.' },
    { f: 'Kann ich Texte ändern?', a: 'Ja. Alle Texte stehen im Ordner data/. Das Kompendium und die Tests lesen dieselben Dateien und passen sich an.' }
  ],
  fachTitel: 'Fachhinweise',
  fach: [
    { t: 'Gewitter bei Stotternheim', a: 'Gesichert sind das Datum (2. Juli 1505) und der Klostereintritt am 17. Juli. Dass allein das Gewitter den Ausschlag gab, gilt als Legende. Im Spiel deutet der Mönch an, dass Luther schon vorher mit Gott rang.' },
    { t: 'Turmerlebnis', a: 'Der Zeitpunkt ist in der Forschung umstritten. Das Spiel nennt „um 1515–1518“.' },
    { t: 'Thesenanschlag', a: 'Sicher ist der Brief an Erzbischof Albrecht vom 31. Oktober 1517. Der Anschlag an die Schlosskirche ist nicht sicher belegt. Ein Hinweiszettel in der Schreibstube trennt beides.' },
    { t: 'Tetzel-Spruch', a: 'Der Reim vom klingenden Geld wird Tetzel zugeschrieben, ist aber nicht wörtlich belegt. Im Spiel heißt es: „Man sagt, er habe gereimt“.' },
    { t: '„Hier stehe ich“', a: 'Der Satz kam erst beim Druck der Rede hinzu. Belegt ist der Schluss „Gott helfe mir. Amen.“ Der Titel des Spiels spielt mit der Legende, das Finale löst sie auf.' },
    { t: 'Bann und Acht', a: 'Kirchenbann durch Papst Leo X. im Januar 1521, Reichsacht durch Kaiser Karl V. im Wormser Edikt vom Mai 1521. Das Spiel trennt die kirchliche und die weltliche Strafe.' },
    { t: 'Bibelübersetzung', a: 'Auf der Wartburg übersetzte Luther das Neue Testament in rund elf Wochen. Es erschien im September 1522. Die Psalmen folgten 1524, die ganze Bibel 1534. Es gab schon vorher deutsche Bibeln.' },
    { t: 'Gute Werke', a: 'Der Satz „den Himmel verdienen“ verkürzt die katholische Lehre. Im Spiel steht deshalb, dass es damals viele Menschen so verstanden. Nach katholischer Lehre wirken Gnade und Werke zusammen.' },
    { t: 'Gottesdienst', a: 'Luther kehrte 1522 zurück und bremste zunächst übereilte Änderungen. Seine deutsche Gottesdienstordnung erschien 1526. Das Bonusspiel spricht deshalb allgemein von der Zeit „nach der Reformation“.' },
    { t: 'Luthers Judenfeindschaft', a: 'Sie gehört nicht in den Zeitraum des Spiels (1505–1522) und kommt dort nicht vor. Luthers späte Schriften gegen die Juden gehören aber zu seinem Bild. Sie sind ein Thema für später in der Einheit oder in höheren Klassen.' }
  ]
};
