# Hier stehe ich

Lernspiel zu Martin Luther (1505–1522) für den evangelischen Religionsunterricht in Klasse 7. Die Spielenden sind Lehrling in einer Wittenberger Druckerei, rekonstruieren an sieben Stationen Luthers Weg und setzen am Ende eine eigene Flugschrift.

**Stand:** Phase 2 von 4. Der Kernpfad ist vollständig spielbar, mit Platzhaltergrafik. Lehrkraftmodus, Kompendium, Bonusspiele und Vorlesen folgen in Phase 3.

## Spielen

Nach dem Einschalten von GitHub Pages (Repository → Settings → Pages → Branch `main`, Ordner `/`) läuft das Spiel unter
`https://simfischer.github.io/Hier-stehe-ich/`.

Lokal braucht es einen kleinen Webserver, weil Browser ES-Module nicht direkt von der Festplatte laden:

```bash
npm start
```

Danach `http://localhost:4173` öffnen. Es gibt keine Abhängigkeiten und keinen Build-Schritt.

## Für Lehrkräfte in Kürze

- **Dauer:** Der Kernpfad ist auf rund 45 Minuten geschätzt (bei 130 Wörtern Lesetempo pro Minute). Für eine Einzelstunde ist das knapp; siehe „Offene Punkte“.
- **Gerät:** iPad im Quer- oder Hochformat, allein oder zu zweit.
- **Speichern:** Der Stand bleibt auf dem Gerät. Über den Titel oben öffnet sich das Menü mit dem Fortsetzungscode (acht Zeichen). Er merkt sich fertige Stationen und funktioniert auf jedem Gerät.
- **Hilfen:** Jedes Rätsel hat drei gestufte Hilfen. Das Menü zeigt, wie viele genutzt wurden.
- **Datenschutz:** keine Namen, keine Konten, kein Server, keine externen Abrufe.
- **Flugschrift:** „Drucken / PDF“ öffnet den Druckdialog, „Als Bild teilen“ das Teilen-Menü des iPads.

## Aufbau

| Ordner | Inhalt |
| --- | --- |
| `data/` | Alle Inhalte: Stationen, Szenen, Gespräche, Karten, Glossar, Rätsel, Regeln der Spielsysteme, Bedientexte |
| `js/engine/` | Spielstand, Fortsetzungscode, Szenen, Fenster, Rätselblatt, Platzhaltergrafik |
| `js/puzzles/` | Ein Modul je Rätselart: oben die Regeln (ohne Bildschirm), unten die Anzeige |
| `css/` | `tokens` (Farben, Größen), `layout`, `components`, `scenes`, `print` |
| `tests/` | Datenprüfung, Durchspieltest, Simulation der Spielsysteme, Fortsetzungscode |
| `docs/` | Plan, Asset-Liste |

Texte ändert man nur in `data/`. Ein Test stellt sicher, dass in `js/` kein Lesetext steht.

## Tests

```bash
npm test
```

- **Daten:** Jede Station hat Szene, Rätsel, Lösung, drei Hilfen und Karten; alle Verweise existieren; Satzlänge und Glossar.
- **Durchspiel:** Der Kernpfad wird zweimal vollständig gespielt, sorgfältig und schwach (falsche Karten in Worms, nur Latein in der Druckwelle), und nach jedem Fortsetzungscode fortgesetzt.
- **Spielsysteme:** Marktplatz, Druckwelle und Verhör je 500-mal für drei Spielertypen mit festem Startwert.
- **Zeit:** Schätzung je Station aus Textmenge und Bedienschritten.

Im Browser geprüft wurden alle Stationen in 1024 × 768 sowie Stichproben in 1180 × 820, 1366 × 1024 und 820 × 1180.

## Offene Punkte

- **Spielzeit:** Die Schätzung liegt bei 45 statt 40 Minuten. Ob gekürzt werden muss, zeigt erst eine Erprobung mit einer Klasse.
- **Bilder:** Die fertigen Grafiken aus `docs/ASSET-PROMPTS.md` sind noch nicht eingebaut. Das Spiel zeichnet Platzhalter.
- **Druck und Teilen** sind am iPad selbst noch nicht erprobt, nur im Desktop-Browser.
- **Fachprüfung** aller Texte gegen die Leitplanken des Konzepts folgt in Phase 4 (`docs/FACHPRUEFUNG.md`).

## Quellen und Rechte

Konzept und fachliche Leitplanken: `KONZEPT.md`. Alle Spieltexte sind eigens geschrieben. Die Thesen und Liedstrophen sind eigene Übertragungen; die Bibel von 1483 (Koberger) und Luthers Fassung von 1546 sind gemeinfrei. Aus lizenziertem Unterrichtsmaterial wurde nichts übernommen.
