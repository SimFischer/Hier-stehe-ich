# Prüfbericht Phase 4

Stand: 17.11.2026. Geprüft wurden alle Texte, die Schülerinnen und Schüler im Spiel lesen (rund 7000 Wörter: Szenen, Gespräche, Rätsel, Spielsysteme, Karten, Glossar, Bonusspiele), und das Layout aller Szenen und Rätselschritte in vier Bildschirmgrößen.

## 1. Fachprüfung gegen die Leitplanken

| Leitplanke aus dem Konzept | Umsetzung im Spiel | Ergebnis |
| --- | --- | --- |
| Gewitter bei Stotternheim: 2. Juli 1505, Klostereintritt 17. Juli; Gewitter nicht allein ausschlaggebend | Kurzfilm nennt beide Daten. Der Mönch im Kloster sagt: „Ich glaube, er rang schon vorher mit Gott.“ | erfüllt |
| Turmerlebnis: Zeitpunkt umstritten | Szene „um 1515–1518“, Einstieg: „Wann genau … weiß niemand sicher.“ | erfüllt |
| Thesenanschlag nicht sicher belegt; sicher ist der Brief an Albrecht | Hinweiszettel „Was wir wissen – was erzählt wird“; der Brief ist der Pflicht-Hotspot | erfüllt |
| Tetzel-Spruch nur zugeschrieben | „Man sagt, Tetzel habe gereimt … Ob er es genau so sagte, ist nicht belegt.“ | erfüllt |
| „Hier stehe ich“ nicht authentisch | Luther spricht den belegten Schluss („Gott helfe mir. Amen.“). Das Finale löst die Legende auf und erwähnt, dass man den Satz anders gelesen haben kann. | erfüllt |
| Bann und Acht getrennt | Kirchenbann: Papst Leo X., Januar 1521. Reichsacht: Kaiser Karl V., Wormser Edikt, Mai 1521. Eigener Zuordnungsschritt. | erfüllt |
| Wartburg und Bibel: NT in rund elf Wochen, Septembertestament, frühere deutsche Bibeln | Alle drei Punkte im Spiel. Psalm 23 wird ausdrücklich als später übersetzter Text benannt (1524). | erfüllt |
| Name „Luther“ von *eleutheros* | Notizbuch-Fund „Eleutherius“ im Turmzimmer | erfüllt |
| Keine erfundenen Zitate echter Personen | Sätze von Tetzel und dem Sprecher des Kaisers sind als „nacherzählt“ gekennzeichnet. Luthers Schluss in Worms ist als Übertragung eingeleitet. | erfüllt |
| Konfessionelle Fairness | Tetzel und der Sprecher vertreten ihre Sicht sachlich. Der Kaplan erklärt die katholische Lehre zum Gebet für Verstorbene. Das Finale sagt, dass es Ablass gegen Geld heute nicht mehr gibt. | erfüllt |

## 2. Gefundene und behobene Fehler

| Stelle | Vorher | Problem | Jetzt |
| --- | --- | --- | --- |
| Jüterbog, Einstieg | „In Wittenberg ist der Ablasshandel verboten.“ | Verboten war nicht der Ablass überhaupt (Wittenberg hatte selbst einen großen Reliquienablass), sondern Tetzels Ablasspredigt in Kursachsen. | „In Kursachsen darf Tetzel seinen Ablass nicht verkaufen.“ |
| Marktplatz, Geselle | „In Wittenberg ist das verboten.“ | wie oben | „Bei uns in Wittenberg darf Tetzel nicht predigen.“ |
| Marktplatz, Kaufmann | „Der Brief kostet einen Gulden.“ | Die Preise waren nach Stand gestaffelt; für einen Kaufmann war ein Gulden zu niedrig. | „Der Brief kostet ein paar Gulden.“ |
| Karte „Viele haben es gelesen“ und Verhör | „In wenigen Wochen kannte das ganze Reich die Thesen.“ | übertrieben | „In wenigen Wochen sprach man im ganzen Reich über die Thesen.“ |
| Verhör, Auswahl „Widerrufen“ | „Dann wäre es still geworden … Keine evangelische Kirche.“ | Was ohne Luthers Nein geschehen wäre, weiß niemand sicher. | mit „wohl“ und „vielleicht“ formuliert; die Behauptung zur evangelischen Kirche ist gestrichen |
| Bonus Gottesdienst | „Die Predigt erklärt die Bibel auf Deutsch“ als Neuerung | Deutsche Predigten gab es auch vor der Reformation. Neu war ihr Gewicht. | „Die Predigt steht im Mittelpunkt und erklärt die Bibel.“ |
| Glossar „Fegefeuer“ | „Nach damaligem Glauben …“ | Die katholische Kirche lehrt die Reinigung nach dem Tod bis heute. „Damals“ klingt, als sei das überholt. | „Nach katholischer Lehre wird die Seele nach dem Tod gereinigt, bevor sie zu Gott kommt. Um 1500 stellten sich viele das als Feuer vor.“ |

## 3. Bewusste Vereinfachungen

Diese Stellen sind für Klasse 7 vereinfacht und im Lehrkräftekompendium erklärt:

- **Gute Werke:** „Den Himmel muss man sich verdienen“ verkürzt die katholische Lehre. Das Spiel rahmt den Satz als etwas, das „damals viele Menschen glaubten“.
- **Heilige:** „Heilige vermitteln bei Gott“ meint die Fürbitte der Heiligen. Auch nach katholischer Lehre ist Christus der einzige Mittler.
- **Druckwelle:** Städte, Wege und Zahlen sind ein Spielmodell. Es gibt keine historischen Leserzahlen; die Karte zeigt heutige Flüsse und Küsten.
- **Bildfiguren:** Luther, Tetzel, Karl V. und der Sprecher sind keine Porträts. Für den Kaplan steht vorläufig das Bild eines Mönchs.

## 4. Sprachprüfung

- Kein Satz hat mehr als 15 Wörter. Die längsten Sätze (15 Wörter) sind Luthers Schluss in Worms, eine wörtliche Übersetzung aus dem Psalm (als schwer markiert) und eine Lösungshilfe.
- Fachbegriffe sind beim Antippen erklärt. Neu im Glossar: Kurfürst, Kaplan, Edikt, Abendmahl, Psalm. Insgesamt 21 Begriffe.
- Originaltexte (Koberger 1483, Luther 1546) stehen immer neben einer heutigen Fassung.

## 5. Layoutprüfung

Geprüft mit `tests/layout-browser.js` im Browser: die Leiste, 8 Szenen und 38 Rätselschritte (28 im Kernpfad, 10 in den Bonusspielen) mit dem Spielstand, den man an der Stelle wirklich hat.

| Größe | Befunde vorher | Behoben | Jetzt |
| --- | --- | --- | --- |
| 1024 × 768 (iPad quer) | 3: Schilder „Junker Jörg“ und „Alte Bibel“ überdeckt; Kartenauswahl in Worms scrollt; Kopf- und Fußzeile der Flugschrift-Vorschau 11 px | Hotspot verschoben; Auswahl enger gesetzt; Schrift auf 14 px | keine |
| 1180 × 820 (iPad Air quer) | keine | – | keine |
| 1366 × 1024 (iPad Pro quer) | keine | – | keine |
| 820 × 1180 (iPad hoch) | 1: Reihe der Reichsstände 114 px zu breit | Reihe bricht um | keine |

Geprüft wurde: kein seitliches Scrollen, kein Scrollen im Rätselblatt, Schrift mindestens 14 px, Tippziele mindestens 44 × 44 px, Hotspots im Bild, nicht übereinander und nicht unter dem Textband.

**Grenzen der Prüfung:** Gemessen wurde im Desktop-Browser mit nachgestellten Fenstergrößen, nicht auf einem echten iPad. Safari kann bei Schrift und Abständen leicht abweichen. Nur der erste Zustand jedes Schritts wurde gemessen; Zwischenstände (zum Beispiel eine lange Rückmeldung) können etwas mehr Platz brauchen. Die Eingabezeile der Flugschrift mit eingeblendeter Bildschirmtastatur ist nicht geprüft.

## 6. Zeitprüfung

Die Schätzung aus Textmenge (130 Wörter pro Minute) und Bedienschritten ergibt für den Kernpfad **45 Minuten** (Prolog 1,4 · Kirche 3,8 · Kloster 3,5 · Turmzimmer 5,2 · Jüterbog 6,5 · Thesen 8,0 · Worms 7,3 · Wartburg 4,6 · Flugschrift 4,7). Das Ziel aus dem Konzept waren rund 40 Minuten.

Für eine Einzelstunde bedeutet das: Langsame Gruppen werden wahrscheinlich nicht fertig. Das Kompendium empfiehlt, in der nächsten Stunde mit dem Fortsetzungscode weiterzumachen oder im Lehrkraftmodus über Station 1 und 2 zu springen. Ob die Schätzung stimmt, zeigt erst eine Erprobung mit einer Klasse.


## 7. Neue Karten in „Hammer & Siegel“ (20.11.2026)

Siebzehn Karten kamen dazu. Jede hat einen gesicherten historischen Kern; die Texte sind Nacherzählungen, keine Zitate. Wo eine Karte eine andere entkräftet, passt der Inhalt zueinander (Konter-Lexikon).

| Karte | Kern | Entkräftet |
|---|---|---|
| Loci communes | 1521, Melanchthons erste geordnete Darstellung der evangelischen Lehre, als Lehrbuch genutzt | (stärkt Bibel und Wissen) |
| Argula von Grumbach | 1523, Brief an die Universität Ingolstadt zur Verteidigung des Studenten Arsacius Seehofer, vielfach gedruckt | Abschwören! |
| Die Wittenbergisch Nachtigall | 1523, Spruchgedicht des Nürnberger Schuhmachers Hans Sachs | Der große lutherische Narr |
| Ulrich von Hutten | ab 1520 deutschsprachige Schriften gegen die römische Kurie | Die Kurie in Rom |
| Junker Jörg | 1521/22 Wartburgaufenthalt in Verkleidung, Übersetzung des Neuen Testaments | Das Wormser Edikt |
| Die ganze Bibel auf Deutsch | 1534, Vollbibel in Wittenberg, mit Mitarbeitern wie Melanchthon | Die Bibel auf Latein |
| Die Deutsche Messe | 1526, „Deutsche Messe und Ordnung des Gottesdiensts“ | Die Messe auf Latein |
| Pfarrer dürfen heiraten | 1525, Heirat mit Katharina von Bora | Ehelos bleiben |
| Schulen für alle | 1524, Schrift „An die Ratsherren aller Städte deutschen Landes …“, Schulen auch für Mädchen | (stärkt Wissen) |
| Die Protestation | 1529, Protestation der evangelischen Stände auf dem Reichstag zu Speyer; Herkunft des Namens „Protestanten“ | Das Wormser Edikt |
| Das Augsburger Bekenntnis | 1530, Confessio Augustana, verfasst von Melanchthon, dem Kaiser vorgelegt | Ketzer! |
| Die Gemeinde urteilt | 1523, Schrift über das Recht einer Gemeinde, Lehre zu beurteilen und Prediger zu berufen | Nur geweihte Priester |
| Das Wormser Edikt (Kirche) | Mai 1521, Reichsacht, Verbot von Druck, Verkauf und Lektüre der Schriften | |
| Abschwören! (Kirche) | 1523, erzwungener Widerruf des Studenten Arsacius Seehofer in Ingolstadt | |
| Der große lutherische Narr (Kirche) | 1522, Spottschrift des Franziskaners Thomas Murner | |
| Die Messe auf Latein (Kirche) | lateinische Messe vor der Reformation | |
| Ehelos bleiben (Kirche) | Zölibat für Priester, Mönche und Nonnen | |

Zuordnung zu den Gegnern: Abschwören! bei Eck (Professor in Ingolstadt), der Narr bei Emser (ebenfalls Streitschriftsteller gegen Luther), das Edikt bei Kaiser Karl und Herzog Georg, Messe und Zölibat bei Albrecht, Georg und Leo. Spätere Ereignisse (1524 bis 1534) erscheinen nur als Karten Luthers: was aus der Reformation wurde.

### Zweite Konter (20.11.2026)

Jede Kirchenkarte hat jetzt mindestens zwei Konter, damit verschiedene Decks möglich sind (Anführer ausgenommen: Personen werden nicht „widerlegt“). Ergänzt wurden diese Paare; der Text der Luther-Karte antwortet jeweils auf die Aussage der Kirchenkarte:

| Kirchenkarte | Neuer Konter | Begründung |
|---|---|---|
| Gott, der strenge Richter | Allein aus Glauben | Turmerlebnis: Gottes Gerechtigkeit als Geschenk statt Gericht |
| Der Papst entscheidet | An den christlichen Adel | 1520 gegen die „Mauern“ Roms, auch gegen das Auslegungsmonopol des Papstes |
| Die Konzilien | Maßstab Bibel | Maßstab ist die Schrift, nicht die Zahl der Bischöfe |
| Wie Jan Hus | Das Augsburger Bekenntnis | die Evangelischen bekennen den gemeinsamen christlichen Glauben |
| Ketzer! | Loci communes | die Lehre geordnet aus der Bibel begründet |
| Der Kirchenbann | Die Bulle im Feuer | Luther verbrennt 1520 die Bannandrohung |
| Ruhe und Ordnung | Neue Kirchenordnungen | neue Ordnung der Gemeinden statt Unruhe |
| Die Bannandrohung | Gewissen | Luther widerruft nicht |
| Bücher ins Feuer | Die Druckerpresse | mehr Abzüge, als man verbrennen kann |
| Die Reichsacht, Der Ketzerprozess | Junker Jörg | Luther wird auf der Wartburg in Sicherheit gebracht |
| Die Macht des Kaisers | Die Protestation | Fürsten und Städte widersprechen dem Reichstagsbeschluss |
| Widerrufe! | Argula von Grumbach | fordert Begründung aus der Bibel statt Widerruf |
| Abschwören! | Gewissen | Glaube lässt sich nicht erzwingen |
| Der große lutherische Narr | Cranachs Bilder | Cranachs Bildnisse prägen ein würdiges Bild Luthers |
| Die Messe auf Latein | Deutsche Lieder | die Gemeinde singt auf Deutsch mit |
| Ehelos bleiben | Freiheit eines Christenmenschen | ein Christ ist frei; Gelübde machen nicht gerecht |
