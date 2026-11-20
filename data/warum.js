// Inhalte für den „Warum?“-Moment in „Hammer & Siegel“ (js/puzzles/warum.js).
// kirche: je Kirchenkarte eine Sacherklärung (was steckt dahinter?) und zwei falsche Antworten zum selben Thema.
//   Die falschen Antworten sind typische Missverständnisse: Sie klingen nach Luther, sind aber nicht sein Argument.
// antwort: je Konter-Paar „Luther-Karte>Kirchenkarte“ die richtige Antwort, mit dem Namen der Karte.
// Fachlich geprüft werden sollen alle Texte (docs/FACHPRUEFUNG.md, Abschnitt „Warum?“-Fragen).
export const warum = {
  kirche: {
    'c-richter': {
      erklaerung: 'Um 1500 stellten sich viele Menschen Gott vor allem als strengen Richter vor, der jede Sünde bestraft. Auch der junge Mönch Luther hatte große Angst, vor Gott nicht bestehen zu können.',
      falsch: ['Gott ist streng, aber wer genug Ablassbriefe kauft, braucht das Gericht nicht zu fürchten.', 'Gott richtet nicht selbst. Das überlässt er ganz dem Papst und den Bischöfen.']
    },
    'c-fegefeuer': {
      erklaerung: 'Die Kirche lehrte: Nach dem Tod müssen die Seelen im Fegefeuer von ihren Sünden gereinigt werden, bevor sie in den Himmel kommen. Viele fürchteten, dass das sehr lange dauert, für sich und für verstorbene Angehörige.',
      falsch: ['Das Fegefeuer dauert nur kurz, deshalb muss man sich keine Gedanken über Sünden machen.', 'Wer im Fegefeuer ist, kann von den Lebenden mit genug Geld sicher befreit werden.']
    },
    'c-werke': {
      erklaerung: 'Gute Werke sind fromme Taten: fasten, beten, zu heiligen Orten pilgern, Geld spenden. Viele glaubten, dass man sich damit Gottes Gnade und das Heil verdienen kann.',
      falsch: ['Gute Werke sind schlecht. Ein Christ soll gar nichts Gutes mehr tun.', 'Nur das Pilgern zählt. Fasten und Beten bringen nichts für das Heil.']
    },
    'c-ablass': {
      erklaerung: 'Ein Ablass erlässt nach der Lehre der Kirche die Strafen für Sünden, die man bereut und gebeichtet hat, zum Beispiel die Zeit im Fegefeuer. Um 1517 bekam man ihn vor allem gegen eine Geldspende. Das Geld floss unter anderem in den Bau des Petersdoms.',
      falsch: ['Der Ablass ist in Ordnung, er ist nur zu teuer. Er müsste billiger werden.', 'Den Ablass dürfen nur Adlige kaufen. Das ist ungerecht gegenüber den Bauern.']
    },
    'c-brief': {
      erklaerung: 'Ein Ablassbrief ist ein Schriftstück, das man gegen Geld kaufen konnte. Er bestätigte, dass einem Strafen für Sünden erlassen sind. Viele glaubten, damit ihre Zeit im Fegefeuer oder die von verstorbenen Angehörigen zu verkürzen.',
      falsch: ['Ein Ablassbrief gilt nur, wenn der Papst ihn selbst unterschrieben hat.', 'Ablassbriefe sind gut, man sollte sie aber auf Deutsch statt auf Latein drucken.']
    },
    'c-predigt': {
      erklaerung: 'Der Dominikaner Johann Tetzel zog 1517 als Ablassprediger durch die Gegend, zum Beispiel nach Jüterbog nahe Wittenberg. Er warb so eindrucksvoll für den Ablass, dass die Menschen in Scharen kamen und kauften.',
      falsch: ['Tetzel predigt zu leise. Wenn ihn alle verstehen könnten, wäre der Ablass in Ordnung.', 'Prediger dürfen nur über die Bibel reden, nie über Geld. Deshalb ist Tetzel ein Ketzer.']
    },
    'c-petersdom': {
      erklaerung: 'In Rom wurde ab 1506 der neue Petersdom gebaut, die größte Kirche der Christenheit. Ein Teil des Ablassgeldes aus Deutschland ging dorthin. Ein anderer Teil half Erzbischof Albrecht von Mainz, seine Schulden beim Bankhaus Fugger zu bezahlen.',
      falsch: ['Der Petersdom ist unnötig, Kirchen sollten grundsätzlich aus Holz gebaut werden.', 'Die Deutschen sollten lieber einen Dom in Wittenberg bauen und dafür Ablass verkaufen.']
    },
    'c-papst': {
      erklaerung: 'Die Kirche lehrte: Der Papst ist der Nachfolger des Apostels Petrus. Er hat das letzte Wort darüber, was Christen glauben sollen und wie die Bibel zu verstehen ist.',
      falsch: ['Der Papst hat recht, solange er Deutscher ist.', 'Statt des Papstes soll der Kaiser bestimmen, was Christen glauben.']
    },
    'c-konzil': {
      erklaerung: 'Ein Konzil ist eine große Versammlung von Bischöfen, die über Fragen des Glaubens berät und entscheidet. Was ein Konzil beschlossen hatte, galt als sicher.',
      falsch: ['Konzilien sind gut, aber sie sollten nur aus Mönchen bestehen.', 'Ein Konzil hat immer recht, weil dort so viele Menschen abstimmen.']
    },
    'c-tradition': {
      erklaerung: 'Tradition heißt Überlieferung: Lehren und Bräuche, die über viele Jahrhunderte weitergegeben wurden. Die Kirche sagte: Was so lange gilt, kann nicht falsch sein.',
      falsch: ['Alles Alte ist falsch. Was neu ist, ist immer besser.', 'Die Tradition ist richtig, aber nur in Rom. In Deutschland gelten andere Regeln.']
    },
    'c-hus': {
      erklaerung: 'Jan Hus war ein Prediger aus Prag. Er kritisierte die Kirche ähnlich wie später Luther. Das Konzil von Konstanz verurteilte ihn 1415 als Ketzer, und er wurde verbrannt. Wer mit Hus verglichen wurde, galt als Ketzer.',
      falsch: ['Hus war ein Verbrecher, mit ihm hat Luther gar nichts gemeinsam.', 'Was ein Konzil über Hus beschlossen hat, darf niemand mehr hinterfragen.']
    },
    'c-ketzer': {
      erklaerung: 'Ein Ketzer ist jemand, der nach Ansicht der Kirche eine falsche Lehre verbreitet. Ketzern drohten schwere Strafen, bis hin zum Tod auf dem Scheiterhaufen.',
      falsch: ['Ketzer ist nur ein Schimpfwort. Es hatte damals keine Folgen.', 'Wer Ketzer genannt wird, sollte sofort alles widerrufen, das ist am klügsten.']
    },
    'c-bann': {
      erklaerung: 'Mit dem Kirchenbann schloss der Papst jemanden aus der Kirche aus. Der Gebannte durfte nicht mehr an den Sakramenten teilnehmen. Im Januar 1521 bannte Papst Leo X. Luther.',
      falsch: ['Der Bann ist harmlos, er gilt nur für einen Tag.', 'Luther möchte gebannt werden, weil er selbst Papst werden will.']
    },
    'c-ordnung': {
      erklaerung: 'Viele Fürsten und der Kaiser fürchteten: Wenn um den Glauben gestritten wird, gerät das ganze Reich in Unruhe. Ruhe und Ordnung waren ihnen wichtiger als neue Fragen.',
      falsch: ['Luther will Unruhe. Er möchte, dass die Bauern die Fürsten absetzen.', 'Ordnung ist unwichtig. Hauptsache, alle streiten möglichst laut.']
    },
    'c-mehrheit': {
      erklaerung: 'Gegen Luther standen der Papst, der Kaiser, viele Fürsten und Bischöfe. Man sagte: Wenn fast alle Mächtigen einer Meinung sind, muss der Einzelne nachgeben.',
      falsch: ['Die Mehrheit hat immer recht, deshalb sollte Luther schweigen.', 'Luther ist allein. Niemand im Reich interessiert sich für seine Thesen.']
    },
    'c-ablassprediger': {
      erklaerung: 'Ablassprediger zogen im Auftrag der Kirche von Stadt zu Stadt. Sie predigten über Sünde und Fegefeuer und verkauften dann Ablassbriefe. Mit großem Aufwand sollten möglichst viele Menschen kaufen.',
      falsch: ['Die Ablassprediger sollten mehr Ablass verkaufen, damit der Petersdom schneller fertig wird.', 'Ablassprediger sind in Ordnung, wenn sie nur in Kirchen und nicht auf Marktplätzen predigen.']
    },
    'c-bulle': {
      erklaerung: 'Eine Bulle ist ein feierliches Schreiben des Papstes, benannt nach dem Siegel daran. 1520 drohte Papst Leo X. Luther in einer Bulle den Bann an: Widerrufe innerhalb von 60 Tagen, sonst wirst du ausgeschlossen.',
      falsch: ['Luther widerruft sofort, weil 60 Tage zu kurz sind.', 'Die Bulle ist nur ein Glückwunschschreiben des Papstes.']
    },
    'c-verbrennung': {
      erklaerung: 'Ab 1520 wurden Luthers Schriften in mehreren Städten öffentlich verbrannt, zum Beispiel in Löwen, Köln und Mainz. So sollte seine Lehre aus der Welt geschafft werden.',
      falsch: ['Wenn Bücher verbrannt werden, ist ihr Inhalt für immer verloren.', 'Luther verbrennt seine Schriften selbst, weil er sie bereut.']
    },
    'c-reichsacht': {
      erklaerung: 'Die Reichsacht war die schwerste Strafe im Heiligen Römischen Reich. Wer geächtet war, stand außerhalb des Rechts: Niemand durfte ihm helfen, und jeder durfte ihn gefangen nehmen.',
      falsch: ['Die Acht ist nur eine Geldstrafe. Wer zahlt, ist wieder frei.', 'Nach der Acht muss Luther das Reich verlassen und nach Rom ziehen.']
    },
    'c-gehorsam': {
      erklaerung: 'Die Kirche lehrte: Ein guter Christ gehorcht dem Papst, den Bischöfen und den Priestern. Wer ihnen widerspricht, widerspricht Gott.',
      falsch: ['Christen müssen niemandem gehorchen und können tun, was sie wollen.', 'Gehorsam gilt nur für Mönche. Alle anderen dürfen machen, was sie wollen.']
    },
    'c-kurie': {
      erklaerung: 'Die Kurie ist der Hof des Papstes in Rom mit seinen Beamten und Kardinälen. Dort wurde entschieden, was in der ganzen Kirche gilt, und dort floss auch viel Geld aus ganz Europa hin.',
      falsch: ['Die Kurie sollte nach Wittenberg umziehen, dann wäre alles in Ordnung.', 'Die Kurie ist ein Gericht für Diebe und hat mit dem Glauben nichts zu tun.']
    },
    'c-weihe': {
      erklaerung: 'Priester wurden von einem Bischof geweiht. Die Kirche lehrte: Nur geweihte Priester dürfen die Messe feiern, die Sakramente spenden und die Bibel verbindlich auslegen. Die Laien waren davon ausgeschlossen.',
      falsch: ['Jeder darf Priester werden, ganz ohne Ausbildung oder Auftrag der Gemeinde.', 'Priester sind überflüssig, Gottesdienste soll es gar nicht mehr geben.']
    },
    'c-latein': {
      erklaerung: 'Die Bibel der Kirche war die lateinische Vulgata. Latein verstanden fast nur Gelehrte und Geistliche. Laien sollten die Bibel nicht selbst auslegen, sondern sich auf die Priester verlassen.',
      falsch: ['Die Bibel ist nur auf Latein heilig. Eine Übersetzung wäre verboten und falsch.', 'Alle Deutschen sollen zuerst Latein lernen, dann können sie die Bibel lesen.']
    },
    'c-unfehlbar': {
      erklaerung: 'Die Kirche sagte von sich: Was die römische Kirche im Glauben lehrt, kann nicht falsch sein. Wer etwas anderes behauptet, irrt.',
      falsch: ['Die Kirche irrt immer. Man sollte gar nichts von ihr glauben.', 'Nur der Kaiser kann im Glauben nicht irren.']
    },
    'c-ketzerprozess': {
      erklaerung: 'In einem Ketzerprozess wurde jemand angeklagt, eine falsche Lehre zu verbreiten. Wer verurteilt wurde und nicht widerrief, konnte hingerichtet werden, so wie Jan Hus 1415.',
      falsch: ['Ketzerprozesse enden immer mit einem Freispruch.', 'Luther stellt sich freiwillig dem Prozess in Rom, weil er dort sicher ist.']
    },
    'c-widerrufe': {
      erklaerung: 'Widerrufen heißt: öffentlich zurücknehmen, was man gesagt oder geschrieben hat. Von Luther wurde das immer wieder verlangt, zum Beispiel von Kardinal Cajetan 1518 in Augsburg und 1521 auf dem Reichstag in Worms.',
      falsch: ['Luther widerruft, damit er in Ruhe weiterschreiben kann.', 'Luther widerruft in Worms alles, nimmt den Widerruf aber später heimlich zurück.']
    },
    'c-landsknechte': {
      erklaerung: 'Kaiser Karl V. war der mächtigste Herrscher seiner Zeit. Er hatte Soldaten, die Landsknechte, und viele Fürsten auf seiner Seite. Gegen ihn schien Widerstand aussichtslos.',
      falsch: ['Der Kaiser ist schwach. Er hat keine Soldaten und keine Verbündeten.', 'Luther stellt ein eigenes Heer auf und besiegt den Kaiser in einer Schlacht.']
    },
    'c-edikt': {
      erklaerung: 'Das Wormser Edikt vom Mai 1521 verhängte die Reichsacht über Luther. Es verbot, ihn zu schützen und seine Schriften zu drucken, zu verkaufen oder zu lesen.',
      falsch: ['Nach dem Edikt hört Luther auf zu schreiben, und niemand liest ihn mehr.', 'Das Edikt gilt nur in Worms. Überall sonst ist Luther frei.']
    },
    'c-ingolstadt': {
      erklaerung: '1523 wurde der Student Arsacius Seehofer an der Universität Ingolstadt angeklagt, weil er Luthers Lehre vertrat. Unter Druck musste er öffentlich abschwören und wurde in ein Kloster gebracht.',
      falsch: ['Seehofer schwört gern ab, weil er Luther nie verstanden hat.', 'Die Universität Ingolstadt ist evangelisch und schützt alle Lutheraner.']
    },
    'c-spott': {
      erklaerung: '1522 erschien das Spottgedicht „Von dem großen Lutherischen Narren“ des Mönchs Thomas Murner. Luther wurde darin als Narr verhöhnt. Mit Spott und Bildern wurde damals auf beiden Seiten gestritten.',
      falsch: ['Wer verspottet wird, hat immer unrecht.', 'Luther antwortet auf Spott nie, und auch sonst verteidigt ihn niemand.']
    },
    'c-messe': {
      erklaerung: 'In der Messe sprach der Priester auf Latein, oft leise und mit dem Rücken zur Gemeinde. Die meisten Leute verstanden kaum etwas. Sie schauten zu und beteten still für sich.',
      falsch: ['Die Gemeinde soll im Gottesdienst gar nicht mehr singen oder beten.', 'Die Messe soll abgeschafft werden, Christen brauchen keinen Gottesdienst.']
    },
    'c-zoelibat': {
      erklaerung: 'Zölibat heißt: ehelos leben. Priester, Mönche und Nonnen durften nach den Regeln der Kirche nicht heiraten. Das galt als besonders gottgefälliges Leben.',
      falsch: ['Alle Christen müssen heiraten, sonst sind sie keine guten Christen.', 'Ehelos zu leben ist verboten, wer es tut, wird bestraft.']
    }
  },
  antwort: {
    'k4>c-richter': '„Wie der Vater“: Im Gleichnis vom verlorenen Sohn läuft der Vater seinem Sohn entgegen. So ist Gott: kein strenger Richter, sondern ein liebender Vater, der vergibt.',
    'k12>c-richter': '„Allein aus Glauben“: Gottes Gerechtigkeit ist ein Geschenk. Der Mensch wird gerecht, weil er Gott vertraut, nicht weil er alles richtig macht.',
    'k12>c-fegefeuer': '„Allein aus Glauben“: Wer Gott vertraut, ist durch Gottes Gnade gerecht. Er muss keine Angst haben, sich das Heil erst verdienen zu müssen.',
    'w3>c-fegefeuer': '„Gott entscheidet“: Über die Verstorbenen entscheidet Gott allein. Kein Papst und kein Ablass kann Seelen aus dem Fegefeuer holen.',
    'k2>c-werke': '„Werke reichen nicht“: Auch viele gute Taten bringen keinen Frieden mit Gott. Kein Mensch kann sich den Himmel verdienen.',
    'k12>c-werke': '„Allein aus Glauben“: Nicht durch eigene Leistung wird der Mensch gerecht, sondern durch den Glauben an Gottes Gnade.',
    't43>c-werke': '„These 43“: Wer einem Armen gibt oder einem Bedürftigen leiht, tut Besseres, als wenn er Ablass kauft.',
    'r9>c-werke': '„Freiheit eines Christenmenschen“: Gute Werke machen nicht gerecht. Wer glaubt, ist frei und tut Gutes aus Liebe zum Nächsten, nicht um sich das Heil zu verdienen.',
    'k3>c-ablass': '„Gnade ist ein Geschenk“: Gott vergibt aus Liebe. Was geschenkt ist, kann man nicht kaufen.',
    'k6>c-ablass': '„Nicht käuflich“: Vergebung kommt von Gott und lässt sich nicht mit Geld bezahlen.',
    't27>c-ablass': '„These 27“: Es ist Menschenlehre zu predigen, eine Seele fliege aus dem Fegefeuer, sobald das Geld im Kasten klingt.',
    'r12>c-ablass': '„Der Gemeine Kasten“: Statt das Geld für Ablass nach Rom zu schicken, sammelt Wittenberg es in einer Kasse für die Armen der eigenen Stadt.',
    'k3>c-brief': '„Gnade ist ein Geschenk“: Gott schenkt Vergebung. Ein gekauftes Papier kann dieses Geschenk nicht ersetzen.',
    'w2>c-brief': '„Ohne Reue kein Erlass“: Wer seine Sünden nicht wirklich bereut, dem hilft auch kein Ablassbrief.',
    't32>c-brief': '„These 32“: Wer glaubt, durch Ablassbriefe seines Heils sicher zu sein, wird mit seinen Lehrern ewig verdammt. Auf den Brief verlassen heißt sich selbst betrügen.',
    'w2>c-predigt': '„Ohne Reue kein Erlass“: Tetzel lockt mit dem schnellen Kauf. Doch ohne echte Reue hilft kein Ablass.',
    'k6>c-predigt': '„Nicht käuflich“: Egal wie mitreißend gepredigt wird: Vergebung kann man nicht kaufen.',
    't36>c-predigt': '„These 36“: Jeder Christ, der wirklich bereut, hat von Gott schon vollen Erlass der Strafe und Schuld, auch ohne Ablassbrief.',
    'w1>c-petersdom': '„Weg des Geldes“: Das Ablassgeld dient nicht nur der Kirche: Ein Teil bezahlt die Schulden Erzbischof Albrechts beim Bankhaus Fugger.',
    'n1>c-petersdom': '„Die Not der Leute“: Arme Menschen geben ihr letztes Geld für einen Bau in Rom, während sie selbst Not leiden.',
    't86>c-petersdom': '„These 86“: Der Papst ist reicher als die Reichsten. Warum baut er den Petersdom nicht mit seinem eigenen Geld statt mit dem der armen Gläubigen?',
    'k5>c-papst': '„Maßstab Bibel“: Was Christen glauben, muss sich an der Bibel messen lassen, auch die Entscheidungen des Papstes.',
    'r10>c-papst': '„An den christlichen Adel“: Luther schreibt 1520, dass auch der Papst die Bibel nicht allein auslegen darf. Die Fürsten sollen helfen, die Kirche zu erneuern.',
    'k5>c-konzil': '„Maßstab Bibel“: Nicht die Zahl der Bischöfe entscheidet, sondern ob ein Beschluss mit der Bibel übereinstimmt.',
    'k9>c-konzil': '„Konzilien irren“: Auch Konzilien sind Menschen. Sie haben einander schon widersprochen, also können sie irren.',
    'k5>c-tradition': '„Maßstab Bibel“: Auch eine lange Tradition muss sich an der Bibel prüfen lassen. Alter allein macht eine Lehre nicht wahr.',
    'k11>c-tradition': '„Bibel für alle“: Wenn alle die Bibel selbst lesen können, kann jeder prüfen, ob die Tradition mit ihr übereinstimmt.',
    'k9>c-hus': '„Konzilien irren“: In Leipzig 1519 sagt Luther: Auch das Konzil von Konstanz kann sich geirrt haben. Manches, was Hus lehrte, war christlich.',
    'r29>c-hus': '„Das Augsburger Bekenntnis“: 1530 zeigen die Evangelischen, dass sie den gemeinsamen christlichen Glauben bekennen. Sie sind keine Ketzer.',
    'r19>c-ketzer': '„Loci communes“: Melanchthon begründet die neue Lehre 1521 geordnet aus der Bibel. Wer sie prüft, sieht: Das ist kein wirres Ketzertum.',
    'r29>c-ketzer': '„Das Augsburger Bekenntnis“: Die Evangelischen legen 1530 offen dar, was sie glauben, und zeigen: Es ist der christliche Glaube, begründet aus der Bibel.',
    'k10>c-bann': '„Gewissen“: Ein Ausschluss durch den Papst ändert nichts. Luthers Gewissen ist an Gottes Wort gebunden, nicht an das Urteil Roms.',
    'r15>c-bann': '„Die Bulle im Feuer“: Luther verbrennt 1520 die Bannandrohung öffentlich. Er zeigt: Er erkennt die Macht des Papstes über seinen Glauben nicht an.',
    'k7>c-ordnung': '„Erneuern, nicht spalten“: Luther will keinen Aufruhr. Er will, dass die Kirche wieder nach der Bibel lebt.',
    'r6>c-ordnung': '„Neue Kirchenordnungen“: Johannes Bugenhagen sorgt dafür, dass die Gemeinden geordnet weiterleben, mit Predigt, Schule und Hilfe für die Armen.',
    'k8>c-mehrheit': '„Viele haben es gelesen“: Luther ist nicht allein. In wenigen Wochen sprechen Menschen im ganzen Reich über seine Thesen.',
    'n2>c-mehrheit': '„Rückhalt der Studenten“: Etwa 200 Studenten begleiten Luther nach Leipzig. Viele junge Leute stehen hinter ihm.',
    'k6>c-ablassprediger': '„Nicht käuflich“: Wie viele Prediger auch werben: Vergebung kann man nicht kaufen.',
    't27>c-ablassprediger': '„These 27“: Wer predigt, die Seele springe aus dem Fegefeuer, sobald das Geld im Kasten klingt, predigt Menschenlehre.',
    't43>c-ablassprediger': '„These 43“: Die Prediger sollten lehren: Wer den Armen hilft, tut Besseres als wer Ablass kauft.',
    'r12>c-ablassprediger': '„Der Gemeine Kasten“: Das Geld der Leute soll den Armen in der eigenen Stadt helfen, nicht an Ablassprediger gehen.',
    'k10>c-bulle': '„Gewissen“: Luther widerruft nicht, weil ihn niemand aus der Bibel widerlegt hat. Sein Gewissen ist an Gottes Wort gebunden.',
    'r15>c-bulle': '„Die Bulle im Feuer“: Statt zu widerrufen, verbrennt Luther im Dezember 1520 die Bannandrohung vor dem Elstertor in Wittenberg.',
    'k13>c-verbrennung': '„Die Druckerpresse“: Für jedes verbrannte Buch werden neue gedruckt. Luthers Gedanken erreichen Tausende.',
    'r13>c-verbrennung': '„Flugschriften“: Kleine, billige Hefte verbreiten Luthers Gedanken schneller, als man sie verbrennen kann.',
    'r4>c-reichsacht': '„Schutz des Kurfürsten“: Friedrich der Weise schützt Luther. Er lässt ihn nicht ausliefern, obwohl er geächtet ist.',
    'r23>c-reichsacht': '„Junker Jörg“: Nach Worms wird Luther zum Schein überfallen und auf die Wartburg gebracht. Dort lebt er versteckt und ist sicher.',
    'r9>c-gehorsam': '„Freiheit eines Christenmenschen“: Ein Christ ist durch den Glauben frei. Er gehorcht Gott und seinem Gewissen, nicht blind jeder Anordnung.',
    'r11>c-gehorsam': '„Priestertum aller Getauften“: Alle Getauften stehen Gott gleich nah. Sie dürfen selbst beten, die Bibel lesen und prüfen, was gelehrt wird.',
    'r10>c-kurie': '„An den christlichen Adel“: Luther fordert 1520, dass nicht mehr so viel Geld nach Rom fließt und die Kirche im Land selbst erneuert wird.',
    'r22>c-kurie': '„Ulrich von Hutten“: Der Ritter greift auf Deutsch die Geldgier Roms an, damit alle verstehen, wohin ihr Geld geht.',
    'r6>c-weihe': '„Neue Kirchenordnungen“: Die Gemeinden ordnen ihr Kirchenleben selbst neu, mit Pfarrern, die sie berufen.',
    'r11>c-weihe': '„Priestertum aller Getauften“: Durch die Taufe sind alle Christen Priester vor Gott. Jeder darf beten, die Bibel lesen und von Gott erzählen.',
    'r30>c-weihe': '„Die Gemeinde urteilt“: 1523 schreibt Luther: Eine christliche Gemeinde darf prüfen, was gepredigt wird, und ihren Pfarrer selbst berufen.',
    'k11>c-latein': '„Bibel für alle“: Jeder soll die Bibel in seiner eigenen Sprache lesen und verstehen können.',
    'r17>c-latein': '„Das Septembertestament“: 1522 erscheint das Neue Testament auf Deutsch. Nun können es auch Leute lesen, die kein Latein können.',
    'r24>c-latein': '„Die ganze Bibel auf Deutsch“: 1534 ist die ganze Bibel übersetzt. Alle können selbst nachlesen, was darin steht.',
    'k9>c-unfehlbar': '„Konzilien irren“: Konzilien haben einander widersprochen. Also kann auch die Kirche im Glauben irren.',
    'r18>c-unfehlbar': '„Universität Wittenberg“: Hier wird offen geprüft und gestritten, was in der Bibel steht, statt einfach hinzunehmen, was Rom lehrt.',
    'r4>c-ketzerprozess': '„Schutz des Kurfürsten“: Friedrich der Weise sorgt dafür, dass Luther nicht nach Rom ausgeliefert wird.',
    'r23>c-ketzerprozess': '„Junker Jörg“: Versteckt auf der Wartburg ist Luther vor seinen Verfolgern sicher und übersetzt dort das Neue Testament.',
    'k10>c-widerrufe': '„Gewissen“: In Worms sagt Luther: Wenn man ihn nicht durch die Bibel oder klare Gründe widerlegt, kann er nicht widerrufen. Sein Gewissen ist an Gottes Wort gebunden.',
    'r20>c-widerrufe': '„Argula von Grumbach“: Sie fordert die Gelehrten in Ingolstadt auf: Widerlegt mit der Bibel, statt Widerruf zu erzwingen.',
    'r4>c-landsknechte': '„Schutz des Kurfürsten“: Gegen die Macht des Kaisers hält Friedrich der Weise seine schützende Hand über Luther.',
    'r28>c-landsknechte': '„Die Protestation“: 1529 widersprechen evangelische Fürsten und Städte dem Kaiser in Speyer. Seitdem heißen sie Protestanten.',
    'r23>c-edikt': '„Junker Jörg“: Trotz Acht und Verbot arbeitet Luther auf der Wartburg weiter und übersetzt das Neue Testament.',
    'r28>c-edikt': '„Die Protestation“: 1529 protestieren Fürsten und Städte dagegen, das Wormser Edikt wieder streng durchzusetzen. Sie wollen in Glaubensfragen ihrem Gewissen folgen.',
    'k10>c-ingolstadt': '„Gewissen“: Glauben kann man nicht erzwingen. Wer gegen sein Gewissen abschwören muss, ist nicht überzeugt.',
    'r20>c-ingolstadt': '„Argula von Grumbach“: 1523 verteidigt sie den Studenten Seehofer mit Bibelstellen und verlangt, dass man ihn mit der Bibel widerlegt.',
    'r2>c-spott': '„Cranachs Bilder“: Der Maler Lucas Cranach zeigt Luther würdig und ernst. Seine Bilder prägen, wie man Luther sieht.',
    'r21>c-spott': '„Die Wittenbergisch Nachtigall“: Hans Sachs besingt Luther 1523 als Nachtigall, die den neuen Tag ankündigt, eine Antwort auf den Spott.',
    'r8>c-messe': '„Deutsche Lieder“: Die Gemeinde schaut nicht mehr nur zu. Sie singt selbst, und zwar auf Deutsch.',
    'r25>c-messe': '„Die Deutsche Messe“: 1526 ordnet Luther einen Gottesdienst auf Deutsch. Alle verstehen die Lesungen und können mitfeiern.',
    'r9>c-zoelibat': '„Freiheit eines Christenmenschen“: Ehelosigkeit macht vor Gott nicht gerechter. Ein Christ ist frei, auch zu heiraten.',
    'r26>c-zoelibat': '„Pfarrer dürfen heiraten“: 1525 heiratet Luther die frühere Nonne Katharina von Bora. Evangelische Pfarrer dürfen eine Familie gründen.'
  }
};
