// TamaPoke Android — pas de la montre via Health Connect (v13, Android 14+)
//
// Health Connect additionne (sans doublons) les pas de toutes les sources :
// montre Fitbit, Withings, téléphone… On ne lit que des totaux.
// Règle : le total du jour = le plus grand des deux (podomètre du téléphone ou
// Health Connect). Si Health Connect en a plus (téléphone resté au vestiaire),
// la différence est ajoutée — jamais l'inverse, donc pas de double comptage.
// Hier est aussi rattrapé une fois (pas faits après la dernière ouverture).
'use strict';

//        ES, EN, FR, DE, IT, PT, JA, KO
const HX = {
  TITLE: ['Reloj (Health Connect)', 'Watch (Health Connect)', 'Montre (Health Connect)', 'Uhr (Health Connect)', 'Orologio (Health Connect)', 'Relógio (Health Connect)', 'とけい（Health Connect）', '워치 (Health Connect)'],
  HOW: ['Lee los pasos de tu reloj (Fitbit, Withings…) en Health Connect. Si tiene más pasos que el teléfono, la diferencia cuenta para tu compañero. Se sincroniza al abrir la app.', 'Reads your watch steps (Fitbit, Withings…) from Health Connect. If it has more steps than the phone, the difference counts for your partner. Synced when you open the app.', "Lit les pas de ta montre (Fitbit, Withings…) dans Health Connect. S'il y en a plus que sur le téléphone, la différence compte pour ton compagnon. Synchronisé à l'ouverture de l'appli.", 'Liest die Schritte deiner Uhr aus Health Connect. Hat sie mehr als das Handy, zählt die Differenz. Abgleich beim Öffnen.', 'Legge i passi dell\'orologio da Health Connect. Se sono più del telefono, la differenza conta. Sincronizzato all\'apertura.', 'Lê os passos do relógio no Health Connect. Se houver mais que no celular, a diferença conta. Sincroniza ao abrir o app.', 'Health Connect の ほすうを よみこむ', 'Health Connect의 걸음 수를 읽어요'],
  NA: ['Necesita Android 14 o superior', 'Needs Android 14 or later', 'Nécessite Android 14 ou plus récent', 'Benötigt Android 14 oder neuer', 'Serve Android 14 o successivo', 'Requer Android 14 ou superior', 'Android 14 いじょうが ひつよう', 'Android 14 이상 필요'],
  ON: ['Activar', 'Turn on', 'Activer', 'Einschalten', 'Attiva', 'Ativar', 'オン', '켜기'],
  OFF: ['Desactivar', 'Turn off', 'Désactiver', 'Ausschalten', 'Disattiva', 'Desativar', 'オフ', '끄기'],
  ALLOW: ['Dar permiso', 'Grant access', "Donner l'accès", 'Zugriff erlauben', 'Consenti accesso', 'Permitir acesso', 'きょかする', '권한 허용'],
  OPEN: ['Abrir Health Connect', 'Open Health Connect', 'Ouvrir Health Connect', 'Health Connect öffnen', 'Apri Health Connect', 'Abrir Health Connect', 'Health Connect を ひらく', 'Health Connect 열기'],
  SYNC: ['Sincronizar ahora', 'Sync now', 'Synchroniser', 'Jetzt abgleichen', 'Sincronizza ora', 'Sincronizar agora', 'いま どうき', '지금 동기화'],
  NEEDPERM: ['Falta el permiso «Pasos». Si no aparece la ventana, ábrelo en Health Connect > Permisos de apps > TamaPoke.', 'The "Steps" permission is missing. If no window shows up, grant it in Health Connect > App permissions > TamaPoke.', "Il manque l'autorisation « Pas ». Si aucune fenêtre ne s'ouvre : Health Connect > Autorisations des applis > TamaPoke.", 'Berechtigung „Schritte" fehlt. Sonst in Health Connect > App-Berechtigungen > TamaPoke.', 'Manca il permesso «Passi». Altrimenti: Health Connect > Autorizzazioni app > TamaPoke.', 'Falta a permissão «Passos». Senão: Health Connect > Permissões de apps > TamaPoke.', '「ほすう」の きょかが ない', '"걸음수" 권한이 없어요'],
  STATE: ['Hoy: Health Connect %u pasos · añadidos %u · última sinc. %s', 'Today: Health Connect %u steps · added %u · last sync %s', "Aujourd'hui : Health Connect %u pas · ajoutés %u · synchro %s", 'Heute: Health Connect %u · hinzugefügt %u · Abgleich %s', 'Oggi: Health Connect %u · aggiunti %u · sinc. %s', 'Hoje: Health Connect %u · adicionados %u · sinc. %s', 'きょう: HC %u ほ · ついか %u · %s', '오늘: HC %u · 추가 %u · %s'],
  NEVER: ['nunca', 'never', 'jamais', 'nie', 'mai', 'nunca', 'まだ', '없음'],
  SYNCING: ['Sincronizando…', 'Syncing…', 'Synchronisation…', 'Abgleich…', 'Sincronizzazione…', 'Sincronizando…', 'どうきちゅう…', '동기화 중…'],
  NOTHING: ['Health Connect: %u pasos hoy, el teléfono ya tenía %u: nada que añadir', 'Health Connect: %u steps today, the phone already had %u: nothing to add', "Health Connect : %u pas aujourd'hui, le téléphone en avait déjà %u : rien à ajouter", 'Health Connect: %u heute, Handy hatte schon %u: nichts hinzuzufügen', 'Health Connect: %u oggi, il telefono ne aveva già %u: niente da aggiungere', 'Health Connect: %u hoje, o celular já tinha %u: nada a adicionar', 'HC %u ほ / でんわ %u ほ: ついか なし', 'HC %u / 폰 %u: 추가 없음'],
  ERR: ['Health Connect no respondió', 'Health Connect did not answer', "Health Connect n'a pas répondu", 'Health Connect antwortet nicht', 'Health Connect non risponde', 'Health Connect não respondeu', 'Health Connect が こたえない', 'Health Connect 응답 없음'],
  ADDED: ['+%u pasos del reloj', '+%u steps from your watch', '+%u pas de la montre', '+%u Schritte von der Uhr', '+%u passi dall\'orologio', '+%u passos do relógio', 'とけいから +%u ほ', '워치에서 +%u걸음'],
  ADDEDY: ['+%u pasos de ayer (reloj)', '+%u steps from yesterday (watch)', "+%u pas d'hier (montre)", '+%u Schritte von gestern (Uhr)', '+%u passi di ieri (orologio)', '+%u passos de ontem (relógio)', 'きのう +%u ほ', '어제 +%u걸음'],
};
const HXT = (k, ...a) => sprintf(HX[k][gLang], ...a);
const hel = (id) => document.getElementById(id);

function hcAvail() { return !!(window.TPStore && window.TPStore.hcState); }
function hcState() { try { return hcAvail() ? window.TPStore.hcState() : -1; } catch (e) { return -1; } }
function hcPrefs() { return prefs.get('hc', null) || { on: false, day: 0, add: 0, last: 0, total: 0, yday: 0 }; }
function hcPut(h) { prefs.put('hc', h); prefs.flush(); }
function localMidnight() { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }

let hcBusy = 0;
function hcSync(force) {
  const h = hcPrefs();
  if (!h.on || pet.awaitingStarter()) return false;
  if (hcState() !== 1) { if (force) { hcMsg = HXT('NEEDPERM'); renderHc(); } return false; }
  if (!force && Date.now() - hcBusy < 20000) return false;
  hcBusy = Date.now();
  const mid = localMidnight();
  let err = '';
  try {
    err = window.TPStore.hcSteps(String(mid), String(Date.now()), 'd');
    if (err === true || err === false) err = err ? '' : 'refus';
    if (!err && h.yday !== pet.today()) window.TPStore.hcSteps(String(mid - 86400000), String(mid), 'y');
  } catch (e) { err = String(e); }
  hcMsg = err ? `${HXT('ERR')} (${err})` : HXT('SYNCING');
  renderHc();
  return !err;
}
let hcMsg = '';
// erreur renvoyée par Health Connect (permission retirée, service indisponible…)
window.tpHcErr = function (msg) {
  hcMsg = `${HXT('ERR')} (${msg})`;
  renderHc();
};
// crédite des pas d'un jour passé : rencontres, objets, pension, total… mais
// sans gonfler le compteur d'aujourd'hui
function creditPastSteps(day, delta) {
  const keepToday = pet.stepsDay === pet.today() ? pet.stepsToday : 0;
  const best = pet.stepsBest;
  const gained = pet.addSteps(delta);
  pet.stepsToday = keepToday;
  if (pet.stepsDay) { if (keepToday) pet.stepHist[pet.stepsDay] = keepToday; else delete pet.stepHist[pet.stepsDay]; }
  pet.stepHist[day] = (pet.stepHist[day] || 0) + delta;
  pet.stepsBest = Math.max(best, pet.stepHist[day], keepToday);
  pet.save();
  return gained;
}
window.tpHc = function (tag, n) {
  const h = hcPrefs();
  n = Number(n);
  if (!(n >= 0)) { h.err = 1; hcPut(h); hcMsg = HXT('ERR'); renderHc(); return; }
  h.err = 0;
  const today = pet.today();
  if (tag === 'd') {
    if (h.day !== today) { h.day = today; h.add = 0; }
    const have = pet.stepsDay === today ? pet.stepsToday : 0;
    const delta = Math.min(60000, n - have);
    h.total = n; h.last = Date.now();
    if (delta > 0) {
      if (pet.addSteps(delta)) sfxPlay(SFX_WILD);
      h.add += delta;
      toast(HXT('ADDED', delta), 3000);
      hcMsg = HXT('ADDED', delta);
    } else hcMsg = HXT('NOTHING', n, have);
  } else if (tag === 'y') {
    const yd = today - 1;
    const delta = Math.min(60000, n - (pet.stepHist[yd] || 0));
    h.yday = today;
    if (delta > 0) {
      if (creditPastSteps(yd, delta)) sfxPlay(SFX_WILD);
      setTimeout(() => toast(HXT('ADDEDY', delta), 3000), 3200);
    }
  }
  hcPut(h);
  renderHc();
};

function renderHc() {
  const box = hel('opt-hc');
  if (!box) return;
  hel('opt-hc-h').textContent = HXT('TITLE');
  hel('opt-hc-how').textContent = HXT('HOW');
  const st = hcState(), h = hcPrefs();
  const on = hel('opt-hc-on'), allow = hel('opt-hc-allow'), open = hel('opt-hc-open'), sync = hel('opt-hc-sync');
  allow.textContent = HXT('ALLOW'); open.textContent = HXT('OPEN'); sync.textContent = HXT('SYNC');
  on.textContent = h.on ? HXT('OFF') : HXT('ON');
  on.className = h.on ? 'on' : 'blue';
  let txt = '';
  if (st < 0) { txt = HXT('NA'); on.hidden = allow.hidden = open.hidden = sync.hidden = true; }
  else {
    on.hidden = false;
    allow.hidden = !h.on || st === 1;
    open.hidden = !h.on;
    sync.hidden = !h.on || st !== 1;
    if (h.on && st !== 1) txt = HXT('NEEDPERM');
    else if (h.on) {
      let when = HXT('NEVER');
      try { if (h.last) when = new Date(h.last).toLocaleTimeString(LOCALES[gLang], { hour: '2-digit', minute: '2-digit' }); } catch (e) { /* rien */ }
      txt = HXT('STATE', h.day === pet.today() ? h.total : 0, h.day === pet.today() ? h.add : 0, when);
    }
  }
  hel('opt-hc-st').textContent = txt + (hcMsg && h.on && st >= 0 ? ' — ' + hcMsg : '');
}
// demande l'accès ; si Android n'affiche rien (accès déjà refusé deux fois),
// on ouvre directement Health Connect pour l'autoriser à la main
function hcAsk() {
  try { window.TPStore.hcRequest(); } catch (e) { /* rien */ }
  setTimeout(() => {
    if (!document.hidden && hcState() === 0) { try { window.TPStore.hcOpen(); } catch (e) { /* rien */ } }
  }, 1500);
}
function wireHc() {
  hel('opt-hc-on').addEventListener('click', () => {
    const h = hcPrefs();
    h.on = !h.on;
    hcPut(h);
    if (h.on) { if (hcState() === 0) hcAsk(); else hcSync(true); }
    renderHc();
  });
  hel('opt-hc-allow').addEventListener('click', hcAsk);
  hel('opt-hc-open').addEventListener('click', () => { try { window.TPStore.hcOpen(); } catch (e) { /* rien */ } });
  hel('opt-hc-sync').addEventListener('click', () => { hcSync(true); });
  // synchro : au démarrage, au retour dans l'appli (après la fenêtre d'autorisation
  // aussi), à l'ouverture de la Balade et toutes les 5 minutes
  setTimeout(() => hcSync(true), 2500);
  // Android 13+ : l'appli cible maintenant Android 14, la permission des
  // notifications doit être demandée (une seule fois)
  setTimeout(() => {
    try {
      if (window.TPStore && window.TPStore.notifState && window.TPStore.notifState() === 0 && !prefs.get('askedNotif', false)) {
        prefs.put('askedNotif', true); prefs.flush();
        window.TPStore.askNotif();
      }
    } catch (e) { /* rien */ }
  }, 4000);
  setInterval(() => hcSync(false), 300000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTimeout(() => { renderHc(); hcSync(false); }, 1200);
  });
  if (typeof openPed === 'function') {
    const orig = openPed;
    openPed = function () { orig(); hcSync(false); };  // eslint-disable-line no-func-assign
  }
}
wireHc();
