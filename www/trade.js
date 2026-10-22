// TamaPoke Android — échange de Pokémon entre amis (ajout du fork)
//
// Sans réseau, en deux temps pour ne rien perdre ni dupliquer par accident :
//  1. OFFRE : chacun choisit un Pokémon de son équipe ; il est verrouillé et
//     son QR « offre » (TPT1) s'affiche. Chacun scanne l'offre de l'autre.
//  2. CONFIRMATION : chaque téléphone affiche alors un petit QR de confirmation
//     (TPK1) calculé à partir des deux offres. Chacun scanne celui de l'autre :
//     l'échange s'applique seulement à ce moment-là.
// Après l'échange, le QR de confirmation reste affiché pour que l'ami puisse
// encore le scanner. Une offre déjà reçue ne peut pas être reçue deux fois.
// Les évolutions par échange de la 1re génération s'appliquent à l'arrivée.
'use strict';

//        ES, EN, FR, DE, IT, PT, JA, KO
const TRX = {
  TITLE: ['Intercambio', 'Trade', 'Échange', 'Tausch', 'Scambio', 'Troca', 'こうかん', '교환'],
  STEP1: ['1. Escanead la OFERTA del otro', '1. Scan each other\'s OFFER', "1. Scannez l'OFFRE de l'autre", '1. Scannt gegenseitig das ANGEBOT', "1. Scansionate l'OFFERTA dell'altro", '1. Escaneiem a OFERTA um do outro', '1. おたがいの オファーを よみとる', '1. 서로의 제안을 스캔'],
  STEP2: ['2. Escanead la CONFIRMACIÓN del otro', '2. Scan each other\'s CONFIRMATION', '2. Scannez la CONFIRMATION de l\'autre', '2. Scannt gegenseitig die BESTÄTIGUNG', "2. Scansionate la CONFERMA dell'altro", '2. Escaneiem a CONFIRMAÇÃO um do outro', '2. おたがいの かくにんを よみとる', '2. 서로의 확인을 스캔'],
  DONE: ['¡Intercambio hecho! Deja este QR hasta que tu amigo termine.', 'Trade done! Keep this QR until your friend is done.', "Échange fait ! Laisse ce QR affiché jusqu'à ce que ton ami ait fini.", 'Tausch fertig! Lass diesen QR, bis dein Freund fertig ist.', 'Scambio fatto! Tieni questo QR finché il tuo amico non ha finito.', 'Troca feita! Deixe este QR até seu amigo terminar.', 'こうかん かんりょう！ ともだちが おわるまで この QRを ひょうじ', '교환 완료! 친구가 끝날 때까지 이 QR을 보여주세요'],
  GIVE: ['Das: %s', 'You give: %s', 'Tu donnes : %s', 'Du gibst: %s', 'Dai: %s', 'Você dá: %s', 'あげる: %s', '줄 것: %s'],
  GET: ['Recibes: %s', 'You get: %s', 'Tu reçois : %s', 'Du bekommst: %s', 'Ricevi: %s', 'Você recebe: %s', 'もらう: %s', '받을 것: %s'],
  FROM: ['de %s', 'from %s', 'de %s', 'von %s', 'da %s', 'de %s', '%s から', '%s에게서'],
  SCAN: ['Escanear', 'Scan', 'Scanner', 'Scannen', 'Scansiona', 'Escanear', 'よみとる', '스캔'],
  STOP: ['Parar', 'Stop', 'Arrêter', 'Stopp', 'Ferma', 'Parar', 'やめる', '중지'],
  PASTE: ['Pegar', 'Paste', 'Coller', 'Einfügen', 'Incolla', 'Colar', 'はりつけ', '붙여넣기'],
  SHARE: ['Compartir', 'Share', 'Partager', 'Teilen', 'Condividi', 'Compartilhar', 'おくる', '공유'],
  CANCEL: ['Cancelar el intercambio', 'Cancel the trade', "Annuler l'échange", 'Tausch abbrechen', 'Annulla lo scambio', 'Cancelar a troca', 'こうかんを やめる', '교환 취소'],
  CANCEL_Q: ['¿Seguro? Si tu amigo ya terminó, tendría una copia. Pulsa otra vez.', 'Sure? If your friend already finished, they would keep a copy. Tap again.', "Sûr ? Si ton ami a déjà fini, il garderait une copie. Touche encore.", 'Sicher? Ist dein Freund schon fertig, behält er eine Kopie. Nochmal tippen.', "Sicuro? Se il tuo amico ha già finito, terrebbe una copia. Tocca ancora.", 'Certeza? Se seu amigo já terminou, ele ficaria com uma cópia. Toque de novo.', 'ほんとに？ ともだちが おわっていたら コピーが のこるよ', '정말? 친구가 이미 끝냈다면 복사본이 남아요'],
  CLOSE: ['Cerrar', 'Close', 'Fermer', 'Schließen', 'Chiudi', 'Fechar', 'とじる', '닫기'],
  BAD: ['Código no válido', 'Invalid code', 'Code invalide', 'Ungültiger Code', 'Codice non valido', 'Código inválido', 'コードが ただしくない', '잘못된 코드'],
  SELF: ['¡Es tu propia oferta!', "That's your own offer!", "C'est ta propre offre !", 'Das ist dein eigenes Angebot!', 'È la tua offerta!', 'É a sua própria oferta!', 'じぶんの オファーだよ', '내 제안이에요'],
  ALREADY: ['Esta oferta ya se recibió', 'This offer was already received', 'Cette offre a déjà été reçue', 'Dieses Angebot wurde schon empfangen', 'Offerta già ricevuta', 'Esta oferta já foi recebida', 'この オファーは うけとりずみ', '이미 받은 제안'],
  WRONGK: ['Esta confirmación no es de este intercambio', "This confirmation isn't for this trade", "Cette confirmation ne correspond pas à cet échange", 'Diese Bestätigung passt nicht', 'Questa conferma non corrisponde', 'Esta confirmação não é desta troca', 'この かくにんは ちがう こうかん', '다른 교환의 확인이에요'],
  NEEDOFFER: ['Primero escanea su oferta', 'Scan their offer first', "Scanne d'abord son offre", 'Erst sein Angebot scannen', "Prima scansiona la sua offerta", 'Escaneie a oferta primeiro', 'さきに オファーを よみとって', '먼저 제안을 스캔하세요'],
  EVOLVED: ['¡%s evolucionó en %s!', '%s evolved into %s!', '%s a évolué en %s !', '%s hat sich zu %s entwickelt!', '%s si è evoluto in %s!', '%s evoluiu para %s!', '%sは %sに しんかした！', '%s이(가) %s(으)로 진화했다!'],
  ARRIVED: ['¡%s llegó a tu equipo!', '%s joined your team!', '%s a rejoint ton équipe !', '%s ist in deinem Team!', '%s è nella tua squadra!', '%s entrou na sua equipe!', '%sが チームに きた！', '%s이(가) 팀에 왔다!'],
  TRUST: ['Sin conexión, el intercambio se basa en la confianza: id hasta el final los dos.', 'Offline trading relies on trust: both of you go to the end.', "Hors ligne, l'échange repose sur la confiance : allez tous les deux jusqu'au bout.", 'Offline beruht der Tausch auf Vertrauen: macht beide bis zum Ende.', 'Offline lo scambio si basa sulla fiducia: arrivate entrambi alla fine.', 'Offline, a troca depende de confiança: vão os dois até o fim.', 'オフラインの こうかんは しんらいで なりたつよ', '오프라인 교환은 신뢰가 필요해요'],
  MSG: ['Intercambio TamaPoke: pega esto en Equipo > Intercambio: ', 'TamaPoke trade: paste this in Team > Trade: ', 'Échange TamaPoke : colle ceci dans Équipe > Échange : ', 'TamaPoke-Tausch: in Team > Tausch einfügen: ', 'Scambio TamaPoke: incolla in Squadra > Scambio: ', 'Troca TamaPoke: cole em Equipe > Troca: ', 'TamaPoke こうかん: ', 'TamaPoke 교환: '],
};
const TRT = (k, ...a) => sprintf(TRX[k][gLang], ...a);
const tel = (id) => document.getElementById(id);
const TRADE_EVO = { 64: 65, 67: 68, 75: 76, 93: 94 };  // Kadabra, Machopeur, Gravalanch, Spectrum

// ------------------------------------------------------------- codes
function encodeOffer(o) {
  const tr = trainer();
  const nick = cleanName(o.nick || '');
  const v = [o.nonce, tr.id, o.ind.dex, o.ind.shiny ? 1 : 0, o.ind.age, o.ind.ga, o.ind.gd, o.ind.gs,
    o.ind.ta || 0, o.ind.td || 0, o.ind.ts || 0].map(b36).join('.');
  const body = `${v}.${nick}.${cleanName(tr.name)}`;
  return `TPT1-${body}-${(cardHash(body) % 1296).toString(36).padStart(2, '0')}`;
}
function parseOffer(text) {
  const m = /TPT1-((?:[0-9a-z]+\.){11}[A-Z0-9]{0,10}\.[A-Z0-9]{0,10})-([0-9a-z]{2})/.exec(String(text || ''));
  if (!m || (cardHash(m[1]) % 1296).toString(36).padStart(2, '0') !== m[2]) return null;
  const f = m[1].split('.');
  const v = f.slice(0, 11).map((x) => parseInt(x, 36));
  const o = { code: m[0], nonce: v[0], tid: v[1], dex: v[2], shiny: v[3] === 1, age: v[4],
    ga: v[5], gd: v[6], gs: v[7], ta: v[8], td: v[9], ts: v[10], nick: f[11] || '', tname: f[12] || '' };
  const okG = (g) => g >= 80 && g <= 110, okT = (t) => t >= 0 && t <= 100;
  if (!(o.dex >= 1 && o.dex <= 151) || o.age > 999 * 60 || !okG(o.ga) || !okG(o.gd) || !okG(o.gs) ||
      !okT(o.ta) || !okT(o.td) || !okT(o.ts)) return null;
  return o;
}
function pairKey(a, b) { return [a, b].sort().join('|'); }
// la confirmation prouve « j'ai bien reçu ton offre » (empreinte des deux
// offres) et contient aussi MON offre : si l'ami ne l'avait pas encore
// scannée, la confirmation suffit (pas de blocage si l'un a scanné avant l'autre)
function confirmCode(myOffer, theirOffer) {
  const h = cardHash(pairKey(myOffer, theirOffer));
  return `TPK1-${(h >>> 0).toString(36)}~${myOffer}`;
}
function parseConfirm(text) {
  const m = /TPK1-([0-9a-z]+)~(TPT1-\S+)/.exec(String(text || ''));
  if (!m) return null;
  const offer = parseOffer(m[2]);
  return offer ? { h: m[1], offer } : null;
}

// ------------------------------------------------------------- état
// prefs.trade = { uid, ind, nonce, code, their, stage: 'offer'|'confirm'|'done', confirm }
// (le Pokémon offert est suivi par son identifiant : il peut être dans l'équipe ou au PC)
function tradeState() { return prefs.get('trade', null); }
function setTradeState(t) { prefs.put('trade', t); prefs.flush(); }
function tradePending() { const t = tradeState(); return !!(t && t.stage !== 'done'); }
function tradeLocked(uid) {
  const t = tradeState();
  return !!(uid && t && t.stage !== 'done' && t.uid === uid);
}

function startTrade(uid) {
  const cur = tradeState();
  if (cur && cur.stage !== 'done') { openTradeSheet(); return; }
  const at = pet.findInd(uid);
  if (!at) return;
  const ind = pet[at.list][at.i];
  const nonce = 1 + Math.floor(Math.random() * 2147483000);
  const t = { uid, nonce, ind: JSON.parse(JSON.stringify(ind)), stage: 'offer', their: null, confirm: null };
  t.code = encodeOffer({ nonce, ind, nick: ind.nick });
  setTradeState(t);
  openTradeSheet();
}

// l'individu offert est-il toujours à sa place ? (sinon l'échange est caduc)
function offeredStillThere(t) {
  // compatibilité avec un échange commencé en v8 (repéré par sa place dans l'équipe)
  if (!t.uid && t.slot !== undefined && pet.box[t.slot]) { t.uid = pet.box[t.slot].uid; }
  const at = pet.findInd(t.uid);
  if (!at) return null;
  const o = pet[at.list][at.i];
  return (o.dex === t.ind.dex && o.age === t.ind.age && o.ga === t.ind.ga && o.gd === t.ind.gd) ? at : null;
}

function acceptOffer(text) {
  const t = tradeState();
  const o = parseOffer(text);
  if (!o) { setTradeStatus(TRT('BAD'), false); sfxPlay(SFX_DENY); return false; }
  if (o.nonce === t.nonce || o.tid === trainer().id) { setTradeStatus(TRT('SELF'), false); return false; }
  const seen = prefs.get('tradeSeen', []);
  if (seen.includes(o.nonce)) { setTradeStatus(TRT('ALREADY'), false); return false; }
  t.their = o;
  t.stage = 'confirm';
  t.confirm = confirmCode(t.code, o.code);
  setTradeState(t);
  sfxPlay(SFX_TAP);
  renderTradeSheet();
  return true;
}
function acceptConfirm(text) {
  const t = tradeState();
  const c = parseConfirm(text);
  if (!c) { setTradeStatus(TRT('BAD'), false); return false; }
  const o = c.offer;
  if (o.nonce === t.nonce || o.tid === trainer().id) { setTradeStatus(TRT('SELF'), false); return false; }
  if (t.their && t.their.code !== o.code) { setTradeStatus(TRT('WRONGK'), false); sfxPlay(SFX_DENY); return false; }
  // l'empreinte doit porter sur MON offre actuelle : l'ami a bien reçu celle-ci
  const expect = (cardHash(pairKey(t.code, o.code)) >>> 0).toString(36);
  if (c.h !== expect) { setTradeStatus(TRT('WRONGK'), false); sfxPlay(SFX_DENY); return false; }
  if (!t.their) {
    const seen = prefs.get('tradeSeen', []);
    if (seen.includes(o.nonce)) { setTradeStatus(TRT('ALREADY'), false); return false; }
    t.their = o;
  }
  t.confirm = confirmCode(t.code, o.code);
  applyTrade(t);
  return true;
}
function applyTrade(t) {
  const at = offeredStillThere(t);
  if (!at) { setTradeStatus(TRT('BAD'), false); return; }
  const o = t.their;
  // le Pokémon reçu : ses gènes, son entraînement, son niveau ; besoins remis
  // à neuf, lien et médailles à zéro (nouveau dresseur)
  let dex = o.dex;
  const ind = Pet.freshIndividual(dex, o.shiny, 1, [o.ga, o.gd, o.gs]);
  ind.age = o.age; ind.ta = o.ta; ind.td = o.td; ind.ts = o.ts; ind.nick = o.nick;
  let evoMsg = '';
  if (TRADE_EVO[dex]) {
    const to = TRADE_EVO[dex];
    evoMsg = TRT('EVOLVED', uni(dexName(dex)), uni(dexName(to)));
    dex = to;
    ind.dex = to;
    ind.evdl = 0;
  }
  ind.t = Date.now();
  pet[at.list][at.i] = ind;  // il prend la place du Pokémon donné (équipe ou PC)
  for (const d of [o.dex, dex]) {
    pet.dexReg[(d - 1) >> 3] |= (1 << ((d - 1) & 7));
    if (o.shiny) pet.dexShinyReg[(d - 1) >> 3] |= (1 << ((d - 1) & 7));
  }
  pet.save();
  const seen = prefs.get('tradeSeen', []);
  seen.push(o.nonce);
  prefs.put('tradeSeen', seen.slice(-50));
  const log = prefs.get('tradeLog', []);
  log.push({ t: Date.now(), gave: t.ind.dex, got: dex, who: o.tname || '' });
  prefs.put('tradeLog', log.slice(-30));
  t.stage = 'done';
  t.result = evoMsg || TRT('ARRIVED', uni((o.shiny ? '*' : '') + (o.nick || dexName(dex))));
  setTradeState(t);
  sfxPlay(TRADE_EVO[o.dex] ? SFX_EVOLVE : SFX_WIN);
  haptic(120);
  renderTradeSheet();
}
function cancelTrade() {
  prefs.put('trade', null);
  prefs.flush();
  closeTrade();
}

// ------------------------------------------------------------- écran
let tradeScan = null, tradeRaf = 0, tradeCamPoll = 0, cancelArmed = false;
function setTradeStatus(text, ok) {
  const st = tel('trade-status');
  st.textContent = text;
  st.className = 'status ' + (ok ? 'ok' : (text ? 'err' : ''));
}
function openTradeSheet() {
  teamOpen = false;
  cancelArmed = false;
  tel('trade').classList.add('open');
  renderTradeSheet();
}
function closeTrade() {
  stopTradeScan();
  tel('trade').classList.remove('open');
  const t = tradeState();
  if (t && t.stage === 'done') { prefs.put('trade', null); prefs.flush(); }
}
function indLabel(dex, shiny, nick, age) {
  return `${shiny ? '*' : ''}${uni(nick || dexName(dex))} ${uni(sprintf(T(S_LVL_FMT), lvOfAge(age)))}`;
}
function renderTradeSheet() {
  const t = tradeState();
  if (!t) { closeTrade(); return; }
  tel('trade-title').textContent = TRT('TITLE');
  tel('trade-trust').textContent = TRT('TRUST');
  tel('trade-give').textContent = TRT('GIVE', indLabel(t.ind.dex, t.ind.shiny, t.ind.nick, t.ind.age));
  tel('trade-get').textContent = t.their
    ? `${TRT('GET', indLabel(t.their.dex, t.their.shiny, t.their.nick, t.their.age))}${t.their.tname ? ' ' + TRT('FROM', t.their.tname) : ''}` : '';
  tel('trade-scan').textContent = tradeScan ? TRT('STOP') : TRT('SCAN');
  tel('trade-paste').textContent = TRT('PASTE');
  tel('trade-share').textContent = TRT('SHARE');
  tel('trade-cancel').textContent = TRT('CANCEL');
  tel('trade-close').textContent = TRT('CLOSE');
  let step, code;
  if (t.stage === 'offer') { step = TRT('STEP1'); code = t.code; }
  else if (t.stage === 'confirm') { step = TRT('STEP2'); code = t.confirm; }
  else { step = t.result + ' — ' + TRT('DONE'); code = t.confirm; }
  tel('trade-step').textContent = step;
  tel('trade-code').textContent = code;
  drawQr(tel('trade-qr'), code);
  tel('trade-cancel').hidden = t.stage === 'done';
  tel('trade-scan').hidden = tel('trade-paste').hidden = t.stage === 'done';
  if (t.stage === 'done') setTradeStatus('', false);
}
function onTradeText(text) {
  const t = tradeState();
  if (!t || t.stage === 'done') return false;
  // la confirmation contient aussi une offre : la tester en premier
  if (/TPK1-/.test(text)) return acceptConfirm(text);
  if (/TPT1-/.test(text)) {
    if (t.stage !== 'offer') return false;
    return acceptOffer(text);
  }
  return false;
}
async function startTradeScan() {
  if (tradeScan) { stopTradeScan(); return; }
  try {
    if (window.TPStore && window.TPStore.cameraState && window.TPStore.cameraState() !== 1) {
      window.TPStore.askCamera();
      setTradeStatus(OXT('CAM'), false);
      clearInterval(tradeCamPoll);
      let tries = 0;
      tradeCamPoll = setInterval(() => {
        if (++tries > 60) { clearInterval(tradeCamPoll); return; }
        if (window.TPStore.cameraState() === 1) { clearInterval(tradeCamPoll); setTradeStatus('', false); startTradeScan(); }
      }, 500);
      return;
    }
    tradeScan = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
  } catch (e) {
    tradeScan = null;
    setTradeStatus(OXT('NOCAM'), false);
    return;
  }
  const v = tel('trade-video');
  v.srcObject = tradeScan;
  v.hidden = false;
  tel('trade-scan').textContent = TRT('STOP');
  try { await v.play(); } catch (e) { /* lecture auto */ }
  const work = document.createElement('canvas');
  const g = work.getContext('2d', { willReadFrequently: true });
  let last = 0;
  const tick = (ts) => {
    if (!tradeScan) return;
    tradeRaf = requestAnimationFrame(tick);
    if (ts - last < 120 || v.readyState < 2) return;
    last = ts;
    const s = Math.min(1, 480 / Math.max(v.videoWidth, v.videoHeight));
    work.width = Math.max(1, Math.floor(v.videoWidth * s));
    work.height = Math.max(1, Math.floor(v.videoHeight * s));
    g.drawImage(v, 0, 0, work.width, work.height);
    const img = g.getImageData(0, 0, work.width, work.height);
    const res = window.jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' });
    if (res && res.data && onTradeText(res.data)) stopTradeScan();
  };
  tradeRaf = requestAnimationFrame(tick);
}
function stopTradeScan() {
  cancelAnimationFrame(tradeRaf);
  clearInterval(tradeCamPoll);
  if (tradeScan) { tradeScan.getTracks().forEach((x) => x.stop()); tradeScan = null; }
  const v = tel('trade-video');
  if (v) { v.hidden = true; v.srcObject = null; }
  if (tel('trade-scan')) tel('trade-scan').textContent = TRT('SCAN');
}
function wireTrade() {
  tel('trade-scan').addEventListener('click', () => { audio.ensure(); startTradeScan(); });
  tel('trade-paste').addEventListener('click', () => {
    const b = tel('trade-pastebox');
    b.hidden = !b.hidden;
    if (!b.hidden) tel('trade-input').focus();
  });
  tel('trade-input').addEventListener('input', (e) => {
    if (onTradeText(e.target.value)) { e.target.value = ''; tel('trade-pastebox').hidden = true; }
  });
  tel('trade-share').addEventListener('click', () => {
    const msg = TRT('MSG') + tel('trade-code').textContent;
    try {
      if (window.TPStore && window.TPStore.shareText) window.TPStore.shareText(msg);
      else if (navigator.share) navigator.share({ text: msg });
    } catch (e) { /* rien */ }
  });
  tel('trade-cancel').addEventListener('click', () => {
    if (!cancelArmed) { cancelArmed = true; setTradeStatus(TRT('CANCEL_Q'), false); return; }
    cancelTrade();
  });
  tel('trade-close').addEventListener('click', closeTrade);
}
wireTrade();
