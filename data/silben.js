// Trennstellen für lange Wörter in Kartentiteln. Nicht jeder Browser trennt Deutsch automatisch (hyphens: auto),
// auf kleinen Karten würden lange Wörter sonst abgeschnitten. Der Punkt steht für eine mögliche Trennstelle.
const stellen = [
  'September·tes·ta·ment', 'Kir·chen·ord·nun·gen', 'Chris·ten·men·schen', 'Wit·ten·ber·gisch', 'Ab·lass·pre·di·ger',
  'No·vi·zen·meis·ter', 'Dru·cker·pres·se', 'Flug·schrif·ten', 'Bann·an·dro·hung', 'Ket·zer·pro·zess', 'christ·li·chen',
  'Pro·tes·ta·ti·on', 'Ab·lass·han·del', 'ent·schei·det', 'Ka·te·chis·mus', 'Pries·ter·tum', 'Uni·ver·si·tät', 'Ab·lass·brief',
  'Kir·chen·bann', 'lu·the·ri·sche', 'Me·lanch·thon', 'Grie·chisch', 'Kur·fürs·ten', 'Wit·ten·berg', 'Nach·ti·gall',
  'Augs·bur·ger', 'Be·kennt·nis', 'Reichs·acht', 'Ab·schwö·ren', 'Hie·ro·ny·mus'
];
const karte = new Map(stellen.map((w) => [w.replaceAll('·', ''), w.replaceAll('·', '\u00AD')]));

/** Titel mit weichen Trennstellen (unsichtbar, nur beim Umbruch ein Bindestrich). */
export const trenne = (titel) => titel.replace(/[A-Za-zÄÖÜäöüß\u00AD]+/g, (w) => karte.get(w.replaceAll('\u00AD', '')) || w);
