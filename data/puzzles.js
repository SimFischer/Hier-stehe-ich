// Rätsel. Jedes Rätsel ist eine Folge von Schritten. Die „art“ eines Schritts wählt das Modul in js/puzzles/.
// hilfen: immer drei Stufen (Richtung, Teillösung, Lösung mit Erklärung).
// Der letzte Schritt jeder Station ist die Begründungsauswahl (art: 'wahl', begruendung: true).
// Liedstrophen und Thesen sind eigene Übertragungen. Koberger 1483 und Luther 1546 sind gemeinfrei.
export const puzzles = {
  wandbild: {
    id: 'wandbild', station: 's1', titel: 'Der Weg der Seele', lernziel: [2],
    schritte: [
      { art: 'zuordnen', titel: 'Das Wandbild', layout: 'bild', einzeln: true, stapel: true,
        anweisung: 'Sieh dir das Bildteil an. Tippe dann auf den Platz an der Wand, an den es gehört.',
        falsch: 'Dieses Teil passt nicht zu dem, was an diesem Platz gesucht wird.',
        ziele: [
          { id: 'himmel', label: 'Oben links', unter: 'Das Ziel, auf das alle hoffen.' },
          { id: 'gericht', label: 'Oben Mitte', unter: 'Er entscheidet über jede Seele.' },
          { id: 'hoelle', label: 'Oben rechts', unter: 'Der Ort ohne Rückweg.' },
          { id: 'tod', label: 'Unten links', unter: 'Hier beginnt der Weg der Seele.' },
          { id: 'feuer', label: 'Unten Mitte', unter: 'Hier wird gereinigt. Es schmerzt, aber es endet.' },
          { id: 'beter', label: 'Unten rechts', unter: 'Sie wollen von der Erde aus helfen.' }
        ],
        items: [
          { id: 'i-feuer', bild: 'wandbild-4', text: 'Seelen in Flammen blicken nach oben', ziel: 'feuer' },
          { id: 'i-tod', bild: 'wandbild-1', text: 'Ein Mensch auf dem Sterbebett', ziel: 'tod' },
          { id: 'i-himmel', bild: 'wandbild-3', text: 'Eine goldene Stadt mit offenem Tor', ziel: 'himmel' },
          { id: 'i-beter', bild: 'wandbild-6', text: 'Angehörige beten vor einem Altar', ziel: 'beter' },
          { id: 'i-gericht', bild: 'wandbild-2', text: 'Christus als Richter auf dem Regenbogen', ziel: 'gericht' },
          { id: 'i-hoelle', bild: 'wandbild-5', text: 'Ein dunkler Rachen verschlingt Gestalten', ziel: 'hoelle' }
        ],
        hilfen: [
          'Lies den Satz unter jedem Platz. Er beschreibt, was dort zu sehen war.',
          'Der Weg beginnt unten links mit dem Tod. Oben in der Mitte sitzt der Richter.',
          'Oben: goldene Stadt, Richter, dunkler Rachen. Unten: Sterbebett, Flammen, betende Angehörige. Das Fegefeuer liegt zwischen Tod und Himmel.'
        ] },
      { art: 'zuordnen', titel: 'Vier Wege aus dem Feuer', layout: 'liste', einzeln: true, stapel: true,
        anweisung: 'Wie wollten Menschen die Zeit im Fegefeuer verkürzen? Ordne jedem Weg seine Erklärung zu.',
        falsch: 'Das beschreibt einen anderen Weg.',
        ziele: [
          { id: 'z-wall', label: 'Ein langer Weg zu Fuß zu einem heiligen Ort.' },
          { id: 'z-rel', label: 'Überreste von Heiligen ansehen und verehren.' },
          { id: 'z-heil', label: 'Heilige bitten, bei Gott ein gutes Wort einzulegen.' },
          { id: 'z-abl', label: 'Ein Schreiben der Kirche, das Strafen erlässt.' }
        ],
        items: [
          { id: 'i-abl', bild: 'weg-ablass', text: 'Ablassbrief', ziel: 'z-abl' },
          { id: 'i-wall', bild: 'weg-wallfahrt', text: 'Wallfahrt', ziel: 'z-wall' },
          { id: 'i-heil', bild: 'weg-heilige', text: 'Heiligenverehrung', ziel: 'z-heil' },
          { id: 'i-rel', bild: 'weg-reliquien', text: 'Reliquien', ziel: 'z-rel' }
        ],
        hilfen: [
          'Denk an den Pilger und an das Kästchen auf dem Seitenaltar.',
          'Der Pilger ist auf Wallfahrt. Im Kästchen liegen Reliquien.',
          'Wallfahrt: langer Weg. Reliquien: Überreste. Heiligenverehrung: Heilige bitten. Ablassbrief: Schreiben der Kirche.'
        ] },
      { art: 'wahl', begruendung: true, wer: 'pilger', frage: 'Was meinst du: Wovor haben die Menschen hier am meisten Angst?',
        optionen: [
          { text: 'Vor dem langen Weg der Wallfahrt.', rueck: 'Der Weg ist hart. Aber ich gehe ihn ja gerade wegen der Angst.' },
          { text: 'Vor Gottes Gericht und der Zeit im Fegefeuer.', richtig: true, rueck: 'Ja. Für uns Menschen hier ist Gott vor allem ein strenger Richter.' },
          { text: 'Davor, dass die Kirche einstürzt.', rueck: 'Nein, die Mauern halten. Meine Sorge gilt meiner Seele.' }
        ] }
    ]
  },

  waage: {
    id: 'waage', station: 's2', titel: 'Die Waage der Werke', lernziel: [1, 3],
    schritte: [
      { art: 'waage', titel: 'Die Waage der Werke', start: 40, schwelle: 6, rest: 3, lastBild: 'gewicht-suende',
        anweisung: 'Links liegt die Last der Sünden. Lege Bruder Martins gute Werke in die rechte Schale. Du darfst jedes Werk so oft legen, wie du willst. Schaffst du den Ausgleich?',
        werke: [
          { id: 'fasten', bild: 'werk-fasten', label: 'Fasten', gewicht: 6, text: 'Bruder Martin fastet tagelang. Die Schale senkt sich ein wenig.' },
          { id: 'beten', bild: 'werk-beten', label: 'Beten', gewicht: 7, text: 'Sieben Gebetszeiten am Tag, auch nachts. Die Waage bewegt sich.' },
          { id: 'beichte', bild: 'werk-beichte', label: 'Beichte', gewicht: 9, text: 'Er beichtet stundenlang jede Kleinigkeit. Wieder ein Stück.' },
          { id: 'wachen', bild: 'werk-wachen', label: 'Nachtwachen', gewicht: 5, text: 'Er wacht, bis ihm die Augen zufallen.' }
        ],
        suenden: [
          { gewicht: 14, text: 'Beim Fasten denkt er stolz: Ich bin frommer als die anderen.' },
          { gewicht: 12, text: 'Beim Beten schweifen seine Gedanken ab.' },
          { gewicht: 13, text: 'Er ärgert sich über einen Mitbruder.' },
          { gewicht: 16, text: 'Er zweifelt: Ist Gott mir überhaupt gnädig?' }
        ],
        ende: 'Immer wenn es fast reicht, kommt etwas Neues dazu. So fühlt es sich für Bruder Martin an: Es reicht nie.',
        hilfen: [
          'Lege immer wieder Werke in die rechte Schale. Beobachte, was passiert, wenn es fast reicht.',
          'Jedes Mal, wenn die Waage fast ausgeglichen ist, fällt eine neue Sünde in die linke Schale. Mach weiter, bis keine mehr kommt.',
          'Die Waage kann nicht kippen. Genau das ist die Erkenntnis: Aus eigener Kraft findet Luther keinen Frieden mit Gott.'
        ] },
      { art: 'duell', gegner: 'uebung', titel: 'Übung: So geht die Disputation', szene: 'kloster' },
      { art: 'wahl', begruendung: true, wer: 'mitbruder', frage: 'Du hast es gesehen. Was bedeutet das für Bruder Martin?',
        optionen: [
          { text: 'Er muss sich einfach noch mehr anstrengen.', rueck: 'Das versucht er seit Jahren. Du hast die Waage gesehen.' },
          { text: 'Gute Werke sind ihm egal.', rueck: 'Im Gegenteil. Niemand hier nimmt sie so ernst wie er.' },
          { text: 'Aus eigener Kraft findet er keinen Frieden mit Gott.', richtig: true, rueck: 'So ist es. Je mehr er sich anstrengt, desto größer wird seine Angst.' }
        ] }
    ]
  },

  standbild: {
    id: 'standbild', station: 's3', titel: 'Standbild zum Lied', lernziel: [3],
    schritte: [
      { art: 'standbild', titel: 'Standbild zum Lied', genug: 3,
        anweisung: '1523 schreibt Luther über diese Jahre ein Lied. Stelle zu drei Strophen ein Standbild. Gott erscheint als Licht.',
        figuren: { luther: 'Luther', gott: 'Gott (als Licht)' },
        regler: {
          abstand: { label: 'Abstand', werte: [{ id: 'nah', label: 'nah' }, { id: 'mittel', label: 'mittel' }, { id: 'weit', label: 'weit' }] },
          blick: { label: 'Das Licht scheint', werte: [{ id: 'zu', label: 'zu Luther hin' }, { id: 'ab', label: 'von ihm weg' }] },
          luther: { label: 'Luther', werte: [{ id: 'gebeugt', label: 'gebeugt' }, { id: 'kniend', label: 'kniend' }, { id: 'aufrecht', label: 'aufrecht' }] },
          gott: { label: 'Das Licht ist', werte: [{ id: 'streng', label: 'schmal und fern' }, { id: 'offen', label: 'weit und warm' }] }
        },
        strophen: [
          { nr: 2, text: 'Ich war gefangen und verloren. Meine Schuld quälte mich Tag und Nacht. Ich fiel immer tiefer hinein.',
            passt: { abstand: ['weit'], blick: ['ab'], luther: ['gebeugt', 'kniend'], gott: ['streng'] },
            rueck: {
              abstand: { ja: 'Der große Abstand passt: Luther fühlt sich verloren.', nein: 'Abstand: „Verloren“ klingt nach großer Entfernung.' },
              blick: { ja: 'Das Licht fällt nicht auf Luther. So erlebt er es in dieser Strophe.', nein: 'Licht: Spürt Luther hier, dass Gott ihn ansieht?' },
              luther: { ja: 'Luthers Haltung zeigt die Last der Schuld.', nein: 'Luther: Wer „immer tiefer fällt“, steht kaum aufrecht.' },
              gott: { ja: 'Schmal und fern: So erlebt Luther den strengen Richter.', nein: 'Gott: Noch erlebt Luther ihn als fernen Richter.' }
            } },
          { nr: 3, text: 'Meine guten Werke halfen mir nicht. Die Angst trieb mich zur Verzweiflung. Mir blieb nur der Tod.',
            passt: { abstand: ['weit', 'mittel'], blick: ['ab'], luther: ['gebeugt', 'kniend'], gott: ['streng'] },
            rueck: {
              abstand: { ja: 'Der Abstand bleibt. Die Werke haben ihn nicht verkleinert.', nein: 'Abstand: Haben die guten Werke Luther näher zu Gott gebracht?' },
              blick: { ja: 'Das Licht bleibt abgewandt.', nein: 'Licht: In dieser Strophe ist noch keine Zuwendung zu spüren.' },
              luther: { ja: 'So sieht Verzweiflung aus.', nein: 'Luther: Angst und Verzweiflung drücken ihn nieder.' },
              gott: { ja: 'Gott bleibt für Luther der Strenge.', nein: 'Gott: Wärme spürt Luther hier noch nicht.' }
            } },
          { nr: 4, text: 'Da hatte Gott Erbarmen mit mir. Er wandte mir sein Vaterherz zu. Er gab sein Bestes für mich.',
            passt: { abstand: ['nah', 'mittel'], blick: ['zu'], luther: ['kniend', 'aufrecht'], gott: ['offen'] },
            rueck: {
              abstand: { ja: 'Jetzt ist Nähe da. Gott kommt Luther entgegen.', nein: 'Abstand: „Er wandte sich mir zu“ klingt nach Nähe.' },
              blick: { ja: 'Das Licht fällt auf Luther. Das ist die Wende.', nein: 'Licht: Wohin wendet sich ein Vater, der Erbarmen hat?' },
              luther: { ja: 'Luther kann sich aufrichten.', nein: 'Luther: Die Last ist von ihm genommen.' },
              gott: { ja: 'Weit und warm: wie der Vater im Gleichnis.', nein: 'Gott: Denk an den Vater, der dem Sohn entgegenläuft.' }
            } }
        ],
        hilfen: [
          'Lies die Strophe genau. Welche Wörter sagen etwas über Nähe, Blick und Haltung?',
          'In Strophe 2 und 3 ist Gott fern und streng. In Strophe 4 wendet er sich Luther zu.',
          'Strophe 2 und 3: weit, Licht scheint weg, Luther gebeugt, Licht schmal und fern. Strophe 4: nah, Licht scheint zu Luther, Luther aufrecht, Licht weit und warm.'
        ] },
      { art: 'wahl', begruendung: true, frage: 'Welche Figur im Gleichnis vom verlorenen Sohn zeigt, wie Luther Gott jetzt sieht?',
        info: { knopf: 'Gleichnis nachlesen', titel: 'Der verlorene Sohn (nach Lukas 15)', absaetze: [
          'Ein Vater hat zwei Söhne. Der jüngere lässt sich sein Erbe auszahlen und zieht in die Fremde.',
          'Dort verprasst er alles. Er muss Schweine hüten und hat großen Hunger.',
          'Da geht er nach Hause zurück. Er will den Vater nur noch um Arbeit bitten.',
          'Doch der Vater sieht ihn schon von Weitem. Er läuft ihm entgegen, umarmt ihn und feiert ein Fest.',
          'Der ältere Bruder ist wütend. Er hat immer gearbeitet und nie ein Fest bekommen.',
          'Der Vater sagt: „Dein Bruder war verloren und ist wiedergefunden.“'] },
        optionen: [
          { text: 'Der ältere Bruder, der genau nachrechnet.', rueck: 'So hatte Luther Gott früher gesehen: als einen, der abrechnet.' },
          { text: 'Der Vater, der dem Sohn entgegenläuft.', richtig: true, rueck: 'Genau. Gott wartet nicht mit der Strafe. Er kommt dem Menschen entgegen.' },
          { text: 'Der Bauer mit den Schweinen in der Fremde.', rueck: 'Bei ihm gab es nur Arbeit und Hunger, kein Erbarmen.' }
        ] }
    ]
  },

  marktplatz: {
    id: 'marktplatz', station: 's4', titel: 'Der Marktplatz', lernziel: [2, 4],
    schritte: [
      { art: 'markt', titel: 'Der Marktplatz', system: 'marktplatz',
        hilfen: [
          'Hör genau hin: Was treibt die Person an? Angst, Rechnen, Trauer, ein Plan?',
          'Wer rechnet, will wissen, wohin das Geld geht. Wer Angst hat, braucht ein anderes Bild von Gott. Sprich zuerst mit denen, die nah am Kasten stehen.',
          'Bäuerin: Gott entscheidet. Kaufmann: Weg des Geldes. Pilger: Gnade ist ein Geschenk. Junge: Ohne Reue kein Erlass. Geselle: Werke reichen nicht. Witwe: Gott braucht dein Geld nicht.'
        ] },
      { art: 'gespraech', dialog: 'tetzel-auswertung' },
      { art: 'duell', gegner: 'tetzel', titel: 'Disputation mit Tetzel', szene: 'jueterbog',
        hilfen: [
          'Tippe die Karten von Tetzel an und lies, wie stark sie sind. Dann such in deiner Hand eine Karte, die sie entkräftet.',
          'Warte mit deiner Konterkarte, bis die starke Karte liegt. Dann fällt sie auf 1, und du ziehst eine Karte nach.',
          'Ablasshandel: „Gnade ist ein Geschenk“. Strenger Richter: „Wie der Vater“. Fegefeuer: „Gott entscheidet“. Gute Werke: „Werke reichen nicht“. Predigt und Brief: „Ohne Reue kein Erlass“. Petersdom: „Weg des Geldes“.'
        ] },
      { art: 'wahl', frei: true, speichert: 'rat', wer: 'baeuerin', frage: 'Du hast mit so vielen geredet. Was soll ich nun tun mit meinen drei Groschen?',
        optionen: [
          { wert: 'behalten', text: 'Behalte sie. Bete für deine Mutter und vertraue auf Gott.', rueck: 'Vertrauen. Das ist schwerer als bezahlen. Aber ich will es versuchen.' },
          { wert: 'armen', text: 'Gib sie jemandem, der Not hat.', rueck: 'Meine Nachbarin hat einen kranken Mann. Daran habe ich gar nicht gedacht.' },
          { wert: 'kaufen', text: 'Kauf den Brief, wenn er dich ruhig macht.', rueck: 'Dann kaufe ich ihn. Ob er mich wirklich ruhig macht?' }
        ] },
      { art: 'wahl', begruendung: true, frage: 'Was setzt Luther gegen den Ablasshandel?',
        optionen: [
          { text: 'Die Briefe müssten nur billiger sein.', rueck: 'Der Preis ist nicht das Problem. Vergebung ist keine Ware.' },
          { text: 'Sünden sind gar nicht so schlimm.', rueck: 'Das sagt Luther nicht. Er nimmt Schuld sehr ernst und setzt auf Reue.' },
          { text: 'Gott vergibt dem, der bereut. Kaufen kann man das nicht.', richtig: true, rueck: 'Richtig. Darum hält Luther die Briefe für eine falsche Sicherheit.' }
        ] }
    ]
  },

  druckwelle: {
    id: 'druckwelle', station: 's5', titel: 'Die Druckwelle', lernziel: [4],
    schritte: [
      { art: 'zuordnen', titel: 'Die Druckvorlage', layout: 'liste', einzeln: true, quelle: 'thesen',
        anweisung: 'Fünf Thesen sollen auf Deutsch gedruckt werden, so dass jeder sie versteht. Ordne jeder These ihre kurze Fassung zu.',
        falsch: 'Diese Fassung sagt etwas anderes als die These. Lies beide noch einmal.',
        hilfen: [
          'Suche in jeder These das wichtigste Wort: Münze, sicher, bereut, Armen, Papst.',
          'These 27 handelt von der klingenden Münze. These 86 fragt nach dem Geld des Papstes.',
          '27: Seele nicht freikaufen. 32: Wer sich verlässt, betrügt sich. 36: Reue genügt. 43: Menschen in Not helfen. 86: Papst soll selbst zahlen.'
        ] },
      { art: 'auswahl', titel: 'Deine zwei Thesen', quelle: 'thesen', anzahl: 2, ergebnis: 'thesen',
        anweisung: 'Zwei Thesen nimmst du als Karten in deinen Beutel. Welche findest du am stärksten?' },
      { art: 'druck', titel: 'Die Druckwelle', system: 'druckwelle',
        hilfen: [
          'Achte auf den Zähler: Was bringt mehr, ein lateinisches oder ein deutsches Blatt?',
          'Die eckigen Städte sind Knotenpunkte. Ein deutsches Blatt verbreitet sich von dort in alle Richtungen.',
          'Schicke das erste deutsche Blatt nach Leipzig. Bringe mit Latein einen Boten nach Erfurt und dann ein deutsches Blatt nach Nürnberg. Danach sind Frankfurt, Köln und Straßburg an der Reihe.'
        ] },
      { art: 'duell', gegner: 'tetzel2', titel: 'Revanche: Die Thesen gegen Tetzel', szene: 'jueterbog',
        hilfen: [
          'Die Thesen sind jetzt deine stärksten Karten. Nimm sie ins Deck und dazu die Karten gegen den Ablass.',
          'Tetzel hat einen Anführer: seine eigene Karte. Er spielt sie meist erst in Runde 2 oder 3. Heb dir eine Antwort auf.',
          'Ablassprediger: These 27 oder These 43. Ablasshandel: „Gnade ist ein Geschenk“. Predigt und Brief: „Ohne Reue kein Erlass“. Richter: „Wie der Vater“.'
        ] },
      { art: 'wahl', begruendung: true, frage: 'Warum verbreiteten sich Luthers Thesen so schnell?',
        optionen: [
          { text: 'Sie wurden gedruckt und ins Deutsche übersetzt.', richtig: true, rueck: 'Genau. Ohne Druckerpresse und ohne Deutsch wären sie ein Streit unter Gelehrten geblieben.' },
          { text: 'Luther ritt selbst von Stadt zu Stadt.', rueck: 'Luther blieb in Wittenberg. Unterwegs waren die gedruckten Blätter.' },
          { text: 'Der Papst ließ sie überall vorlesen.', rueck: 'Der Papst hatte daran kein Interesse. Die Thesen kritisierten ja seine Kirche.' }
        ] }
    ]
  },

  leipzig: {
    id: 'leipzig', station: 'sl', titel: 'Die Leipziger Disputation', lernziel: [5],
    schritte: [
      { art: 'duell', gegner: 'eck', titel: 'Luther gegen Eck', szene: 'leipzig',
        hilfen: [
          'Eck spielt die Karten der Gelehrten: Konzilien, Papst und Tradition. Und er hat sich selbst als Anführer.',
          'Gegen „Die Konzilien“ und „Wie Jan Hus“ hast du noch keine Antwort. Versuch, die anderen Runden zu gewinnen.',
          '„Maßstab Bibel“ entkräftet Papst und Tradition. „Gewissen“ fehlt dir noch. Verlieren ist hier nicht schlimm: Die Geschichte geht weiter.'
        ] },
      { art: 'text', titel: 'Was in Leipzig geschah',
        absaetze: [
          { text: 'Die Disputation dauerte fast drei Wochen. Eck trieb Luther in die Enge.' },
          { text: 'Am Ende sagte Luther: Auch ein Konzil kann irren. Manche Sätze von Jan Hus seien gut christlich.' },
          { text: 'Damit war der Bruch mit Rom kaum noch aufzuhalten. Ein Jahr später drohte der Papst Luther mit dem Bann.' }
        ] },
      { art: 'wahl', begruendung: true, frage: 'Was war das Neue, das Luther in Leipzig sagte?',
        optionen: [
          { text: 'Auch ein Konzil der Kirche kann sich irren.', richtig: true, rueck: 'Genau. Damit stellte Luther die Bibel über Papst und Konzilien.' },
          { text: 'Der Ablass ist eine gute Sache.', rueck: 'Das sagte Luther nicht. Er kritisierte den Ablass schon seit 1517.' },
          { text: 'Er will zurück ins Kloster gehen.', rueck: 'Davon war keine Rede. In Leipzig ging es darum, wer im Glauben entscheidet.' }
        ] }
    ]
  },

  verhoer: {
    id: 'verhoer', station: 's6', titel: 'Das Verhör', lernziel: [5],
    schritte: [
      { art: 'duell', gegner: 'worms', titel: 'Vor Kaiser und Reich', szene: 'saal',
        hilfen: [
          'Sieh dir die Karten des Sprechers an, bevor du dein Deck baust. Nimm für jede starke Karte eine passende Antwort mit.',
          'Ein Deck mit zwölf Karten hält länger durch als ein kleines. Karten ohne passende Antwort kannst du zu Beginn tauschen.',
          'Papst und Tradition: „Maßstab Bibel“. Konzilien und Hus: „Konzilien irren“. Ordnung: „Erneuern, nicht spalten“. Alle gegen einen: „Viele haben es gelesen“. Bann: „Gewissen“. Strenger Richter: „Wie der Vater“.'
        ] },
      { art: 'wahl', wer: 'sprecher', frage: 'Zum letzten Mal, Martin Luther: Widerrufst du deine Bücher?',
        optionen: [
          { text: 'Widerrufen', rueck: 'Dann wäre es wohl still geworden um Luther. Vielleicht gäbe es keine deutsche Bibel von der Wartburg. Auch deine Flugschrift gäbe es nicht. So ist es aber nicht gewesen. Wähle noch einmal.' },
          { text: 'Nicht widerrufen', richtig: true, rueck: 'So war es. Luther nimmt nichts zurück.' }
        ] },
      { art: 'text', titel: 'Luthers Antwort', system: 'verhoer',
        absaetze: [
          { text: 'Der Schluss von Luthers Rede ist überliefert. In heutigem Deutsch sagt er:' },
          { zitat: true, text: 'Wenn man mich nicht mit der Bibel oder mit klaren Gründen widerlegt, bleibe ich dabei. Mein Gewissen ist in Gottes Wort gefangen. Gegen das Gewissen zu handeln, ist weder sicher noch gut. Gott helfe mir. Amen.' },
          { auswertung: true },
          { urteil: true }
        ] },
      { art: 'zuordnen', titel: 'Zwei Strafen', layout: 'zwei',
        anweisung: 'Luther trifft eine Strafe der Kirche und eine des Reichs. Was gehört wozu?',
        falsch: 'Das gehört zur anderen Strafe. Denk daran: Kirche oder Reich?',
        ziele: [
          { id: 'bann', label: 'Kirchenbann', unter: 'Strafe der Kirche' },
          { id: 'acht', label: 'Reichsacht', unter: 'Strafe des Reichs' }
        ],
        items: [
          { id: 'i-kaiser', text: 'verhängt von Kaiser Karl V.', ziel: 'acht' },
          { id: 'i-jan', text: 'Januar 1521', ziel: 'bann' },
          { id: 'i-vogel', text: 'vogelfrei: Niemand darf ihm helfen', ziel: 'acht' },
          { id: 'i-papst', text: 'verhängt von Papst Leo X.', ziel: 'bann' },
          { id: 'i-mai', text: 'Mai 1521, Wormser Edikt', ziel: 'acht' },
          { id: 'i-aus', text: 'Ausschluss aus der Kirche', ziel: 'bann' }
        ],
        hilfen: [
          'Der Papst ist das Oberhaupt der Kirche, der Kaiser das Oberhaupt des Reichs.',
          'Das Schreiben aus Rom in der Herberge kam im Januar 1521. Das Wormser Edikt folgte nach dem Reichstag.',
          'Kirchenbann: Papst Leo X., Januar 1521, Ausschluss aus der Kirche. Reichsacht: Kaiser Karl V., Mai 1521, vogelfrei.'
        ] },
      { art: 'wahl', begruendung: true, frage: 'Warum hat Luther nicht widerrufen?',
        optionen: [
          { text: 'Er wollte berühmt werden.', rueck: 'Luther riskierte sein Leben. Um Ruhm ging es ihm nicht.' },
          { text: 'Sein Gewissen war an die Bibel gebunden.', richtig: true, rueck: 'Ja. Solange ihn niemand mit der Bibel widerlegte, konnte er nicht zurück.' },
          { text: 'Der Kaiser hatte es ihm verboten.', rueck: 'Im Gegenteil: Der Kaiser verlangte den Widerruf.' }
        ] }
    ]
  },

  uebersetzung: {
    id: 'uebersetzung', station: 's7', titel: 'Die Übersetzungswerkstatt', lernziel: [6],
    schritte: [
      { art: 'uebersetzung', titel: 'Die Übersetzungswerkstatt', fragen: 2,
        anweisung: 'Auf der Wartburg übersetzt Luther das Neue Testament. Wie er arbeitet, probierst du an Psalm 23 aus. Den hat er erst später übersetzt. Frag zwei Leute um Rat und wähle dann die Fassung, die jeder versteht.',
        altLabel: 'Deutsche Bibel von 1483', lutherLabel: 'So schrieb es Luther später',
        ratgeber: ['marktfrau', 'kind', 'handwerker'],
        verse: [
          { alt: 'Der Herr regieret mich und mir gebrist nichts.',
            stimmen: { marktfrau: '„Gebrist“? Das Wort kennt bei uns keiner.', kind: 'Ein Hirte passt auf. Das verstehe ich.', handwerker: '„Regieret“ klingt nach Steuern, nicht nach Fürsorge.' },
            optionen: [
              { text: 'Der Herr lenkt mich, und mir gebricht nichts.', rueck: 'Das ist genau übersetzt. Aber wer redet so?' },
              { text: 'Der Herr ist mein Hirte. Mir wird nichts fehlen.', richtig: true },
              { text: 'Gott ist mein Chef, alles läuft.', rueck: 'Das versteht jeder. Aber es sagt nicht mehr, was im Text steht.' }
            ],
            luther: 'Der HERR ist mein Hirte, mir wird nichts mangeln.' },
          { alt: 'Und an der stat der weyde do satzt er mich.',
            stimmen: { marktfrau: 'Sag doch einfach, wo die Schafe gern sind.', kind: 'Grün muss es sein!', handwerker: 'Bei „an der Statt der Weide“ stolpert man beim Lesen.' },
            optionen: [
              { text: 'Er bringt mich irgendwohin, wo es schön ist.', rueck: 'Schön gesagt, aber zu ungenau. Im Text steht eine Weide.' },
              { text: 'An den Ort der Weide, dort setzte er mich hin.', rueck: 'Wort für Wort richtig. Aber es klingt nach Latein, nicht nach Deutsch.' },
              { text: 'Er lässt mich auf einer grünen Wiese weiden.', richtig: true }
            ],
            luther: 'Er weidet mich auf einer grünen Aue.' },
          { alt: 'Wann ob ich gee in mitt des schatten des todes, ich furcht nit die ubeln ding.',
            stimmen: { marktfrau: 'Ein dunkles Tal kennt jeder, der mal nachts heimging.', kind: '„Üble Ding“ klingt komisch.', handwerker: 'Kurz muss es sein. Angst macht keine langen Sätze.' },
            optionen: [
              { text: 'Und wenn ich durch ein finsteres Tal gehe, habe ich keine Angst.', richtig: true },
              { text: 'Auch wenn es mal dunkel wird, ist mir das egal.', rueck: 'Zu locker. Der Psalm spricht von echter Gefahr und von Vertrauen.' },
              { text: 'Wenn ich auch gehe inmitten des Schattens des Todes, fürchte ich nicht die üblen Dinge.', rueck: 'Genau, aber schwer. Beim Vorlesen bleibt davon wenig hängen.' }
            ],
            luther: 'Und ob ich schon wanderte im finstern Tal, fürchte ich kein Unglück.' }
        ],
        hilfen: [
          'Hör auf die Ratgeber. Sie sagen dir, welche Wörter sie nicht verstehen.',
          'Gesucht ist die Fassung, die genau bleibt und trotzdem klingt wie gesprochenes Deutsch.',
          'Richtig sind: „Der Herr ist mein Hirte“, „auf einer grünen Wiese weiden“ und „durch ein finsteres Tal“.'
        ] },
      { art: 'wahl', begruendung: true, frage: 'Warum übersetzte Luther die Bibel auf diese Weise?',
        optionen: [
          { text: 'Latein war verboten worden.', rueck: 'Latein blieb die Sprache der Gelehrten. Verboten war es nicht.' },
          { text: 'Jeder sollte die Bibel selbst lesen und verstehen können.', richtig: true, rueck: 'Ja. Wenn die Bibel der Maßstab ist, muss jeder sie verstehen können.' },
          { text: 'Er wollte eine neue Bibel erfinden.', rueck: 'Luther erfand nichts. Er übersetzte den alten Text so genau und klar wie möglich.' }
        ] }
    ]
  },

  finale: {
    id: 'finale', station: 'f', titel: 'Die Flugschrift', lernziel: [7],
    schritte: [
      { art: 'gespraech', dialog: 'meister-finale' },
      { art: 'zuordnen', titel: 'Der Setzkasten: viermal „allein“', layout: 'liste', einzeln: true,
        anweisung: 'Luthers Lehre lässt sich in vier „allein“ fassen. Jedes widerspricht etwas, das damals viele Menschen glaubten. Ordne zu.',
        falsch: 'Das passt besser zu einem anderen „allein“.',
        ziele: [
          { id: 'z-schrift', label: 'Papst und Kirche legen fest, was richtig geglaubt wird.' },
          { id: 'z-christus', label: 'Der Papst führt die Christen. Heilige vermitteln bei Gott.' },
          { id: 'z-gnade', label: 'Den Himmel muss man sich verdienen.' },
          { id: 'z-glaube', label: 'Ablass und fromme Leistungen machen vor Gott gerecht.' }
        ],
        items: [
          { id: 'i-glaube', text: 'Allein der Glaube', ziel: 'z-glaube', falsch: 'Glaube heißt: Der Mensch vertraut auf Gott, statt etwas zu leisten.' },
          { id: 'i-schrift', text: 'Allein die Schrift', ziel: 'z-schrift', falsch: 'Die Schrift ist die Bibel. Wem widerspricht sie als Maßstab?' },
          { id: 'i-gnade', text: 'Allein die Gnade', ziel: 'z-gnade', falsch: 'Gnade heißt: Gott schenkt. Was ist das Gegenteil von geschenkt?' },
          { id: 'i-christus', text: 'Allein Christus', ziel: 'z-christus', falsch: 'Hier geht es darum, wer zwischen Gott und den Menschen steht.' }
        ],
        hilfen: [
          'Denk an deine Stationen: Waage, Turmzimmer, Markt, Worms.',
          'Schrift meint die Bibel. Gnade ist ein Geschenk, also das Gegenteil von verdienen.',
          'Schrift: Papst und Kirche legen fest. Christus: Papst führt, Heilige vermitteln. Gnade: Himmel verdienen. Glaube: Ablass und Leistungen.'
        ] },
      { art: 'text', titel: 'Zwei Dinge zum Schluss',
        absaetze: [
          { text: 'Der Titel dieses Spiels ist eine Legende. „Hier stehe ich, ich kann nicht anders“ hat Luther in Worms wohl nie gesagt. Vielleicht hast du den Satz so gelesen. Er kam erst dazu, als die Rede gedruckt wurde. Belegt ist der Schluss: „Gott helfe mir. Amen.“' },
          { text: 'Und heute? Die katholische Kirche hat sich seitdem selbst erneuert. Ablass gegen Geld gibt es nicht mehr. Evangelische und katholische Christen arbeiten an vielen Orten zusammen.' }
        ] },
      { art: 'gespraech', dialog: 'baeuerin-finale' },
      { art: 'flugschrift', titel: 'Deine Flugschrift', maxZeichen: 60, karten: 3,
        anweisung: 'Setze deine Flugschrift: eine Schlagzeile, drei Karten als Kernaussagen und ein Bild.',
        schlagzeilen: ['Mönch gegen Kaiser und Papst!', 'Vergebung ist kein Geschäft!', 'Die Bibel für alle, auf Deutsch!', 'Was Doktor Luther wirklich will'],
        eigene: 'Eigene Schlagzeile', namenHinweis: 'Schreibe keinen vollen Namen in die Schlagzeile.',
        kopf: 'Neue Zeitung aus Wittenberg', fuss: 'Gedruckt zu Wittenberg im Herbst 1522',
        motive: [{ id: 'feder', bild: 'motiv-1', label: 'Mönch mit Feder' }, { id: 'presse', bild: 'motiv-2', label: 'Druckerpresse' }, { id: 'buch', bild: 'motiv-3', label: 'Offene Bibel' }, { id: 'waage', bild: 'motiv-4', label: 'Waage' }] }
    ]
  }
};
