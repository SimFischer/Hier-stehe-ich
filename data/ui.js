// Alle Bedientexte. {n}, {von} und ähnliche Platzhalter werden beim Anzeigen ersetzt.
export const t = {
  // Allgemein
  weiter: 'Weiter', schliessen: 'Schließen', nochmal: 'Noch einmal spielen', richtig: 'Richtig.', nochEinmal: 'Das passt nicht. Versuch es noch einmal.',
  navigation: 'Spielleiste', menue: 'Menü öffnen', gesperrt: 'Das geht noch nicht. Sieh dich erst weiter um.',
  karte: 'Karte', beutel: 'Beutel', notizbuch: 'Notizbuch', platten: 'Druckplatten',
  neueKarte: 'Neue Karte im Beutel: {titel}', neueKarten: 'Neu in deinem Beutel',
  nacherzaehlt: 'Nacherzählt, kein wörtliches Zitat.', nacherzaehltKurz: '(nacherzählt)',
  nacherzaehltHinweis: 'Was Tetzel und der Sprecher des Kaisers im Spiel sagen, ist nacherzählt. Es sind keine wörtlichen Zitate.',
  begruendung: 'Zum Abschluss', zuZweitBesprecht: 'Besprecht kurz:',
  // Start und Menü
  startKicker: 'Ein Lernspiel über Martin Luther, 1505–1522',
  startAllein: 'Allein spielen', startZuZweit: 'Zu zweit spielen', weiterspielen: 'Weiterspielen',
  neuAllein: 'Neu beginnen (allein)', neuZuZweit: 'Neu beginnen (zu zweit)',
  kartenQuelle: 'Karte: © OpenStreetMap-Mitwirkende (ODbL) und Natural Earth.',
  datenschutz: 'Dein Spielstand bleibt auf diesem Gerät. Es werden keine Namen gebraucht und keine Daten gesendet.',
  codeTitel: 'Dein Fortsetzungscode', codeText: 'Schreib dir den Code auf. Damit spielst du später oder auf einem anderen Gerät weiter. Er merkt sich fertige Stationen.',
  codeKurz: 'Fortsetzungscode:', codeEingeben: 'Code eingeben', codeLaden: 'Laden', codeGeladen: 'Spielstand geladen.',
  code_form: 'Ein Code hat acht Zeichen, zum Beispiel ABCD-2345.', code_pruefsumme: 'Der Code stimmt nicht. Prüfe ihn auf Tippfehler.', code_inhalt: 'Dieser Code passt nicht zu dieser Fassung des Spiels.',
  einstellungen: 'Einstellungen', zuZweit: 'Wir spielen zu zweit', hilfenGezaehlt: 'Genutzte Hilfen: {n}',
  neu: 'Spiel neu beginnen', neuSicher: 'Wirklich alles löschen?',
  // Karte und Abschluss
  karteNochNicht: 'Die Karte bekommst du vom Meister. Sprich mit ihm und sieh dir den Setzkasten an.',
  ortFertig: 'erledigt', ortOffen: 'jetzt offen', ortZu: 'noch verschlossen',
  platteTitel: 'Druckplatte {n} von {von}', zurKarte: 'Zur Karte', zurDruckerei: 'Zur Druckerei',
  endeTitel: 'Geschafft!', endeText: 'Du hast Luthers Weg von 1505 bis 1522 nachgezeichnet. Zeigt euch eure Flugschriften und vergleicht: Welche Gründe habt ihr gewählt?',
  beutelLeer: 'Dein Beutel ist noch leer. Karten bekommst du an den Stationen.',
  notizen: 'Was du gesehen hast', notizenLeer: 'Noch keine Einträge.', glossar: 'Wörter, die man kennen sollte',
  // Vorlesen, Bonus, Lehrkraftmodus
  vorlesen: 'Vorlesen', vorlesenAuto: 'Texte automatisch vorlesen',
  bonusTitel: 'Bonusspiele', bonusText: 'Freiwillig und kurz. Für alle, die schon fertig sind oder mehr wissen wollen.',
  bonusOffen: 'offen, etwa {n} Minuten', bonusZu: 'öffnet sich nach „{ort}“', bonusFertig: 'Bonusspiel geschafft: {titel}',
  lkTitel: 'Lehrkraftmodus', lkText: 'Dieser Bereich ist für Lehrkräfte. Er ist nicht geschützt: Wer ihn kennt, kann ihn öffnen.',
  lkKompendium: 'Lehrkräftekompendium öffnen ↗', lkStand: 'Stationen: {n} von {von} · Hilfen: {hilfen} · Bonusspiele: {bonus}',
  lkStufe: 'erledigt, Stufe {n} von 3', lkSpringen: 'Hinspringen', lkLoesen: 'Als gelöst markieren',
  lkHinweis: '„Hinspringen“ markiert alle Stationen davor als gelöst. Karten und Druckplatten werden dabei vergeben.',
  // Rätselblatt
  schritt: 'Schritt {n} von {von}', hilfe: 'Hilfe', hilfeStufe: 'Hilfe {n} von {von}:', raetselVerlassen: 'Rätsel verlassen',
  zuTeile: 'Teile', zuZiele: 'Plätze', zuTeilWaehlen: 'Tippe ein Teil an.', zuZielWaehlen: 'Tippe jetzt den passenden Platz an.', zuFertig: 'Alles liegt richtig.',
  waageBild: 'Eine Waage. Links die Last der Sünden, rechts die guten Werke.', waageLast: 'Last der Sünden', waageLeer: 'noch leer',
  standStrophe: 'Strophe {n}:', standPruefen: 'So stelle ich es', standNaechste: 'Nächste Strophe',
  auswahlStand: '{n} von {von} gewählt', erinnertJa: 'Richtig erinnert. „{titel}“ liegt jetzt im Beutel.', erinnertNein: 'Das war es nicht. Überlege noch einmal.',
  versNr: 'Vers {n} von {von}', ratFragen: 'Frag mindestens {n} Leute, wie das für sie klingt.', uebWaehle: 'Welche Fassung versteht jeder?', uebGut: 'Das versteht jeder und bleibt genau.',
  // Marktplatz
  marktRunde: 'Runde {n} von {von}', marktGespraeche: 'Gespräche übrig: {n}', marktMuenzen: 'Münzen im Kasten: {n}', marktNachd: 'Nachdenklich: {n} von {von}',
  marktKasten: 'Ablasskasten', marktNachdenklich: 'ist nachdenklich', marktGekauft: 'hat gekauft',
  marktWaehle: 'Tippe eine Person an und sprich mit ihr.', marktKarteWaehlen: 'Mit welcher Karte antwortest du?',
  // Druckwelle
  druckWoche: 'Woche {n} von {von}', druckBoten: 'Boten: {n}', druckFrei: 'Deutsche Blätter: {n}', druckAnteil: 'Von 100 Menschen wissen {n} davon',
  druckKein: 'noch ohne Thesen', druckLatein: 'hat die lateinische Fassung', druckDeutsch: 'hat die deutsche Fassung', druckKnoten: 'Knotenpunkt',
  druckKurzLatein: 'L', druckKurzDeutsch: 'D',
  druckWaehle: 'Tippe eine Stadt an.', druckZuWeit: 'Zu weit weg. Deine Boten erreichen nur Nachbarn von Städten, die die Thesen schon haben.',
  druckSchonDeutsch: 'Hier wird schon auf Deutsch gedruckt.', druckSchonLatein: 'Hier lesen bisher nur die Gelehrten mit.',
  druckKnotenText: 'Ein Knotenpunkt: Viele Handelswege treffen sich hier.', druckKleinText: 'Eine Stadt mit wenigen Handelswegen.',
  druckSchickeLatein: 'Latein schicken', druckSchickeDeutsch: 'Deutsch schicken', druckWocheEnde: 'Woche beenden', druckWocheEndeLeer: 'Nächste Woche',
  druckNeu: 'Neu erreicht: {orte}.',
  // Verhör
  verhoerEinwand: 'Einwand {n} von {von}', verhoerSaal: 'Im Saal stimmen {n} von {von} zu', verhoerWaehle: 'Mit welcher Karte antwortet Luther?',
  verhoer_gut: 'passt genau', verhoer_halb: 'passt zum Teil', verhoer_sonst: 'passt nicht',
  // Flugschrift
  flugSchlagzeile: 'Schlagzeile', flugKarten: 'Kernaussagen ({n} von {von})', flugBild: 'Bild',
  flugDrucken: 'Drucken / PDF', flugTeilen: 'Als Bild teilen', flugFertig: 'Fertig', flugDatei: 'flugschrift.png', flugGespeichert: 'Das Bild wurde gespeichert.'
};
