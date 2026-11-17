# Überarbeitung 1: Rückmeldung zum Durchspielen bis Station 4

Stand: 17.11.2026. Grundlage: gesprochene Rückmeldung von Simon nach dem Durchspielen am Laptop (Prolog bis Station 4). Station 5 bis Finale folgen in einer zweiten Runde.

## A. Oberfläche

| Nr. | Rückmeldung | Umsetzung |
| --- | --- | --- |
| A1 | Startseite weckt keine Lust, Hintergrund (Bücher) passt nicht zu Luther, Schrift wirkt fad | Neue Startseite: der Saal von Worms als Hintergrund, Luther (Bild „Worms“, Hand auf der Brust) groß im Bild, Titel als großes Schriftband mit roter Initiale, Untertitel als Frage („Was würdest du riskieren?“). Kurzer Teaser in drei Zeilen. |
| A2 | Unterschied „allein“ und „zu zweit“ unklar | Zwei Auswahlkarten mit Bild und je einem Satz: allein = du entscheidest selbst; zu zweit = ihr teilt euch ein Gerät und besprecht die Abschlussfragen. |
| A3 | Text unten viel zu klein, wirkt angeklebt | Textband größer (Schrift etwa 22–26 px), als Pergamentrolle mit Namensschild des Sprechers; höher, aber nicht über die Figuren. |
| A4 | Figuren werden im Gespräch blass wie Geister | Hotspots bleiben im Gespräch voll sichtbar. Die sprechende Figur bekommt einen hellen Rand, alle anderen bleiben normal. |
| A5 | Unterstrichene Wörter: nicht erklärt, Erklärung oben winzig | Erklärung als eigenes Kärtchen über dem Textband, in normaler Schriftgröße, mit Schließen-Knopf. Beim ersten unterstrichenen Wort im Spiel ein einmaliger Hinweis: „Unterstrichene Wörter kannst du antippen.“ |
| A6 | Fortsetzungscode nach jeder Station nervt | Code nur noch im Menü unter „Spielstand sichern“. Abschlussfenster ohne Code. |
| A7 | Vorlesen überall entfernen | Vorlesen-Knopf, Schalter im Menü, Knopf in den Rätseln und `speech.js` werden entfernt. |
| A8 | Fragen von Figuren unklar („Pilger: Sag mir: Wovor fürchten wir …“) | Fragen von Figuren erscheinen als Sprechblase mit Namen und Anführungszeichen („Der Pilger fragt dich: „…““). Text so, dass klar ist, wer mit „wir“ gemeint ist. |

## B. Stationen 1–4

| Nr. | Rückmeldung | Umsetzung |
| --- | --- | --- |
| B1 | Wandbild: Teile klein, erst nach Auswahl erkennbar | Ein Bildteil nach dem anderen groß in der Hand, daneben die Wand mit sechs Plätzen. Tippen auf einen Platz legt es dort ab. Gleiches Muster für „Vier Wege“ und die Lutherrose. |
| B2 | Gewitter-Blitz schön, gern öfter | Während der Gewitterszene schlägt alle paar Sekunden ein Blitz ein (Aufhellen und Wechsel auf das Blitzbild). |
| B3 | Waage schwebt über der Bank | Waage steht auf der Steinbank. |
| B4 | Waage im Rätsel nicht zentriert, rechte Schale aus dem Bild | Waage neu aus den drei Einzelbildern (Ständer, Balken, Schalen), mittig, immer ganz sichtbar. |
| B5 | Waage nicht motivierend | Neue Regel: Gute Werke dürfen mehrfach gelegt werden. Sobald die Waage fast ausgeglichen ist, fällt eine neue Sünde in die linke Schale (mit kurzem Text: „Ein stolzer Gedanke beim Gebet“). Nach der letzten Sünde: „Es reicht nie.“ |
| B6 | Frage zum Gleichnis: Gleichnis nicht greifbar | Knopf „Gleichnis nachlesen“ zeigt die Geschichte vom verlorenen Sohn kurz nacherzählt. |
| B7 | Marktplatz: Figuren winzig und schwebend, Kasten in der Luft, Leute auf dem Marktstand | Neue Anordnung: Kasten auf dem Pflaster in der Mitte, sechs Figuren deutlich größer im Vordergrund auf dem Boden. Wer näher an den Kasten rückt, läuft sichtbar nach hinten zur Mitte. Statisten stehen am Kasten, nicht auf den Ständen. |
| B8 | Kartenwahl am Markt passt nicht (Textliste) | Antwort mit echten Sammelkarten (siehe C), als Hand am unteren Rand. |

## C. Sammelkarten und Kartenduell

Leitidee: Gute Argumente sind wie Spielkarten. Man sammelt sie, kennt ihre Stärken und spielt sie im richtigen Moment.

- **Sammelkarten:** Jede Argument-, Wissens- und Thesenkarte wird eine echte Karte: Bild, Name, Kartenart (Bibel, Gnade, Wissen, These, Gewissen), Stärke 1–3, ein Satz Kartentext und „Stark gegen …“. Der Beutel wird zum Kartenalbum mit leeren Plätzen („9 von 18 gesammelt“).
- **Kartenduell in Worms** (ersetzt das bisherige Verhör): Der Sprecher des Kaisers spielt in vier Runden je eine Einwandkarte mit eigener Stärke und Art (Papst, Konzil, Ordnung, Mehrheit). Du spielst eine Karte aus deiner Hand von fünf. Passt deine Karte zum Einwand („Stark gegen“), zählt sie doppelt; sonst nur ihre Grundstärke. Ein Stimmungsbalken im Saal kippt je nach Runde zu dir oder zum Sprecher. Karten fliegen sichtbar in die Mitte, die Reichsstände reagieren. Keine Niederlage im Spielsinn: Ergebnisstufen wie bisher.
- **Lernziel bleibt:** Welches Argument passt auf welchen Einwand? Die Stärke-Zahlen sind so gesetzt, dass die passende Karte immer gewinnt und unpassende auch mit hoher Zahl nicht reichen.

## D. Minispiele

Vorbild: „Rettet das Krippenspiel“ und „Im Zeichen der Wende“ (Steuern, Zeitdruck, Bestwert).

| Spiel | Neu |
| --- | --- |
| Die Entführung | Top-down-Steuerspiel: Du lenkst den Wagen mit Luther durch den Thüringer Wald zur Wartburg. Spitzel mit Sichtkegeln patrouillieren; wer gesehen wird, beginnt am letzten Wegpunkt. Steuerung mit Pfeiltasten oder durch Tippen und Halten. |
| Die Druckerpresse | Taktspiel mit Bildern der Presse: Ein Zeiger läuft über eine Leiste, tippen im richtigen Moment. Jeder gute Druck füllt den Stapel, Fehldrucke kosten Zeit, Bestwert wird gemerkt. |
| Die Lutherrose | Die Rose wird aus fünf Schichten zusammengesetzt (Ring, Blau, Rose, Herz, Kreuz), danach die Deutung zuordnen. |
| Silbenrätsel, Gottesdienst | bleiben, mit größerer Darstellung |

## Reihenfolge

1. A (Oberfläche)
2. B (Stationen 1–4)
3. C (Karten)
4. D (Minispiele)
5. Tests anpassen, Browserprüfung in vier Größen, Commit

Nicht Teil dieser Runde: Inhalte ab Station 5 (außer dem Kartenduell, das in Worms spielt).

## Umsetzung (17.11.2026)

Alle Punkte aus A bis D sind umgesetzt. Abweichungen und Entscheidungen:

- **A3 Textband:** Auf dem iPad steht der Text unter dem Bild, auf breiten Bildschirmen (Laptop) rechts daneben. So bleibt das Bild groß.
- **A1 Startseite:** Hintergrund ist der Saal von Worms, davor Luther. Eine eigene Schmuckschrift wird nicht geladen (Konzept: keine externen Abrufe); der Titel nutzt Kapitälchen mit roter Initiale.
- **B5 Waage:** Startlast 40, vier Sünden, danach rührt sich die Waage nicht mehr. Ein Durchgang dauert etwa 15 Klicks.
- **B7 Markt:** Der Hintergrund bleibt der ganze Marktplatz; Figuren stehen auf dem Pflaster und laufen zum Kasten in der Mitte.
- **C Karten:** 19 Karten mit Bildern aus dem Bildpaket. Stärke 1–3, „Stark gegen“ +2 oder +3. Einwände haben Stärke 4. Ein Test stellt sicher, dass keine Karte ohne passenden Bonus einen Einwand schlägt.
- **D Entführung:** Vier Rastplätze, vier Patrouillen, zwei schwenkende Posten. Ein Test lässt einen vorsichtigen Fahrer durchspielen; er braucht etwa 13 Sekunden, Kinder voraussichtlich deutlich länger. Hindernisse im Wald gibt es nicht, die Bäume sind nur Bild.
- **Zeit:** Die Schätzung steigt auf 46 Minuten. Die Testgrenze ist auf 48 Minuten gesetzt.
- **Noch offen:** Rückmeldung zu Station 5 bis Finale; Erprobung von Steuerung und Taktspiel am iPad.
