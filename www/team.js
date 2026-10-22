// TamaPoke Android — équipe et incubateur (ajout du fork)
//
// L'équipe garde jusqu'à 6 Pokémon « en pension » : leur temps est figé
// (ni faim ni niveau) tant qu'ils ne sont pas ton compagnon. On en change
// quand on veut : le compagnon actuel prend la place de celui qu'on choisit.
// L'incubateur fait éclore l'œuf d'un Pokémon capturé en marchant
// (2 000 / 5 000 / 10 000 pas selon la rareté) ; le bébé rejoint l'équipe.
'use strict';

//        ES, EN, FR, DE, IT, PT, JA, KO
const TMX = {
  TITLE: ['EQUIPO', 'TEAM', 'EQUIPE', 'TEAM', 'SQUADRA', 'EQUIPE', 'チーム', '팀'],
  ACTIVE: ['Compañero', 'Partner', 'Compagnon', 'Partner', 'Compagno', 'Parceiro', 'あいぼう', '파트너'],
  EMPTY: ['libre', 'free', 'libre', 'frei', 'libero', 'livre', 'あき', '빈칸'],
  TAKE: ['ELEGIR', 'CHOOSE', 'PRENDRE', 'WAHLEN', 'SCEGLI', 'ESCOLHER', 'えらぶ', '선택'],
  FREE: ['LIBERAR', 'RELEASE', 'RELACHER', 'FREILASSEN', 'LIBERA', 'SOLTAR', 'にがす', '놓아주기'],
  FAVLOCK: ['♥ FAVORITO', '♥ FAVOURITE', '♥ FAVORI', '♥ FAVORIT', '♥ PREFERITO', '♥ FAVORITO', '♥ おきにいり', '♥ 즐겨찾기'],
  SURE: ['¿SEGURO?', 'SURE?', 'SUR ?', 'SICHER?', 'SICURO?', 'CERTEZA?', 'ほんとに？', '정말?'],
  BACK: ['VOLVER', 'BACK', 'RETOUR', 'ZURUCK', 'INDIETRO', 'VOLTAR', 'もどる', '뒤로'],
  INC: ['INCUBADORA', 'INCUBATOR', 'INCUBATEUR', 'BRUTKASTEN', 'INCUBATRICE', 'INCUBADORA', 'ふかそうち', '부화기'],
  INC_EMPTY: ['Vacía: guarda el huevo de una captura', 'Empty: keep a caught Pokémon\'s egg', 'Vide : garde l\'oeuf d\'une capture', 'Leer: behalte ein Ei nach dem Fangen', 'Vuota: tieni l\'uovo di una cattura', 'Vazia: guarde o ovo de uma captura', 'からっぽ', '비어 있음'],
  INC_STEPS: ['%u / %u pasos', '%u / %u steps', '%u / %u pas', '%u / %u Schritte', '%u / %u passi', '%u / %u passos', '%u / %u ほ', '%u / %u 걸음'],
  INC_READY: ['¡Listo! Libera un sitio', 'Ready! Free a slot', 'Prêt ! Libère une place', 'Bereit! Platz frei machen', 'Pronto! Libera un posto', 'Pronto! Libere uma vaga', 'かえる！ あきを つくって', '준비 완료! 자리를 비워요'],
  HATCHED: ['¡%s nació en la incubadora!', '%s hatched in the incubator!', '%s est né dans l\'incubateur !', '%s ist geschlüpft!', '%s è nato nell\'incubatrice!', '%s nasceu na incubadora!', '%sが ふかした！', '%s 부화!'],
  SWAPPED: ['¡%s es tu compañero!', '%s is your partner!', '%s est ton compagnon !', '%s ist dein Partner!', '%s è il tuo compagno!', '%s é seu parceiro!', '%sが あいぼうに！', '%s이(가) 파트너!'],
  INCFULL: ['La incubadora está ocupada', 'Incubator is busy', 'Incubateur occupé', 'Brutkasten belegt', 'Incubatrice occupata', 'Incubadora ocupada', 'ふかそうちが いっぱい', '부화기 사용 중'],
  TEAMFULL: ['Equipo lleno', 'Team is full', 'Équipe pleine', 'Team voll', 'Squadra piena', 'Equipe cheia', 'チームが いっぱい', '팀이 가득 참'],
  BUSY: ['Ahora no', 'Not now', 'Pas maintenant', 'Nicht jetzt', 'Non ora', 'Agora não', 'いまは だめ', '지금은 안 돼요'],
  TRADE: ['CAMBIAR', 'TRADE', 'ECHANGER', 'TAUSCHEN', 'SCAMBIA', 'TROCAR', 'こうかん', '교환'],
  TOPC: ['AL PC', 'TO PC', 'AU PC', 'INS PC', 'AL PC', 'AO PC', 'PCへ', 'PC로'],
  MOVED_PC: ['%s está en el PC', '%s was sent to the PC', '%s est au PC', '%s ist im PC', '%s è nel PC', '%s foi para o PC', '%sを PCへ', '%s을(를) PC로'],
  PCFULL: ['PC lleno', 'PC is full', 'PC plein', 'PC voll', 'PC pieno', 'PC cheio', 'PCが いっぱい', 'PC가 가득 참'],
  TOPC_HATCH: ['%s nació: está en el PC', '%s hatched: sent to the PC', '%s est né : il est au PC', '%s geschlüpft: im PC', '%s è nato: è nel PC', '%s nasceu: está no PC', '%sが かえった（PCへ）', '%s 부화: PC로'],
  PENDING: ['INTERCAMBIO EN CURSO >', 'TRADE IN PROGRESS >', 'ECHANGE EN COURS >', 'TAUSCH LAUFT >', 'SCAMBIO IN CORSO >', 'TROCA EM ANDAMENTO >', 'こうかんちゅう >', '교환 중 >'],
  // choix après une capture
  WHAT: ['¿Qué hacer?', 'What now?', 'Que faire ?', 'Was nun?', 'Che fare?', 'O que fazer?', 'どうする？', '어떻게 할까요?'],
  KEEP_TEAM: ['AL EQUIPO', 'TO THE TEAM', 'DANS L\'EQUIPE', 'INS TEAM', 'IN SQUADRA', 'NA EQUIPE', 'チームへ', '팀에 넣기'],
  KEEP_PC: ['AL PC', 'TO THE PC', 'AU PC', 'INS PC', 'NEL PC', 'NO PC', 'PCへ', 'PC로'],
  KEEP_EGG: ['SU HUEVO', 'ITS EGG', 'SON OEUF', 'SEIN EI', 'IL SUO UOVO', 'O OVO', 'タマゴを もらう', '알 받기'],
  KEEP_NONE: ['SOLO POKEDEX', 'POKEDEX ONLY', 'JUSTE POKEDEX', 'NUR POKEDEX', 'SOLO POKEDEX', 'SO POKEDEX', 'ずかんだけ', '도감만'],
};
const TMT = (k, ...a) => {
  const v = TMX[k][gLang];
  return sprintf(gLang >= 6 ? v : toCp437(v), ...a);
};

let teamOpen = false, teamSel = -1, teamSure = false;
const TEAM_CELL = 92, TEAM_X = CX - 1.5 * TEAM_CELL - 6, TEAM_Y = 128;
function slotRect(i) {
  const c = i % 3, r = Math.floor(i / 3);
  return { x: TEAM_X + c * (TEAM_CELL + 6), y: TEAM_Y + r * (TEAM_CELL + 6), w: TEAM_CELL, h: TEAM_CELL };
}
function indName(o) { return o.nick ? o.nick : dexName(o.dex); }
function indLevel(o) { return lvOfAge(o.age); }

function openTeam() {
  if (pet.awaitingStarter()) return;
  checkIncubator();
  teamOpen = true; teamSel = -1; teamSure = false;
}

// l'incubateur a fini ? (après des pas, ou quand une place se libère)
function checkIncubator() {
  const born = pet.tryHatchIncubator();
  if (born) {
    sfxPlay(SFX_HATCH);
    toast(TMT(born.where === 'pc' ? 'TOPC_HATCH' : 'HATCHED', (born.shiny ? '*' : '') + dexName(born.dex)), 4000);
  }
}

function drawThumbIn(dex, x, y, w, h, sil, shiny) {
  let cv = shiny && !sil ? shinyThumbs.get(dex) : null;
  if (!cv) {
    const t = thumbs.get(dex);
    if (!t) return;
    cv = thumbs.canvas(t, sil);
  }
  const s = Math.max(1, Math.min(2.5, Math.min(w / cv.width, h / cv.height)));
  gfx.image(cv, x + idiv(w - cv.width * s, 2), y + idiv(h - cv.height * s, 2), cv.width * s, cv.height * s);
}

function renderTeam() {
  gfx.fillScreen(RGB565_BLACK);
  gfx.fillCircle(CX, CY, 231, UI_BG_DAY);
  gfx.setTextColor(UI_INK);
  setSize(3);
  const title = `${TMT('TITLE')} ${pet.box.length}/${BOX_SIZE}`;
  setCur(centerX(title, 3), 36);
  printT(title);

  const pend = typeof tradeState === 'function' && tradeState() && tradeState().stage !== 'done';
  if (pend) {
    gfx.fillRoundRect(113, 94, 240, 26, 10, 0x4C98);
    gfx.setTextColor(UI_WHITE);
    setSize(2);
    setCur(centerX(TMT('PENDING'), 2), 100);
    printT(TMT('PENDING'));
  }
  // compagnon actuel
  setSize(2);
  const act = pet.isEgg() ? T(S_EGG_HDR) : `${pet.shiny ? '*' : ''}${indName({ nick: pet.nick, dex: pet.speciesId })} ${sprintf(T(S_LVL_FMT), pet.level())}`;
  const line = `${TMT('ACTIVE')}: ${act}`;
  gfx.setTextColor(pet.isEgg() ? UI_INK : DEX_TBL[pet.speciesId].accent);
  setCur(centerX(line, 2), 76);
  printT(line);

  // 6 places
  for (let i = 0; i < BOX_SIZE; i++) {
    const r = slotRect(i), o = pet.box[i];
    const sel = i === teamSel;
    gfx.fillRoundRect(r.x, r.y, r.w, r.h, 12, o ? (sel ? lerp565(UI_BAR_OK, UI_WHITE, 5, 8) : UI_WHITE) : UI_BG_DAY);
    gfx.drawRoundRect(r.x, r.y, r.w, r.h, 12, o ? (sel ? UI_BAR_OK : UI_INK) : UI_TRACK);
    if (!o) {
      gfx.setTextColor(UI_TRACK);
      setSize(2);
      setCur(r.x + idiv(r.w - textW(TMT('EMPTY'), 2), 2), r.y + 38);
      printT(TMT('EMPTY'));
      continue;
    }
    drawThumbIn(o.dex, r.x + 4, r.y + 2, r.w - 8, r.h - 26, false, o.shiny);
    const lv = `N${indLevel(o)}`;
    gfx.setTextColor(UI_INK);
    setSize(2);
    setCur(r.x + idiv(r.w - textW(lv, 2), 2), r.y + r.h - 20);
    printT(lv);
    if (o.shiny) { gfx.setTextColor(UI_BAR_WARN); setCur(r.x + r.w - 16, r.y + 4); printT('*'); }
    if (typeof tradeLocked === 'function' && tradeLocked(o.uid)) {
      gfx.fillRoundRect(r.x + 4, r.y + 4, 22, 18, 6, 0x4C98);
      gfx.setTextColor(UI_WHITE); setCur(r.x + 9, r.y + 6); printT('>');
    }
  }

  // incubateur
  const iy = 330;
  gfx.setTextColor(UI_INK);
  setSize(2);
  setCur(centerX(TMT('INC'), 2), iy);
  printT(TMT('INC'));
  const inc = pet.incubator;
  if (!inc) {
    const e = TMT('INC_EMPTY');
    gfx.setTextColor(UI_TRACK);
    setSize(gCjkFont ? 2 : (textW(e, 2) > 300 ? 1 : 2));
    setCur(centerX(e, gCjkFont ? 2 : (textW(e, 2) > 300 ? 1 : 2)), iy + 26);
    printT(e);
  } else {
    drawMap('SPR_EGG', 32, 104, iy + 18, 1, false);
    const bx = 144, bw = 200, by = iy + 24;
    gfx.fillRoundRect(bx, by, bw, 14, 5, UI_TRACK);
    const done = inc.need - inc.left;
    const fw = Math.floor((bw - 4) * done / inc.need);
    if (fw > 0) gfx.fillRoundRect(bx + 2, by + 2, fw, 10, 4, inc.left === 0 ? UI_BAR_WARN : UI_BAR_OK);
    const st = inc.left === 0 ? TMT('INC_READY') : TMT('INC_STEPS', done, inc.need);
    gfx.setTextColor(inc.left === 0 ? UI_BAR_BAD : UI_INK);
    setSize(gCjkFont ? 2 : (textW(st, 2) > 280 ? 1 : 2));
    setCur(centerX(st, textW(st, 2) > 280 && !gCjkFont ? 1 : 2), iy + 46);
    printT(st);
  }

  gfx.setTextColor(UI_TRACK);
  setSize(2);
  setCur(centerX(T(S_BACK), 2), 410);
  printT(T(S_BACK));

  if (teamSel >= 0 && pet.box[teamSel]) drawTeamDetail(pet.box[teamSel]);
}

function drawTeamDetail(o) {
  const d = DEX_TBL[o.dex];
  gfx.fillRoundRect(63, 96, 340, 280, 16, UI_WHITE);
  gfx.drawRoundRect(63, 96, 340, 280, 16, UI_INK);
  drawThumbIn(o.dex, 83, 112, 90, 90, false, o.shiny);
  gfx.setTextColor(d.accent);
  setSize(2);
  const nm = (o.shiny ? '*' : '') + indName(o);
  setCur(186, 122);
  printT(nm);
  gfx.setTextColor(UI_INK);
  setCur(186, 146);
  printT(sprintf(T(S_LVL_FMT), indLevel(o)));
  if (o.nick) { gfx.setTextColor(UI_TRACK); setCur(186, 170); printT(`(${dexName(o.dex)})`); }
  drawTypeChips(186, o.nick ? 192 : 170, o.dex, false);
  const lv = indLevel(o);
  const stats = [[T(S_STAT_ATK), calcStat(d.bAtk, o.ga, lv, o.ta)], [T(S_STAT_DEF), calcStat(d.bDef, o.gd, lv, o.td)],
    [T(S_STAT_SPE), calcStat(d.bSpe, o.gs, lv, o.ts)]];
  gfx.setTextColor(UI_INK);
  stats.forEach(([l, v], k) => { setCur(96 + k * 100, 218); printT(`${l} ${v}`); });
  // boutons (40 px de haut, 3 rangées)
  const btn = (x, y, w, col, txt, tc) => {
    gfx.fillRoundRect(x, y, w, 40, 12, col);
    gfx.setTextColor(tc);
    setSize(2);
    setCur(x + idiv(w - textW(txt, 2), 2), y + 12);
    printT(txt);
  };
  const locked = typeof tradeLocked === 'function' && tradeLocked(o.uid);
  if (locked) {
    btn(83, 240, 300, 0x4C98, TMT('PENDING'), UI_WHITE);
    return;
  }
  btn(83, 240, 300, UI_BAR_OK, TMT('TAKE'), UI_WHITE);
  btn(83, 286, 145, 0x4C98, TMT('TRADE'), UI_WHITE);
  btn(238, 286, 145, pet.pcFull() ? UI_TRACK : C565(0x6a, 0x7a, 0x9c), TMT('TOPC'), UI_WHITE);
  if (o.fav) btn(83, 332, 300, UI_TRACK, TMT('FAVLOCK'), UI_INK);
  else btn(83, 332, 300, teamSure ? UI_BAR_BAD : UI_TRACK, teamSure ? TMT('SURE') : TMT('FREE'), teamSure ? UI_WHITE : UI_INK);
}

function teamTap(x, y) {
  const pend = typeof tradePending === 'function' && tradePending();
  if (pend && teamSel < 0 && y >= 94 && y <= 120 && x >= 113 && x <= 353) { openTradeSheet(); return; }
  if (teamSel >= 0 && pet.box[teamSel]) {
    const o = pet.box[teamSel];
    const done = () => { teamSel = -1; teamSure = false; };
    // le Pokémon en cours d'échange ne bouge pas tant que l'échange n'est pas fini
    if (tradeLocked(o.uid)) {
      if (y >= 240 && y <= 280 && x >= 83 && x <= 383) openTradeSheet();
      done();
      return;
    }
    if (y >= 286 && y <= 326 && x >= 83 && x < 228) {           // échanger
      done();
      startTrade(o.uid);
      return;
    }
    if (y >= 286 && y <= 326 && x >= 238 && x <= 383) {          // au PC
      if (pet.boxToPC(teamSel)) { sfxPlay(SFX_TAP); toast(TMT('MOVED_PC', indName(o)), 2500); }
      else { toast(TMT('PCFULL')); sfxPlay(SFX_DENY); }
      done();
      return;
    }
    if (y >= 240 && y <= 280 && x >= 83 && x <= 383) {           // prendre
      const res = pet.swapWithBox(teamSel);
      if (res === 'ok') {
        sfxPlay(SFX_HATCH);
        toast(TMT('SWAPPED', (pet.shiny ? '*' : '') + indName({ nick: pet.nick, dex: pet.speciesId })), 3000);
        teamOpen = false;
        if (TP_EXT) sendPlan(true);
      } else {
        toast(res === 'incfull' ? TMT('INCFULL') : TMT('BUSY'));
        sfxPlay(SFX_DENY);
      }
      done();
      return;
    }
    if (y >= 332 && y <= 372 && x >= 83 && x <= 383) {          // relâcher (2 touchers)
      if (pet.box[teamSel] && pet.box[teamSel].fav) { sfxPlay(SFX_DENY); return; }  // favori : protégé
      if (!teamSure) { teamSure = true; return; }
      pet.releaseFromBox(teamSel);
      sfxPlay(SFX_BYE);
      done();
      checkIncubator();                                          // une place s'est libérée
      return;
    }
    done();
    return;
  }
  for (let i = 0; i < BOX_SIZE; i++) {
    const r = slotRect(i);
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
      if (pet.box[i]) { teamSel = i; teamSure = false; sfxPlay(SFX_TAP); }
      return;
    }
  }
  teamOpen = false;
}
