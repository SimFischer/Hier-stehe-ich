# Überarbeitung 2: Das Kartenspiel „Disputation“

Stand: 18.11.2026. Grundlage: Rückmeldungen von Simon nach Überarbeitung 1 (Markt, Kartenspiel nach dem Vorbild von Gwent, Kartendesign, Tutorial, Spiel im Spiel).

## Leitidee

Die Kirche hatte um 1520 die Argumenthoheit. Im Spiel sind ihre Karten deshalb stark (bis 10), Luthers Karten schwach (1 bis 6). Luther gewinnt nur mit den passenden Erkenntnissen: Sie entkräften Karten der Kirche. Diese Erkenntnisse sammelt man an den Stationen. Man verliert also anfangs und gewinnt am Ende, wenn man genug verstanden hat.

## Was umgesetzt ist

| Bereich | Umsetzung |
| --- | --- |
| Markt (Station 4) | Keine Karten mehr. Jede Person bekommt drei Antworten zur Auswahl. |
| Regeln | Abwechselnd Karten legen, passen, zwei Runden gewinnen. Gleichstand gewinnt die Kirche. Entkräften setzt eine Kirchenkarte auf 1. Treffer: Wer eine liegende Karte entkräftet, zieht nach. Kartentausch vor dem Spiel, Deckbau (8 bis 12 Karten). Anführer: eine besondere Karte, einmal je Partie. |
| Karten | 24 Karten Luthers in der Geschichte, 18 weitere in der Kampagne, 28 Karten der Kirche, 15 Anführer. Seltenheit (gewöhnlich, selten, episch, legendär), Fähigkeiten, eigene Bilder für alle 40 Karten der Geschichte. |
| Kartendesign | Wie bei Gwent: Bild über die ganze Karte, Band mit Stärke und Kartenart, Namensschild. Fähigkeiten und Text zeigt die Detailansicht beim Antippen. |
| Tutorial | Station 2: Bruder Johannes führt durch eine Übungspartie (11 Schritte, nicht zu verlieren). Auf der Karte jederzeit wiederholbar. |
| Handlungsbogen | Station 4: Tetzel ist meist stärker. Station 5: Revanche mit den gedruckten Thesen, meist gewonnen. Station 6 (neu): Leipzig gegen Eck, fast sicher verloren; danach erhält man „Konzilien irren“. Station 7: Worms mit dem Kaiser als Anführer, mit passendem Deck meist gewonnen. Das Urteil des Kaisers bleibt wie in der Geschichte. |
| Lernhinweis | Nach einer Niederlage nennt das Spiel die Kirchenkarte, die nicht entkräftet wurde, die passende Antwort und wo man sie bekommt. |
| Spiel im Spiel | Nach dem Finale: zwölf Gegner in vier Kapiteln (vom Novizenmeister bis Papst Leo X.), je mit eigenem Deck und Anführer. Bis zu drei Sterne je Gegner, beim ersten Sieg und bei den ersten drei Sternen je eine neue Karte zur Wahl. Mit Sternen schaltet man Anführer frei (Luther, Melanchthon, Friedrich der Weise, Katharina von Bora). Der Fortschritt bleibt auf dem Gerät. |
| Album | Luthers Karten, Kampagnenkarten und alle Kirchenkarten, die man schon gesehen hat. |

## Balance (Simulation, kluger Spieler mit passendem Deck)

| Gegner | Siegquote |
| --- | --- |
| Tetzel, Station 4 | etwa 25 % |
| Tetzel, Revanche Station 5 | etwa 85 % |
| Eck in Leipzig | etwa 5 % |
| Worms (Luther selbst als Anführer) | etwa 65 % (ganze Sammlung statt passendem Deck: etwa 50 %) |
| Kampagne Kapitel 1 bis 3 | 60 bis 100 % |
| Papst Leo X. (letzter Gegner) | etwa 40 % |

Wahllos gespielt gewinnt man fast nie. Kinder werden unter den Werten des klugen Bots liegen.

## Entscheidungen und offene Punkte

- **Leipzig** ist jetzt Station 6 ohne Druckplatte. Worms ist Station 7, die Wartburg Station 8. Der Fortsetzungscode ist deshalb in Fassung 3; ältere Codes gelten nicht mehr.
- **Spielzeit:** Mit Übung, Revanche und Leipzig schätzt der Test rund 70 Minuten für den Kernpfad. Das passt zu einer Doppelstunde. Die Testgrenze liegt bei 75 Minuten.
- **Historische Personen** in der Kampagne (Prierias, Cajetan, Eck, Emser, Aleander, Albrecht, Herzog Georg, Karl V., Leo X.) vertreten ihre Position nacherzählt, ohne erfundene Zitate.
- **Bilder für die Kampagne:** Alle 54 Bilder (Anführer, neue Karten, Gegnerfiguren) sind eingebaut.
- **Noch offen:** Erprobung am iPad und mit einer Klasse; Rückmeldung zu Station 5 bis Finale.

## Nachtrag 18.11.2026: Erprobung gegen Tetzel

- **Fehler behoben:** Hatten beide Seiten keine Karten mehr, endeten zwei Runden auf einmal. Der Spieltisch zeigte aber nur das erste Rundenergebnis und blieb danach stehen. Jetzt folgen alle Rundenergebnisse nacheinander, dann das Ergebnis der Disputation.
- **Anführer:** Wer keine Handkarten mehr hat, aber noch einen Anführer, passt nicht mehr von selbst. Er darf ihn noch spielen oder passen.
- **Worms:** Luther steht dort selbst als Anführer auf deiner Seite.
