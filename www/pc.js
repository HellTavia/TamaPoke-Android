// TamaPoke Android — PC et espace Échanges (ajout du fork)
//
// PC : stockage des Pokémon capturés ou éclos qui ne sont pas dans l'équipe
// (jusqu'à 240, temps figé comme dans l'équipe). Depuis le PC : envoyer dans
// l'équipe, prendre comme compagnon, échanger, relâcher.
// Échanges : choisir le Pokémon à proposer (équipe ou PC), reprendre un
// échange en cours, historique des échanges.
'use strict';

//        ES, EN, FR, DE, IT, PT, JA, KO
const PX = {
  PC: ['PC', 'PC', 'PC', 'PC', 'PC', 'PC', 'PC', 'PC'],
  SORT_NO: ['N.º', 'No.', 'N°', 'Nr.', 'N.', 'N.º', 'ばんごう', '번호'],
  SORT_LV: ['Nivel', 'Level', 'Niveau', 'Level', 'Livello', 'Nível', 'レベル', '레벨'],
  SORT_NEW: ['Recientes', 'Recent', 'Récents', 'Neueste', 'Recenti', 'Recentes', 'あたらしい', '최근'],
  EMPTY: ['El PC está vacío. Tras una captura, elige «Al PC».', 'The PC is empty. After a catch, choose "To the PC".', 'Le PC est vide. Après une capture, choisis « Au PC ».', 'Der PC ist leer. Nach dem Fangen „Ins PC" wählen.', 'Il PC è vuoto. Dopo una cattura scegli «Nel PC».', 'O PC está vazio. Após uma captura, escolha «No PC».', 'PCは からっぽ', 'PC가 비어 있어요'],
  TO_TEAM: ['Al equipo (%u/6)', 'To the team (%u/6)', "Dans l'équipe (%u/6)", 'Ins Team (%u/6)', 'In squadra (%u/6)', 'Na equipe (%u/6)', 'チームへ（%u/6）', '팀으로 (%u/6)'],
  TAKE: ['Elegir como compañero', 'Make it your partner', 'Prendre comme compagnon', 'Als Partner wählen', 'Scegli come compagno', 'Escolher como parceiro', 'あいぼうに する', '파트너로'],
  TRADE: ['Intercambiar', 'Trade', 'Échanger', 'Tauschen', 'Scambia', 'Trocar', 'こうかん', '교환'],
  FREE: ['Liberar', 'Release', 'Relâcher', 'Freilassen', 'Libera', 'Soltar', 'にがす', '놓아주기'],
  SURE: ['¿Seguro? Pulsa otra vez', 'Sure? Tap again', 'Sûr ? Touche encore', 'Sicher? Nochmal tippen', 'Sicuro? Tocca ancora', 'Certeza? Toque de novo', 'ほんとに？', '정말?'],
  CLOSE: ['Cerrar', 'Close', 'Fermer', 'Schließen', 'Chiudi', 'Fechar', 'とじる', '닫기'],
  TEAMFULL: ['Equipo lleno', 'Team is full', 'Équipe pleine', 'Team voll', 'Squadra piena', 'Equipe cheia', 'チームが いっぱい', '팀이 가득 참'],
  SWAPPED: ['¡%s es tu compañero!', '%s is your partner!', '%s est ton compagnon !', '%s ist dein Partner!', '%s è il tuo compagno!', '%s é seu parceiro!', '%sが あいぼうに！', '%s이(가) 파트너!'],
  INCFULL: ['La incubadora está ocupada', 'Incubator is busy', 'Incubateur occupé', 'Brutkasten belegt', 'Incubatrice occupata', 'Incubadora ocupada', 'ふかそうちが いっぱい', '부화기 사용 중'],
  BUSY: ['Ahora no', 'Not now', 'Pas maintenant', 'Nicht jetzt', 'Non ora', 'Agora não', 'いまは だめ', '지금은 안 돼요'],
  INTRADE: ['En intercambio', 'In a trade', 'En échange', 'Im Tausch', 'In scambio', 'Em troca', 'こうかんちゅう', '교환 중'],
  SEARCH: ['Buscar…', 'Search…', 'Rechercher…', 'Suchen…', 'Cerca…', 'Buscar…', 'さがす…', '검색…'],
  ALLTYPES: ['Todos los tipos', 'All types', 'Tous les types', 'Alle Typen', 'Tutti i tipi', 'Todos os tipos', 'すべての タイプ', '모든 타입'],
  FAVS: ['♥ Favoritos', '♥ Favourites', '♥ Favoris', '♥ Favoriten', '♥ Preferiti', '♥ Favoritos', '♥ おきにいり', '♥ 즐겨찾기'],
  FAV_ON: ['♥ Favorito (protegido)', '♥ Favourite (protected)', '♥ Favori (protégé)', '♥ Favorit (geschützt)', '♥ Preferito (protetto)', '♥ Favorito (protegido)', '♥ おきにいり', '♥ 즐겨찾기 (보호)'],
  FAV_OFF: ['♡ Marcar favorito', '♡ Mark as favourite', '♡ Mettre en favori', '♡ Als Favorit', '♡ Segna preferito', '♡ Marcar favorito', '♡ おきにいりに する', '♡ 즐겨찾기'],
  MULTI: ['Selección múltiple', 'Select several', 'Sélection multiple', 'Mehrfachauswahl', 'Selezione multipla', 'Seleção múltipla', 'まとめて えらぶ', '여러 개 선택'],
  MULTI_END: ['Terminar', 'Done', 'Terminer', 'Fertig', 'Fine', 'Concluir', 'おわる', '완료'],
  MULTI_FREE: ['Liberar %u', 'Release %u', 'Relâcher %u', '%u freilassen', 'Libera %u', 'Soltar %u', '%uひき にがす', '%u마리 놓아주기'],
  MULTI_SURE: ['¿Liberar %u? Pulsa otra vez', 'Release %u? Tap again', 'Relâcher %u ? Touche encore', '%u freilassen? Nochmal tippen', 'Liberare %u? Tocca ancora', 'Soltar %u? Toque de novo', '%uひき にがす？', '%u마리? 다시 누르세요'],
  MULTI_HINT: ['Toca los Pokémon a liberar. Los favoritos y los que están en intercambio no se pueden elegir.', 'Tap the Pokémon to release. Favourites and Pokémon in a trade can\'t be picked.', 'Touche les POKEMON à relâcher. Les favoris et ceux en échange ne peuvent pas être choisis.', 'Tippe die Pokémon zum Freilassen an. Favoriten und Pokémon im Tausch sind gesperrt.', 'Tocca i Pokémon da liberare. Preferiti e Pokémon in scambio sono esclusi.', 'Toque nos Pokémon a soltar. Favoritos e Pokémon em troca ficam de fora.', 'にがす ポケモンを タッチ', '놓아줄 포켓몬을 누르세요'],
  RELEASED: ['%u Pokémon liberados', '%u Pokémon released', '%u POKEMON relâchés', '%u Pokémon freigelassen', '%u Pokémon liberati', '%u Pokémon soltos', '%uひき にがした', '%u마리 놓아줌'],
  NORES: ['Sin resultados', 'No results', 'Aucun résultat', 'Keine Treffer', 'Nessun risultato', 'Nenhum resultado', 'みつからない', '결과 없음'],
  FAVPROT: ['Es un favorito: quítalo de favoritos para liberarlo', 'It\'s a favourite: unmark it to release it', "C'est un favori : retire-le des favoris pour le relâcher", 'Favorit: erst entfernen', 'È un preferito: toglilo dai preferiti', 'É favorito: desmarque para soltar', 'おきにいりは にがせない', '즐겨찾기는 놓아줄 수 없어요'],
  // espace échanges
  TR_TITLE: ['Intercambios', 'Trades', 'Échanges', 'Tausch', 'Scambi', 'Trocas', 'こうかん', '교환'],
  TR_PICK: ['Elige el Pokémon que propones (equipo o PC)', 'Pick the Pokémon to offer (team or PC)', 'Choisis le POKEMON à proposer (équipe ou PC)', 'Wähle das Pokémon zum Tauschen (Team oder PC)', 'Scegli il Pokémon da offrire (squadra o PC)', 'Escolha o Pokémon a oferecer (equipe ou PC)', 'だす ポケモンを えらんでね', '보낼 포켓몬을 고르세요'],
  TR_PARTNER: ['Tu compañero no se puede intercambiar: ponlo antes en el equipo o en el PC.', 'Your partner can\'t be traded: move it to the team or PC first.', "Ton compagnon ne s'échange pas : mets-le d'abord dans l'équipe ou au PC.", 'Dein Partner kann nicht getauscht werden: erst ins Team oder PC.', 'Il compagno non si scambia: mettilo prima in squadra o nel PC.', 'O parceiro não pode ser trocado: coloque-o antes na equipe ou no PC.', 'あいぼうは こうかん できない', '파트너는 교환할 수 없어요'],
  TR_OFFER: ['Proponer %s', 'Offer %s', 'Proposer %s', '%s anbieten', 'Offri %s', 'Oferecer %s', '%sを だす', '%s 보내기'],
  TR_PENDING: ['Intercambio en curso: das %s', 'Trade in progress: you give %s', 'Échange en cours : tu donnes %s', 'Tausch läuft: du gibst %s', 'Scambio in corso: dai %s', 'Troca em andamento: você dá %s', 'こうかんちゅう: %s', '교환 중: %s'],
  TR_RESUME: ['Continuar el intercambio', 'Resume the trade', "Reprendre l'échange", 'Tausch fortsetzen', 'Riprendi lo scambio', 'Retomar a troca', 'こうかんを つづける', '교환 계속'],
  TR_NONE: ['No tienes ningún Pokémon para intercambiar (equipo y PC vacíos).', 'No Pokémon to trade (team and PC are empty).', "Aucun POKEMON à échanger (équipe et PC vides).", 'Kein Pokémon zum Tauschen.', 'Nessun Pokémon da scambiare.', 'Nenhum Pokémon para trocar.', 'こうかん できる ポケモンが いない', '교환할 포켓몬이 없어요'],
  TR_HIST: ['Historial', 'History', 'Historique', 'Verlauf', 'Cronologia', 'Histórico', 'りれき', '기록'],
  TR_LINE: ['%s: diste %s, recibiste %s', '%s: gave %s, got %s', '%s : donné %s, reçu %s', '%s: %s gegeben, %s bekommen', '%s: dato %s, ricevuto %s', '%s: deu %s, recebeu %s', '%s: %s → %s', '%s: %s → %s'],
  TEAM: ['Equipo', 'Team', 'Équipe', 'Team', 'Squadra', 'Equipe', 'チーム', '팀'],
};
const PXT = (k, ...a) => sprintf(PX[k][gLang], ...a);
const pel = (id) => document.getElementById(id);

// ---- utilitaires d'affichage HTML
const thumbUrlCache = new Map();
function thumbUrl(dex, shiny) {
  const key = dex * 2 + (shiny ? 1 : 0);
  if (thumbUrlCache.has(key)) return thumbUrlCache.get(key);
  let src = null;
  if (shiny) {
    src = shinyThumbs.get(dex);  // null tant qu'elle charge : on rafraîchit à l'arrivée
    if (!src) return thumbUrl(dex, false);
  } else {
    const t = thumbs.get(dex);
    if (!t) return '';
    src = cropCanvas(thumbs.canvas(t, false));
  }
  const k = Math.max(1, Math.floor(64 / Math.max(src.width, src.height)));
  const cv = document.createElement('canvas');
  cv.width = src.width * k; cv.height = src.height * k;
  const g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(src, 0, 0, cv.width, cv.height);
  const url = cv.toDataURL('image/png');
  thumbUrlCache.set(key, url);
  return url;
}
window.addEventListener('tp-shiny', (e) => {
  const url = thumbUrl(e.detail, true);
  document.querySelectorAll(`img[data-sh="${e.detail}"]`).forEach((im) => { im.src = url; });
});
function thumbImg(o) { return `<img src="${thumbUrl(o.dex, o.shiny)}" ${o.shiny ? `data-sh="${o.dex}"` : ''} alt="">`; }
function typeLabel(t) {
  const i = TYPE_DATA.types.indexOf(t);
  const arr = TYPE_DATA.names[LANG_CODES[gLang]] || TYPE_DATA.names.EN || [];
  return (i >= 0 && arr[i]) || t;
}
function typeChipsHtml(dex) {
  return monTypes(dex).map((t) => `<span class="tchip" style="background:${css(TYPE_COLORS[t] || UI_TRACK)}">${esc(typeLabel(t))}</span>`).join('');
}
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function indLv(o) { return lvOfAge(o.age); }
function indNameU(o) { return uni(o.nick ? o.nick : dexName(o.dex)); }
function indStats(o) {
  const d = DEX_TBL[o.dex], lv = indLv(o);
  return { atk: calcStat(d.bAtk, o.ga, lv, o.ta || 0), def: calcStat(d.bDef, o.gd, lv, o.td || 0), spe: calcStat(d.bSpe, o.gs, lv, o.ts || 0) };
}
function cardHtml(o, sel, extra, cls) {
  const lock = typeof tradeLocked === 'function' && tradeLocked(o.uid);
  return `<button type="button" class="mon${sel ? ' sel' : ''}${lock ? ' lock' : ''}${cls || ''}" data-uid="${o.uid}">
    ${thumbImg(o)}
    <span class="mn">${o.shiny ? '★ ' : ''}${esc(indNameU(o))}</span>
    <span class="ml">${esc(uni(sprintf(T(S_LVL_FMT), indLv(o))))}${extra || ''}</span>
    ${lock ? `<span class="badge">⇄</span>` : o.fav ? `<span class="badge fav">♥</span>` : ''}
  </button>`;
}

// ------------------------------------------------------------------ PC
let pcSort = 'new', pcSel = 0, pcSure = false, pcQ = '', pcType = '', pcMulti = null, pcMultiSure = false;
function openPC() {
  if (pet.awaitingStarter()) return;
  pcSel = 0; pcSure = false; pcMulti = null; pcMultiSure = false;
  pel('pc-status').textContent = '';
  pel('pc').classList.add('open');
  renderPC();
}
function closePC() { pel('pc').classList.remove('open'); pcMulti = null; }
function pcMsg(t, ok) { const e = pel('pc-status'); e.textContent = t || ''; e.className = 'status' + (t ? (ok ? ' ok' : ' err') : ''); }
// recherche sans accents ni majuscules, dans le nom de l'espèce (langue du jeu + anglais), le surnom et le n°
function fold(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function pcMatch(o) {
  if (pcType === 'fav') { if (!o.fav) return false; }
  else if (pcType && !monTypes(o.dex).includes(pcType)) return false;
  const q = fold(pcQ.trim());
  if (!q) return true;
  if (/^\d+$/.test(q)) return o.dex === +q;
  const hay = [uni(dexName(o.dex)), DEX_TBL[o.dex] && DEX_TBL[o.dex].name, o.nick ? uni(o.nick) : ''].map(fold).join(' ');
  return hay.includes(q);
}
function sortedPC() {
  const list = pet.pc.map((o, i) => ({ o, i })).filter((x) => pcMatch(x.o));
  if (pcSort === 'no') list.sort((a, b) => a.o.dex - b.o.dex || indLv(b.o) - indLv(a.o));
  else if (pcSort === 'lv') list.sort((a, b) => indLv(b.o) - indLv(a.o) || a.o.dex - b.o.dex);
  else list.sort((a, b) => (b.o.t || 0) - (a.o.t || 0));
  return list;
}
function pcCanFree(o) { return !o.fav && !(typeof tradeLocked === 'function' && tradeLocked(o.uid)); }
function renderPCTools() {
  pel('pc-title').textContent = `${PXT('PC')} — ${pet.pc.length}/${PC_SIZE}`;
  pel('pc-close').textContent = PXT('CLOSE');
  pel('pc-sorts').innerHTML = [['no', 'SORT_NO'], ['lv', 'SORT_LV'], ['new', 'SORT_NEW']].map(([k, l]) =>
    `<button type="button" data-sort="${k}" class="${pcSort === k ? 'on' : ''}">${esc(PXT(l))}</button>`).join('');
  const q = pel('pc-q');
  q.placeholder = PXT('SEARCH');
  if (q.value !== pcQ) q.value = pcQ;
  const present = new Set();
  pet.pc.forEach((o) => monTypes(o.dex).forEach((t) => present.add(t)));
  pel('pc-type').innerHTML = `<option value="">${esc(PXT('ALLTYPES'))}</option><option value="fav"${pcType === 'fav' ? ' selected' : ''}>${esc(PXT('FAVS'))}</option>` +
    TYPE_DATA.types.filter((t) => present.has(t) || t === pcType).map((t) => `<option value="${t}"${pcType === t ? ' selected' : ''}>${esc(typeLabel(t))}</option>`).join('');
  const mb = pel('pc-multi');
  mb.textContent = pcMulti ? PXT('MULTI_END') : PXT('MULTI');
  mb.className = pcMulti ? 'on' : '';
  mb.hidden = !pet.pc.length;
}
function renderPC() {
  renderPCTools();
  const grid = pel('pc-grid');
  const bar = pel('pc-multibar');
  if (!pet.pc.length) {
    grid.innerHTML = `<p class="how">${esc(PXT('EMPTY'))}</p>`;
    pel('pc-detail').innerHTML = ''; bar.innerHTML = '';
    return;
  }
  const list = sortedPC();
  grid.innerHTML = list.length ? list.map(({ o }) => cardHtml(o, pcMulti ? pcMulti.has(o.uid) : o.uid === pcSel,
    '', !pcMulti || pcCanFree(o) ? '' : ' dim')).join('') : `<p class="how">${esc(PXT('NORES'))}</p>`;
  if (pcMulti) {
    pel('pc-detail').innerHTML = `<p class="how">${esc(PXT('MULTI_HINT'))}</p>`;
    const n = pcMulti.size;
    bar.innerHTML = `<div class="row"><button type="button" data-act="mfree" class="${pcMultiSure ? 'main' : ''}" ${n ? '' : 'disabled'}>${esc(pcMultiSure ? PXT('MULTI_SURE', n) : PXT('MULTI_FREE', n))}</button></div>`;
  } else {
    bar.innerHTML = '';
    renderPCDetail();
  }
}
function renderPCDetail() {
  const box = pel('pc-detail');
  const at = pcSel ? pet.findInd(pcSel) : null;
  if (!at || at.list !== 'pc') { box.innerHTML = ''; return; }
  const o = pet.pc[at.i];
  const st = indStats(o);
  const lock = typeof tradeLocked === 'function' && tradeLocked(o.uid);
  box.innerHTML = `<div class="detail">
    ${thumbImg(o)}
    <div><b>${o.shiny ? '★ ' : ''}${esc(indNameU(o))}</b> · ${esc(uni(sprintf(T(S_LVL_FMT), indLv(o))))}
      ${o.nick ? `<div class="small">(${esc(uni(dexName(o.dex)))})</div>` : ''}
      <div>${typeChipsHtml(o.dex)}</div>
      <div class="small">${esc(uni(T(S_STAT_ATK)))} ${st.atk} · ${esc(uni(T(S_STAT_DEF)))} ${st.def} · ${esc(uni(T(S_STAT_SPE)))} ${st.spe}</div>
      <div class="small">${knownMoves(o.dex, indLv(o)).map((m) => esc(moveNameU(m))).join(' · ')}</div>
    </div></div>
    ${lock ? `<div class="row"><button type="button" class="blue" data-act="resume">${esc(PXT('TR_RESUME'))}</button></div>` : `
    <div class="row">
      <button type="button" class="on" data-act="team" ${pet.boxFull() ? 'disabled' : ''}>${esc(PXT('TO_TEAM', pet.box.length))}</button>
      <button type="button" data-act="take">${esc(PXT('TAKE'))}</button>
    </div>
    <div class="row">
      <button type="button" data-act="fav" class="${o.fav ? 'fav' : ''}">${esc(o.fav ? PXT('FAV_ON') : PXT('FAV_OFF'))}</button>
    </div>
    <div class="row">
      <button type="button" class="blue" data-act="trade">${esc(PXT('TRADE'))}</button>
      <button type="button" data-act="free" class="${pcSure ? 'main' : ''}" ${o.fav ? 'disabled' : ''}>${esc(pcSure ? PXT('SURE') : PXT('FREE'))}</button>
    </div>`}`;
}
function pcAction(act) {
  if (act === 'mfree') {
    if (!pcMulti || !pcMulti.size) return;
    if (!pcMultiSure) { pcMultiSure = true; renderPC(); return; }
    let n = 0;
    for (const uid of pcMulti) {
      const at = pet.findInd(uid);
      if (at && at.list === 'pc' && pcCanFree(pet.pc[at.i])) { pet.pc.splice(at.i, 1); n++; }
    }
    pet.save();
    sfxPlay(SFX_BYE);
    pcMulti = null; pcMultiSure = false; pcSel = 0;
    pcMsg(PXT('RELEASED', n), true);
    checkIncubator();
    renderPC();
    return;
  }
  const at = pet.findInd(pcSel);
  if (!at || at.list !== 'pc') return;
  const o = pet.pc[at.i];
  pcMsg('');
  if (act === 'resume') { closePC(); openTradeSheet(); return; }
  if (act === 'fav') {
    if (o.fav) delete o.fav; else o.fav = 1;
    pet.save();
    sfxPlay(SFX_TAP);
  } else if (act === 'team') {
    if (pet.pcToBox(at.i)) { sfxPlay(SFX_TAP); pcSel = 0; } else { pcMsg(PXT('TEAMFULL')); sfxPlay(SFX_DENY); }
  } else if (act === 'take') {
    const res = pet.swapWithPC(at.i);
    if (res === 'ok') {
      sfxPlay(SFX_HATCH);
      toast(PXT('SWAPPED', (pet.shiny ? '*' : '') + (pet.nick || dexName(pet.speciesId))), 3000);
      if (TP_EXT) sendPlan(true);
      closePC();
      return;
    }
    pcMsg(res === 'incfull' ? PXT('INCFULL') : PXT('BUSY'));
    sfxPlay(SFX_DENY);
  } else if (act === 'trade') {
    closePC();
    startTrade(o.uid);
    return;
  } else if (act === 'free') {
    if (o.fav) { pcMsg(PXT('FAVPROT')); sfxPlay(SFX_DENY); return; }
    if (!pcSure) { pcSure = true; renderPCDetail(); return; }
    pet.releaseFromPC(at.i);
    sfxPlay(SFX_BYE);
    pcSel = 0;
    checkIncubator();
  }
  pcSure = false;
  renderPC();
}

// ------------------------------------------------------------ échanges
let hubSel = 0;
function openTradeHub() {
  if (pet.awaitingStarter()) return;
  hubSel = 0;
  pel('trades').classList.add('open');
  renderTradeHub();
}
function closeTradeHub() { pel('trades').classList.remove('open'); }
function renderTradeHub() {
  pel('tr-title').textContent = PXT('TR_TITLE');
  pel('tr-close').textContent = PXT('CLOSE');
  const top = pel('tr-top');
  const t = typeof tradeState === 'function' ? tradeState() : null;
  if (t && t.stage !== 'done') {
    top.innerHTML = `<p class="how">${esc(PXT('TR_PENDING', uni((t.ind.shiny ? '★ ' : '') + (t.ind.nick || dexName(t.ind.dex)))))}</p>
      <div class="row"><button type="button" class="main" data-act="resume">${esc(PXT('TR_RESUME'))}</button></div>`;
    pel('tr-pick').innerHTML = '';
  } else {
    const all = pet.box.concat(pet.pc);
    if (!all.length) {
      top.innerHTML = `<p class="how">${esc(PXT('TR_NONE'))}</p><p class="small">${esc(PXT('TR_PARTNER'))}</p>`;
      pel('tr-pick').innerHTML = '';
    } else {
      top.innerHTML = `<p class="how">${esc(PXT('TR_PICK'))}</p><p class="small">${esc(PXT('TR_PARTNER'))}</p>`;
      const sel = hubSel ? pet.findInd(hubSel) : null;
      const selO = sel ? pet[sel.list][sel.i] : null;
      pel('tr-pick').innerHTML =
        (pet.box.length ? `<h3>${esc(PXT('TEAM'))}</h3><div class="grid">${pet.box.map((o) => cardHtml(o, o.uid === hubSel)).join('')}</div>` : '') +
        (pet.pc.length ? `<h3>${esc(PXT('PC'))}</h3><div class="grid">${pet.pc.slice().sort((a, b) => (b.t || 0) - (a.t || 0)).map((o) => cardHtml(o, o.uid === hubSel)).join('')}</div>` : '') +
        `<div class="row"><button type="button" class="main" data-act="offer" ${selO ? '' : 'disabled'}>${esc(selO ? PXT('TR_OFFER', (selO.shiny ? '★ ' : '') + indNameU(selO)) : PXT('TRADE'))}</button></div>`;
    }
  }
  const log = prefs.get('tradeLog', []);
  pel('tr-hist').innerHTML = log.length ? `<h3>${esc(PXT('TR_HIST'))}</h3>` + log.slice().reverse().map((e) => {
    let d = '';
    try { d = new Date(e.t).toLocaleDateString(LOCALES[gLang], { day: 'numeric', month: 'short' }); } catch (x) { d = ''; }
    const who = e.who ? ` (${esc(e.who)})` : '';
    return `<p class="small">${esc(PXT('TR_LINE', d, uni(dexName(e.gave)), uni(dexName(e.got))))}${who}</p>`;
  }).join('') : '';
}

function wirePC() {
  pel('pc-close').addEventListener('click', closePC);
  pel('pc-sorts').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-sort]');
    if (b) { pcSort = b.dataset.sort; renderPC(); }
  });
  pel('pc-q').addEventListener('input', (e) => { pcQ = e.target.value; renderPC(); });
  pel('pc-type').addEventListener('change', (e) => { pcType = e.target.value; renderPC(); });
  pel('pc-multi').addEventListener('click', () => {
    pcMulti = pcMulti ? null : new Set(); pcMultiSure = false; pcSel = 0; pcMsg(''); renderPC();
  });
  pel('pc-multibar').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (b && !b.disabled) pcAction(b.dataset.act);
  });
  pel('pc-grid').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-uid]');
    if (!b) return;
    if (pcMulti) {
      const uid = +b.dataset.uid, at = pet.findInd(uid);
      if (!at || at.list !== 'pc' || !pcCanFree(pet.pc[at.i])) { sfxPlay(SFX_DENY); return; }
      if (pcMulti.has(uid)) pcMulti.delete(uid); else pcMulti.add(uid);
      pcMultiSure = false; sfxPlay(SFX_TAP); renderPC();
      return;
    }
    pcSel = +b.dataset.uid; pcSure = false; pcMsg('');
    sfxPlay(SFX_TAP);
    renderPC();
    pel('pc-detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  pel('pc-detail').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (b && !b.disabled) pcAction(b.dataset.act);
  });
  pel('tr-close').addEventListener('click', closeTradeHub);
  pel('trades').addEventListener('click', (e) => {
    const m = e.target.closest('button[data-uid]');
    if (m && pel('tr-pick').contains(m)) {
      if (typeof tradeLocked === 'function' && tradeLocked(+m.dataset.uid)) return;
      hubSel = +m.dataset.uid; sfxPlay(SFX_TAP); renderTradeHub(); return;
    }
    const b = e.target.closest('button[data-act]');
    if (!b || b.disabled) return;
    if (b.dataset.act === 'resume') { closeTradeHub(); openTradeSheet(); }
    else if (b.dataset.act === 'offer' && hubSel) { closeTradeHub(); startTrade(hubSel); }
  });
}
wirePC();
