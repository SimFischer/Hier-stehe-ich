# Plan „Hier stehe ich“ (Phase 1)

Stand: 13.11.2026 · Grundlage: `KONZEPT.md` · Status: **wartet auf Freigabe für Phase 2**

Dieser Plan legt fest, was gebaut wird, bevor Code entsteht. Abschnitt 9 enthält die Fragen, die ich nicht allein entscheiden will. Zu jeder Frage steht mein Vorschlag; ohne Rückmeldung baue ich nach dem Vorschlag.

Gelesen habe ich dafür: das Konzept, das Repository „Im Zeichen der Wende“ (Bedienung, Datenformat, Testaufbau) und aus der Einheit die Präsentationen 1–8 und 10, den Text „Ein Leben im Aufbruch“ mit Steckbrief, „Gegenüberstellung der Lehren“, den Liedtext, das Silbenrätsel, das AB 95 Thesen (Material 1–3), AB 11, M 6/M 7 (Worms) und M 8 (Bibelübersetzung). Aus dem Material übernehme ich Themen und Aufgabenformen, keine Texte. Schülernamen aus den Folien kommen nirgends vor.

## 1. Architektur

Statische Seite ohne Build-Schritt. Alles sind ES-Module; `index.html` lädt genau ein Skript (`js/main.js`) und vier Stylesheets.

```text
index.html              Spiel
lehrkraefte.html        Kompendium (liest dieselben Daten)
css/
  tokens.css            Farben, Schrift, Abstände, Größen (inkl. iPad-Werte)
  layout.css            Bühne, Kopfleiste, Dialogbereich, Hoch-/Querformat
  components.css        Knöpfe, Karten, Fenster, Druckplatten, Hilfen
  scenes.css            Szenen, Rätsel, Spielsysteme
  print.css             Flugschrift und Kompendium (nur Druck)
js/
  main.js               Start, verbindet Engine und Daten
  engine/
    state.js            ein Spielstand-Objekt, Änderungen nur über Aktionen
    save.js             localStorage
    code.js             Fortsetzungscode (kodieren, prüfen, lesen)
    scenes.js           Szenen und Hotspots
    dialog.js           Gespräche mit Bedingungen („Figuren mit Gedächtnis“)
    cards.js            Argumentebeutel
    notebook.js         Notizbuch und Glossar
    map.js              Erinnerungs-Karte
    hints.js            gestufte Hilfen, Zählung
    speech.js           Vorlesen
    teacher.js          Lehrkraftmodus
    ui.js               Fenster, Meldungen, Fokus
  puzzles/              ein Ordner je Rätsel: rules.js (reine Logik) + view.js
    wandbild/ waage/ standbild/ marktplatz/ druckwelle/ verhoer/
    uebersetzung/ setzkasten/ flugschrift/
  bonus/                entfuehrung, presse, lutherrose, gottesdienst, silben
data/
  game.js               Titel, Stationen, Reihenfolge, Druckplatten
  scenes.js             Szenen und Hotspots
  dialogs.js            alle Gespräche
  cards.js              Argument- und Wissenskarten
  glossary.js           Fachbegriffe
  puzzles/*.js          Rätseldaten, Lösungen, Hilfen
  systems/*.js          Regeln und Zahlen der drei Spielsysteme
  teacher.js            Leitfaden, FAQ, Fachhinweise
assets/                 Bilder (zuerst Platzhalter)
tests/                  node --test
docs/                   PLAN, ASSET-PROMPTS, FACHPRUEFUNG, Berichte
```

**Regeln der Architektur**

- **Inhalt und Logik getrennt.** In `js/` steht kein Satz, den Schüler lesen. In `data/` steht keine Funktion. Ein Test prüft beides.
- **`rules.js` ohne Browser.** Jedes Rätsel hat eine reine Logikdatei mit `start(daten, seed)`, `zug(zustand, aktion)` und `auswertung(zustand)`. Node kann sie ohne Bildschirm durchspielen. Die Anzeige (`view.js`) ruft nur diese Funktionen auf.
- **Daten als `.js`, nicht `.json`.** So kann Safari sie ohne Abruf importieren und Node sie im Test direkt lesen. Kompendium und Tests lesen dieselben Dateien.
- **Zufall nur mit Startwert.** Wo Figuren sich bewegen, ist das Zierde. Spielentscheidend ist kein Zufall.
- **Lokal testen** braucht einen kleinen Webserver (`npm start`), weil Browser ES-Module nicht direkt von der Festplatte laden. Auf GitHub Pages läuft es ohne Zutun.

## 2. Datenformat

Jeder Eintrag hat eine `id`. Verweise laufen nur über IDs; der Datentest prüft, dass jedes Ziel existiert.

```js
// data/scenes.js
{ id: 'kloster', station: 2, name: 'Im Erfurter Kloster', zeit: '1505',
  bild: 'bg-kloster', einstieg: 'Text beim Betreten …',
  hotspots: [
    { id: 'mitbruder', label: 'Mitbruder', x: 62, y: 58, art: 'gespraech', ziel: 'mitbruder' },
    { id: 'waage',     label: 'Waage',     x: 40, y: 55, art: 'raetsel',   ziel: 'waage',
      wenn: { gespraech: 'mitbruder' } }
  ] }

// data/dialogs.js – Bedingungen machen das „Gedächtnis“ der Figuren
{ id: 'baeuerin-finale', figur: 'baeuerin', zeilen: [
    { wenn: { rat: 'behalten' }, text: '…' },
    { wenn: { rat: 'kaufen' },   text: '…' } ] }

// data/cards.js
{ id: 'k3', art: 'argument', station: 3, titel: 'Gnade ist ein Geschenk',
  text: 'Gott schenkt Gnade. Man kann sie nicht verdienen.' }

// data/puzzles/waage.js
{ id: 'waage', station: 2, lernziel: [1, 3], minuten: 3,
  hilfen: ['Richtung …', 'Teillösung …', 'Lösung mit Erklärung …'],
  begruendung: { frage: '…', optionen: [{ text: '…', richtig: true, rueck: '…' }] } }
```

Eine Station gilt als abgeschlossen, wenn Rätsel **und** Begründungsauswahl gelöst sind. Dann gibt es Druckplatte und Argumentkarte.

## 3. Stationen, Szenen und Zeitbudget

Zeitrechnung: 110 Wörter Lesetext pro Minute (heterogene Lesekompetenz), dazu feste Zeiten je Rätselschritt. Daraus ergibt sich das Textbudget. Der Zeittest in Phase 4 rechnet mit denselben Werten aus den Daten nach.

| Nr. | Szenen | Rätsel / System | Min. | Textbudget (Wörter) |
| --- | --- | --- | --- | --- |
| 0 | `druckerei` | Setzkasten ansehen, Auftrag | 2 | 150 |
| 1 | `kirche` | Wandbild „Der Weg der Seele“ | 3 | 180 |
| 2 | `stotternheim` (Kurzfilm), `kloster` | Waage der Werke | 5 | 280 |
| 3 | `turmzimmer` | Digitales Standbild | 5 | 300 |
| 4 | `jueterbog` | **Marktplatz** | 6 | 380 |
| 5 | `schreibstube`, `reichskarte` | **Druckwelle** | 6 | 300 |
| 6 | `herberge` (Tag 1), `saal` (Tag 2) | **Verhör** | 7 | 420 |
| 7 | `wartburg` | Übersetzungswerkstatt | 4 | 220 |
| F | `druckerei` | Setzkasten, Flugschrift | 3 | 170 |
| | | **Summe** | **41** | **2400** |

Dazu kommen die Erinnerungs-Karte (Übersicht, kein eigener Inhalt) und elf Hintergrundbilder. Station 1 und 2 sind von Anfang an beide offen, danach geht es der Reihe nach.

**Bedienung** wie im Vorgänger: Kopfleiste mit Karte, Argumentebeutel, Notizbuch, Hinweis, Vollbild; Titel in der Mitte (5 Sekunden halten oder Umschalt + Enter für den Lehrkraftmodus); Zielzeile unter der Kopfleiste; Szene mit Hotspots; Gespräche und Rätsel in einem Fenster. Sieben Druckplatten ersetzen die Siegel.

**Hochformat:** Die Szene steht im Format 4:3 oben, Gespräch und Rätsel darunter. Es wird nichts abgeschnitten und nichts muss seitlich gewischt werden.

## 4. Die einfachen Rätsel

| Rätsel | Ablauf | Abschluss |
| --- | --- | --- |
| **Wandbild** (1) | Sechs Bildteile an ihren Platz legen (Erde, Gericht, Himmel, Fegefeuer, Hölle, betende Angehörige). Danach vier Wege (Wallfahrt, Reliquien, Heiligenverehrung, Ablassbrief) den passenden Bildern zuordnen. | Frage des Pilgers: Wovor hatten die Menschen Angst? |
| **Waage** (2) | Vier Werke (Fasten, Beten, Beichte, Nachtwachen) nacheinander in die Schale legen. Die Waage hebt sich jedes Mal etwas, kippt aber nie. Ein fünftes Feld „noch mehr“ bleibt wirkungslos. | Frage des Mitbruders: Was bedeutet das für Bruder Martin? |
| **Standbild** (3) | Zu drei Strophen je zwei Figuren stellen: Abstand (3 Stufen), Blick Gottes (zu / ab), Haltung Luthers (3), Haltung Gottes (2). Rückmeldung in Worten, mehrere Lösungen gelten. Nicht passende Bilder werden erklärt, nicht als falsch markiert. | Auswahl zum Gleichnis vom verlorenen Sohn |
| **Übersetzung** (7) | Für drei Verse aus Psalm 23: alte Fassung lesen, zwei von drei Leuten fragen (Marktfrau, Kind, Handwerker), dann aus drei Formulierungen die verständlichste wählen. | Frage: Warum übersetzte Luther so? |
| **Setzkasten** (F) | Vier „allein“ je einer Gegenposition zuordnen. | Flugschrift setzen |

**Flugschrift:** Schlagzeile (vier Vorschläge oder eigene, höchstens 60 Zeichen), drei Argumentkarten als Kernaussagen, eines von vier Bildern. Ausgabe über den Druckdialog (PDF) und zusätzlich als Bild zum Teilen. Vor dem Druck weist das Spiel darauf hin, keinen vollen Namen einzutragen.

## 5. Die drei Spielsysteme

Gemeinsam gilt: feste Rundenzahl, kein Verlieren, drei Ergebnisstufen mit Auswertung, erneutes Spielen möglich. Die Zahlen unten sind Startwerte; die Simulationstests in Phase 2 legen sie endgültig fest. Ziel der Balance: Wer sorgfältig spielt, erreicht die beste Stufe. Wer zufällig tippt, landet meist auf der untersten. Mit dem Mindestwissen ist die mittlere Stufe sicher erreichbar.

### 5.1 Marktplatz (Station 4)

**Vorbereitung:** Ablassbrief, Ablasskasten und Geldweg untersuchen. Das ergibt die Wissenskarten W1–W3.

**Figuren:** sechs ansprechbare Menschen und vier Statisten. Jede Figur steht auf einer Leiste von 0 (weit weg) bis 3 (kauft).

| Figur | Anliegen | Start | Passende Karte |
| --- | --- | --- | --- |
| Bäuerin | Ihre Mutter ist gestorben. Sie will sie aus dem Fegefeuer holen. | 1 | W3, K4 |
| Kaufmann | Er rechnet: ein Brief ist billiger als eine Wallfahrt. | 0 | W1 |
| Pilger | Er hat Angst vor Gottes Gericht. | 1 | K3, K4 |
| Junge | Er will für künftige Sünden vorsorgen. | 2 | W2 |
| Geselle aus Wittenberg | Alle kaufen, also kauft er auch. | 0 | K2, W1 |
| Witwe | Sie will ihr letztes Geld geben. | 1 | W1, K3 |

**Ablauf:** drei Runden. Je Runde zwei Gespräche, je Gespräch eine Karte.

- Passt die Karte, wird die Figur **nachdenklich**, tritt zur Seite und nimmt einen Statisten mit.
- Passt sie nicht, erklärt die Figur in einem Satz, warum sie das nicht überzeugt. Sie bleibt, wo sie ist. Man darf sie später noch einmal ansprechen.
- Nach Runde 1 und 2 läutet die Glocke, Tetzel predigt, alle Unentschlossenen rücken einen Schritt vor. Wer auf 3 steht, kauft. Nach Runde 3 kaufen alle, die nicht nachdenklich sind.

Die Reihenfolge zählt also: Der Junge steht schon nah am Kasten. K1 („Gott galt als strenger Richter“) passt bei niemandem. Wer sie spielt, hört, dass sie die Angst eher verstärkt.

**Anzeige:** Münzen im Kasten, Zahl der Nachdenklichen (0–6).

**Auswertung:** Stufe nach Zahl der Nachdenklichen (0–2, 3–4, 5–6). Dann spricht Tetzel und erklärt seine Sicht. Zum Schluss fragt die Bäuerin um Rat. Die Antwort wird gespeichert; im Finale kommt sie wieder.

### 5.2 Druckwelle (Station 5)

**Vorbereitung:** Fünf Thesen (27, 32, 36, 43, 86) je einer Fassung in heutigem Deutsch zuordnen. Das ergibt die deutsche Druckvorlage. Zwei der fünf Thesen wählen die Spielenden als Karten.

**Karte:** zehn Städte, verbunden durch Handelswege.

```text
Magdeburg — Wittenberg — Leipzig* — Erfurt — Frankfurt* — Köln
                            |          |         |
                         Nürnberg* ————+     Straßburg — Basel
                            |                    |
                         Augsburg* ——————————————+
```

`*` = Knotenpunkt. Jede Stadt hat zwei Gruppen: Gelehrte (klein) und Volk (groß).

**Ablauf:** sechs Runden, je drei Boten.

- Ein Bote geht von einer Stadt, die die Thesen schon hat, in eine Nachbarstadt.
- **Lateinische Fassung:** erreicht die Gelehrten der Stadt. Die Stadt gilt als erreicht, Boten können von dort weiter.
- **Deutsche Fassung:** erreicht Gelehrte und Volk. Am Ende jeder Runde druckt die Stadt nach und schickt die deutsche Fassung weiter: ein Knotenpunkt an alle Nachbarn, eine kleine Stadt an einen.
- Deutsche Flugblätter sind anfangs knapp, weil erst übersetzt und gesetzt werden muss: Runde 1 und 2 je ein Bote, Runde 3 und 4 je zwei, danach alle drei.

Die Entscheidung liegt darin, wohin das knappe deutsche Blatt geht. Wer es früh nach Leipzig oder Nürnberg schickt, sieht die Karte von selbst weiterlaufen. Wer nur Latein verschickt, erreicht alle Städte, aber fast nur Gelehrte.

**Anzeige:** Die Karte färbt sich in zwei Stufen (Latein hell, Deutsch kräftig). Ein Zähler zeigt „von 100 Menschen im Reich haben … davon gehört“, ohne absolute Zahlen.

**Auswertung:** drei Stufen nach erreichtem Anteil. In jeder Stufe reagieren Rom und der Kaiserhof. Der Schlusstext vergleicht Latein und Deutsch am eigenen Spielverlauf. Karte K8.

### 5.3 Verhör (Station 6)

**Tag 1, Herberge:** Die Spielenden sehen alle gesammelten Karten und wählen fünf. Fehlt eine These, kann man sie über eine „Erinnerung“ nachholen: eine Frage zur früheren Station, dann liegt die Karte bereit. In der Herberge findet man außerdem K9.

**Tag 2, Saal:** vier Einwände, je eine Antwortkarte.

| Einwand des Sprechers | Passt gut | Passt halb |
| --- | --- | --- |
| Der Papst entscheidet, was geglaubt wird. | K5 | T86 |
| Die Konzilien haben längst entschieden. | K9 | K5 |
| Du spaltest die Kirche und störst die Ordnung. | K7 | T43 |
| Du stehst allein gegen alle. | K8 | K5, K3 |

- Passt gut: Stimmung +2, mehrere Reichsstände nicken. Passt halb: +1 und ein Satz, was noch fehlt. Passt nicht: 0 und eine Erklärung, was die Karte nicht beantwortet.
- Die Stimmung läuft von 0 bis 8 und ist an zwölf Figuren im Saal sichtbar.
- K5 passt mehrfach, lässt sich aber nur einmal spielen. Das ist die eigentliche Denkaufgabe beim Deckbau.

**Schlussfrage „Widerrufst du?“** Bei „Widerrufen“ zeigt das Spiel drei Dinge, die es dann nicht gegeben hätte, und fragt erneut. Danach folgt der belegte Schluss der Rede in heutiger Übertragung, gekennzeichnet als Übertragung.

**Auswertung:** drei Stufen nach Stimmung. Der Ausgang ist in jeder Stufe derselbe: Der Kaiser bleibt bei seinem Urteil. Das Spiel sagt das ausdrücklich, damit niemand meint, gute Argumente hätten Luther die Acht erspart. Zum Abschluss ordnen die Spielenden Bann und Acht zu (wer, wann, was bedeutet es). Karte K10.

## 6. Argumentebeutel

| ID | Karte | Woher |
| --- | --- | --- |
| K1 | Gott galt als strenger Richter. | 1 |
| K2 | Gute Werke allein bringen keinen Frieden. | 2 |
| K3 | Gott schenkt Gnade. Man kann sie nicht verdienen. | 3 |
| K4 | Gott ist wie der Vater im Gleichnis. | 3 |
| K5 | Die Bibel ist der Maßstab. | 3 |
| W1 | Der Weg des Geldes: Albrecht, Fugger, Petersdom. | 4 |
| W2 | Ohne Reue hilft kein Brief. | 4 |
| W3 | Über die Verstorbenen entscheidet Gott allein. | 4 |
| K6 | Vergebung kann man nicht kaufen. | 4 |
| T27, T32, T36, T43, T86 | Thesen in eigenen Worten (zwei nach Wahl) | 5 |
| K7 | Luther will die Kirche erneuern, nicht spalten. | 5 |
| K8 | In wenigen Wochen kannte das Reich die Thesen. | 5 |
| K9 | Auch Konzilien können irren. | 6 |
| K10 | Mein Gewissen ist an Gottes Wort gebunden. | 6 |
| K11 | Jeder soll die Bibel selbst lesen können. | 7 |

Alle Karten außer den Thesen gehören fest zum Stationsabschluss. Deshalb muss der Fortsetzungscode sie nicht einzeln speichern.

**Figuren mit Gedächtnis:** die Bäuerin (Jüterbog → Finale, abhängig vom Rat), der Pilger (Kirche → Marktplatz, erkennt den Lehrling wieder), der Meister (kommentiert im Finale die Ergebnisse der drei Systeme).

## 7. Speichern und Fortsetzungscode

Der Spielstand liegt in `localStorage`. Der Code enthält denselben Stand in 40 Bit und wird als acht Zeichen in zwei Vierergruppen gezeigt (`K7QM-2XHD`). Das Alphabet hat 32 Zeichen ohne O, 0, I, 1 und L.

| Inhalt | Bit |
| --- | --- |
| Formatversion | 2 |
| Stationen erledigt (Prolog, 1–7, Finale) | 9 |
| gewählte zwei Thesen (10 Möglichkeiten) | 4 |
| Rat an die Bäuerin | 2 |
| Stufe Marktplatz, Druckwelle, Verhör | 6 |
| Bonusspiele erledigt | 5 |
| genutzte Hilfen (0–15, danach „15+“) | 4 |
| Prüfsumme | 8 |

Der Code speichert den Stand am Beginn der laufenden Station, nicht den Zwischenstand im Rätsel. Die Flugschrift ist nicht im Code. Ein Tippfehler wird über die Prüfsumme erkannt und mit einer klaren Meldung abgewiesen.

## 8. Bonus, Lehrkräfte, Tests, Ablauf

**Bonusspiele (Phase 3):** Entführung (nach 6), Druckerpresse (nach 5), Lutherrose (nach 7), Gottesdienst damals und heute (nach F), Silbenrätsel (nach 2, mit neuen Fragen statt der Fragen vom Arbeitsblatt). Dazu die Reflexion mit zwei Fragen. Jedes Bonusspiel dauert höchstens fünf Minuten und ist überspringbar.

**Lehrkraftmodus und Kompendium (Phase 3):** wie im Konzept. Das Kompendium erzeugt Leitfaden, Lösungen und Zeitangaben aus `data/`; nur Schnellstart, FAQ und Fachhinweise sind eigener Text in `data/teacher.js`.

**Tests (`npm test`, nur Node-Bordmittel):**

1. Daten: jede Station hat Szene, Rätsel, Lösung, drei Hilfen, Karte; alle Verweise existieren; kein Text in `js/`.
2. Sprache: Satzlänge je Text (Warnung über 15 Wörter), Fachbegriffe stehen im Glossar.
3. Durchspiel: Kernpfad vollständig, auch mit falschen Karten in Worms und mit „Widerrufen“.
4. Simulation je Spielsystem für drei Spielertypen (sorgfältig, zufällig, schwach lesend), je 500 Durchgänge mit festem Startwert: jede Stufe erreichbar, kein Hänger, Rundenzahl eingehalten.
5. Fortsetzungscode: hin und zurück für jeden erreichbaren Stand, Ablehnung bei Tippfehlern.
6. Zeit: Summe je Station aus Wörtern und Schritten, Kernpfad 38–43 Minuten.

**Reihenfolge in Phase 2**, je ein Commit:

1. Grundgerüst: Ordner, Designsystem, Zustand, Speichern, Code, Testrahmen
2. Regeln der drei Spielsysteme mit Simulationstests (noch ohne Bild)
3. Engine: Szenen, Gespräche, Karten, Notizbuch, Karte, Hilfen
4. Anzeige der drei Spielsysteme
5. Prolog und Stationen 1–3
6. Stationen 4–7 als ganze Stationen
7. Finale und Flugschrift
8. Durchspieltest, Prüfung in den vier Bildschirmgrößen, README

## 9. Offene Fragen

**Fachlich**

1. **Das Lied ist von 1523**, die Rahmenhandlung spielt im Herbst 1522, das Turmzimmer um 1515–1518. Vorschlag: Im Turmzimmer wird nicht gesungen. Das Notizbuch sagt: „Später, 1523, hat Luther darüber ein Lied geschrieben.“ Das Standbild arbeitet mit drei Strophen in eigener Übertragung.
2. **Welche Strophen?** Das Konzept nennt 2 und 4–5, die Klasse hat 2 bis 5 gestellt. Vorschlag: 2, 3 und 4. Strophe 3 (gute Werke helfen nicht) schließt an die Waage an, Strophe 4 (wie ein Vater) führt zum Gleichnis.
3. **Gott als Figur auf der Bühne.** Im Unterricht haben Schüler Gott gespielt. Vorschlag: im Spiel eine helle Gestalt ohne Gesicht, damit kein festes Gottesbild vorgegeben wird. Alternative: ein Lichtsymbol.
4. **Psalm 23 auf der Wartburg ist ein Zeitfehler.** Dort entstand das Neue Testament; die Psalmen folgten 1524, die ganze Bibel 1534, M 8 zitiert die Fassung von 1546. Vorschlag: Psalm 23 bleibt, weil die Klasse M 8 kennt. Die Szene sagt offen: „Auf der Wartburg übersetzt Luther das Neue Testament. Wie er arbeitet, probierst du an einem Psalm aus, den er später übersetzt hat.“ Die Koberger-Fassung von 1483 ist gemeinfrei, die Formulierungen der drei Ratgeber schreibe ich selbst.
5. **„Dem Volk aufs Maul schauen“** stammt aus dem Sendbrief vom Dolmetschen von 1530. Vorschlag: nur im Notizbuch, mit Jahreszahl.
6. **M 7 legt Luther „hier stehe ich“ in den Mund.** Falls die Klasse den Text gelesen hat, widerspricht das Spiel ihrem Material. Vorschlag: Der Hinweis im Finale sagt das ausdrücklich („Vielleicht hast du den Satz so gelesen …“).
7. **K9 „Auch Konzilien können irren“** kommt in der Einheit nicht vor, wird aber für den zweiten Einwand gebraucht. Vorschlag: als Fund in der Herberge mit einem Satz Erklärung. Alternative: Einwand 2 streichen und nur drei Runden spielen.
8. **Die Druckerei ist erfunden.** Das Septembertestament druckte Melchior Lotter d. J. Vorschlag: Der Meister bleibt namenlos und sagt, das Buch im Regal komme „von Lotter drüben“.
9. **Die Einwände des Sprechers in Worms** sind Nacherzählung, keine Zitate. Vorschlag: Das Notizbuch kennzeichnet das einmal deutlich.

**Didaktisch**

10. **Die vier „allein“ und die fünf Paare der „Gegenüberstellung“ passen nicht eins zu eins.** Vorschlag: Schrift ↔ „Papst und Kirche legen fest, was richtig geglaubt wird“; Christus ↔ „Der Papst führt die Christenheit, Heilige vermitteln“; Gnade ↔ „Mit guten Werken verdient man den Himmel“; Glaube ↔ „Ablass und fromme Leistungen verkürzen die Strafe“. Gnade und Glaube liegen für Klasse 7 nah beieinander; die Hilfe erklärt den Unterschied (Gnade: Gott schenkt. Glaube: Der Mensch vertraut darauf).
11. **Katholische Position zu guten Werken.** Die Formulierung „den Himmel verdienen“ aus dem Arbeitsblatt ist aus katholischer Sicht verkürzt. Vorschlag: Im Spiel heißt es „so verstanden es damals viele Menschen“, und das Kompendium erklärt den Unterschied.
12. **Flugschrift teilen.** Auf dem iPad ist „Als PDF sichern“ im Druckdialog umständlich. Vorschlag: zusätzlich ein Knopf „Als Bild teilen“, der direkt das Teilen-Menü öffnet. Das Bild lässt sich auf der OPSH-Pinnwand hochladen.
13. **Freitext in der Schlagzeile.** Vorschlag: erlaubt, höchstens 60 Zeichen, wird nur auf dem Gerät gehalten und nicht im Code gespeichert.
14. **Zu zweit am iPad.** Vorschlag: keine getrennten Spielerrollen. Die Begründungsfragen beginnen mit „Besprecht kurz …“, wenn beim Start „zu zweit“ gewählt wurde.

**Technisch**

15. **Adresse.** Das Repository heißt `Hier-stehe-ich`, die Seite läge unter `simfischer.github.io/Hier-stehe-ich/`. Soll es so bleiben? GitHub Pages musst du in den Repository-Einstellungen einmal einschalten.
16. **Töne.** Der Glockenschlag gliedert den Marktplatz. Vorschlag: wenige, im Browser erzeugte Töne, abschaltbar, beim Start aus. Keine Musik.
