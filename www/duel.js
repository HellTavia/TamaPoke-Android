// TamaPoke Android — duel entre amis (ajout du fork)
//
// Pas de réseau : chaque téléphone affiche une « carte de combat » (QR code
// ou code texte) qui décrit son compagnon. Chacun scanne la carte de l'autre
// (ou la colle, reçue par message). Le combat est entièrement déterminé par
// les deux cartes : même graine, même ordre, mêmes dégâts — les deux
// téléphones affichent exactement le même combat, sans être connectés.
'use strict';

// ------------------------------------------------------------------ textes
//        ES, EN, FR, DE, IT, PT, JA, KO
const DX = {
  TITLE: ['Duelo entre amigos', 'Duel with friends', 'Duel entre amis', 'Duell mit Freunden', 'Duello tra amici', 'Duelo entre amigos', 'ともだちと たいせん', '친구와 대결'],
  HOW: ['1. Tu amigo escanea tu QR.  2. Escaneas el suyo.  Los dos veréis el mismo combate.',
    '1. Your friend scans your QR.  2. You scan theirs.  You will both see the same battle.',
    '1. Ton ami scanne ton QR.  2. Tu scannes le sien.  Vous verrez le même combat.',
    '1. Dein Freund scannt deinen QR.  2. Du scannst seinen.  Ihr seht denselben Kampf.',
    '1. Il tuo amico scansiona il tuo QR.  2. Tu scansioni il suo.  Vedrete la stessa lotta.',
    '1. Seu amigo escaneia seu QR.  2. Você escaneia o dele.  Vocês verão a mesma luta.',
    '1. ともだちが きみの QRを よみとる  2. きみが ともだちの QRを よみとる  おなじ たいせんが みられるよ',
    '1. 친구가 내 QR을 스캔  2. 내가 친구 QR을 스캔  둘 다 같은 대결을 봐요'],
  SCAN: ['Escanear', 'Scan', 'Scanner', 'Scannen', 'Scansiona', 'Escanear', 'よみとる', '스캔'],
  STOP: ['Parar', 'Stop', 'Arrêter', 'Stopp', 'Ferma', 'Parar', 'やめる', '중지'],
  PASTE: ['Pegar un código', 'Paste a code', 'Coller un code', 'Code einfügen', 'Incolla un codice', 'Colar um código', 'コードを はりつけ', '코드 붙여넣기'],
  SHARE: ['Compartir mi código', 'Share my code', 'Partager mon code', 'Meinen Code teilen', 'Condividi il mio codice', 'Compartilhar meu código', 'コードを おくる', '내 코드 공유'],
  FIGHT: ['¡LUCHAR!', 'BATTLE!', 'COMBATTRE !', 'KÄMPFEN!', 'LOTTA!', 'LUTAR!', 'たたかう！', '대결!'],
  CLOSE: ['Cerrar', 'Close', 'Fermer', 'Schließen', 'Chiudi', 'Fechar', 'とじる', '닫기'],
  GOT: ['Rival: %s Nv.%u ✓', 'Opponent: %s Lv.%u ✓', 'Adversaire : %s Niv.%u ✓', 'Gegner: %s Lv.%u ✓', 'Avversario: %s Lv.%u ✓', 'Adversário: %s Nv.%u ✓', 'あいて: %s Lv.%u ✓', '상대: %s Lv.%u ✓'],
  WAIT: ['Deja que tu amigo escanee tu QR, luego lucha.', 'Let your friend scan your QR, then battle.', 'Laisse ton ami scanner ton QR, puis combats.', 'Lass deinen Freund deinen QR scannen, dann kämpfe.', 'Lascia che il tuo amico scansioni il tuo QR, poi lotta.', 'Deixe seu amigo escanear seu QR, depois lute.', 'ともだちに QRを よませてから たたかおう', '친구가 내 QR을 스캔한 뒤 대결하세요'],
  BAD: ['Código no válido', 'Invalid code', 'Code invalide', 'Ungültiger Code', 'Codice non valido', 'Código inválido', 'コードが ただしくない', '잘못된 코드'],
  SELF: ['¡Es tu propio código!', "That's your own code!", "C'est ton propre code !", 'Das ist dein eigener Code!', 'È il tuo codice!', 'É o seu próprio código!', 'じぶんの コードだよ！', '내 코드예요!'],
  CAM: ['Permite la cámara y vuelve a tocar Escanear', 'Allow the camera, then tap Scan again', 'Autorise la caméra puis touche Scanner', 'Kamera erlauben, dann erneut Scannen', 'Consenti la fotocamera e tocca di nuovo', 'Permita a câmera e toque em Escanear', 'カメラを きょかしてね', '카메라를 허용해 주세요'],
  NOCAM: ['Cámara no disponible: pega un código', 'No camera: paste a code instead', 'Caméra indisponible : colle un code', 'Keine Kamera: Code einfügen', 'Fotocamera assente: incolla un codice', 'Sem câmera: cole um código', 'カメラが つかえない', '카메라를 쓸 수 없어요'],
  RECORD: ['Duelos: ganados %u, perdidos %u', 'Duels: won %u, lost %u', 'Duels : gagnés %u, perdus %u', 'Duelle: gewonnen %u, verloren %u', 'Duelli: vinti %u, persi %u', 'Duelos: vencidos %u, perdidos %u', 'たいせん: %uしょう %uはい', '대결: %u승 %u패'],
  REWARD: ['Premios hoy: %u/5', 'Rewards today: %u/5', "Récompenses aujourd'hui : %u/5", 'Belohnungen heute: %u/5', 'Premi oggi: %u/5', 'Prêmios hoje: %u/5', 'きょうの ごほうび %u/5', '오늘 보상 %u/5'],
  VS: ['¡Duelo contra %s!', 'Duel vs %s!', 'Duel contre %s !', 'Duell gegen %s!', 'Duello contro %s!', 'Duelo contra %s!', '%sと たいせん！', '%s와 대결!'],
  MSG: ['¡Duelo TamaPoke! Pega este código en Paseo > Duelo: ', 'TamaPoke duel! Paste this code in Walk > Duel: ', 'Duel TamaPoke ! Colle ce code dans Balade > Duel : ', 'TamaPoke-Duell! Füge diesen Code unter Laufen > Duell ein: ', 'Duello TamaPoke! Incolla questo codice in Passeggio > Duello: ', 'Duelo TamaPoke! Cole este código em Passeio > Duelo: ', 'TamaPoke たいせん！ さんぽ > たいせん に はりつけてね: ', 'TamaPoke 대결! 산책 > 대결에 붙여넣기: '],
  VERIF: ['CODIGO %s', 'CHECK %s', 'CODE %s', 'CODE %s', 'CODICE %s', 'CODIGO %s', 'コード %s', '코드 %s'],
  LAST: ['Último duelo: %s, %s, código %s', 'Last duel: %s, %s, code %s', 'Dernier duel : %s, %s, code %s', 'Letztes Duell: %s, %s, Code %s', 'Ultimo duello: %s, %s, codice %s', 'Último duelo: %s, %s, código %s', 'さいごの たいせん: %s %s コード %s', '마지막 대결: %s, %s, 코드 %s'],
  WON: ['ganado', 'won', 'gagné', 'gewonnen', 'vinto', 'vencido', 'かち', '승리'],
  LOSTW: ['perdido', 'lost', 'perdu', 'verloren', 'perso', 'perdido', 'まけ', '패배'],
  CHECKHOW: ['Al final, los dos debéis ver el mismo código: es el mismo combate.', 'At the end you should both see the same code: same battle.', 'À la fin, vous devez voir le même code : c\'est le même combat.', 'Am Ende seht ihr denselben Code: derselbe Kampf.', 'Alla fine vedrete lo stesso codice: stessa lotta.', 'No fim, vocês verão o mesmo código: mesma luta.', 'さいごに おなじ コードなら おなじ たいせん', '마지막에 같은 코드면 같은 대결이에요'],
  NEWCARD: ['Nueva tarjeta', 'New card', 'Nouvelle carte', 'Neue Karte', 'Nuova carta', 'Novo cartão', 'あたらしい カード', '새 카드'],
  NEWCARD_Q: ['Toca otra vez: tus amigos tendrán que volver a escanear.', 'Tap again: friends will need to rescan you.', 'Touche encore : tes amis devront rescanner ton QR.', 'Nochmal tippen: Freunde müssen neu scannen.', 'Tocca ancora: gli amici dovranno riscansionare.', 'Toque de novo: amigos terão que escanear de novo.', 'もういちど タッチ: ともだちは よみなおしが ひつよう', '한 번 더 터치: 친구가 다시 스캔해야 해요'],
  NEWCARD_OK: ['Tarjeta actualizada con tus stats actuales.', 'Card updated with your current stats.', 'Carte mise à jour avec tes stats actuelles.', 'Karte mit aktuellen Werten aktualisiert.', 'Carta aggiornata con le statistiche attuali.', 'Cartão atualizado com seus stats atuais.', 'いまの つよさで カードを こうしん', '현재 능력치로 카드 갱신'],
  TNAME: ['Tu nombre de entrenador', 'Your trainer name', 'Ton nom de dresseur', 'Dein Trainername', 'Il tuo nome allenatore', 'Seu nome de treinador', 'トレーナーの なまえ', '트레이너 이름'],
  SAVE: ['OK', 'OK', 'OK', 'OK', 'OK', 'OK', 'OK', 'OK'],
  FRIENDS: ['Rivales', 'Opponents', 'Adversaires', 'Gegner', 'Avversari', 'Adversários', 'たいせん あいて', '상대'],
  TOTAL: ['Duelos: %u · amigos: %u', 'Duels: %u · friends: %u', 'Duels : %u · amis : %u', 'Duelle: %u · Freunde: %u', 'Duelli: %u · amici: %u', 'Duelos: %u · amigos: %u', '%uかい たいせん（%uにん）', '%u번 대결 (친구 %u명)'],
  ROW: ['Duelos %u · V %u / D %u', 'Duels %u · W %u / L %u', 'Duels %u · V %u / D %u', 'Duelle %u · S %u / N %u', 'Duelli %u · V %u / S %u', 'Duelos %u · V %u / D %u', '%uかい · %uしょう %uはい', '%u번 · %u승 %u패'],
  NOFRIEND: ['Aún no hay duelos', 'No duels yet', 'Aucun duel pour le moment', 'Noch keine Duelle', 'Ancora nessun duello', 'Nenhum duelo ainda', 'まだ たいせんしてない', '아직 대결 없음'],
  FRIEND: ['Amigo %s', 'Friend %s', 'Ami %s', 'Freund %s', 'Amico %s', 'Amigo %s', 'ともだち %s', '친구 %s'],
  ALREADY: ['Este duelo ya se contó', 'This duel was already counted', 'Ce duel est déjà compté', 'Dieses Duell wurde schon gezählt', 'Duello già contato', 'Duelo já contado', 'この たいせんは カウントずみ', '이미 기록된 대결'],
  LASTON: ['último %s', 'last %s', 'dernier %s', 'zuletzt %s', 'ultimo %s', 'último %s', 'さいご %s', '최근 %s'],
  RENAME: ['Nombre para este amigo', 'Name for this friend', 'Surnom pour cet ami', 'Name für diesen Freund', 'Nome per questo amico', 'Nome para este amigo', 'この ともだちの なまえ', '이 친구의 이름'],
  NEED: ['No puede luchar ahora', "Can't battle right now", 'Il ne peut pas combattre maintenant', 'Kann gerade nicht kämpfen', 'Non può lottare ora', 'Não pode lutar agora', 'いまは たたかえない', '지금은 대결할 수 없어요'],
};
Object.assign(DX, {
  TEAM: ['Equipo de duelo: tu compañero + 2', 'Duel team: your partner + 2', 'Équipe de duel : ton compagnon + 2', 'Duell-Team: Partner + 2', 'Squadra da duello: compagno + 2', 'Equipe de duelo: parceiro + 2', 'デュエル チーム: あいぼう＋2', '듀얼 팀: 파트너 + 2'],
  TEAM_HOW: ['Elige 2 Pokémon de tu equipo. Combate 3 contra 3: cada uno usa sus ataques reales.', 'Pick 2 Pokémon from your team. 3-vs-3 battle, each one uses its real moves.', "Choisis 2 POKEMON de ton équipe. Combat 3 contre 3, chacun avec ses vraies attaques.", 'Wähle 2 Pokémon aus deinem Team. 3-gegen-3 mit echten Attacken.', 'Scegli 2 Pokémon della squadra. Lotta 3 contro 3 con le mosse vere.', 'Escolha 2 Pokémon da equipe. Luta 3 contra 3 com golpes reais.', 'チームから 2ひき えらんでね（3たい3）', '팀에서 2마리를 고르세요 (3대3)'],
  TEAM_EMPTY: ['Equipo vacío: duelo 1 contra 1', 'Empty team: 1-vs-1 duel', 'Équipe vide : duel en 1 contre 1', 'Team leer: 1 gegen 1', 'Squadra vuota: 1 contro 1', 'Equipe vazia: 1 contra 1', 'チームが からっぽ: 1たい1', '팀이 비었어요: 1대1'],
  OLDCARD: ['Tarjeta de una versión antigua: duelo 1 contra 1 sin ataques', 'Card from an older version: 1-vs-1 duel without moves', "Carte d'une ancienne version : duel 1 contre 1, sans attaques", 'Karte einer alten Version: 1 gegen 1 ohne Attacken', 'Carta di una vecchia versione: 1 contro 1 senza mosse', 'Cartão de versão antiga: 1 contra 1 sem golpes', 'ふるい カード: 1たい1', '이전 버전 카드: 1대1'],
});
const DXT = (k, ...a) => sprintf(DX[k][gLang], ...a);
const DUEL_BTN = ['DUELO', 'DUEL', 'DUEL', 'DUELL', 'DUELLO', 'DUELO', 'たいせん', '대결'];

// ------------------------------------------------------------ carte de combat
// TPD1-<dex.shiny.lv.atk.def.spe.hp.nonce en base 36>.<surnom>-<contrôle>
const b36 = (n) => Math.max(0, Math.floor(n)).toString(36);
function cardHash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
// v2 (TPD2) : + identifiant de dresseur permanent et nom de dresseur, pour
// reconnaître un ami d'un duel à l'autre. Les cartes TPD1 (v4/v5) restent lues.
function cleanName(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10); }
function trainer() {
  let t = prefs.get('trainer', null);
  if (!t || !t.id) {
    t = { id: 1 + Math.floor(Math.random() * 2147483000), name: '' };
    prefs.put('trainer', t);
    prefs.flush();
  }
  return t;
}
const nickEnc = (n) => (n || '').replace(/\./g, '_').replace(/-/g, '+').replace(/~/g, '+').toUpperCase().replace(/[^A-Z_+]/g, '').slice(0, 11);
const nickDec = (n) => (n || '').replace(/_/g, '.').replace(/\+/g, '-');
function encodeCard(c) {
  const nick = (c.nick || '').replace(/\./g, '_').replace(/-/g, '+');
  let body = [c.dex, c.sh ? 1 : 0, c.lv, c.atk, c.def, c.spe, c.hp, c.n, c.tid].map(b36).join('.') +
    '.' + nick + '.' + cleanName(c.tname);
  // TPD4 (v12) : + 2 POKEMON de l'équipe pour le duel 3 contre 3 avec attaques
  if (c.team) {
    for (const m of c.team) body += '~' + [m.dex, m.sh ? 1 : 0, m.lv, m.atk, m.def, m.spe, m.hp].map(b36).join('.') + '.' + nickEnc(m.nick);
    return `TPD4-${body}-${(cardHash(body) % 1296).toString(36).padStart(2, '0')}`;
  }
  // TPD3 = même carte que TPD2, mais les deux téléphones appliquent les types
  return `TPD3-${body}-${(cardHash(body) % 1296).toString(36).padStart(2, '0')}`;
}
function parseCard(text) {
  text = String(text || '');
  const m4 = /TPD4-((?:[0-9a-z]+\.){9}[A-Z_+]{0,11}\.[A-Z0-9]{0,10})((?:~(?:[0-9a-z]+\.){7}[A-Z_+]{0,11}){0,2})-([0-9a-z]{2})/.exec(text);
  if (m4) return parseCard4(m4);
  let m = /TPD([23])-((?:[0-9a-z]+\.){9}[A-Z_+]{0,11}\.[A-Z0-9]{0,10})-([0-9a-z]{2})/.exec(text);
  const v2 = !!m;
  const rules = m ? +m[1] : 1;
  if (m) m = [m[0], m[2], m[3]];
  if (!m) m = /TPD1-((?:[0-9a-z]+\.){8}[A-Z_+]{0,11})-([0-9a-z]{2})/.exec(text);
  if (!m) return null;
  const body = m[1];
  if ((cardHash(body) % 1296).toString(36).padStart(2, '0') !== m[2]) return null;
  const f = body.split('.');
  const nf = v2 ? 9 : 8;
  const v = f.slice(0, nf).map((x) => parseInt(x, 36));
  const c = { dex: v[0], sh: v[1] === 1, lv: v[2], atk: v[3], def: v[4], spe: v[5], hp: v[6], n: v[7],
    // ancienne carte sans identifiant : le numéro de carte en tient lieu
    tid: v2 ? v[8] : v[7], tname: v2 ? (f[10] || '') : '',
    nick: (f[nf] || '').replace(/_/g, '.').replace(/\+/g, '-'), code: m[0], rules };
  if (!(c.dex >= 1 && c.dex <= 151 && c.lv >= 1 && c.lv <= 999)) return null;
  // garde-fou contre les cartes trafiquées : stats possibles pour cette espèce
  const d = DEX_TBL[c.dex];
  const ok = (st, base) => st >= 1 && st <= Math.ceil(base * 1.1) + c.lv + 100;
  if (!ok(c.atk, d.bAtk) || !ok(c.def, d.bDef) || !ok(c.spe, d.bSpe)) return null;
  const hp0 = battleHp(d.bHp, c.lv);
  if (c.hp < hp0 || c.hp > hp0 + 10) return null;
  return c;
}
function validMon(c) {
  if (!(c.dex >= 1 && c.dex <= 151 && c.lv >= 1 && c.lv <= 999)) return false;
  const d = DEX_TBL[c.dex];
  const ok = (st, base) => st >= 1 && st <= Math.ceil(base * 1.1) + c.lv + 100;
  if (!ok(c.atk, d.bAtk) || !ok(c.def, d.bDef) || !ok(c.spe, d.bSpe)) return false;
  const hp0 = battleHp(d.bHp, c.lv);
  return c.hp >= hp0 && c.hp <= hp0 + 10;
}
function parseCard4(m4) {
  const body = m4[1] + m4[2];
  if ((cardHash(body) % 1296).toString(36).padStart(2, '0') !== m4[3]) return null;
  const f = m4[1].split('.');
  const v = f.slice(0, 9).map((x) => parseInt(x, 36));
  const c = { dex: v[0], sh: v[1] === 1, lv: v[2], atk: v[3], def: v[4], spe: v[5], hp: v[6], n: v[7], tid: v[8],
    nick: nickDec(f[9]), tname: f[10] || '', code: m4[0], rules: 4 };
  if (!validMon(c)) return null;
  c.team = [{ dex: c.dex, sh: c.sh, lv: c.lv, atk: c.atk, def: c.def, spe: c.spe, hp: c.hp, nick: c.nick }];
  for (const seg of m4[2].split('~').slice(1)) {
    const g = seg.split('.');
    const w = g.slice(0, 7).map((x) => parseInt(x, 36));
    const mon = { dex: w[0], sh: w[1] === 1, lv: w[2], atk: w[3], def: w[4], spe: w[5], hp: w[6], nick: nickDec(g[7]) };
    if (!validMon(mon)) return null;
    c.team.push(mon);
  }
  return c;
}
// équipe de duel (v12) : 2 POKEMON de l'équipe choisis dans l'écran Duel
function duelTeamMembers() {
  let uids = prefs.get('duelTeam', null);
  if (!Array.isArray(uids)) uids = pet.box.slice(0, 2).map((o) => o.uid);
  return uids.map((u) => pet.box.find((o) => o.uid === u)).filter(Boolean).slice(0, 2);
}
function memberCard(o) {
  const lv = indLv(o), st = indStats(o);
  return { dex: o.dex, sh: !!o.shiny, lv, atk: st.atk, def: st.def, spe: st.spe,
    hp: Math.min(STAT_MAX, battleHp(DEX_TBL[o.dex].bHp, lv) + Math.min(10, Math.floor((o.bond || 0) / 10))), nick: o.nick || '' };
}
// ma carte : figée 24 h, même si le compagnon évolue entre-temps : ton ami
// doit pouvoir rejouer exactement le même combat que toi. Elle ne se renouvelle
// qu'à l'ouverture de l'écran Duel (jamais au milieu d'un échange) ou à la main.
let duelSessionCard = null;
function myCard(renew = false) {
  if (duelSessionCard && !renew) return duelSessionCard;
  let saved = renew ? null : prefs.get('duelCard', null);
  const now = Date.now();
  if (saved && now - saved.t > 24 * 3600 * 1000) saved = null;
  // œuf ou nouvelle partie (compagnon relâché) : la carte n'a plus de sens
  if (saved && pet.isEgg()) saved = null;
  const tr = trainer();
  // carte d'avant la v6 (sans identifiant) ou nom de dresseur changé : on la refait
  const tm = duelTeamMembers();
  const tmKey = tm.map((o) => o.uid).join(',');
  if (saved && (!/^TPD4-/.test(saved.code) || saved.tname !== tr.name || saved.tm !== tmKey)) saved = null;
  if (!saved) {
    const c = { dex: pet.speciesId, sh: pet.shiny, lv: pet.level(), atk: pet.atkStat(), def: pet.defStat(),
      spe: pet.speStat(), hp: pet.hpMax(), n: 1 + Math.floor(Math.random() * 2147483000), nick: pet.nick || '',
      tid: tr.id, tname: tr.name, team: tm.map(memberCard) };
    saved = { code: encodeCard(c), t: now, dex: c.dex, sh: c.sh, tname: tr.name, tm: tmKey };
    prefs.put('duelCard', saved);
    prefs.flush();
  }
  return parseCard(saved.code);
}

// ------------------------------------------------------- combat déterministe
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// P1 = la carte au plus petit numéro : les deux téléphones font le même calcul
function simulateDuel(a, b) {
  const [p1, p2] = a.n < b.n ? [a, b] : [b, a];
  const rng = mulberry32(cardHash(`${p1.code}|${p2.code}`));
  if ((p1.rules || 1) >= 4 && (p2.rules || 1) >= 4) return simulateTeamDuel(p1, p2, rng);
  const hp = { p1: p1.hp, p2: p2.hp };
  const st = { p1, p2 };
  const useTypes = (p1.rules || 1) >= 3 && (p2.rules || 1) >= 3;
  let turn = p1.spe > p2.spe ? 'p1' : p2.spe > p1.spe ? 'p2' : (rng() < 0.5 ? 'p1' : 'p2');
  const events = [];
  for (let g = 0; g < 80 && hp.p1 > 0 && hp.p2 > 0; g++) {
    const def = turn === 'p1' ? 'p2' : 'p1';
    const crit = rng() < 0.125;
    // types seulement si les deux cartes sont des TPD3 (sinon : même calcul qu'en v4-v6)
    const ba = useTypes ? bestAttack(st[turn].dex, st[def].dex) : { mult: 1 };
    let dmg = Math.floor(st[turn].atk * 22 / (st[def].def + 5) * (85 + Math.floor(rng() * 16)) / 100 * ba.mult);
    if (crit) dmg = Math.floor(dmg * 1.5);
    dmg = Math.max(2, dmg);
    hp[def] = Math.max(0, hp[def] - dmg);
    events.push({ by: turn, dmg, crit, ba });
    turn = def;
  }
  return { p1, p2, events, winner: hp.p1 > 0 ? 'p1' : 'p2' };
}

// v12 : 3 contre 3, attaques de Rouge/Bleu ; mêmes tirages des deux côtés
function simulateTeamDuel(p1, p2, rng) {
  const R = (n) => Math.floor(rng() * n);
  const mk = (e) => ({ ...e, max: e.hp, hp: e.hp, st: newStages(), moves: knownMoves(e.dex, e.lv) });
  const side = { p1: { team: p1.team.map(mk), i: 0 }, p2: { team: p2.team.map(mk), i: 0 } };
  const act = (k) => side[k].team[side[k].i];
  const faster = () => {
    const a = act('p1'), b = act('p2');
    const sa = a.spe * stageMul(a.st.spe), sb = b.spe * stageMul(b.st.spe);
    return sa > sb ? 'p1' : sb > sa ? 'p2' : (R(2) ? 'p1' : 'p2');
  };
  const events = [];
  let turn = faster(), winner = null;
  for (let g = 0; g < 400 && !winner; g++) {
    const other = turn === 'p1' ? 'p2' : 'p1';
    const att = act(turn), def = act(other);
    const crit = R(1000) < 125;
    const m = aiMove(att, def, att.moves, R);
    const ev = useMove(att, def, m, crit, R);
    ev.by = turn;
    events.push(ev);
    if (def.hp <= 0) {
      events.push({ ko: other });
      if (side[other].i + 1 >= side[other].team.length) { winner = turn; break; }
      side[other].i++;
      events.push({ sw: other, i: side[other].i });
      turn = faster();
    } else turn = other;
  }
  if (!winner) {  // garde-fou : le plus de PV restants (en %) gagne
    const left = (k) => side[k].team.reduce((a, x) => a + x.hp / x.max, 0);
    winner = left('p1') >= left('p2') ? 'p1' : 'p2';
  }
  return { p1, p2, events, winner, team: true };
}
function evSide(ev) { return ev.by || ev.ko || ev.sw; }

// code de vérification : identique sur les deux téléphones si et seulement si
// les deux cartes et donc le combat sont les mêmes
const VERIF_ALPHA = 'ACDEFHJKLMNPQRTUVWXY3479';  // sans O/0/I/1 ambigus
function verifCode(sim) {
  let h = cardHash(`${sim.p1.code}|${sim.p2.code}|${sim.winner}|${sim.events.length}`);
  let out = '';
  for (let i = 0; i < 4; i++) { out += VERIF_ALPHA[h % VERIF_ALPHA.length]; h = Math.floor(h / VERIF_ALPHA.length); }
  return out;
}

// ----------------------------------------------------------- récompenses
function duelStats() {
  const s = prefs.get('duelStats', null) || { won: 0, lost: 0, day: 0, rew: 0, seen: [] };
  const d = pet.today();
  if (s.day !== d) { s.day = d; s.rew = 0; s.seen = []; }
  return s;
}
// tableau des adversaires, rangé par identifiant de dresseur
function friendsBook() { return prefs.get('duelFriends', null) || {}; }
function friendLabel(id, f) {
  if (f.alias) return f.alias;
  if (f.name) return f.name;
  return DXT('FRIEND', String(id).slice(-4).toUpperCase());
}
// un même combat (mêmes deux cartes) ne compte qu'une fois dans les stats
function duelResult(win, opp, verif) {
  const s = duelStats();
  const book = friendsBook();
  const key = String(opp.tid);
  const f = book[key] || { name: '', alias: '', n: 0, w: 0, l: 0, last: 0, dex: 0, seen: [] };
  const counted = f.seen.includes(opp.n);
  if (!counted) {
    if (win) { s.won++; f.w++; } else { s.lost++; f.l++; }
    f.n++;
    f.seen.push(opp.n);
    if (f.seen.length > 30) f.seen.shift();
  } else {
    toast(DXT('ALREADY'));
  }
  if (opp.tname) f.name = opp.tname;
  f.last = Date.now();
  f.dex = opp.dex;
  book[key] = f;
  prefs.put('duelFriends', book);
  s.last = { name: friendLabel(key, f), win: !!win, code: verif || '' };
  pet.energy = dropTo(pet.energy, 15, 5);
  pet.fullness = dropTo(pet.fullness, 5, 5);
  pet.water = dropTo(pet.water, 8, 5);
  // 5 duels récompensés par jour, une fois par adversaire
  if (s.rew < 5 && !s.seen.includes(opp.n)) {
    s.rew++;
    s.seen.push(opp.n);
    if (win) {
      pet.joy = clamp100(pet.joy + 15);
      pet.trAtk = Math.min(100, pet.trAtk + 2);
      pet.addBond(3);
      pet.heartUntil = millis() + HEART_MS;
    } else {
      pet.joy = clamp100(pet.joy + 5);       // fair-play
      pet.trDef = Math.min(100, pet.trDef + 1);
    }
  }
  prefs.put('duelStats', s);
  pet.registerCare();
  pet.save();
}

// --------------------------------------------------------- lancer un duel
function canDuel() { return !pet.isEgg() && !pet.sleeping && !pet.ceremony; }
function startDuel(opp) {
  for (const m of (opp.team || [opp])) pet.markSeen(m.dex);  // v19 Pokédex : vus
  const me = myCard();
  if (!me || !canDuel()) { toast(DXT('NEED')); return false; }
  if (pet.energy < 20) { toast(TX('X_TOO_TIRED')); sfxPlay(SFX_DENY); return false; }
  const sim = simulateDuel(me, opp);
  const myRole = sim.p1.code === me.code ? 'p1' : 'p2';
  duelSessionCard = null;  // échange terminé
  const wild = { dex: opp.dex, lv: opp.lv, shiny: opp.sh, atk: opp.atk, def: opp.def, spe: opp.spe,
    hp: opp.hp, max: opp.hp, nick: opp.nick };
  bt = {
    duel: true, sim, myRole, opp, myCard: me, verif: verifCode(sim), phase: 'intro', t0: millis(), wild,
    me: { hp: me.hp, max: me.hp, atk: me.atk, def: me.def, spe: me.spe },
    turn: 'me', applied: false, crit: false, tapped: false, msg: DXT('VS', opp.tname || duelName(opp)), popups: [],
    hurt: { me: 0, wild: 0 }, shownHp: { me: me.hp, wild: opp.hp }, result: 0, ei: 0,
  };
  wildPmd.load(opp.dex, opp.sh);
  duelMePmd.load(me.dex, me.sh);
  battleOpen = true;
  pedOpen = false;
  sfxPlay(SFX_WILD);
  return true;
}
function duelName(c) { return c.nick ? c.nick : dexName(c.dex); }

// --------------------------------------------------------------- l'écran
let duelOpp = null, scanStream = null, scanRaf = 0, camPoll = 0;
function el(id) { return document.getElementById(id); }

function openDuel() {
  if (!canDuel()) { toast(DXT('NEED')); return; }
  duelSessionCard = null;
  const me = myCard();
  if (!me) return;
  duelSessionCard = me;
  newCardArmed = false;
  duelOpp = null;
  const ov = el('duel');
  el('duel-title').textContent = DXT('TITLE');
  el('duel-how').textContent = DXT('HOW');
  el('duel-scan').textContent = DXT('SCAN');
  el('duel-paste').textContent = DXT('PASTE');
  el('duel-share').textContent = DXT('SHARE');
  el('duel-fight').textContent = DXT('FIGHT');
  el('duel-close').textContent = DXT('CLOSE');
  el('duel-new').textContent = DXT('NEWCARD');
  el('duel-check').textContent = DXT('CHECKHOW');
  fillCard(me);
  const s = duelStats();
  el('duel-rec').textContent = `${DXT('RECORD', s.won, s.lost)} · ${DXT('REWARD', s.rew)}`;
  el('duel-last').textContent = s.last
    ? DXT('LAST', uni(s.last.name), s.last.win ? DXT('WON') : DXT('LOSTW'), s.last.code) : '';
  el('duel-tname-lbl').textContent = DXT('TNAME');
  el('duel-tname').value = trainer().name;
  el('duel-tname-ok').textContent = DXT('SAVE');
  renderFriends();
  setDuelStatus('', false);
  el('duel-fight').disabled = true;
  el('duel-pastebox').hidden = true;
  ov.classList.add('open');
}
function fillCard(me) {
  el('duel-code').textContent = me.code;
  const row = (c) => `${uni(duelName(c))} · ${uni(sprintf(T(S_LVL_FMT), c.lv))}  ATK ${c.atk}  DEF ${c.def}  VIT ${c.spe}  PV ${c.hp}`;
  el('duel-me').innerHTML = (me.team || [me]).map((c) => `<div>${esc(row(c))}</div>`).join('');
  drawQr(el('duel-qr'), me.code);
  renderDuelTeam();
}
// choix des 2 équipiers du duel 3 contre 3
function renderDuelTeam() {
  const box = el('duel-team');
  if (!box) return;
  const sel = duelTeamMembers().map((o) => o.uid);
  if (!pet.box.length) { box.innerHTML = `<p class="small">${esc(DXT('TEAM_EMPTY'))}</p>`; return; }
  box.innerHTML = `<h3>${esc(DXT('TEAM'))}</h3><p class="small">${esc(DXT('TEAM_HOW'))}</p><div class="grid">` +
    pet.box.map((o) => cardHtml(o, sel.includes(o.uid))).join('') + '</div>';
}
function toggleDuelMember(uid) {
  let sel = duelTeamMembers().map((o) => o.uid);
  if (sel.includes(uid)) sel = sel.filter((u) => u !== uid);
  else { sel.push(uid); if (sel.length > 2) sel.shift(); }
  prefs.put('duelTeam', sel);
  prefs.flush();
  duelSessionCard = null;
  const me = myCard();
  duelSessionCard = me;
  fillCard(me);
  setDuelStatus(DXT('NEWCARD_OK'), true);
  sfxPlay(SFX_TAP);
}
let newCardArmed = false;
function renewCard() {
  if (!newCardArmed) { newCardArmed = true; setDuelStatus(DXT('NEWCARD_Q'), false); return; }
  newCardArmed = false;
  duelSessionCard = null;
  const me = myCard(true);
  duelSessionCard = me;
  fillCard(me);
  duelOpp = null;
  el('duel-fight').disabled = true;
  setDuelStatus(DXT('NEWCARD_OK'), true);
}
function saveTrainerName() {
  const t = trainer();
  const nm = cleanName(el('duel-tname').value);
  el('duel-tname').value = nm;
  if (nm === t.name) return;
  t.name = nm;
  prefs.put('trainer', t);
  prefs.flush();
  // le nom fait partie de la carte : nouvelle carte (les amis devront rescanner)
  duelSessionCard = null;
  const me = myCard();
  duelSessionCard = me;
  fillCard(me);
  setDuelStatus(DXT('NEWCARD_OK'), true);
}
function renderFriends() {
  const book = friendsBook();
  const ids = Object.keys(book).sort((a, b) => book[b].n - book[a].n || book[b].last - book[a].last);
  const box = el('duel-friends');
  box.innerHTML = '';
  const h = document.createElement('h3');
  h.textContent = ids.length ? `${DXT('FRIENDS')} — ${DXT('TOTAL', ids.reduce((a, k) => a + book[k].n, 0), ids.length)}`
    : DXT('FRIENDS');
  box.appendChild(h);
  if (!ids.length) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = DXT('NOFRIEND');
    box.appendChild(p);
    return;
  }
  let date;
  for (const k of ids) {
    const f = book[k];
    try { date = new Date(f.last).toLocaleDateString(LOCALES[gLang], { day: 'numeric', month: 'short' }); } catch (e) { date = ''; }
    const row = document.createElement('div');
    row.className = 'friend';
    const name = document.createElement('button');
    name.type = 'button';
    name.className = 'fname';
    name.textContent = `${friendLabel(k, f)} ✎`;
    name.title = DXT('RENAME');
    const info = document.createElement('span');
    info.className = 'finfo';
    const pk = f.dex ? uni(dexName(f.dex)) : '';
    info.textContent = `${DXT('ROW', f.n, f.w, f.l)} · ${pk} · ${DXT('LASTON', date)}`;
    const bar = document.createElement('div');
    bar.className = 'fbar';
    const fill = document.createElement('i');
    fill.style.width = `${f.n ? Math.round(100 * f.w / f.n) : 0}%`;
    bar.appendChild(fill);
    name.addEventListener('click', () => {
      // surnom local pour cet ami (vide = son nom de dresseur)
      const inp = document.createElement('input');
      inp.className = 'falias';
      inp.maxLength = 12;
      inp.value = f.alias || f.name || '';
      inp.placeholder = DXT('RENAME');
      name.replaceWith(inp);
      inp.focus();
      const done = () => {
        const b = friendsBook();
        if (b[k]) { b[k].alias = inp.value.trim().slice(0, 12); prefs.put('duelFriends', b); prefs.flush(); }
        renderFriends();
      };
      inp.addEventListener('blur', done);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
    });
    row.appendChild(name);
    row.appendChild(info);
    row.appendChild(bar);
    box.appendChild(row);
  }
}
function closeDuel() {
  stopScan();
  el('duel').classList.remove('open');
}
function setDuelStatus(text, ok) {
  const st = el('duel-status');
  st.textContent = text;
  st.className = ok ? 'ok' : (text ? 'err' : '');
}
function acceptCode(text) {
  const c = parseCard(text);
  const me = myCard();
  if (!c) { setDuelStatus(DXT('BAD'), false); sfxPlay(SFX_DENY); return false; }
  if (me && (c.n === me.n || c.tid === me.tid)) { setDuelStatus(DXT('SELF'), false); return false; }
  duelOpp = c;
  const more = c.team && c.team.length > 1 ? ' + ' + c.team.slice(1).map((x) => uni(duelName(x))).join(', ') : '';
  const old = (c.rules || 1) < 4 ? `  (${DXT('OLDCARD')})` : '';
  setDuelStatus(`${DXT('GOT', uni(duelName(c)), c.lv)}${more}${old}  —  ${DXT('WAIT')}`, true);
  el('duel-fight').disabled = false;
  sfxPlay(SFX_TAP);
  return true;
}

function drawQr(cv, text) {
  const q = window.qrcode(0, 'M');
  q.addData(text);
  q.make();
  const n = q.getModuleCount(), m = 3;
  const cells = n + 2 * m;
  const px = Math.max(2, Math.floor(200 * (window.devicePixelRatio || 1) / cells));
  cv.width = cv.height = cells * px;
  const g = cv.getContext('2d');
  g.fillStyle = '#fff';
  g.fillRect(0, 0, cv.width, cv.height);
  g.fillStyle = '#000';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) g.fillRect((c + m) * px, (r + m) * px, px, px);
}

async function startScan() {
  if (scanStream) { stopScan(); return; }
  try {
    if (window.TPStore && window.TPStore.cameraState && window.TPStore.cameraState() !== 1) {
      window.TPStore.askCamera();
      setDuelStatus(DXT('CAM'), false);
      // la permission revient quand l'utilisateur répond : on relance tout seul
      clearInterval(camPoll);
      let tries = 0;
      camPoll = setInterval(() => {
        if (++tries > 60) { clearInterval(camPoll); return; }
        if (window.TPStore.cameraState() === 1) { clearInterval(camPoll); setDuelStatus('', false); startScan(); }
      }, 500);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('no camera');
    scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
  } catch (e) {
    scanStream = null;
    setDuelStatus(DXT('NOCAM'), false);
    return;
  }
  const v = el('duel-video');
  v.srcObject = scanStream;
  v.hidden = false;
  el('duel-scan').textContent = DXT('STOP');
  try { await v.play(); } catch (e) { /* lecture auto */ }
  const work = document.createElement('canvas');
  const g = work.getContext('2d', { willReadFrequently: true });
  let last = 0;
  const tick = (t) => {
    if (!scanStream) return;
    scanRaf = requestAnimationFrame(tick);
    if (t - last < 120 || v.readyState < 2) return;
    last = t;
    const s = Math.min(1, 480 / Math.max(v.videoWidth, v.videoHeight));
    work.width = Math.max(1, Math.floor(v.videoWidth * s));
    work.height = Math.max(1, Math.floor(v.videoHeight * s));
    g.drawImage(v, 0, 0, work.width, work.height);
    const img = g.getImageData(0, 0, work.width, work.height);
    const res = window.jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' });
    if (res && res.data && /TPD[1234]-/.test(res.data)) {
      if (acceptCode(res.data)) stopScan();
    }
  };
  scanRaf = requestAnimationFrame(tick);
}
function stopScan() {
  cancelAnimationFrame(scanRaf);
  clearInterval(camPoll);
  if (scanStream) { scanStream.getTracks().forEach((t) => t.stop()); scanStream = null; }
  const v = el('duel-video');
  if (v) { v.hidden = true; v.srcObject = null; }
  const b = el('duel-scan');
  if (b) b.textContent = DXT('SCAN');
}
function shareCode() {
  const me = myCard();
  if (!me) return;
  const msg = DXT('MSG') + me.code;
  try {
    if (window.TPStore && window.TPStore.shareText) { window.TPStore.shareText(msg); return; }
    if (navigator.share) { navigator.share({ text: msg }); return; }
    if (navigator.clipboard) navigator.clipboard.writeText(msg);
  } catch (e) { /* rien */ }
}

function wireDuel() {
  el('duel-scan').addEventListener('click', () => { audio.ensure(); startScan(); });
  el('duel-share').addEventListener('click', shareCode);
  el('duel-paste').addEventListener('click', () => {
    const box = el('duel-pastebox');
    box.hidden = !box.hidden;
    if (!box.hidden) el('duel-input').focus();
  });
  el('duel-input').addEventListener('input', (e) => { if (/TPD[1234]-/.test(e.target.value)) acceptCode(e.target.value); });
  el('duel-close').addEventListener('click', closeDuel);
  el('duel-new').addEventListener('click', renewCard);
  el('duel-team').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-uid]');
    if (b) toggleDuelMember(+b.dataset.uid);
  });
  el('duel-tname-ok').addEventListener('click', saveTrainerName);
  el('duel-tname').addEventListener('keydown', (e) => { if (e.key === 'Enter') saveTrainerName(); });
  el('duel-fight').addEventListener('click', () => {
    if (!duelOpp) return;
    const opp = duelOpp;
    closeDuel();
    startDuel(opp);
  });
}
wireDuel();
