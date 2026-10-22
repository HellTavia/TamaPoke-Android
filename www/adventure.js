// TamaPoke Android — Aventure (v11, ajout du fork)
//
// Défis du jour, sac d'objets trouvés en balade, pension (œufs) et badges.
// Tout l'état tient dans prefs.adv (exporté avec la sauvegarde). La logique du
// firmware n'est pas touchée : on observe les actions en enveloppant quelques
// méthodes de Pet (le test différentiel charge core.js seul).
'use strict';

//        ES, EN, FR, DE, IT, PT, JA, KO
const AX = {
  TITLE: ['Aventura', 'Journey', 'Aventure', 'Abenteuer', 'Avventura', 'Aventura', 'ぼうけん', '모험'],
  T_CH: ['Retos', 'Challenges', 'Défis', 'Aufgaben', 'Sfide', 'Desafios', 'チャレンジ', '도전'],
  T_BAG: ['Mochila', 'Bag', 'Sac', 'Beutel', 'Zaino', 'Mochila', 'バッグ', '가방'],
  T_CARE: ['Guardería', 'Day Care', 'Pension', 'Pension', 'Pensione', 'Creche', 'あずかりや', '키우미집'],
  T_BADGE: ['Medallas', 'Badges', 'Badges', 'Orden', 'Medaglie', 'Insígnias', 'バッジ', '배지'],
  CLOSE: ['Cerrar', 'Close', 'Fermer', 'Schließen', 'Chiudi', 'Fechar', 'とじる', '닫기'],
  // défis
  CH_HOW: ['3 retos nuevos cada día. Cada reto cumplido da un objeto; los 3 dan además un Caramelo Raro.', '3 new challenges every day. Each one gives an item; all 3 also give a Rare Candy.', 'Trois nouveaux défis chaque jour. Chaque défi réussi donne un objet ; les trois donnent en plus un Super Bonbon.', 'Jeden Tag 3 neue Aufgaben. Jede bringt ein Item, alle 3 zusätzlich ein Sonderbonbon.', '3 nuove sfide ogni giorno. Ognuna dà uno strumento; tutte e 3 anche una Caramella Rara.', '3 desafios novos por dia. Cada um dá um item; os 3 dão ainda um Doce Raro.', 'まいにち 3つの チャレンジ', '매일 3개의 도전'],
  CH_steps: ['Camina %u pasos', 'Walk %u steps', 'Marcher %u pas', 'Lauf %u Schritte', 'Cammina %u passi', 'Ande %u passos', '%uほ あるく', '%u걸음 걷기'],
  CH_win: ['Gana %u combates', 'Win %u battles', 'Gagner %u combats', 'Gewinne %u Kämpfe', 'Vinci %u lotte', 'Vença %u batalhas', 'バトルに %uかい かつ', '배틀 %u승'],
  CH_drink: ['Dale de beber %u veces', 'Give water %u times', 'Donner à boire %u fois', '%u-mal Wasser geben', 'Dai da bere %u volte', 'Dê água %u vezes', 'みずを %uかい あげる', '물 %u번 주기'],
  CH_feed: ['Dale de comer %u veces', 'Feed it %u times', 'Nourrir %u fois', '%u-mal füttern', 'Nutrilo %u volte', 'Alimente %u vezes', 'ごはんを %uかい あげる', '밥 %u번 주기'],
  CH_play: ['Juega %u veces', 'Play %u times', 'Jouer %u fois', '%u-mal spielen', 'Gioca %u volte', 'Brinque %u vezes', '%uかい あそぶ', '%u번 놀기'],
  CH_clean: ['Báñalo %u vez', 'Clean it %u time', 'Faire la toilette %u fois', '%u-mal baden', 'Pulisci %u volta', 'Dê banho %u vez', '%uかい おふろ', '%u번 목욕'],
  CH_duel: ['Haz %u duelo con un amigo', 'Do %u duel with a friend', 'Faire %u duel avec un ami', '%u Duell mit Freunden', 'Fai %u duello con un amico', 'Faça %u duelo com amigo', 'ともだちと %uかい デュエル', '친구와 듀얼 %u번'],
  CLAIM: ['Recoger', 'Claim', 'Récupérer', 'Abholen', 'Ritira', 'Pegar', 'うけとる', '받기'],
  CLAIMED: ['Recogido ✓', 'Claimed ✓', 'Récupéré ✓', 'Abgeholt ✓', 'Ritirato ✓', 'Pego ✓', 'うけとった ✓', '받음 ✓'],
  BONUS: ['Los 3 retos: +1 Caramelo Raro', 'All 3: +1 Rare Candy', 'Les trois défis : +1 Super Bonbon', 'Alle 3: +1 Sonderbonbon', 'Tutte e 3: +1 Caramella Rara', 'Os 3: +1 Doce Raro', '3つ ぜんぶ: ふしぎなアメ', '3개 모두: 이상한사탕'],
  GOT: ['¡Recibes: %s!', 'You got: %s!', 'Tu reçois : %s !', 'Erhalten: %s!', 'Ricevi: %s!', 'Você recebe: %s!', '%sを てにいれた！', '%s 획득!'],
  ZONE: ['Zona de la semana: %s', 'Zone of the week: %s', 'Zone de la semaine : %s', 'Gebiet der Woche: %s', 'Zona della settimana: %s', 'Zona da semana: %s', 'こんしゅうの エリア: %s', '이번 주 지역: %s'],
  ZONE_HOW: ['Más Pokémon de esta zona en tus paseos. De noche (21 h–6 h) salen Zubat, Gastly, Clefairy…; de día, Pidgey, Caterpie…', 'More Pokémon from this zone on your walks. At night (9 pm–6 am) Zubat, Gastly, Clefairy… come out; by day, Pidgey, Caterpie…', "Plus de POKEMON de cette zone en balade. La nuit (21 h–6 h) sortent Nosferapti, Fantominus, Mélofée… ; le jour, Roucool, Chenipan…", 'Mehr Pokémon aus diesem Gebiet. Nachts (21–6 Uhr) Zubat, Nebulak, Piepi…; tagsüber Taubsi, Raupy…', 'Più Pokémon di questa zona. Di notte (21–6) Zubat, Gastly, Clefairy…; di giorno Pidgey, Caterpie…', 'Mais Pokémon desta zona. À noite (21h–6h) Zubat, Gastly, Clefairy…; de dia Pidgey, Caterpie…', 'このエリアの ポケモンが でやすい。よる(21-6じ)は ズバット・ゴース・ピッピ', '이 지역 포켓몬이 더 자주 나와요. 밤(21-6시)엔 주뱃·고오스·삐삐'],
  NIGHT: ['Ahora: noche', 'Now: night', 'En ce moment : nuit', 'Jetzt: Nacht', 'Ora: notte', 'Agora: noite', 'いまは よる', '지금: 밤'],
  DAY: ['Ahora: día', 'Now: day', 'En ce moment : jour', 'Jetzt: Tag', 'Ora: giorno', 'Agora: dia', 'いまは ひる', '지금: 낮'],
  ZS: ['Zona %s · %s', 'Zone: %s · %s', 'Zone %s · %s', 'Gebiet %s · %s', 'Zona %s · %s', 'Zona %s · %s', '%s・%s', '%s · %s'],
  NIGHT_S: ['noche', 'night', 'nuit', 'Nacht', 'notte', 'noite', 'よる', '밤'],
  DAY_S: ['día', 'day', 'jour', 'Tag', 'giorno', 'dia', 'ひる', '낮'],
  Z_prairie: ['Pradera', 'Meadow', 'Prairie', 'Wiese', 'Prateria', 'Pradaria', 'そうげん', '초원'],
  Z_plage: ['Playa', 'Beach', 'Plage', 'Strand', 'Spiaggia', 'Praia', 'うみべ', '해변'],
  Z_foret: ['Bosque', 'Forest', 'Forêt', 'Wald', 'Foresta', 'Floresta', 'もり', '숲'],
  Z_volcan: ['Volcán', 'Volcano', 'Volcan', 'Vulkan', 'Vulcano', 'Vulcão', 'かざん', '화산'],
  Z_montagne: ['Montaña', 'Mountain', 'Montagne', 'Berg', 'Montagna', 'Montanha', 'やま', '산'],
  // sac
  BAG_HOW: ['Cada 1000 pasos puedes encontrar un objeto. Se usan en tu compañero.', 'Every 1000 steps you may find an item. Items are used on your partner.', 'Tous les 1000 pas, tu peux trouver un objet. Les objets s\'utilisent sur ton compagnon.', 'Alle 1000 Schritte kannst du ein Item finden. Für deinen Partner.', 'Ogni 1000 passi puoi trovare uno strumento. Si usa sul compagno.', 'A cada 1000 passos você pode achar um item. Use no parceiro.', '1000ほ ごとに どうぐが みつかるかも', '1000걸음마다 도구를 찾을 수 있어요'],
  BAG_EMPTY: ['La mochila está vacía: ¡a caminar!', 'Your bag is empty: go for a walk!', 'Le sac est vide : va marcher !', 'Der Beutel ist leer: geh laufen!', 'Zaino vuoto: cammina!', 'Mochila vazia: vá andar!', 'バッグは からっぽ', '가방이 비었어요'],
  USE: ['Usar', 'Use', 'Utiliser', 'Benutzen', 'Usa', 'Usar', 'つかう', '사용'],
  NOEFFECT: ['No tendría efecto', 'It won\'t have any effect', 'Ça n\'aurait aucun effet', 'Hätte keine Wirkung', 'Non avrebbe effetto', 'Não teria efeito', 'こうかが ない', '효과가 없어요'],
  FOUND: ['¡Objeto encontrado: %s!', 'Item found: %s!', 'Objet trouvé : %s !', 'Item gefunden: %s!', 'Trovato: %s!', 'Item encontrado: %s!', '%sを みつけた！', '%s 발견!'],
  USED: ['%s usado', '%s used', '%s utilisé', '%s benutzt', '%s usato', '%s usado', '%sを つかった', '%s 사용'],
  EVOLVES: ['¡%s está evolucionando!', '%s is evolving!', '%s évolue !', '%s entwickelt sich!', '%s si evolve!', '%s está evoluindo!', '%sが しんかする！', '%s 진화!'],
  I_potion: ['Poción', 'Potion', 'Potion', 'Trank', 'Pozione', 'Poção', 'キズぐすり', '상처약'],
  I_candy: ['Caramelo Raro', 'Rare Candy', 'Super Bonbon', 'Sonderbonbon', 'Caramella Rara', 'Doce Raro', 'ふしぎなアメ', '이상한사탕'],
  I_fire: ['Piedra Fuego', 'Fire Stone', 'Pierre Feu', 'Feuerstein', 'Pietrafocaia', 'Pedra de Fogo', 'ほのおのいし', '불꽃의돌'],
  I_water: ['Piedra Agua', 'Water Stone', 'Pierre Eau', 'Wasserstein', 'Pietraidrica', 'Pedra da Água', 'みずのいし', '물의돌'],
  I_thunder: ['Piedra Trueno', 'Thunder Stone', 'Pierre Foudre', 'Donnerstein', 'Pietratuono', 'Pedra do Trovão', 'かみなりのいし', '천둥의돌'],
  I_leaf: ['Piedra Hoja', 'Leaf Stone', 'Pierre Plante', 'Blattstein', 'Pietrafoglia', 'Pedra da Folha', 'リーフのいし', '리프의돌'],
  I_moon: ['Piedra Lunar', 'Moon Stone', 'Pierre Lune', 'Mondstein', 'Pietralunare', 'Pedra da Lua', 'つきのいし', '달의돌'],
  D_potion: ['+40 de energía', '+40 energy', '+40 d\'énergie', '+40 Energie', '+40 energia', '+40 energia', 'げんき +40', '기력 +40'],
  D_candy: ['Sube 1 nivel', 'Raises the level by 1', 'Monte d\'un niveau', '+1 Level', '+1 livello', 'Sobe 1 nível', 'レベルが 1 あがる', '레벨 +1'],
  D_stone: ['Hace evolucionar a ciertos Pokémon', 'Makes certain Pokémon evolve', 'Fait évoluer certains POKEMON', 'Entwickelt bestimmte Pokémon', 'Fa evolvere certi Pokémon', 'Evolui certos Pokémon', 'ある ポケモンを しんかさせる', '특정 포켓몬을 진화'],
  // pension
  CARE_HOW: ['Deja 2 Pokémon (equipo o PC): tras 2500 pasos encontrarás un huevo de la forma básica. Metamorph va con todos. Los legendarios no crían.', 'Leave 2 Pokémon (team or PC): after 2,500 steps there\'ll be an egg of the base form. Ditto pairs with anyone. Legendaries don\'t breed.', "Dépose 2 POKEMON (équipe ou PC) : après 2 500 pas, un œuf de la forme de base t'attend. Métamorph va avec tout le monde. Les légendaires ne pondent pas.", 'Gib 2 Pokémon ab: nach 2500 Schritten wartet ein Ei der Grundform. Ditto passt zu allen. Legendäre nicht.', 'Lascia 2 Pokémon: dopo 2500 passi troverai un uovo della forma base. Ditto va con tutti. I leggendari no.', 'Deixe 2 Pokémon: após 2500 passos haverá um ovo da forma básica. Ditto combina com todos. Lendários não.', '2ひき あずけて 2500ほ あるくと タマゴ', '2마리를 맡기고 2500걸음 걸으면 알'],
  SLOT: ['Hueco libre', 'Empty slot', 'Place libre', 'Freier Platz', 'Posto libero', 'Vaga livre', 'あき', '빈 자리'],
  DEPOSIT: ['Dejar un Pokémon', 'Leave a Pokémon', 'Déposer un POKEMON', 'Pokémon abgeben', 'Lascia un Pokémon', 'Deixar um Pokémon', 'あずける', '맡기기'],
  WITHDRAW: ['Recoger', 'Take back', 'Reprendre', 'Abholen', 'Ritira', 'Pegar de volta', 'ひきとる', '찾기'],
  PICKONE: ['Elige el Pokémon que dejas', 'Pick the Pokémon to leave', 'Choisis le POKEMON à déposer', 'Wähle das Pokémon', 'Scegli il Pokémon', 'Escolha o Pokémon', 'あずける ポケモン', '맡길 포켓몬'],
  PROG: ['Huevo: %u / 2500 pasos', 'Egg: %u / 2,500 steps', 'Œuf : %u / 2 500 pas', 'Ei: %u / 2500 Schritte', 'Uovo: %u / 2500 passi', 'Ovo: %u / 2500 passos', 'タマゴ: %u / 2500ほ', '알: %u / 2500걸음'],
  NOEGG: ['Estos dos no van a criar', 'These two won\'t breed', 'Ces deux-là ne pondront pas', 'Diese zwei züchten nicht', 'Questi due non si riproducono', 'Esses dois não vão cruzar', 'この 2ひきは タマゴを うまない', '이 둘은 알을 낳지 않아요'],
  EGGREADY: ['¡Hay un huevo de %s!', 'There\'s a %s egg!', 'Un œuf de %s t\'attend !', 'Ein %s-Ei wartet!', 'C\'è un uovo di %s!', 'Há um ovo de %s!', '%sの タマゴが ある！', '%s 알이 있어요!'],
  TAKEEGG: ['Llevar el huevo a la incubadora', 'Put the egg in the incubator', "Mettre l'œuf à l'incubateur", 'Ei in den Brutkasten', 'Metti l\'uovo nell\'incubatrice', 'Levar o ovo à incubadora', 'ふかそうちへ', '부화기로'],
  INCBUSY: ['La incubadora está ocupada', 'The incubator is busy', "L'incubateur est occupé", 'Brutkasten belegt', 'Incubatrice occupata', 'Incubadora ocupada', 'ふかそうちが いっぱい', '부화기 사용 중'],
  NOROOM: ['Equipo y PC llenos', 'Team and PC are full', 'Équipe et PC pleins', 'Team und PC voll', 'Squadra e PC pieni', 'Equipe e PC cheios', 'いっぱい', '가득 참'],
  NONEPICK: ['No hay Pokémon en el equipo ni en el PC', 'No Pokémon in the team or PC', "Aucun POKEMON dans l'équipe ni au PC", 'Keine Pokémon im Team oder PC', 'Nessun Pokémon in squadra o PC', 'Nenhum Pokémon na equipe ou PC', 'ポケモンが いない', '포켓몬이 없어요'],
  // badges
  BADGE_HOW: ['8 medallas, una recompensa (Caramelo Raro) por cada una. También en la Ficha.', '8 badges, each one rewarded with a Rare Candy. Also shown on the Profile.', '8 badges, chacun récompensé par un Super Bonbon. Ils sont aussi sur la Fiche.', '8 Orden, je ein Sonderbonbon. Auch im Profil.', '8 medaglie, ognuna con una Caramella Rara. Anche nella Scheda.', '8 insígnias, cada uma com um Doce Raro. Também na Ficha.', '8つの バッジ（ふしぎなアメ つき）', '배지 8개 (각각 이상한사탕)'],
  NEWBADGE: ['¡Medalla %s obtenida!', '%s Badge earned!', 'Badge %s obtenu !', '%sorden erhalten!', 'Medaglia %s ottenuta!', 'Insígnia %s obtida!', '%sバッジ ゲット！', '%s 배지 획득!'],
  B_0: ['Roca', 'Boulder', 'Roche', 'Felsen', 'Sasso', 'Rocha', 'グレー', '회색'],
  B_1: ['Cascada', 'Cascade', 'Cascade', 'Quell', 'Cascata', 'Cascata', 'ブルー', '블루'],
  B_2: ['Trueno', 'Thunder', 'Foudre', 'Donner', 'Tuono', 'Trovão', 'オレンジ', '오렌지'],
  B_3: ['Arcoíris', 'Rainbow', 'Prisme', 'Farbspektrum', 'Arcobaleno', 'Arco-íris', 'レインボー', '무지개'],
  B_4: ['Alma', 'Soul', 'Âme', 'Seelen', 'Anima', 'Alma', 'ピンク', '핑크'],
  B_5: ['Pantano', 'Marsh', 'Marais', 'Sumpf', 'Palude', 'Pântano', 'ゴールド', '골드'],
  B_6: ['Volcán', 'Volcano', 'Volcan', 'Vulkan', 'Vulcano', 'Vulcão', 'クリムゾン', '크림슨'],
  B_7: ['Tierra', 'Earth', 'Terre', 'Erd', 'Terra', 'Terra', 'グリーン', '그린'],
  BC_0: ['%u pasos en total', '%u steps in total', '%u pas au total', '%u Schritte insgesamt', '%u passi in totale', '%u passos no total', 'ごうけい %uほ', '총 %u걸음'],
  BC_1: ['Pokédex: %u especies', 'Pokédex: %u species', 'Pokédex : %u espèces', 'Pokédex: %u Arten', 'Pokédex: %u specie', 'Pokédex: %u espécies', 'ずかん %u', '도감 %u'],
  BC_2: ['%u combates ganados', '%u battles won', '%u combats gagnés', '%u Kämpfe gewonnen', '%u lotte vinte', '%u batalhas vencidas', 'バトル %uしょう', '배틀 %u승'],
  BC_3: ['%u retos cumplidos', '%u challenges done', '%u défis réussis', '%u Aufgaben erfüllt', '%u sfide completate', '%u desafios feitos', 'チャレンジ %u', '도전 %u개'],
  BC_4: ['%u duelos ganados', '%u duels won', '%u duels gagnés', '%u Duelle gewonnen', '%u duelli vinti', '%u duelos vencidos', 'デュエル %uしょう', '듀얼 %u승'],
  BC_7: ['Pokédex %u y las otras 7 medallas', 'Pokédex %u and the 7 other badges', 'Pokédex %u et les 7 autres badges', 'Pokédex %u und die 7 anderen Orden', 'Pokédex %u e le altre 7', 'Pokédex %u e as outras 7', 'ずかん %u ＋ 7つの バッジ', '도감 %u + 배지 7개'],
};
const AXT = (k, ...a) => sprintf(AX[k][gLang], ...a);
const ael = (id) => document.getElementById(id);

// ------------------------------------------------------------------ état
const ITEMS = ['potion', 'candy', 'fire', 'water', 'thunder', 'leaf', 'moon'];
const STONE_EVO = {
  fire: { 37: 38, 58: 59, 133: 136 },
  water: { 61: 62, 90: 91, 120: 121, 133: 134 },
  thunder: { 25: 26, 133: 135 },
  leaf: { 44: 45, 70: 71, 102: 103 },
  moon: { 30: 31, 33: 34, 35: 36, 39: 40 },
};
const CARE_STEPS = 2500;
const DITTO = 132;

function advState() {
  const a = prefs.get('adv', null) || {};
  a.items = a.items || {};
  a.itemSteps = a.itemSteps || 0;
  a.day = a.day || 0;
  a.cnt = a.cnt || {};
  a.claimed = a.claimed || [0, 0, 0];
  a.bonus = a.bonus || 0;
  a.chDone = a.chDone || 0;
  a.badges = a.badges || 0;
  a.care = a.care || { mons: [], steps: 0, egg: 0, shiny: false };
  return a;
}
function advSave(a) { prefs.put('adv', a); prefs.flush(); }
function itemName(k) { return AXT('I_' + k); }
function addItem(a, k, n = 1) { a.items[k] = Math.min(99, (a.items[k] || 0) + n); }

// petit générateur déterministe (défis du jour identiques toute la journée)
function dayRng(seed) {
  let t = (seed * 2654435761) >>> 0;
  return () => {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function randomItem(rnd) {
  const r = rnd();
  if (r < 0.45) return 'potion';
  if (r < 0.65) return 'candy';
  return ['fire', 'water', 'thunder', 'leaf', 'moon'][Math.floor((r - 0.65) / 0.35 * 5) % 5];
}

// ------------------------------------------------------------- défis
const CH_POOL = [['win', [1, 2, 3]], ['drink', [3]], ['feed', [3]], ['play', [2]], ['clean', [1]], ['duel', [1]]];
function todayChallenges(day) {
  const rnd = dayRng(day + 7919);
  const out = [{ id: 'steps', n: [3000, 5000, 8000][Math.floor(rnd() * 3)] }];
  const pool = CH_POOL.slice();
  while (out.length < 3) {
    const [id, ns] = pool.splice(Math.floor(rnd() * pool.length), 1)[0];
    out.push({ id, n: ns[Math.floor(rnd() * ns.length)] });
  }
  out.forEach((c, i) => { c.reward = randomItem(dayRng(day * 3 + i + 101)); });
  return out;
}
function rollDay(a) {
  const d = pet.today();
  if (d && a.day !== d) { a.day = d; a.cnt = {}; a.claimed = [0, 0, 0]; a.bonus = 0; }
  return a;
}
function chValue(c, a) {
  if (c.id === 'steps') return pet.stepsDay === a.day ? pet.stepsToday : 0;
  return a.cnt[c.id] || 0;
}
function advNote(kind) {
  if (!TP_EXT) return;
  const a = rollDay(advState());
  a.cnt[kind] = (a.cnt[kind] || 0) + 1;
  advSave(a);
  advCheckBadges();
}

// ---------------------------------------------- crochets sur les actions
(function hook() {
  const P = Pet.prototype;
  const wrap = (name, test, kind) => {
    const orig = P[name];
    if (!orig) return;
    P[name] = function (...args) {
      const before = test.pre ? test.pre(this, args) : null;
      const r = orig.apply(this, args);
      try { if (test.post(this, before, args, r)) advNote(kind); } catch (e) { /* rien */ }
      return r;
    };
  };
  const awake = (p) => p.ceremony === CER_NONE && !p.isEgg() && !p.sleeping;
  wrap('feedBerry', { pre: awake, post: (p, b) => b }, 'feed');
  wrap('feedCandy', { pre: awake, post: (p, b) => b }, 'feed');
  wrap('drink', { pre: awake, post: (p, b) => b }, 'drink');
  const canAct = (p) => p.ceremony === CER_NONE && !p.isEgg();
  wrap('play', { pre: (p) => canAct(p) && !p.sleeping, post: (p, b) => b }, 'play');
  wrap('playResult', { pre: canAct, post: (p, b) => b }, 'play');
  wrap('trainStrength', { pre: canAct, post: (p, b) => b }, 'play');
  wrap('clean', { pre: (p) => p.ceremony === CER_NONE && (p.poops > 0 || p.hygiene < 100), post: (p, b) => b }, 'clean');
  wrap('battleResult', { post: (p, b, args) => args[0] === 1 }, 'win');
  const origSteps = P.addSteps;
  P.addSteps = function (n) {
    const r = origSteps.call(this, n);
    try { advSteps(Math.floor(n)); } catch (e) { /* rien */ }
    return r;
  };
  if (typeof duelResult === 'function') {
    const od = duelResult;
    duelResult = function (...args) { const r = od.apply(this, args); advNote('duel'); return r; };  // eslint-disable-line no-global-assign
  }
}());

// pas : objets trouvés + pension
function advSteps(n) {
  if (!TP_EXT || !(n > 0)) return;
  const a = rollDay(advState());
  // objets : un tirage tous les 1000 pas (30 %)
  a.itemSteps += n;
  let found = null;
  while (a.itemSteps >= 1000) {
    a.itemSteps -= 1000;
    if (random(100) < 30) { found = randomItem(Math.random); addItem(a, found); }
  }
  // pension
  const c = a.care;
  if (c.mons.length === 2 && !c.egg && careEggSpecies(c.mons) > 0) {
    c.steps += n;
    if (c.steps >= CARE_STEPS) {
      c.steps = CARE_STEPS;
      c.egg = careEggSpecies(c.mons);
      c.shiny = random(64) === 0 || c.mons.some((o) => o.shiny) && random(16) === 0;
      setTimeout(() => toast(toCp437(AXT('EGGREADY', uni(dexName(c.egg)))), 3500), 600);
    }
  }
  advSave(a);
  if (found) { toast(gLang >= 6 ? AXT('FOUND', itemName(found)) : toCp437(AXT('FOUND', itemName(found))), 3000); if (typeof haptic === 'function') haptic(40); }
  advCheckBadges();
}

// ------------------------------------------------------------ pension
const PREVO = (() => {
  const m = {};
  for (let d = 1; d <= 151; d++) { const t = DEX_TBL[d].evolvesTo; if (t && !m[t]) m[t] = d; }
  m[134] = m[135] = m[136] = 133;
  return m;
})();
function baseForm(dex) { let d = dex; for (let g = 0; g < 4 && PREVO[d]; g++) d = PREVO[d]; return d; }
function careEggSpecies(mons) {
  if (mons.length < 2) return 0;
  const [a, b] = mons;
  if (DEX_TBL[a.dex].rarity === R_LEGENDARIO || DEX_TBL[b.dex].rarity === R_LEGENDARIO) return 0;
  if (a.dex === DITTO && b.dex === DITTO) return 0;
  if (a.dex === DITTO) return baseForm(b.dex);
  if (b.dex === DITTO) return baseForm(a.dex);
  // la mère (le premier déposé) donne l'espèce, comme dans les jeux
  return baseForm(a.dex);
}

// ------------------------------------------------------------- badges
function duelWins() { const s = prefs.get('duelStats', null); return s && s.won ? s.won : 0; }
const BADGES = [
  { col: '#a8a8a8', need: 10000, val: () => pet.stepsTotal, txt: 'BC_0' },
  { col: '#4f93c4', need: 20, val: () => pet.registeredCount(), txt: 'BC_1' },
  { col: '#f0a030', need: 10, val: () => pet.battlesWon, txt: 'BC_2' },
  { col: '#58b868', need: 15, val: () => advState().chDone, txt: 'BC_3' },
  { col: '#e070b0', need: 3, val: () => duelWins(), txt: 'BC_4' },
  { col: '#e8c040', need: 60, val: () => pet.registeredCount(), txt: 'BC_1' },
  { col: '#e8503a', need: 100000, val: () => pet.stepsTotal, txt: 'BC_0' },
  { col: '#3a9a5a', need: 100, val: () => pet.registeredCount(), txt: 'BC_7', all: true },
];
function badgeOk(i, mask) {
  const b = BADGES[i];
  if (b.val() < b.need) return false;
  if (b.all) for (let k = 0; k < 7; k++) if (!(mask & (1 << k))) return false;
  return true;
}
function advCheckBadges() {
  if (!TP_EXT || pet.awaitingStarter()) return;
  const a = advState();
  let changed = false;
  for (let i = 0; i < BADGES.length; i++) {
    if (a.badges & (1 << i)) continue;
    if (badgeOk(i, a.badges)) {
      a.badges |= (1 << i);
      addItem(a, 'candy');
      changed = true;
      const msg = AXT('NEWBADGE', AXT('B_' + i));
      setTimeout(() => { toast(gLang >= 6 ? msg : toCp437(msg), 3500); sfxPlay(SFX_MEDAL); }, 800);
    }
  }
  if (changed) advSave(a);
}
function badgeCount() { const m = advState().badges; let n = 0; for (let i = 0; i < 8; i++) if (m & (1 << i)) n++; return n; }

// ------------------------------------------------------------- objets
function itemUsable(k) {
  if (pet.isEgg() || pet.ceremony !== CER_NONE || pet.evolving()) return false;
  if (k === 'potion') return pet.energy < 100;
  if (k === 'candy') return pet.level() < 100;
  const m = STONE_EVO[k];
  return !!(m && m[pet.speciesId]);
}
function useItem(k) {
  const a = advState();
  if (!(a.items[k] > 0) || !itemUsable(k)) return false;
  a.items[k]--;
  if (k === 'potion') {
    pet.energy = clamp100(pet.energy + 40);
    pet.joy = clamp100(pet.joy + 5);
    pet.heartUntil = millis() + HEART_MS;
    sfxPlay(SFX_EAT);
  } else if (k === 'candy') {
    pet.ageMinutes += MINUTES_PER_LEVEL - (pet.ageMinutes % MINUTES_PER_LEVEL);
    sfxPlay(SFX_LEVEL);
  } else {
    const old = pet.speciesId;
    const next = STONE_EVO[k][old];
    pet.prevSpeciesId = old;
    pet.speciesId = next;
    pet.registerSpecies(next);
    pet.evolveUntil = millis() + EVOLVE_ANIM_MS;
    sfxPlay(SFX_EVOLVE);
    evoPmd.load(old, pet.shiny);
  }
  pet.save();
  advSave(a);
  advCheckBadges();
  if (TP_EXT) sendPlan(true);
  return true;
}

// ================================================================ fiche
let advTab = 'ch', carePick = false, advMsgT = '';
function openAdventure(tab) {
  if (pet.awaitingStarter()) return;
  advTab = tab || advTab; carePick = false; advMsgT = '';
  rollDay(advState());
  ael('adv').classList.add('open');
  renderAdventure();
}
function closeAdventure() { ael('adv').classList.remove('open'); }
function advMsg(t, ok) { advMsgT = t ? `<div class="status ${ok ? 'ok' : 'err'}">${esc(t)}</div>` : ''; }
function renderAdventure() {
  ael('adv-title').textContent = AXT('TITLE');
  ael('adv-close').textContent = AXT('CLOSE');
  ael('adv-tabs').innerHTML = [['ch', 'T_CH'], ['bag', 'T_BAG'], ['care', 'T_CARE'], ['badge', 'T_BADGE']].map(([k, l]) =>
    `<button type="button" data-tab="${k}" class="${advTab === k ? 'on' : ''}">${esc(AXT(l))}</button>`).join('');
  const body = ael('adv-body');
  const a = rollDay(advState());
  if (advTab === 'ch') body.innerHTML = renderChallenges(a);
  else if (advTab === 'bag') body.innerHTML = renderBag(a);
  else if (advTab === 'care') body.innerHTML = renderCare(a);
  else body.innerHTML = renderBadges(a);
  body.insertAdjacentHTML('afterbegin', advMsgT);
}
function renderChallenges(a) {
  const z = ZONES[weekZone(pet.today())];
  const night = isNightHour(pet.hourNow());
  let h = `<div class="zone"><b>${esc(AXT('ZONE', AXT('Z_' + z.id)))}</b> · ${esc(night ? AXT('NIGHT') : AXT('DAY'))}<div class="small">${esc(AXT('ZONE_HOW'))}</div></div>`;
  h += `<p class="how">${esc(AXT('CH_HOW'))}</p>`;
  const chs = todayChallenges(a.day);
  chs.forEach((c, i) => {
    const v = Math.min(c.n, chValue(c, a));
    const done = v >= c.n;
    const pct = Math.round(v / c.n * 100);
    h += `<div class="chal${done ? ' done' : ''}">
      <div class="ct">${esc(AXT('CH_' + c.id, c.n))}</div>
      <div class="bar"><span style="width:${pct}%"></span></div>
      <div class="cr"><span class="small">${v} / ${c.n} · 🎁 ${esc(itemName(c.reward))}</span>
      ${a.claimed[i] ? `<span class="small ok">${esc(AXT('CLAIMED'))}</span>` : `<button type="button" data-claim="${i}" ${done ? '' : 'disabled'}>${esc(AXT('CLAIM'))}</button>`}</div>
    </div>`;
  });
  const all = a.claimed.every((x) => x);
  h += `<div class="row"><button type="button" data-claim="bonus" class="${all && !a.bonus ? 'main' : ''}" ${all && !a.bonus ? '' : 'disabled'}>${esc(a.bonus ? AXT('CLAIMED') : AXT('BONUS'))}</button></div>`;
  return h;
}
function renderBag(a) {
  let h = `<p class="how">${esc(AXT('BAG_HOW'))}</p>`;
  const have = ITEMS.filter((k) => a.items[k] > 0);
  if (!have.length) return h + `<p class="how">${esc(AXT('BAG_EMPTY'))}</p>`;
  h += have.map((k) => {
    const ok = itemUsable(k);
    const desc = k === 'potion' ? AXT('D_potion') : k === 'candy' ? AXT('D_candy') : AXT('D_stone');
    return `<div class="item"><span class="ii ii-${k}"></span><div class="it"><b>${esc(itemName(k))}</b> ×${a.items[k]}<div class="small">${esc(desc)}</div></div>
      <button type="button" data-use="${k}" ${ok ? '' : 'disabled'} title="${ok ? '' : esc(AXT('NOEFFECT'))}">${esc(AXT('USE'))}</button></div>`;
  }).join('');
  return h;
}
function renderCare(a) {
  const c = a.care;
  let h = `<p class="how">${esc(AXT('CARE_HOW'))}</p>`;
  if (carePick) {
    const all = pet.box.concat(pet.pc).filter((o) => !(typeof tradeLocked === 'function' && tradeLocked(o.uid)));
    if (!all.length) return h + `<p class="how">${esc(AXT('NONEPICK'))}</p>`;
    return h + `<h3>${esc(AXT('PICKONE'))}</h3><div class="grid">${all.map((o) => cardHtml(o, false)).join('')}</div>`;
  }
  h += '<div class="care">';
  for (let i = 0; i < 2; i++) {
    const o = c.mons[i];
    if (o) h += `<div class="cslot">${cardHtml(o, false)}<button type="button" data-wd="${i}">${esc(AXT('WITHDRAW'))}</button></div>`;
    else h += `<div class="cslot"><div class="mon empty">${esc(AXT('SLOT'))}</div><button type="button" class="blue" data-dep="1">${esc(AXT('DEPOSIT'))}</button></div>`;
  }
  h += '</div>';
  if (c.mons.length === 2) {
    const sp = careEggSpecies(c.mons);
    if (!sp) h += `<p class="how">${esc(AXT('NOEGG'))}</p>`;
    else if (c.egg) {
      h += `<p class="how ok">${esc(AXT('EGGREADY', uni(dexName(c.egg))))}</p>
        <div class="row"><button type="button" class="main" data-egg="1">${esc(AXT('TAKEEGG'))}</button></div>`;
    } else {
      h += `<div class="bar wide"><span style="width:${Math.round(c.steps / CARE_STEPS * 100)}%"></span></div><p class="small">${esc(AXT('PROG', c.steps))}</p>`;
    }
  }
  return h;
}
function renderBadges(a) {
  let h = `<p class="how">${esc(AXT('BADGE_HOW'))}</p><div class="badges">`;
  BADGES.forEach((b, i) => {
    const got = !!(a.badges & (1 << i));
    const v = Math.min(b.val(), b.need);
    h += `<div class="badge${got ? ' got' : ''}"><span class="bd" style="--c:${b.col}"></span>
      <b>${esc(AXT('B_' + i))}</b><span class="small">${esc(AXT(b.txt, b.need))}</span>
      ${got ? '' : `<div class="bar"><span style="width:${Math.round(v / b.need * 100)}%"></span></div>`}</div>`;
  });
  return h + '</div>';
}

function advClick(e) {
  const t = e.target.closest('button');
  if (!t || t.disabled) return;
  const a = rollDay(advState());
  advMsgT = '';
  if (t.dataset.tab) { advTab = t.dataset.tab; carePick = false; sfxPlay(SFX_TAP); renderAdventure(); return; }
  if (t.dataset.claim !== undefined) {
    if (t.dataset.claim === 'bonus') {
      if (a.bonus || !a.claimed.every((x) => x)) return;
      a.bonus = 1; addItem(a, 'candy');
      advMsg(AXT('GOT', itemName('candy')), true);
    } else {
      const i = +t.dataset.claim, c = todayChallenges(a.day)[i];
      if (a.claimed[i] || chValue(c, a) < c.n) return;
      a.claimed[i] = 1; a.chDone++; addItem(a, c.reward);
      advMsg(AXT('GOT', itemName(c.reward)), true);
    }
    advSave(a); sfxPlay(SFX_MEDAL); advCheckBadges(); renderAdventure();
    return;
  }
  if (t.dataset.use) {
    const k = t.dataset.use, old = pet.speciesId;
    if (useItem(k)) {
      if (STONE_EVO[k]) { closeAdventure(); toast(toCp437(AXT('EVOLVES', uni(dexName(old)))), 3000); return; }
      advMsg(AXT('USED', itemName(k)), true);
    } else advMsg(AXT('NOEFFECT'), false);
    renderAdventure();
    return;
  }
  if (t.dataset.dep) { carePick = true; renderAdventure(); return; }
  if (t.dataset.uid && carePick) {
    const uid = +t.dataset.uid, at = pet.findInd(uid);
    if (!at || a.care.mons.length >= 2) return;
    const o = pet[at.list].splice(at.i, 1)[0];
    a.care.mons.push(o);
    a.care.steps = 0;
    pet.save(); advSave(a);
    carePick = false; sfxPlay(SFX_TAP); renderAdventure();
    return;
  }
  if (t.dataset.wd !== undefined) {
    const i = +t.dataset.wd, o = a.care.mons[i];
    if (!o) return;
    if (!pet.pcFull()) pet.pc.push({ ...o, t: Date.now() });
    else if (!pet.boxFull()) pet.box.push(o);
    else { advMsg(AXT('NOROOM'), false); renderAdventure(); return; }
    a.care.mons.splice(i, 1);
    if (!a.care.egg) a.care.steps = 0;
    pet.save(); advSave(a); sfxPlay(SFX_TAP); renderAdventure();
    return;
  }
  if (t.dataset.egg) {
    if (!a.care.egg) return;
    if (pet.incubator) { advMsg(AXT('INCBUSY'), false); renderAdventure(); return; }
    pet.incubate(a.care.egg, a.care.shiny);
    a.care.egg = 0; a.care.shiny = false; a.care.steps = 0;
    advSave(a); sfxPlay(SFX_HATCH);
    if (TP_EXT) sendPlan(true);
    renderAdventure();
  }
}
ael('adv').addEventListener('click', advClick);
ael('adv-close').addEventListener('click', closeAdventure);
setTimeout(advCheckBadges, 4000);

// -------------------------------------------- page « Badges » de la Fiche
function renderCardBadges() {
  const m = advState().badges;
  const head = `${toCp437(AXT('T_BADGE')).toUpperCase()} ${badgeCount()}/8`;
  gfx.setTextColor(UI_INK);
  setSize(3);
  setCur(centerX(head, 3), 48);
  printT(head);
  for (let i = 0; i < 8; i++) {
    const cx = 113 + (i % 4) * 80, cy = 140 + Math.floor(i / 4) * 110;
    const got = !!(m & (1 << i));
    const col = got ? hexTo565(BADGES[i].col) : UI_TRACK;
    // octogone approché : cercle + losange
    gfx.fillCircle(cx, cy, 26, col);
    gfx.fillCircle(cx, cy, 14, got ? UI_WHITE : UI_BG_DAY);
    gfx.fillCircle(cx, cy, 8, col);
    const nm = gLang >= 6 ? AXT('B_' + i) : toCp437(AXT('B_' + i)).toUpperCase();
    gfx.setTextColor(got ? UI_INK : UI_TRACK);
    setSize(1);
    setCur(cx - idiv(textW(nm, 1), 2), cy + 34);
    printT(nm);
  }
}
function hexTo565(h) {
  const n = parseInt(h.slice(1), 16);
  return C565((n >> 16) & 255, (n >> 8) & 255, n & 255);
}
