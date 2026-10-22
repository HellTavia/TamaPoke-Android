// TamaPoke Android — options : vibrations, sauvegarde et transfert de partie
//
// La partie entière tient dans un objet JSON (prefs). On l'exporte en texte
// compact « TPS1:… » (JSON compressé deflate + base64) :
//   - dans un fichier choisi par l'utilisateur (Drive, Téléchargements…),
//   - par le menu Partager (mail, messagerie…), à recoller ensuite,
//   - ou de téléphone à téléphone en QR codes animés (plusieurs images à la suite).
// À l'import, l'ancienne partie est gardée de côté (« Annuler l'import »).
'use strict';

//        ES, EN, FR, DE, IT, PT, JA, KO
const OX = {
  TITLE: ['Opciones', 'Options', 'Options', 'Optionen', 'Opzioni', 'Opções', 'オプション', '옵션'],
  VIB: ['Vibraciones', 'Vibration', 'Vibrations', 'Vibration', 'Vibrazione', 'Vibração', 'しんどう', '진동'],
  ON: ['Activadas', 'On', 'Activées', 'An', 'Attive', 'Ligada', 'オン', '켬'],
  OFF: ['Desactivadas', 'Off', 'Désactivées', 'Aus', 'Disattive', 'Desligada', 'オフ', '끔'],
  SAVE: ['Copia de seguridad', 'Backup', 'Sauvegarde', 'Sicherung', 'Backup', 'Backup', 'セーブ', '백업'],
  SAVE_HOW: ['Todo se guarda: compañero, equipo, Pokédex, rachas, duelos.', 'Everything is saved: partner, team, Pokédex, streaks, duels.', 'Tout est sauvegardé : compagnon, équipe, Pokédex, séries, duels.', 'Alles wird gesichert: Partner, Team, Pokédex, Serien, Duelle.', 'Si salva tutto: compagno, squadra, Pokédex, serie, duelli.', 'Tudo é salvo: parceiro, equipe, Pokédex, sequências, duelos.', 'あいぼう・チーム・ずかん・きろく すべて セーブ', '파트너, 팀, 도감, 기록 모두 저장'],
  EXPORT_FILE: ['Guardar en un archivo', 'Save to a file', 'Enregistrer dans un fichier', 'In Datei speichern', 'Salva in un file', 'Salvar em arquivo', 'ファイルに ほぞん', '파일로 저장'],
  IMPORT_FILE: ['Cargar un archivo', 'Load a file', 'Charger un fichier', 'Datei laden', 'Carica un file', 'Carregar arquivo', 'ファイルを よみこむ', '파일 불러오기'],
  SEND: ['Enviar como texto', 'Send as text', 'Envoyer en texte', 'Als Text senden', 'Invia come testo', 'Enviar como texto', 'テキストで おくる', '텍스트로 보내기'],
  PASTE: ['Pegar una copia', 'Paste a backup', 'Coller une sauvegarde', 'Sicherung einfügen', 'Incolla un backup', 'Colar um backup', 'セーブを はりつけ', '백업 붙여넣기'],
  TRANSFER: ['Pasar a otro teléfono', 'Move to another phone', 'Transférer vers un autre téléphone', 'Auf anderes Handy übertragen', 'Trasferisci su un altro telefono', 'Passar para outro celular', 'べつの でんわに うつす', '다른 폰으로 옮기기'],
  TR_HOW: ['En el teléfono ANTIGUO: «Mostrar». En el NUEVO: «Escanear» y apunta a los QR hasta el 100 %.', 'On the OLD phone: "Show". On the NEW one: "Scan" and aim at the QR codes until 100 %.', "Sur l'ANCIEN téléphone : « Afficher ». Sur le NOUVEAU : « Scanner » et vise les QR jusqu'à 100 %.", 'Auf dem ALTEN Handy: „Zeigen". Auf dem NEUEN: „Scannen" bis 100 %.', 'Sul VECCHIO: «Mostra». Sul NUOVO: «Scansiona» fino al 100 %.', 'No ANTIGO: «Mostrar». No NOVO: «Escanear» até 100 %.', 'ふるい でんわで ひょうじ、あたらしい でんわで よみとり（100%まで）', '이전 폰: 표시 / 새 폰: 스캔 (100%까지)'],
  SHOW: ['Mostrar', 'Show', 'Afficher', 'Zeigen', 'Mostra', 'Mostrar', 'ひょうじ', '표시'],
  SCAN: ['Escanear', 'Scan', 'Scanner', 'Scannen', 'Scansiona', 'Escanear', 'よみとる', '스캔'],
  STOP: ['Parar', 'Stop', 'Arrêter', 'Stopp', 'Ferma', 'Parar', 'やめる', '중지'],
  CLOSE: ['Cerrar', 'Close', 'Fermer', 'Schließen', 'Chiudi', 'Fechar', 'とじる', '닫기'],
  CONFIRM: ['Esta copia REEMPLAZARÁ la partida actual (%s). Pulsa otra vez para confirmar.', 'This backup will REPLACE the current game (%s). Tap again to confirm.', 'Cette sauvegarde va REMPLACER la partie actuelle (%s). Touche encore pour confirmer.', 'Diese Sicherung ERSETZT das aktuelle Spiel (%s). Nochmal tippen.', 'Questo backup SOSTITUIRÀ la partita attuale (%s). Tocca ancora.', 'Este backup VAI SUBSTITUIR o jogo atual (%s). Toque de novo.', 'いまの データ（%s）を うわがき します。もういちど タッチ', '현재 게임(%s)을 덮어씁니다. 한 번 더 터치'],
  APPLY: ['Cargar esta copia', 'Load this backup', 'Charger cette sauvegarde', 'Diese Sicherung laden', 'Carica questo backup', 'Carregar este backup', 'この セーブを よみこむ', '이 백업 불러오기'],
  FOUND: ['Copia del %s: %s, Pokédex %u/151, equipo %u', 'Backup from %s: %s, Pokédex %u/151, team %u', 'Sauvegarde du %s : %s, Pokédex %u/151, équipe %u', 'Sicherung vom %s: %s, Pokédex %u/151, Team %u', 'Backup del %s: %s, Pokédex %u/151, squadra %u', 'Backup de %s: %s, Pokédex %u/151, equipe %u', '%s の セーブ: %s ずかん %u/151 チーム %u', '%s 백업: %s, 도감 %u/151, 팀 %u'],
  BAD: ['Copia no válida o incompleta', 'Invalid or incomplete backup', 'Sauvegarde invalide ou incomplète', 'Ungültige oder unvollständige Sicherung', 'Backup non valido o incompleto', 'Backup inválido ou incompleto', 'セーブが ただしくない', '잘못된 백업'],
  SAVED: ['Archivo guardado ✓', 'File saved ✓', 'Fichier enregistré ✓', 'Datei gespeichert ✓', 'File salvato ✓', 'Arquivo salvo ✓', 'ほぞんしました ✓', '저장됨 ✓'],
  NOTSAVED: ['No se guardó', 'Not saved', 'Non enregistré', 'Nicht gespeichert', 'Non salvato', 'Não salvo', 'ほぞん されなかった', '저장 안 됨'],
  UNDO: ['Deshacer la última importación', 'Undo the last import', 'Annuler le dernier import', 'Letzten Import rückgängig', 'Annulla ultimo import', 'Desfazer última importação', 'さいごの よみこみを もどす', '마지막 가져오기 취소'],
  PROGRESS: ['Recibido: %u %%', 'Received: %u %%', 'Reçu : %u %%', 'Empfangen: %u %%', 'Ricevuto: %u %%', 'Recebido: %u %%', 'じゅしん %u %%', '수신 %u %%'],
  FRAME: ['Imagen %u / %u — mantenla delante del otro teléfono', 'Frame %u / %u — keep it in front of the other phone', "Image %u / %u — garde-la devant l'autre téléphone", 'Bild %u / %u — vor das andere Handy halten', 'Immagine %u / %u — tienila davanti all’altro telefono', 'Imagem %u / %u — mantenha na frente do outro celular', '%u / %u まい — あいての まえに', '%u / %u — 상대 폰 앞에 두세요'],
  AUTO: ['Copia automática', 'Automatic backup', 'Sauvegarde automatique', 'Automatische Sicherung', 'Backup automatico', 'Backup automático', 'じどう セーブ', '자동 백업'],
  AUTO_HOW: ['Cada semana se crea una copia en la carpeta que elijas (se guardan las 4 últimas). Elige una carpeta fuera de la app (Documentos, Descargas…): las copias sobreviven a una desinstalación. Para recuperarlas: «Cargar un archivo».', 'Every week a backup is written to the folder you choose (the last 4 are kept). Pick a folder outside the app (Documents, Download…) so backups survive an uninstall. To restore: "Load a file".', "Chaque semaine, une copie est créée dans le dossier de ton choix (les 4 dernières sont gardées). Choisis un dossier hors de l'appli (Documents, Download…) : les copies survivent à une désinstallation. Pour récupérer : « Charger un fichier ».", 'Jede Woche wird eine Sicherung im gewählten Ordner angelegt (die letzten 4 bleiben). Wähle einen Ordner außerhalb der App. Wiederherstellen: „Datei laden".', 'Ogni settimana viene creato un backup nella cartella scelta (restano gli ultimi 4). Ripristino: «Carica un file».', 'Toda semana um backup é criado na pasta escolhida (os 4 últimos ficam). Para recuperar: «Carregar arquivo».', 'まいしゅう えらんだ フォルダに セーブ（さいご 4つ）', '매주 선택한 폴더에 백업 (최근 4개)'],
  AUTO_PICK: ['Elegir una carpeta', 'Choose a folder', 'Choisir un dossier', 'Ordner wählen', 'Scegli una cartella', 'Escolher pasta', 'フォルダを えらぶ', '폴더 선택'],
  AUTO_CHANGE: ['Cambiar de carpeta', 'Change folder', 'Changer de dossier', 'Ordner ändern', 'Cambia cartella', 'Trocar pasta', 'フォルダを かえる', '폴더 변경'],
  AUTO_NOW: ['Copiar ahora', 'Back up now', 'Sauvegarder maintenant', 'Jetzt sichern', 'Salva ora', 'Salvar agora', 'いま セーブ', '지금 백업'],
  AUTO_OFF: ['Desactivar', 'Turn off', 'Désactiver', 'Ausschalten', 'Disattiva', 'Desativar', 'オフ', '끄기'],
  AUTO_NONE: ['Desactivada', 'Off', 'Désactivée', 'Aus', 'Disattivato', 'Desativado', 'オフ', '꺼짐'],
  AUTO_STATE: ['Carpeta: %s · última copia: %s', 'Folder: %s · last backup: %s', 'Dossier : %s · dernière copie : %s', 'Ordner: %s · letzte Sicherung: %s', 'Cartella: %s · ultimo: %s', 'Pasta: %s · último: %s', 'フォルダ: %s · さいご: %s', '폴더: %s · 최근: %s'],
  AUTO_NEVER: ['nunca', 'never', 'jamais', 'nie', 'mai', 'nunca', 'まだ', '없음'],
  AUTO_LOST: ['No se puede escribir en la carpeta: vuelve a elegirla', 'Can\'t write to the folder: choose it again', "Impossible d'écrire dans le dossier : choisis-le à nouveau", 'Ordner nicht beschreibbar: neu wählen', 'Cartella non scrivibile: sceglila di nuovo', 'Pasta inacessível: escolha de novo', 'フォルダに かけない', '폴더에 쓸 수 없어요'],
  AUTO_DONE: ['Copia creada ✓', 'Backup written ✓', 'Copie créée ✓', 'Sicherung erstellt ✓', 'Backup creato ✓', 'Backup criado ✓', 'セーブ しました ✓', '백업 완료 ✓'],
  EGG: ['Huevo', 'Egg', 'Œuf', 'Ei', 'Uovo', 'Ovo', 'タマゴ', '알'],
  NOCAM: ['Cámara no disponible', 'No camera', 'Caméra indisponible', 'Keine Kamera', 'Fotocamera assente', 'Sem câmera', 'カメラが つかえない', '카메라를 쓸 수 없어요'],
  CAM: ['Permite la cámara y vuelve a pulsar', 'Allow the camera, then tap again', 'Autorise la caméra puis touche encore', 'Kamera erlauben, dann erneut tippen', 'Consenti la fotocamera e tocca di nuovo', 'Permita a câmera e toque de novo', 'カメラを きょかしてね', '카메라를 허용해 주세요'],
};
const OXT = (k, ...a) => sprintf(OX[k][gLang], ...a);
const oel = (id) => document.getElementById(id);

// ------------------------------------------------------------- vibrations
function vibOn() { return prefs.get('vib', true) !== false; }
function haptic(ms) {
  if (!vibOn() || !ms) return;
  try {
    if (window.TPStore && window.TPStore.vibrate) window.TPStore.vibrate(Math.round(ms));
    else if (navigator.vibrate) navigator.vibrate(ms);
  } catch (e) { /* rien */ }
}

// ----------------------------------------------------------- export / import
function b64uEncode(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64uDecode(str) {
  const s = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}
async function deflate(bytes) {
  if (typeof CompressionStream === 'undefined') return null;
  const cs = new CompressionStream('deflate');
  const buf = await new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer();
  return new Uint8Array(buf);
}
async function inflate(bytes) {
  const ds = new DecompressionStream('deflate');
  const buf = await new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer();
  return new Uint8Array(buf);
}
// TPS1:z<base64url(deflate(json))>  ou  TPS1:j<base64url(json)> si pas de compression
async function exportSave() {
  pet.lastSeenEpoch = rtcEpoch();
  pet.save();
  const data = JSON.parse(JSON.stringify(prefs.m));
  delete data.stepLast;  // compteur matériel propre à ce téléphone
  delete data.bkDir; delete data.bkList; delete data.bkLast; delete data.bkErr;  // dossier de ce téléphone
  const pack = { app: 'tamapoke', v: 1, t: Date.now(), ver: APP_VERSION, d: data };
  const raw = new TextEncoder().encode(JSON.stringify(pack));
  const z = await deflate(raw);
  const body = z ? 'z' + b64uEncode(z) : 'j' + b64uEncode(raw);
  return `TPS1:${body}:${(cardHash(body) >>> 0).toString(36)}`;
}
// ---------------------------------------------- sauvegarde automatique (v10)
const AUTO_EVERY = 7 * 86400000, AUTO_KEEP = 4;
function autoAvailable() { return !!(window.TPStore && window.TPStore.writeInDir); }
function autoDirLabel(uri) {
  // content://…/tree/primary%3ADocuments%2FTamaPoke -> Documents/TamaPoke
  try {
    const m = /\/tree\/([^/]+)/.exec(uri || '');
    if (!m) return '?';
    const id = decodeURIComponent(m[1]);
    const p = id.includes(':') ? id.slice(id.indexOf(':') + 1) : id;
    return p || id.split(':')[0] || '/';
  } catch (e) { return '?'; }
}
async function autoBackup(force) {
  const dir = prefs.get('bkDir', '');
  if (!dir || !autoAvailable()) return false;
  if (!force && Date.now() - prefs.get('bkLast', 0) < AUTO_EVERY) return false;
  const code = await exportSave();
  const d = new Date();
  const p2 = (n) => String(n).padStart(2, '0');
  const name = `TamaPoke-auto-${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}.txt`;
  let uri = '';
  try { uri = window.TPStore.writeInDir(dir, name, code) || ''; } catch (e) { uri = ''; }
  if (!uri) { prefs.put('bkErr', 1); prefs.flush(); return false; }
  const list = prefs.get('bkList', []);
  list.push(uri);
  while (list.length > AUTO_KEEP) {
    const old = list.shift();
    try { window.TPStore.deleteDoc(old); } catch (e) { /* tant pis */ }
  }
  prefs.put('bkList', list); prefs.put('bkLast', Date.now()); prefs.put('bkErr', 0); prefs.flush();
  return true;
}
window.tpDirPicked = function (uri) {
  if (!uri) return;
  prefs.put('bkDir', uri); prefs.put('bkList', []); prefs.put('bkErr', 0); prefs.flush();
  autoBackup(true).then((ok) => { setOptStatus(ok ? OXT('AUTO_DONE') : OXT('AUTO_LOST'), ok); renderAuto(); });
};
function renderAuto() {
  const box = oel('opt-auto');
  if (!box) return;
  oel('opt-auto-h').textContent = OXT('AUTO');
  oel('opt-auto-how').textContent = OXT('AUTO_HOW');
  if (!autoAvailable()) { box.hidden = true; return; }
  box.hidden = false;
  const dir = prefs.get('bkDir', '');
  let st = OXT('AUTO_NONE');
  if (dir) {
    const last = prefs.get('bkLast', 0);
    let when = OXT('AUTO_NEVER');
    try { if (last) when = new Date(last).toLocaleDateString(LOCALES[gLang], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { /* rien */ }
    st = OXT('AUTO_STATE', autoDirLabel(dir), when);
    if (prefs.get('bkErr', 0)) st += ' — ' + OXT('AUTO_LOST');
  }
  oel('opt-auto-st').textContent = st;
  oel('opt-auto-pick').textContent = dir ? OXT('AUTO_CHANGE') : OXT('AUTO_PICK');
  oel('opt-auto-now').textContent = OXT('AUTO_NOW');
  oel('opt-auto-off').textContent = OXT('AUTO_OFF');
  oel('opt-auto-now').hidden = oel('opt-auto-off').hidden = !dir;
}
// vérifié au démarrage, au retour dans l'appli, puis toutes les heures
function autoTick() { autoBackup(false).then((ok) => { if (ok) renderAuto(); }).catch(() => {}); }

async function parseSave(text) {
  const m = /TPS1:([zj][A-Za-z0-9_-]+):([0-9a-z]+)/.exec(String(text || ''));
  if (!m) return null;
  if ((cardHash(m[1]) >>> 0).toString(36) !== m[2]) return null;
  try {
    let bytes = b64uDecode(m[1].slice(1));
    if (m[1][0] === 'z') bytes = await inflate(bytes);
    const pack = JSON.parse(new TextDecoder().decode(bytes));
    if (!pack || pack.app !== 'tamapoke' || !pack.d || typeof pack.d !== 'object') return null;
    return pack;
  } catch (e) { return null; }
}
function describeSave(pack) {
  const d = pack.d;
  const reg = (d.dexreg || []).reduce((a, b) => { let n = 0; for (let x = b; x; x &= x - 1) n++; return a + n; }, 0);
  let date = '';
  try { date = new Date(pack.t).toLocaleDateString(LOCALES[gLang], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { date = ''; }
  const who = d.dexn >= 1 ? `${uni(d.nick || dexName(d.dexn))} ${uni(sprintf(T(S_LVL_FMT), 1 + Math.floor((d.age || 0) / 60)))}` : OXT('EGG');
  return OXT('FOUND', date, who, reg, (d.box || []).length);
}
function currentDesc() {
  return pet.isEgg() ? OXT('EGG') : `${uni(pet.nick || dexName(pet.speciesId))} ${uni(sprintf(T(S_LVL_FMT), pet.level()))}`;
}
function applySave(pack) {
  try {
    if (window.TPStore && window.TPStore.setItem) window.TPStore.setItem('tamapoke_prev', JSON.stringify(prefs.m));
    else localStorage.setItem('tamapoke_prev', JSON.stringify(prefs.m));
  } catch (e) { /* rien */ }
  const d = pack.d;
  d.stepLast = -1;  // le podomètre repart du compteur de CE téléphone
  d.init = true;
  for (const k of ['bkDir', 'bkList', 'bkLast']) if (prefs.m[k] !== undefined) d[k] = prefs.m[k];  // dossier de ce téléphone
  Store.set(JSON.stringify(d));
  freezeSaves();
  location.reload();
}
// plus aucune écriture jusqu'au rechargement : la sauvegarde automatique de
// fermeture (pagehide) écraserait sinon la partie qu'on vient d'importer
function freezeSaves() {
  prefs.put = () => {};
  prefs.flush = () => {};
  Store.set = () => {};
}
function undoImport() {
  let prev = null;
  try { prev = window.TPStore ? window.TPStore.getItem('tamapoke_prev') : localStorage.getItem('tamapoke_prev'); } catch (e) { prev = null; }
  if (!prev) return;
  Store.set(prev);
  freezeSaves();
  try { if (window.TPStore) window.TPStore.setItem('tamapoke_prev', ''); else localStorage.removeItem('tamapoke_prev'); } catch (e) { /* rien */ }
  location.reload();
}

// ---------------------------------------------------------------- l'écran
let pendingImport = null, importArmed = false;
function setOptStatus(t, ok) {
  const st = oel('opt-status');
  st.textContent = t;
  st.className = ok ? 'ok' : (t ? 'err' : '');
}
function openOptions() {
  clockOpen = false;
  oel('opt-title').textContent = OXT('TITLE');
  oel('opt-vib-lbl').textContent = OXT('VIB');
  oel('opt-save-h').textContent = OXT('SAVE');
  oel('opt-save-how').textContent = OXT('SAVE_HOW');
  oel('opt-export').textContent = OXT('EXPORT_FILE');
  oel('opt-import').textContent = OXT('IMPORT_FILE');
  oel('opt-send').textContent = OXT('SEND');
  oel('opt-paste').textContent = OXT('PASTE');
  oel('opt-tr-h').textContent = OXT('TRANSFER');
  oel('opt-tr-how').textContent = OXT('TR_HOW');
  oel('opt-show').textContent = OXT('SHOW');
  oel('opt-scan').textContent = OXT('SCAN');
  oel('opt-close').textContent = OXT('CLOSE');
  renderAuto();
  if (typeof renderHc === 'function') renderHc();
  if (typeof renderNotifSet === 'function') renderNotifSet();
  oel('opt-undo').textContent = OXT('UNDO');
  oel('opt-apply').textContent = OXT('APPLY');
  let prev = null;
  try { prev = window.TPStore ? window.TPStore.getItem('tamapoke_prev') : localStorage.getItem('tamapoke_prev'); } catch (e) { prev = null; }
  oel('opt-undo').hidden = !prev;
  oel('opt-pastebox').hidden = true;
  oel('opt-apply').hidden = true;
  oel('opt-qr').hidden = true;
  oel('opt-frame').textContent = '';
  pendingImport = null; importArmed = false;
  updateVibBtn();
  setOptStatus('', false);
  oel('options').classList.add('open');
}
function closeOptions() {
  stopShow(); stopOptScan();
  oel('options').classList.remove('open');
}
function updateVibBtn() {
  const b = oel('opt-vib');
  b.textContent = vibOn() ? OXT('ON') : OXT('OFF');
  b.classList.toggle('on', vibOn());
}
async function offerImport(text) {
  const pack = await parseSave(text);
  if (!pack) { setOptStatus(OXT('BAD'), false); sfxPlay(SFX_DENY); return false; }
  pendingImport = pack; importArmed = false;
  setOptStatus(describeSave(pack), true);
  oel('opt-apply').hidden = false;
  oel('opt-apply').textContent = OXT('APPLY');
  sfxPlay(SFX_TAP);
  return true;
}
function applyClicked() {
  if (!pendingImport) return;
  if (!importArmed) {
    importArmed = true;
    setOptStatus(OXT('CONFIRM', currentDesc()), false);
    oel('opt-apply').textContent = '⚠ ' + OXT('APPLY');
    return;
  }
  applySave(pendingImport);
}

// fichiers (sélecteur de documents d'Android, via le pont)
window.tpFileSaved = function (ok) { setOptStatus(ok ? OXT('SAVED') : OXT('NOTSAVED'), !!ok); if (ok) haptic(30); };
window.tpFileLoaded = function (text) { if (text) offerImport(text); else setOptStatus(OXT('BAD'), false); };
async function exportFile() {
  const code = await exportSave();
  const d = new Date();
  const name = `TamaPoke-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.tpsave`;
  if (window.TPStore && window.TPStore.saveFile) { window.TPStore.saveFile(name, code); return; }
  // navigateur : téléchargement classique
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([code], { type: 'text/plain' }));
  a.download = name;
  a.click();
  window.tpFileSaved(true);
}
function importFile() {
  if (window.TPStore && window.TPStore.openFile) { window.TPStore.openFile(); return; }
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.onchange = () => { const f = inp.files[0]; if (f) f.text().then(window.tpFileLoaded); };
  inp.click();
}
async function sendText() {
  const code = await exportSave();
  try {
    if (window.TPStore && window.TPStore.shareText) { window.TPStore.shareText(code); return; }
    if (navigator.share) { navigator.share({ text: code }); return; }
    if (navigator.clipboard) await navigator.clipboard.writeText(code);
  } catch (e) { /* rien */ }
}

// --------------------------------------------- transfert en QR codes animés
// chaque image : TPX1/<id>/<i>/<n>/<morceau>
const CHUNK = 600;
let showTimer = 0, scanStream2 = null, scanRaf2 = 0, scanParts = null, camPoll2 = 0;
async function startShow() {
  if (showTimer) { stopShow(); return; }
  stopOptScan();
  const code = await exportSave();
  const id = (cardHash(code) >>> 0).toString(36).slice(0, 5);
  const n = Math.ceil(code.length / CHUNK);
  const frames = [];
  for (let i = 0; i < n; i++) frames.push(`TPX1/${id}/${i}/${n}/${code.slice(i * CHUNK, (i + 1) * CHUNK)}`);
  const cv = oel('opt-qr');
  cv.hidden = false;
  oel('opt-show').textContent = OXT('STOP');
  let k = 0;
  const step = () => {
    drawQr(cv, frames[k]);
    oel('opt-frame').textContent = OXT('FRAME', k + 1, n);
    k = (k + 1) % n;
  };
  step();
  showTimer = setInterval(step, 650);
}
function stopShow() {
  clearInterval(showTimer);
  showTimer = 0;
  const cv = oel('opt-qr');
  if (cv) cv.hidden = true;
  if (oel('opt-show')) oel('opt-show').textContent = OXT('SHOW');
  if (oel('opt-frame')) oel('opt-frame').textContent = '';
}
async function startOptScan() {
  if (scanStream2) { stopOptScan(); return; }
  stopShow();
  try {
    if (window.TPStore && window.TPStore.cameraState && window.TPStore.cameraState() !== 1) {
      window.TPStore.askCamera();
      setOptStatus(OXT('CAM'), false);
      clearInterval(camPoll2);
      let tries = 0;
      camPoll2 = setInterval(() => {
        if (++tries > 60) { clearInterval(camPoll2); return; }
        if (window.TPStore.cameraState() === 1) { clearInterval(camPoll2); setOptStatus('', false); startOptScan(); }
      }, 500);
      return;
    }
    scanStream2 = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
  } catch (e) {
    scanStream2 = null;
    setOptStatus(OXT('NOCAM'), false);
    return;
  }
  scanParts = null;
  const v = oel('opt-video');
  v.srcObject = scanStream2;
  v.hidden = false;
  oel('opt-scan').textContent = OXT('STOP');
  try { await v.play(); } catch (e) { /* lecture auto */ }
  const work = document.createElement('canvas');
  const g = work.getContext('2d', { willReadFrequently: true });
  let last = 0;
  const tick = (t) => {
    if (!scanStream2) return;
    scanRaf2 = requestAnimationFrame(tick);
    if (t - last < 100 || v.readyState < 2) return;
    last = t;
    const s = Math.min(1, 640 / Math.max(v.videoWidth, v.videoHeight));
    work.width = Math.max(1, Math.floor(v.videoWidth * s));
    work.height = Math.max(1, Math.floor(v.videoHeight * s));
    g.drawImage(v, 0, 0, work.width, work.height);
    const img = g.getImageData(0, 0, work.width, work.height);
    const res = window.jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
    if (res && res.data) onFrame(res.data);
  };
  scanRaf2 = requestAnimationFrame(tick);
}
function onFrame(txt) {
  const m = /^TPX1\/([0-9a-z]+)\/(\d+)\/(\d+)\/(.*)$/s.exec(txt);
  if (!m) { if (/TPS1:/.test(txt)) { stopOptScan(); offerImport(txt); } return; }
  const [, id, si, sn, part] = m;
  const i = +si, n = +sn;
  if (!scanParts || scanParts.id !== id || scanParts.n !== n) scanParts = { id, n, got: new Array(n).fill(null), count: 0 };
  if (scanParts.got[i] === null) {
    scanParts.got[i] = part;
    scanParts.count++;
    haptic(15);
  }
  setOptStatus(OXT('PROGRESS', Math.round(100 * scanParts.count / n)), true);
  if (scanParts.count === n) {
    const code = scanParts.got.join('');
    stopOptScan();
    offerImport(code);
  }
}
function stopOptScan() {
  cancelAnimationFrame(scanRaf2);
  clearInterval(camPoll2);
  if (scanStream2) { scanStream2.getTracks().forEach((t) => t.stop()); scanStream2 = null; }
  const v = oel('opt-video');
  if (v) { v.hidden = true; v.srcObject = null; }
  if (oel('opt-scan')) oel('opt-scan').textContent = OXT('SCAN');
}

function wireOptions() {
  oel('opt-vib').addEventListener('click', () => {
    prefs.put('vib', !vibOn());
    prefs.flush();
    updateVibBtn();
    haptic(40);
  });
  oel('opt-export').addEventListener('click', exportFile);
  oel('opt-import').addEventListener('click', importFile);
  oel('opt-auto-pick').addEventListener('click', () => { try { window.TPStore.pickDir(); } catch (e) { /* rien */ } });
  oel('opt-auto-now').addEventListener('click', () => {
    autoBackup(true).then((ok) => { setOptStatus(ok ? OXT('AUTO_DONE') : OXT('AUTO_LOST'), ok); renderAuto(); });
  });
  oel('opt-auto-off').addEventListener('click', () => {
    prefs.put('bkDir', ''); prefs.put('bkList', []); prefs.put('bkErr', 0); prefs.flush(); renderAuto();
  });
  setTimeout(autoTick, 5000);
  setInterval(autoTick, 3600000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(autoTick, 3000); });
  oel('opt-send').addEventListener('click', sendText);
  oel('opt-paste').addEventListener('click', () => {
    const b = oel('opt-pastebox');
    b.hidden = !b.hidden;
    if (!b.hidden) oel('opt-input').focus();
  });
  oel('opt-input').addEventListener('input', (e) => { if (/TPS1:/.test(e.target.value)) offerImport(e.target.value); });
  oel('opt-apply').addEventListener('click', applyClicked);
  oel('opt-undo').addEventListener('click', undoImport);
  oel('opt-show').addEventListener('click', startShow);
  oel('opt-scan').addEventListener('click', () => { audio.ensure(); startOptScan(); });
  oel('opt-close').addEventListener('click', closeOptions);
}
wireOptions();

// chaque effet sonore a sa vibration (indépendante du son)
const HAPTIC_MS = [8, 20, 15, 25, 70, 120, 50, 40, 80, 30, 20, 150, 50, 100];
const _sfxPlay = sfxPlay;
// eslint-disable-next-line no-global-assign
sfxPlay = function (id) {
  if (!(pet.sleeping && id !== SFX_WILD)) haptic(HAPTIC_MS[id] || 0);
  return _sfxPlay(id);
};
