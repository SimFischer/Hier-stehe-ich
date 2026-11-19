# Bildprompts: Siegelbriefe für „Hammer & Siegel“

Stand: 19.11.2026. Nach jedem Sieg in „Hammer & Siegel“ gibt es einen Siegelbrief (Kartenpaket). Beim Öffnen bricht das Wachssiegel, der Brief klappt auf, Licht strömt heraus und die Karten fliegen verdeckt heraus. Die Animation baue ich im Spiel aus einzelnen Bildebenen. Dafür müssen die Bilder **genau übereinanderpassen**.

## So vorgehen (wichtig für saubere Ebenen)

1. Zuerst Bild 1 (geschlossener Brief) erzeugen.
2. Die weiteren Briefbilder **als Bearbeitung von Bild 1** erzeugen („Bearbeite dieses Bild: …“), nicht neu. So bleiben Größe, Lage und Blickwinkel gleich.
3. Alle Dateien als **PNG mit transparentem Hintergrund**, ohne Schatten auf dem Hintergrund, ohne Schrift.
4. Dateinamen genau wie unten. Bitte alle Bilder zusammen als ZIP schicken.

## Gemeinsamer Stil (vor jeden Prompt setzen)

```text
Kolorierter Holzschnitt im Stil deutscher Flugschriften um 1520, passend zu einem Lernspiel über Martin Luther. Kräftige schwarze Konturen, feine Schraffuren, warme, satte Farben: Pergament, Ocker, Siegelrot, Tintenschwarz, etwas Gold. Hochwertig, klar lesbar auch in kleiner Größe, wie ein Sammelobjekt in einem Kartenspiel. Freigestellt auf vollständig transparentem Hintergrund, keine Schrift, keine Buchstaben, keine Menschen. Frontale Ansicht, leicht von oben, mittig im Bild, mit etwas Rand rundherum.
```

## 1. `siegelbrief-zu.png` (1200 × 900)

```text
Ein gefalteter, geschlossener Brief aus dickem, leicht vergilbtem Pergament, querformatig, etwa 3:2. Die dreieckige Briefklappe ist oben zugeklappt und zeigt mit der Spitze zur Mitte. Genau in der Mitte, auf der Spitze der Klappe, sitzt ein großes, rundes, rotes Wachssiegel mit welligem Rand. Im Siegel ist ein Hammer eingeprägt (wie beim Anschlag der Thesen), schräg gestellt, mit feinem Glanzlicht auf dem Wachs. Um den Brief ist eine schmale Kordel aus Hanf gebunden, die unter dem Siegel verschwindet. Kanten leicht abgegriffen, kleine Knicke, ein paar Tintenflecken. Der Brief wirkt wertvoll und geheimnisvoll.
```

## 2. `siegelbrief-auf.png` (1200 × 900, Bearbeitung von Bild 1)

```text
Bearbeite dieses Bild: Derselbe Brief in genau derselben Größe und Lage, aber geöffnet. Die Briefklappe ist nach oben aufgeklappt und steht über den oberen Rand des Briefes hinaus. Das Siegel ist weg (an seiner Stelle nur ein kleiner roter Wachsrest), die Kordel ist gelöst und hängt locker herab. Aus dem Inneren des Briefes strömt warmes, goldenes Licht nach oben, mit einigen Lichtstrahlen. Im Inneren sind die Oberkanten von drei Karten zu sehen, nur als Rückseiten, ohne Motiv.
```

## 3. `siegel-ganz.png` (600 × 600)

```text
Nur das rote Wachssiegel aus Bild 1, groß und allein: rund, welliger, dicker Wachsrand, eingeprägter schräger Hammer, Glanzlicht oben links, leichte Tropfnasen am Rand. Genau mittig, das Siegel füllt etwa 85 Prozent des Bildes.
```

## 4. `siegel-bruch-links.png` und `siegel-bruch-rechts.png` (je 600 × 600, Bearbeitung von Bild 3)

```text
Bearbeite dieses Bild: Dasselbe Siegel in genau derselben Größe und Lage, aber zerbrochen. Ein gezackter Riss läuft von oben nach unten durch die Mitte. Zeige NUR die linke Hälfte (für die zweite Datei: NUR die rechte Hälfte). Die andere Hälfte ist vollständig transparent. Ein paar kleine Wachssplitter an der Bruchkante.
```

## 5. `siegelbrief-gross-zu.png` und `siegelbrief-gross-auf.png` (je 1200 × 900)

Für den großen Siegelbrief (drei Sterne). Wie Bild 1 und 2, als Bearbeitung davon:

```text
Bearbeite dieses Bild: Derselbe Brief in genau derselben Größe und Lage, aber prächtiger: Pergament mit goldenem Rand und feinen goldenen Ornamenten an den Ecken, die Kordel ist ein goldenes Band, das Siegel ist dunkelrot mit Blattgold-Sprenkeln. (Für die zweite Datei: geöffnet wie in Bild 2, das Licht innen noch heller und goldener.)
```

## 6. `siegel-licht.png` (1200 × 1200)

```text
Ein runder Lichtschein aus warmen, goldenen Strahlen, die von der Mitte nach außen laufen, im Holzschnitt-Stil mit feinen Strichlinien statt weichem Verlauf. In der Mitte hell, nach außen auslaufend und durchsichtig werdend. Transparenter Hintergrund. Wird hinter den Karten gedreht, wenn eine seltene Karte erscheint.
```

## 7. Rückseiten nach Seltenheit (je 630 × 880, Hochformat 63:88)

Die Rückseite der Karten gibt es schon (`ruecken-luther`). Für mehr Spannung beim Aufdecken je eine Variante mit Rahmen in der Farbe der Seltenheit, als Bearbeitung der vorhandenen Rückseite:

- `ruecken-selten.png`: Rahmen und Ecken in Silberblau
- `ruecken-episch.png`: Rahmen und Ecken in Violett mit feinem Glanz
- `ruecken-legendaer.png`: Rahmen und Ecken in Gold mit leuchtenden Verzierungen

```text
Bearbeite dieses Bild: Dieselbe Kartenrückseite in genau derselben Größe, aber mit einem breiten, verzierten Rahmen und Eckbeschlägen in [Silberblau / Violett / Gold]. Die Mitte bleibt wie sie ist. Keine Schrift.
```

## Was das Spiel daraus macht

- Brief schwebt leicht, das Siegel pulsiert (Bild 1 und 3).
- Antippen: Siegel zerbricht in zwei Hälften, die zur Seite fallen (Bild 4), der Brief wechselt zu „auf“ (Bild 2), der Lichtschein dreht sich (Bild 6).
- Die Karten fliegen verdeckt heraus, mit der Rückseite ihrer Seltenheit (Bild 7), und drehen sich beim Antippen um.
