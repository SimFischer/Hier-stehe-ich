# Bildprompts, Teil 2: Kartenspiel, Leipzig und fehlende Figuren

Stand: 18.11.2026 · ergänzt `docs/ASSET-PROMPTS.md`

Jeder Prompt unten ist vollständig: Stilrahmen, Zusatz für die Bildart und das Motiv. Du kannst ihn direkt kopieren.

## Stand am 18.11.2026

Eingebaut: Leipzig, Eck, Student, Kaplan, Spieltisch, beide Kartenrücken, alle zehn Symbole, alle 16 Kirchenkarten und 12 von 24 Karten Luthers.

Noch offen: Kartenbilder für `kunst-t32`, `kunst-t36`, `kunst-t43`, `kunst-t86`, `kunst-k7`, `kunst-k8`, `kunst-k13`, `kunst-n2`, `kunst-k9`, `kunst-k10`, `kunst-k11`, `kunst-k14`. Bis dahin zeigen diese Karten ihr bisheriges Bild.

## So kommen die Bilder ins Spiel

1. Datei genau so benennen wie angegeben (zum Beispiel `kunst-k4.jpg`) und in den Ordner `assets/` legen.
2. Eine Zeile im Register `data/assets.js` ergänzen, zum Beispiel `'kunst-k4': { datei: 'kunst-k4.jpg', w: 1200, h: 900 },`. Oder du schickst mir die Bilder, dann trage ich sie ein und verkleinere sie.
3. Mehr ist nicht nötig. Das Spiel nimmt ein vorhandenes Kartenbild automatisch statt des bisherigen Ersatzbilds. Was fehlt, bleibt wie bisher.

Empfohlene Reihenfolge: zuerst A (Leipzig und Figuren), dann die Kartenbilder der Kernkarten (B 1 und B 2), dann Tisch und Kartenrücken (C), zuletzt die Symbole (D).

Format für die Ablage: Kartenbilder als JPG mit etwa 80 % Qualität (ich verkleinere sie für das Spiel auf 600 × 450). Figuren und Symbole als PNG mit durchsichtigem Hintergrund.

## A. Neuer Ort und fehlende Figuren

### `bg-leipzig` · Hintergrund Leipzig (Nebenort, Disputation 1519)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Hintergrundbild 2048 × 1536 Pixel (4:3), JPG. Menschenleer. Alles Wichtige liegt in den mittleren 75 % der Breite; die Ränder dürfen auf schmalen Bildschirmen wegfallen.

Motiv: Großer Saal in der Pleißenburg in Leipzig, Sommer 1519, Hofstube einer Burg. In der Mitte zwei hölzerne Rednerpulte (Katheder), die sich gegenüberstehen, mit Teppichen behängt. Links ein erhöhtes Podest mit leeren, prachtvollen Stühlen für den Herzog. Rechts und hinten Bänke in mehreren Reihen für Zuhörer (leer). Hohe gotische Fenster mit Blick auf Leipziger Dächer und Kirchtürme, Wappenbehänge an den Wänden, Sommerlicht. Links und rechts im Vordergrund freier Boden, auf dem später zwei Figuren stehen. Menschenleer.
```

### `fig-eck` · Johann Eck (Gegner in Leipzig, auch auf der Karte „Johann Eck“)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Ganze Figur, stehend, von vorn bis leicht schräg, PNG mit durchsichtigem Hintergrund, 900 × 1400 Pixel, Licht von links oben, kein Bodenschatten außer einem kleinen Schatten unter den Füßen. Passend zu den übrigen Figuren des Spiels (gleicher Strich, gleiche Farben).

Motiv: Johann Eck, Theologieprofessor aus Ingolstadt, 33 Jahre alt, kräftige, breite Statur, rundes glattrasiertes Gesicht, kurzes dunkles Haar, selbstbewusster, wacher Blick. Dunkler Gelehrtentalar mit Pelzbesatz, schwarzes Barett, in der linken Hand ein dickes Buch mit Lesezeichen, die rechte Hand mit erhobenem Zeigefinger wie beim Argumentieren. Würdig und klug, kein Bösewicht.
```

### `fig-student` · Student aus Wittenberg (Leipzig, Karte „Rückhalt der Studenten“)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Ganze Figur, stehend, von vorn bis leicht schräg, PNG mit durchsichtigem Hintergrund, 900 × 1400 Pixel, Licht von links oben, kein Bodenschatten außer einem kleinen Schatten unter den Füßen. Passend zu den übrigen Figuren des Spiels (gleicher Strich, gleiche Farben).

Motiv: Student aus Wittenberg, etwa 18 Jahre alt, schlanker junger Mann, schlichter dunkelgrüner Rock bis zum Knie, Barett, Bücher unter dem Arm, ein Wanderstab, entschlossener, freundlicher Blick.
```

### `fig-kaplan` · Kaplan (Station 4, Markt von Jüterbog)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Ganze Figur, stehend, von vorn bis leicht schräg, PNG mit durchsichtigem Hintergrund, 900 × 1400 Pixel, Licht von links oben, kein Bodenschatten außer einem kleinen Schatten unter den Füßen. Passend zu den übrigen Figuren des Spiels (gleicher Strich, gleiche Farben).

Motiv: Junger Kaplan einer Stadtkirche, etwa 30 Jahre alt, schwarzer Talar mit weißem Chorhemd (Rochett), kleine runde Kappe, ein Gebetbuch in der Hand, nachdenklicher, freundlicher Blick. Er steht etwas abseits, als würde er leise etwas erklären.
```

## B. Kartenbilder (je 1200 × 900, JPG)

Jede Karte bekommt ein eigenes, randloses Bild. Bisher zeigen die Karten Gegenstände und Figuren aus den Stationen, oft klein und blass. Mit eigenen Kartenbildern wirken sie wie echte Sammelkarten.

### B 1. Luthers Karten (Erkenntnisse)

#### `kunst-k1` · Die Angst kennen (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Ein Pilger kniet ängstlich in einer dunklen Dorfkirche vor einem großen Wandbild des Jüngsten Gerichts. Nur eine Kerze leuchtet, sein Gesicht ist voller Sorge.
```

#### `kunst-k2` · Werke reichen nicht (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Eine große Messingwaage. In der linken Schale ein Berg dunkler, schwerer Steine, in der rechten nur kleine gute Gaben: eine Kerze, ein Brotlaib, ein Rosenkranz. Die Waage neigt sich tief nach links. Ein junger Mönch in schwarzer Kutte schaut ratlos darauf.
```

#### `kunst-k3` · Gnade ist ein Geschenk (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Zwei offene, empfangende Hände in der Bildmitte. Von oben fällt ein warmer Lichtstrahl, in ihm schwebt eine weiße Rose herab. Kein Gesicht und keine Gestalt Gottes, nur Licht.
```

#### `kunst-k4` · Wie der Vater (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Gleichnis vom verlorenen Sohn: Ein alter Vater rennt mit ausgebreiteten Armen auf einer Landstraße auf seinen zerlumpten, barfüßigen Sohn zu. Im Hintergrund ein Bauernhof im Abendlicht.
```

#### `kunst-k5` · Maßstab Bibel (legendär)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Eine große aufgeschlagene Bibel auf einem Lesepult, aus den Seiten strahlt goldenes Licht nach oben. Davor liegen ein Winkelmaß und ein Lot aus Messing wie Werkzeuge eines Baumeisters.
```

#### `kunst-k12` · Allein aus Glauben (legendär)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Der junge Luther als Mönch im Turmzimmer an seinem Pult. Er hebt den Kopf von der aufgeschlagenen Bibel, sein Gesicht ist erleichtert und froh. Durch das schmale Fenster fällt helles Morgenlicht genau auf ihn.
```

#### `kunst-w1` · Weg des Geldes (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Aus einer eisenbeschlagenen Truhe fließt ein Strom von Silbermünzen und teilt sich in drei Wege: zu einer Bischofsmütze mit Wappen, zu einem Kontorbuch mit Münzwaage eines Bankhauses, zu einer fernen Kirchenbaustelle mit Gerüsten und Kran.
```

#### `kunst-w2` · Ohne Reue kein Erlass (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Ein Mann kniet mit gesenktem Kopf und gefalteten Händen, reuig und ehrlich. Neben ihm liegt ein gesiegelter Ablassbrief unbeachtet auf dem Steinboden. Sanftes Licht fällt nur auf den Knienden.
```

#### `kunst-w3` · Gott entscheidet (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Ein kleiner Friedhof mit einfachen Holzkreuzen. Eine trauernde Familie steht an einem Grab. Von oben bricht ein breiter, heller Lichtstrahl durch die Wolken und fällt auf das Grab. Die Gesichter werden ruhig und getröstet. Keine Gestalt Gottes, nur Licht.
```

#### `kunst-k6` · Nicht käuflich (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Eine Hand hält einen Beutel voller Münzen in einen hellen Lichtkegel hinein. Die Münzen fallen durch das Licht hindurch klirrend auf den Boden, als könnte man das Licht nicht kaufen.
```

#### `kunst-n1` · Die Not der Leute (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Eine arme alte Witwe legt mit zitternder Hand ihre letzten Münzen in einen eisenbeschlagenen Ablasskasten. Neben ihr ein dünnes Kind. Im Hintergrund schaut ein Mönch in schwarzer Kutte betroffen zu.
```

#### `kunst-t27` · These 27 (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Eine Münze fällt klingend in den Schlitz eines Ablasskastens, kleine Klanglinien wie im Holzschnitt. Daneben ein Gelehrter im Mönchsgewand, der ernst den Kopf schüttelt und den Finger hebt.
```

#### `kunst-t32` · These 32 (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Ein Mann hält einen gesiegelten Ablassbrief wie einen Schild vor die Brust und lächelt sorglos. Er merkt nicht, dass er auf einer morschen, brechenden Holzbrücke über einem Abgrund steht.
```

#### `kunst-t36` · These 36 (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Ein Mensch kniet reuig vor einem einfachen Holzkreuz, Licht fällt warm auf ihn. Ein Ablassbrief liegt ungeöffnet und unnötig zur Seite gelegt.
```

#### `kunst-t43` · These 43 (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Ein Bürger reicht einer armen Familie an einer Haustür ein Brot und eine Münze. Im Hintergrund steht ein Ablasskasten, den niemand beachtet.
```

#### `kunst-t86` · These 86 (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Die riesige Baustelle der Peterskirche in Rom mit Pfeilern, Gerüsten und Holzkränen, noch ohne Kuppel. Im Vordergrund eine prächtige, überquellende Schatztruhe mit dem Schlüsselwappen des Papstes.
```

#### `kunst-k7` · Erneuern, nicht spalten (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Ein Steinmetz setzt behutsam einen neuen, hellen Stein in eine alte, rissige Kirchenmauer ein, statt sie einzureißen. Die Kirche steht fest, nur die beschädigte Stelle wird erneuert.
```

#### `kunst-k8` · Viele haben es gelesen (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Ein voller Marktplatz: Viele Menschen, Handwerker, Frauen, Kinder, lesen gedruckte Flugblätter oder lesen sie anderen vor. Ein Bote verteilt einen Stapel Blätter, einige Blätter wehen im Wind.
```

#### `kunst-k13` · Die Druckerpresse (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Eine große hölzerne Druckerpresse in voller Arbeit. Ein kräftiger Geselle zieht am Hebel, ein Lehrling hängt frisch gedruckte Bögen zum Trocknen auf. Warmes Werkstattlicht.
```

#### `kunst-n2` · Rückhalt der Studenten (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Eine Gruppe junger Studenten mit Baretten, Büchern und Wanderstäben zieht entschlossen durch ein Stadttor. Vorn ein Pferdewagen mit zwei Gelehrten. Sommerlicht.
```

#### `kunst-k9` · Konzilien irren (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Zwei Versammlungen von Bischöfen mit Mitren stehen sich in einem Kirchenraum gegenüber und halten gegensätzlich Schriftrollen hoch, als würden sie einander widersprechen. Die Rollen zeigen keine Schrift. In der Mitte ein Riss im Boden.
```

#### `kunst-k10` · Gewissen (legendär)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Luther, 37 Jahre alt, in schwarzer Kutte, steht aufrecht vor dem Reichstag in Worms, die Hand auf der Brust. Er steht in einem hellen Lichtkegel, Kaiser und Fürsten sitzen im Halbdunkel um ihn herum.
```

#### `kunst-k11` · Bibel für alle (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Eine Bauernfamilie sitzt abends am Holztisch: Vater, Mutter und zwei Kinder lesen gemeinsam in einer aufgeschlagenen Bibel. Eine Kerze beleuchtet die Gesichter.
```

#### `kunst-k14` · Dem Volk aufs Maul (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung warm und hoffnungsvoll: viel Ocker, Pergament und Tannengrün, Licht von oben.

Motiv: Luther als Junker Jörg mit Vollbart und Wams steht auf einem Markt und hört aufmerksam einer Marktfrau, einem Kind und einem Handwerker zu. In der Hand ein Notizblatt und eine Feder.
```

### B 2. Karten der Kirche

#### `kunst-c-richter` · Gott, der strenge Richter (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Christus als Weltenrichter, wie auf einem mittelalterlichen Wandbild: Er thront auf einem Regenbogen, ein Schwert und eine Lilie gehen von seinem Kopf aus. Darunter steigen kleine Menschen aus ihren Gräbern und blicken ängstlich nach oben.
```

#### `kunst-c-fegefeuer` · Angst vor dem Fegefeuer (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Seelen stehen bis zur Brust in hellen Flammen und blicken flehend nach oben, ein Engel reicht einer von ihnen die Hand. Nicht grausam, eher bedrückend.
```

#### `kunst-c-werke` · Gute Werke zählen (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Fromme Menschen tun gute Werke: Ein Pilger mit Muschelhut wandert zu einer Kirche, eine Frau zündet eine Kerze an, ein Mann legt eine Spende in einen Opferstock. Feierliches Licht.
```

#### `kunst-c-ablass` · Der Ablasshandel (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Auf einem Marktplatz steht ein großes rotes Kreuz mit dem Wappen des Papstes. Davor ein Tisch, an dem gesiegelte Briefe ausgegeben werden. Eine lange Schlange von Menschen wartet geduldig.
```

#### `kunst-c-brief` · Der Ablassbrief (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Ein gesiegelter Ablassbrief mit großem roten Siegel an Schnüren liegt feierlich auf rotem Samt. Die Zeilen sind nur als unleserliche Striche angedeutet. Goldenes Licht.
```

#### `kunst-c-predigt` · Tetzels Predigt (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Johann Tetzel, Dominikaner in weißem Gewand mit schwarzem Mantel, predigt mitreißend von einer Holzkanzel auf dem Marktplatz. Er hebt die Arme, die Menschen hören gebannt zu.
```

#### `kunst-c-petersdom` · Für den Petersdom (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Die gewaltige Baustelle der Peterskirche in Rom: mächtige Pfeiler, Gerüste, Holzkräne, Arbeiter tragen Steine. Noch keine Kuppel. Im Hintergrund der Himmel über Rom.
```

#### `kunst-c-papst` · Der Papst entscheidet (legendär)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Papst Leo X. auf einem prächtigen Thron, mit der dreifachen Krone (Tiara) und den gekreuzten Schlüsseln Petri, ein rundliches, ruhiges Gesicht. Kardinäle in Rot stehen zu beiden Seiten. Würdig und machtvoll.
```

#### `kunst-c-konzil` · Die Konzilien (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Ein großes Konzil in einem Dom: Reihen über Reihen von Bischöfen mit weißen Mitren sitzen auf Bänken, vorn ein Vorsitzender unter einem Baldachin. Feierliches Kerzenlicht.
```

#### `kunst-c-tradition` · Tausend Jahre Tradition (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Ein langer Zug von Gläubigen aus vielen Jahrhunderten, erkennbar an unterschiedlicher Kleidung von der Antike bis um 1500, folgt einem kostbaren goldenen Reliquienschrein zu einer alten Kirche.
```

#### `kunst-c-hus` · Wie Jan Hus (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Konstanz 1415: Der Prediger Jan Hus, schlicht gekleidet, steht allein vor einer Reihe streng blickender Konzilsväter, die über ihn urteilen. Kein Feuer, keine Gewalt.
```

#### `kunst-c-eck` · Johann Eck (legendär)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Johann Eck, Theologieprofessor, 33 Jahre alt, kräftig, rundes glattrasiertes Gesicht, schwarzes Barett und Talar mit Pelzbesatz. Er steht an einem Rednerpult und hebt den Zeigefinger, siegessicher. Zuhörer im Hintergrund.
```

#### `kunst-c-ketzer` · Ketzer! (gewöhnlich)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Ein einzelner Mönch steht in der Mitte eines Platzes. Viele Menschen ringsum zeigen mit ausgestreckten Fingern auf ihn. Er steht still und ernst.
```

#### `kunst-c-bann` · Der Kirchenbann (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: In einer dunklen Kirche wird eine Urkunde mit großem bleiernem Siegel verlesen. Ein Geistlicher löscht eine Kerze, die anderen Kerzen sind schon erloschen.
```

#### `kunst-c-ordnung` · Ruhe und Ordnung (episch)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Der junge Kaiser Karl V., 21 Jahre alt, schmal, mit vorstehendem Kinn, auf dem Thron mit Reichsapfel und Zepter. Davor stehen Landsknechte mit Spießen in strenger Reihe.
```

#### `kunst-c-mehrheit` · Alle gegen einen (selten)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Kartenbild für ein Sammelkartenspiel, Querformat 4:3 (1200 × 900 Pixel), randlos bis an alle Kanten gemalt, kein Rahmen, keine Schrift. Ein einziges klares Motiv in der Bildmitte, gut erkennbar auch sehr klein (etwa 100 Pixel breit). Das Wichtige liegt im mittleren und oberen Bereich: Die Ecke oben links und das untere Fünftel werden im Spiel von Siegel und Titelband verdeckt. Kräftiger Hell-Dunkel-Kontrast, dramatisches Licht wie auf einer besonderen Spielkarte.

Farbstimmung feierlich und machtvoll: tiefes Rot, Gold und Schwarz, prächtige Gewänder. Die Vertreter der Kirche wirken ernsthaft, würdig und überzeugt, nicht gierig, nicht böse, nicht lächerlich.

Motiv: Eine geschlossene Reihe von Kaiser, Fürsten und Bischöfen in prächtigen Gewändern blickt von oben auf einen einzelnen, kleinen Mönch, der ihnen gegenübersteht.
```

## C. Spieltisch und Kartenrücken

### `tisch-disputation` · Spieltisch der Disputation (2048 × 1536, JPG)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Hintergrund-Textur 2048 × 1536 Pixel, genau von oben gesehen. Ruhig, ohne Gegenstände in der Mitte, damit Karten darauf gut lesbar bleiben.

Motiv: Ein großer, dunkler Eichentisch eines Gelehrtensaals, von oben. Über die Mitte ist ein langes, schweres Tuch gelegt: die obere Hälfte tiefrot (Seite der Kirche), die untere Hälfte tannengrün (Seite Luthers), getrennt durch eine schmale goldene Borte. An den Rändern ein paar Kerzenständer, ein Tintenfass und Federkiele. Gedämpftes Kerzenlicht, die Mitte etwas heller.
```

### `ruecken-luther` · Kartenrücken Luther (600 × 840, PNG)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Rückseite einer Spielkarte im Hochformat 600 × 840 Pixel, randlos, symmetrisch, ohne Schrift.

Motiv: Tannengrüner Grund mit feinem Holzschnitt-Rankenmuster. In der Mitte ein großes Medaillon mit der Lutherrose (schwarzes Kreuz in rotem Herz, weiße Rose, blauer Grund, goldener Ring). Goldene Zierecken in allen vier Ecken.
```

### `ruecken-kirche` · Kartenrücken Kirche (600 × 840, PNG)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Rückseite einer Spielkarte im Hochformat 600 × 840 Pixel, randlos, symmetrisch, ohne Schrift.

Motiv: Tiefroter Grund mit goldenem Holzschnitt-Rankenmuster. In der Mitte zwei gekreuzte Schlüssel (Gold und Silber) unter einer dreifachen Krone. Goldene Zierecken in allen vier Ecken. Feierlich und würdig.
```

## D. Symbole der Kartenarten (je 256 × 256, PNG)

Kleine Zeichen neben der Kartenart („Gnade“, „Bibel“ …). Alle Symbole im selben Stil, damit sie als Satz wirken.

### `symbol-gottesbild` · Gottesbild

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: ein Auge in einem Strahlenkranz aus Licht.
```

### `symbol-gnade` · Gnade

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: ein rotes Herz, aus dem eine weiße Rose wächst.
```

### `symbol-bibel` · Bibel

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: ein aufgeschlagenes Buch mit Lichtstrahlen.
```

### `symbol-wissen` · Wissen

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: eine brennende Öllampe.
```

### `symbol-these` · These

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: ein Blatt Papier, mit einem Nagel festgeschlagen.
```

### `symbol-kirche` · Kirche

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: ein kleiner Kirchturm mit Kreuz.
```

### `symbol-druck` · Druck

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: ein einzelner Druckbuchstabe aus Blei (Letter) ohne lesbares Zeichen, seitlich gesehen.
```

### `symbol-gewissen` · Gewissen

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: ein Herz auf einer kleinen Waage.
```

### `symbol-menschen` · Menschen

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: drei schlichte Köpfe in einer Reihe.
```

### `symbol-rom` · Rom

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520. Kräftige schwarze Konturen, sichtbare Schraffuren statt weicher Verläufe, flächige Kolorierung in wenigen warmen Farben: Pergament (#EFE3C8), Ocker (#C8963E), Ziegelrot (#A6432E), Tannengrün (#3E5B45), Tintenschwarz (#1F1A17), dazu ein gedecktes Blau (#3F5870) für Himmel und Schatten. Leicht unregelmäßiger Druck, Papierstruktur. Keine Fotorealistik, keine modernen Gegenstände, keine Schrift, keine Buchstaben, keine Zahlen, keine Wasserzeichen. Gesichter freundlich und schlicht, keine Karikaturen.

Bildart: Kleines Symbol 256 × 256 Pixel, PNG mit durchsichtigem Hintergrund, ein einziger Gegenstand, mittig, sehr klare Silhouette mit dicker schwarzer Kontur, nur zwei bis drei Farben, muss auch in 20 Pixel Größe erkennbar sein. Keine Schrift.

Motiv: zwei gekreuzte Schlüssel.
```

## Was nicht als Bild nötig ist

Kartenrahmen, Seltenheitsfarben, Stärke-Siegel, Titelband und alle Animationen zeichnet das Spiel selbst (`css/karten.css`). So bleiben sie auf jedem Bildschirm scharf, und Texte lassen sich ändern, ohne Bilder neu zu erzeugen.
