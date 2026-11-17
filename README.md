# Hier stehe ich

Lernspiel zu Martin Luther (1505–1522) für den evangelischen Religionsunterricht in Klasse 7. Die Spielenden sind Lehrling in einer Wittenberger Druckerei, rekonstruieren an sieben Stationen Luthers Weg und setzen am Ende eine eigene Flugschrift.

**Stand:** Alle vier Phasen sind umgesetzt: Kernpfad, Lehrkraftmodus, Lehrkräftekompendium, fünf Bonusspiele, Nachdenk-Fragen, fertige Bilder und die Abschlussprüfung (`docs/FACHPRUEFUNG.md`). Dazu Überarbeitung 1 nach dem ersten Durchspielen (`docs/UEBERARBEITUNG-1.md`): neue Startseite, Sammelkarten mit Kartenduell, neue Minispiele. Eine Erprobung am iPad und mit einer Klasse steht noch aus.

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
- **Lehrkraftmodus:** Titel fünf Sekunden halten oder Umschalt + Enter. Dort lassen sich Stationen anspringen oder als gelöst markieren, und von dort geht es zum Kompendium (`lehrkraefte.html`) mit Schnellstart, Leitfaden, Lösungen, Fragen und Fachhinweisen.
- **Bonusspiele:** Silbenrätsel, Druckerpresse (Taktspiel), Entführung (Steuerspiel mit Spitzeln), Lutherrose (zusammensetzen), Gottesdienst und zwei Fragen zum Nachdenken. Sie stehen unten auf der Karte und öffnen sich nach der passenden Station.
- **Karten:** Erkenntnisse werden Sammelkarten mit Bild, Stärke und „Stark gegen“. Im Duell in Worms gewinnt nur die passende Karte.
- **Datenschutz:** keine Namen, keine Konten, kein Server, keine externen Abrufe.
- **Flugschrift:** „Drucken / PDF“ öffnet den Druckdialog, „Als Bild teilen“ das Teilen-Menü des iPads.

## Aufbau

| Ordner | Inhalt |
| --- | --- |
| `data/` | Alle Inhalte: Stationen, Szenen, Gespräche, Karten, Glossar, Rätsel, Regeln der Spielsysteme, Bedientexte |
| `js/engine/` | Spielstand, Fortsetzungscode, Szenen, Fenster, Rätselblatt, Platzhaltergrafik |
| `js/puzzles/` | Ein Modul je Rätselart: oben die Regeln (ohne Bildschirm), unten die Anzeige |
| `css/` | `tokens` (Farben, Größen), `layout`, `components`, `scenes`, `print` |
| `assets/` | 117 Bilder, für das Spiel verkleinert (zusammen rund 29 MB); Register in `data/assets.js` |
| `tests/` | Datenprüfung, Durchspieltest, Simulation der Spielsysteme, Fortsetzungscode |
| `docs/` | Plan, Prüfbericht, Asset-Liste, Bildquellen |

Texte ändert man nur in `data/`. Ein Test stellt sicher, dass in `js/` kein Lesetext steht.

## Tests

```bash
npm test
```

- **Daten:** Jede Station hat Szene, Rätsel, Lösung, drei Hilfen und Karten; alle Verweise existieren; Satzlänge und Glossar.
- **Durchspiel:** Der Kernpfad wird zweimal vollständig gespielt, sorgfältig und schwach (falsche Karten in Worms, nur Latein in der Druckwelle), und nach jedem Fortsetzungscode fortgesetzt.
- **Spielsysteme:** Marktplatz, Druckwelle und Verhör je 500-mal für drei Spielertypen mit festem Startwert.
- **Zeit:** Schätzung je Station aus Textmenge und Bedienschritten.
- **Phase 3:** Regeln der Bonusspiele, Lehrkraftmodus (Hinspringen, Lösen) und die aus den Daten erzeugten Lösungen des Kompendiums.

**Layout im Browser:** `tests/layout-browser.js` prüft die Leiste, alle Szenen und alle Rätselschritte in der aktuellen Fenstergröße (seitliches Scrollen, Scrollen im Rätselblatt, Schrift ab 14 px, Tippziele ab 44 px, Lage der Hotspots). Aufruf im laufenden Spiel über die Browser-Konsole:

```js
const { pruefe } = await import('./tests/layout-browser.js'); console.table(await pruefe());
```

In 1024 × 768, 1180 × 820, 1366 × 1024 und 820 × 1180 gibt es derzeit keine Befunde. Auf breiten Bildschirmen (Laptop) steht der Text neben dem Bild statt darunter. Die Prüfung überschreibt den Spielstand auf dem Gerät.

## Offene Punkte

- **Spielzeit:** Die Schätzung liegt seit Überarbeitung 1 bei 46 statt 40 Minuten (der Test erlaubt bis 48). Ob gekürzt werden muss, zeigt erst eine Erprobung mit einer Klasse.
- **Bilder:** Für den Kaplan in Jüterbog gibt es noch kein eigenes Bild; dort steht vorläufig der Mönch. Nicht verwendet werden bisher: Kaiser, Bote, Sprecher und Luther-Figuren außer Professor und Junker als Szenenfiguren, die Karte der Erinnerung, die Einzelteile der Waage, Kartenvorder- und -rückseite, Flugblatt- und Stadtzeichen, Münze, Geldweg Albrecht und Rom sowie Wald, Wagen und Reiter der Entführung.
- **Druck, Teilen und die Steuerung per Finger** sind am iPad selbst noch nicht erprobt, nur im Desktop-Browser.
- **Lehrkraftmodus:** Das Öffnen über Umschalt + Enter ist geprüft, das Halten des Titels am Touchscreen noch nicht.

## Quellen und Rechte

Die Illustrationen wurden mit einem Bildgenerator erstellt und für das Spiel verkleinert; die Originale in voller Größe liegen nicht im Repository. Die Karten beruhen auf Daten von © OpenStreetMap-Mitwirkenden (ODbL) und Natural Earth; Einzelheiten in `docs/ASSET-QUELLEN.md`.

Konzept und fachliche Leitplanken: `KONZEPT.md`. Alle Spieltexte sind eigens geschrieben. Die Thesen und Liedstrophen sind eigene Übertragungen; die Bibel von 1483 (Koberger) und Luthers Fassung von 1546 sind gemeinfrei. Aus lizenziertem Unterrichtsmaterial wurde nichts übernommen.
