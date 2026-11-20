# Bildprompts, Teil 6: Neue Karten für „Hammer & Siegel“

Stand: 20.11.2026. Es gibt 17 neue Karten (12 für Luther, 5 der Kirche). Erledigt: Alle 17 Bilder sind am 20.11.2026 eingebaut (auf 600 × 450 verkleinert, `assets/kunst-*.jpg`).

## So vorgehen

- Für jede Karte: zuerst den **Stilblock** (je nach Seite Luther oder Kirche), dann das **Motiv** der Karte in denselben Prompt kopieren.
- Format: Querformat 4:3, 1200 × 900 Pixel, JPG oder PNG.
- Dateinamen genau wie angegeben (`kunst-r19.jpg` usw.). Alles zusammen als ZIP schicken; ich verkleinere und trage ein.

## Stilblock für Luthers Karten

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel im Stil von Gwent, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Das Bild wird im Spiel hochkant beschnitten: Das Wichtige gehört in die mittleren 60 % der Breite. Oben links liegt im Spiel ein Band mit der Stärke, unten ein Namensschild. Ein einziges klares Motiv, auch klein gut erkennbar, kräftiger Hell-Dunkel-Kontrast.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.
```

## Stilblock für Karten der Kirche

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel im Stil von Gwent, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Das Bild wird im Spiel hochkant beschnitten: Das Wichtige gehört in die mittleren 60 % der Breite. Oben links liegt im Spiel ein Band mit der Stärke, unten ein Namensschild. Ein einziges klares Motiv, auch klein gut erkennbar, kräftiger Hell-Dunkel-Kontrast.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.
```

## Luthers Karten

| Datei | Karte | Motiv (an den Stilblock anhängen) |
|---|---|---|
| `kunst-r19` | Loci communes | Motiv: Ein junger, schmaler Gelehrter mit kurzem Bart (Philipp Melanchthon) sitzt an einem Pult und ordnet Blätter zu einem dicken Buch. Um ihn herum Studenten, die zuhören. Helles Fensterlicht. |
| `kunst-r20` | Argula von Grumbach | Motiv: Eine adlige Frau um 1523 in dunklem Kleid mit weißer Haube sitzt aufrecht an einem Schreibtisch, eine aufgeschlagene Bibel neben sich, und schreibt mit der Feder einen Brief. Entschlossener Blick. |
| `kunst-r21` | Die Wittenbergisch Nachtigall | Motiv: Eine Nachtigall singt auf einem Zweig im Morgenrot, darunter eine Stadtsilhouette, aus der die Sonne aufgeht. Im Vordergrund ein Schuhmacher-Werktisch mit Leisten und einem Blatt Papier. |
| `kunst-r22` | Ulrich von Hutten | Motiv: Ein Ritter mit Lorbeerkranz im Haar, Brustharnisch und Mantel, hält statt eines Schwertes eine Schreibfeder erhoben. Hinter ihm eine Burg auf einem Hügel. |
| `kunst-r23` | Junker Jörg | Motiv: Martin Luther mit dichtem Bart und vollem Haar, in Ritterkleidung mit Wams und Barett, sitzt in einer holzgetäfelten Burgstube am Fenster und schreibt. Draußen Wald und Hügel. |
| `kunst-r24` | Die ganze Bibel auf Deutsch | Motiv: Eine prächtige, große aufgeschlagene Bibel mit zwei Bänden nebeneinander (Altes und Neues Testament), farbige Holzschnittbilder auf den Seiten, Strahlen von oben. Davor Hände einer Familie, die darin lesen. |
| `kunst-r25` | Die Deutsche Messe | Motiv: Eine Gemeinde in einer einfachen Kirche steht mit Liedblättern in den Händen und singt, vorn ein Pfarrer im schwarzen Talar, der zur Gemeinde gewandt liest. |
| `kunst-r26` | Pfarrer dürfen heiraten | Motiv: Eine schlichte Hochzeit 1525: ein Mann im schwarzen Talar und eine Frau mit Haube und Blumenkranz reichen sich die Hände, Freunde stehen dabei, ein Festtisch im Hintergrund. |
| `kunst-r27` | Schulen für alle | Motiv: Eine Schulstube um 1525: Jungen und Mädchen sitzen auf Bänken mit Schiefertafeln und Büchern, ein Lehrer zeigt auf eine Tafel mit Bildern. Freundliches Licht. |
| `kunst-r28` | Die Protestation | Motiv: Mehrere Fürsten und Ratsherren in prächtigen Mänteln stehen in einem Saal zusammen und erheben gemeinsam die Hand zum Widerspruch. Einer überreicht eine gesiegelte Urkunde. |
| `kunst-r29` | Das Augsburger Bekenntnis | Motiv: In einem großen Saal liest ein Kanzler vor dem thronenden Kaiser eine Schrift vor. Daneben stehen evangelische Fürsten mit ernstem, festem Blick. Prächtige Wandteppiche. |
| `kunst-r30` | Die Gemeinde urteilt | Motiv: Bürger, Handwerker und Frauen sitzen in einem Ratssaal und hören einem jungen Prediger zu. Einige halten eine Bibel und prüfen nach. Ruhige, aufmerksame Stimmung. |

## Karten der Kirche

| Datei | Karte | Motiv (an den Stilblock anhängen) |
|---|---|---|
| `kunst-c-edikt` | Das Wormser Edikt | Motiv: Ein Herold heftet auf einem Stadtplatz eine große gesiegelte Urkunde an eine Holztafel. Davor ein kleiner Stapel Bücher, die eingesammelt werden. Banner mit dem Reichsadler. |
| `kunst-c-ingolstadt` | Abschwören! | Motiv: Ein junger Student kniet vor einer Reihe von Professoren in Talaren und Doktorhüten in einem Hörsaal und legt die Hand auf ein Buch. Ernste, strenge Stimmung. |
| `kunst-c-spott` | Der große lutherische Narr | Motiv: Ein Franziskanermönch in brauner Kutte sitzt an einem Schreibpult und zeichnet mit spitzer Feder. Auf dem Pult liegt eine Narrenkappe mit Schellen. Spöttischer, aber nicht böser Blick. |
| `kunst-c-messe` | Die Messe auf Latein | Motiv: Ein Priester in prächtigem Messgewand steht mit dem Rücken zur Gemeinde am Hochaltar und hebt die Hände. Die Gemeinde kniet weit hinten und schaut zu. Kerzen und Weihrauch. |
| `kunst-c-zoelibat` | Ehelos bleiben | Motiv: Eine Reihe von Mönchen und Nonnen geht in einem Kreuzgang schweigend zum Gebet, die Hände gefaltet. Ein Bischof segnet sie vom Rand aus. |
