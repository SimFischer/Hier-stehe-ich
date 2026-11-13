# Asset-Liste und Bildbeschreibungen

Stand: 13.11.2026 · gehört zu `docs/PLAN.md`

Bis die Bilder fertig sind, zeichnet das Spiel einfache Platzhalter in den Farben des Stilrahmens (`js/engine/platzhalter.js`). Der Einbau der fertigen Bilder ist ein eigener kleiner Schritt, sobald sie unter den genannten Dateinamen in `assets/` liegen.

## Stilrahmen

Diesen Absatz stellst du **jeder** Bildbeschreibung voran:

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige
schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige
Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E),
Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein
gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck,
Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift
im Bild, keine Wasserzeichen. Gesichter freundlich und schlicht, keine
Karikaturen.
```

**Regeln für alle Bilder**

- Keine Schrift im Bild. Alle Texte setzt das Spiel selbst.
- Menschen der Kirche (Tetzel, Sprecher des Kaisers, Mönche) sehen ernsthaft und würdig aus, nicht gierig oder lächerlich.
- Luther sieht in allen Bildern gleich aus: schmales Gesicht, dunkle Augen, etwa 22 Jahre (Kloster) bis 38 Jahre (Wartburg).
- Hintergründe: Die Mitte (mittlere 75 % der Breite) enthält alles Wichtige. Die Ränder dürfen bei schmalen Bildschirmen wegfallen.
- Figuren und Gegenstände: PNG mit durchsichtigem Hintergrund, Licht von links oben.

## Hintergründe (2048 × 1536, JPG oder WebP)

| Datei | Szene | Beschreibung |
| --- | --- | --- |
| `bg-druckerei` | Prolog, Finale | Druckwerkstatt in Wittenberg, Herbst 1522. Links eine hölzerne Druckerpresse, in der Mitte ein umgestürzter Setzkasten mit verstreuten Lettern auf dem Boden, rechts ein Regal mit Büchern und Papierstapeln, zum Trocknen aufgehängte Bögen an einer Leine. Warmes Licht durch ein Butzenfenster. Menschenleer. |
| `bg-kirche` | Station 1 | Inneres einer spätgotischen Dorfkirche um 1500. Die rechte Wand ist eine große leere, hell verputzte Fläche (dort liegt das Wandbild-Rätsel). Links ein Seitenaltar mit Kerzen und einem Reliquienkästchen, Steinboden, Opferstock. Menschenleer. |
| `bg-stotternheim-1` | Station 2, Kurzfilm | Offenes Feld mit Landstraße unter dunklen Gewitterwolken, in der Ferne ein Dorf mit Kirchturm. Ein einzelner Baum am Weg. Menschenleer. |
| `bg-stotternheim-2` | Station 2, Kurzfilm | Dieselbe Ansicht, ein greller Blitz schlägt neben der Straße ein, alles ist hell ausgeleuchtet. |
| `bg-kloster` | Station 2 | Kreuzgang und offene Zelle eines Augustinerklosters. In der Zelle Pritsche, Betpult, Kerze, Wasserkrug. Im Kreuzgang rechts eine freie Steinbank (dort steht die Waage). Kühles Morgenlicht. Menschenleer. |
| `bg-turmzimmer` | Station 3 | Kleine Studierstube in einem Turm. Stehpult mit aufgeschlagener großer Bibel, Bücherstapel, Tintenfass, schmales Fenster mit Blick über Dächer. Die Mitte des Raums ist frei (dort liegt die Standbild-Bühne). Menschenleer. |
| `bg-jueterbog` | Station 4 | Marktplatz einer Kleinstadt, 1517. Hinten Rathaus mit Laube und Fachwerkhäuser, links ein Podest mit einem aufgerichteten roten Kreuz mit Wappen, in der Mitte freier Platz mit Kopfsteinpflaster, rechts Marktstände. Menschenleer, der Platz bietet Raum für zehn Figuren. |
| `bg-schreibstube` | Station 5 | Schreibstube eines Professors im Kloster. Schreibtisch mit Papierbögen, Federkiel, Siegelwachs und einem gefalteten Brief, Regal, Kachelofen, Fenster mit Blick auf einen Kirchturm. Abendlicht, eine Kerze. Menschenleer. |
| `bg-herberge` | Station 6, Tag 1 | Schlichte Kammer in einer Herberge bei Nacht. Tisch mit Kerze und einem Stapel Bücher, Bett, Reisemantel am Haken, Fenster mit Blick auf den Dom im Mondlicht. Menschenleer. |
| `bg-saal` | Station 6, Tag 2 | Großer Saal im Bischofshof. Links ein erhöhter Thron unter einem Baldachin (leer), in der Mitte ein Tisch mit einem Stapel Bücher, rechts und hinten Bänke in mehreren Reihen (leer), Fackeln an den Wänden, hohe Fenster. Menschenleer. |
| `bg-wartburg` | Station 7 | Holzgetäfelte Stube auf einer Burg im Winter. Schreibtisch mit Büchern und Manuskript, Kachelofen, ein Walwirbel als Fußschemel, Fenster mit Blick auf verschneiten Wald. Menschenleer. |

## Karten und Rätselflächen

| Datei | Maße | Beschreibung |
| --- | --- | --- |
| `karte-erinnerung` | 2048 × 1536 | Landkarte Mitteldeutschlands im Holzschnittstil auf Pergament. Flüsse (Elbe, Saale, Main, Rhein), Wälder, Hügel. Kleine Stadtansichten an den Stellen von Erfurt, Wittenberg, Jüterbog, Worms und Eisenach. Keine Beschriftung. |
| `karte-reich` | 2048 × 1536 | Schlichte Karte des Reichs um 1517 auf Pergament: nur Flüsse, Gebirge und Küstenlinie, sehr zurückhaltend koloriert, damit farbige Markierungen gut sichtbar sind. Keine Städte, keine Beschriftung. |
| `wandbild-1` bis `wandbild-6` | je 800 × 800 | Sechs Teile eines Kirchenwandbilds „Der Weg der Seele“: (1) Menschen am Sterbebett, (2) Christus als Richter auf dem Regenbogen, (3) Himmel als Stadt mit Tor und Engeln, (4) Fegefeuer: Menschen in Flammen, die nach oben blicken, ein Engel hebt eine Seele heraus, (5) Höllenrachen mit dunklen Gestalten, nicht blutig, (6) betende Angehörige vor einem Altar. Stil eines verblassten Wandgemäldes. |
| `weg-wallfahrt`, `weg-reliquien`, `weg-heilige`, `weg-ablass` | je 600 × 600 | Vier Bildkarten: Pilger mit Stab und Muschel; ein verziertes Reliquienkästchen; eine Heiligenfigur mit Kerzen; ein Brief mit hängendem Siegel. |
| `waage` | 1200 × 900 | Große Balkenwaage aus Messing mit zwei leeren Schalen, von vorn, Balken waagerecht. Einzelteile getrennt: `waage-staender`, `waage-balken`, `waage-schale`. |
| `gewicht-suende` | 500 × 500 | Schwerer dunkler Feldstein mit Eisenring. |
| `werk-fasten`, `werk-beten`, `werk-beichte`, `werk-wachen` | je 400 × 400 | Vier kleine Gegenstände: leerer Holzteller; gefaltete Hände; Beichtgitter; brennende Kerze mit Stundenglas. |

## Figuren (PNG, durchsichtig, 900 × 1400, ganze Figur, stehend)

| Datei | Beschreibung |
| --- | --- |
| `fig-meister` | Buchdrucker, etwa 50, Lederschürze, aufgekrempelte Ärmel, Druckerschwärze an den Händen, freundlich-streng. |
| `fig-pilger` | Mann, etwa 40, Pilgerhut mit Muschel, Stab, staubiger Umhang, besorgter Blick. |
| `fig-mitbruder` | Junger Augustinermönch in schwarzer Kutte mit Ledergürtel, ruhig. |
| `fig-luther-moench` | Luther, 22, hager, schwarze Kutte, Tonsur, ernster Blick. |
| `fig-luther-professor` | Luther, 34, Kutte und Doktorhut, ein Blatt Papier in der Hand. |
| `fig-luther-worms` | Luther, 37, Kutte, Hand auf der Brust, aufrecht. |
| `fig-luther-junker` | Luther, 38, als Junker Jörg: Vollbart, dichtes Haar, Wams, kein Mönchsgewand. |
| `fig-baeuerin` | Bäuerin, etwa 35, Kopftuch, schlichtes Kleid, ein kleiner Münzbeutel in der Hand, traurig. |
| `fig-kaufmann` | Wohlhabender Kaufmann, Pelzkragen, Barett, Rechenbrett unter dem Arm. |
| `fig-junge` | Junge, etwa 13, barfuß, Kappe, eine Münze in der Faust, neugierig. |
| `fig-geselle` | Handwerksgeselle, etwa 20, Wanderbündel, Filzhut. |
| `fig-witwe` | Alte Frau, dunkles Tuch, Stock, schmaler Beutel. |
| `fig-tetzel` | Dominikanermönch, etwa 50, weißes Gewand mit schwarzem Mantel, kräftige Statur, predigende Geste. Würdig, nicht karikiert. |
| `fig-sprecher` | Johann von der Ecken, Jurist, etwa 40, dunkler Talar, Barett, Schriftrolle, sachlich. |
| `fig-kaiser` | Karl V., 21 Jahre alt, schmal, vorstehendes Kinn, Barett, Pelzmantel, Ordenskette, sitzend auf dem Thron (1100 × 1400). |
| `fig-stand-1` bis `fig-stand-6` | Sechs Reichsstände, sitzend (700 × 900): zwei Fürsten, zwei Bischöfe, zwei Ratsherren. Je drei Fassungen: neutral, nickend, abgewandt. |
| `fig-marktfrau` | Marktfrau, Schürze, Korb mit Brot, lacht. |
| `fig-kind` | Mädchen, etwa 8, Zöpfe, Holzpuppe. |
| `fig-handwerker` | Zimmermann, Lederschurz, Hammer am Gürtel. |
| `fig-statist-1` bis `fig-statist-4` | Vier schlichte Marktbesucher, klein (500 × 800), von hinten oder der Seite. |
| `fig-bote` | Laufender Bote mit Umhängetasche, klein (400 × 400), Seitenansicht. |

**Standbild-Figuren (Station 3, 700 × 1100):**

| Datei | Beschreibung |
| --- | --- |
| `stand-luther-gebeugt`, `-kniend`, `-aufrecht` | Luther als Mönch in drei Haltungen, Seitenansicht nach rechts. |
| `stand-gott-streng`, `-offen` | Helle Gestalt ohne Gesichtszüge in einem weiten Gewand, von einem Lichtkranz umgeben: einmal mit erhobener Hand und abgewandtem Körper, einmal mit ausgebreiteten Armen. Seitenansicht nach links. (Siehe offene Frage 3 im Plan.) |

## Gegenstände und Zeichen (PNG, durchsichtig)

| Datei | Maße | Beschreibung |
| --- | --- | --- |
| `platte-1` bis `platte-7` | je 500 × 500 | Sieben hölzerne Druckplatten mit eingeschnittenem Bildzeichen: Flamme, Blitz, aufgeschlagenes Buch, Münze, Feder, Waage des Gewissens, Burg. Dazu `platte-leer`. |
| `karte-rueck`, `karte-vorn` | 600 × 840 | Rückseite und leere Vorderseite einer Argumentkarte: Pergament mit Holzschnittrahmen. |
| `ablassbrief` | 1200 × 900 | Gedruckter Brief mit freiem Namensfeld und hängendem Siegel. Schrift nur als unleserliche Zeilen. |
| `ablasskasten` | 800 × 800 | Eisenbeschlagene Truhe mit drei Schlössern und Münzschlitz. |
| `muenze` | 200 × 200 | Silbermünze. |
| `geldweg-albrecht`, `-fugger`, `-rom` | je 600 × 600 | Drei Bildzeichen: Bischofsmütze mit Wappen; Kontorbuch mit Münzstapel; Kirchenkuppel im Bau mit Gerüst. |
| `flugblatt-latein`, `flugblatt-deutsch` | je 300 × 400 | Zwei Flugblätter mit unleserlichen Zeilen: eines eng gesetzt, eines mit großem Holzschnitt und breiten Zeilen. |
| `stadt-klein`, `stadt-knoten` | 200 × 200 | Zwei Stadtzeichen für die Reichskarte: ein Turm; drei Türme mit Mauer. |
| `rose-1` bis `rose-5` | je 600 × 600 | Fünf Teile der Lutherrose: schwarzes Kreuz, rotes Herz, weiße Rose, blaues Feld, goldener Ring. |
| `motiv-1` bis `motiv-4` | je 1000 × 1000 | Vier Bilder für die Flugschrift, schwarz-weiß: Mönch mit Feder am Pult; Druckerpresse; aufgeschlagene Bibel im Licht; Waage mit Münze und Herz. |
| `septembertestament` | 500 × 700 | Dickes Buch in hellem Einband, ohne Titelschrift. |

## Bonusspiele (Phase 3)

| Datei | Maße | Beschreibung |
| --- | --- | --- |
| `bonus-wald` | 2048 × 1536 | Waldweg von oben (echte Draufsicht), Hohlweg, Bäume, ein Bach. |
| `bonus-wagen`, `bonus-reiter` | 300 × 300 | Reisewagen und Reiter von oben. |
| `bonus-presse-teile` | 4 × 500 × 500 | Druckerpresse in vier Zuständen: einfärben, Bogen einlegen, pressen, Bogen abnehmen. |
| `bonus-gottesdienst-1500`, `-1522` | je 1600 × 1200 | Dieselbe Kirche zweimal: Priester mit dem Rücken zur Gemeinde am Hochaltar; Prediger auf der Kanzel, der Gemeinde zugewandt, die Gemeinde singt aus Blättern. |

## Was nicht erzeugt wird

Alle Bedienzeichen (Karte, Beutel, Notizbuch, Hinweis, Vollbild, Vorlesen) zeichne ich als SVG direkt im Code. Schriften kommen vom Gerät; es wird keine Schriftdatei geladen. Gemeinfreie Originalbilder (Cranach, alte Holzschnitte) sind für das Notizbuch möglich, aber nicht nötig. Falls du welche willst, kommen sie mit Quellenangabe nach `assets/quellen/`.
