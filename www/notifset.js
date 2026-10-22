// TamaPoke Android — réglage notifications / batterie (v17), dans OPTIONS
'use strict';

//        ES, EN, FR, DE, IT, PT, JA, KO
const NSX = {
  TITLE: ['Notificaciones y batería', 'Notifications & battery', 'Notifications et batterie', 'Benachrichtigungen & Akku', 'Notifiche e batteria', 'Notificações e bateria', 'つうち と バッテリー', '알림 및 배터리'],
  M0: ['Reactivo', 'Responsive', 'Réactif', 'Sofort', 'Reattivo', 'Reativo', 'すぐ', '즉시'],
  M1: ['Equilibrado', 'Balanced', 'Équilibré', 'Ausgewogen', 'Bilanciato', 'Equilibrado', 'バランス', '균형'],
  M2: ['Ahorro', 'Saver', 'Économie', 'Sparen', 'Risparmio', 'Economia', 'せつやく', '절약'],
  H0: ['Todo al minuto. Contador de pasos y alertas de encuentros en directo.', 'Everything to the minute. Live step counting and encounter alerts.', 'Tout à la minute près. Pas comptés et rencontres annoncées en direct.', 'Alles minutengenau, Schritte und Begegnungen live.', 'Tutto al minuto, passi e incontri in diretta.', 'Tudo no minuto, passos e encontros ao vivo.', 'すべて すぐに つうち', '모든 알림 즉시'],
  H1: ['Necesidades agrupadas (±15 min). Encuentros y huevo al instante. Widget cada 5 min.', 'Needs grouped (±15 min). Encounters and egg right away. Widget every 5 min.', "Besoins regroupés (à 15 min près). Rencontres et œuf tout de suite. Widget toutes les 5 min.", 'Bedürfnisse gebündelt (±15 Min). Begegnungen und Ei sofort. Widget alle 5 Min.', 'Bisogni raggruppati (±15 min). Incontri e uovo subito. Widget ogni 5 min.', 'Necessidades agrupadas (±15 min). Encontros e ovo na hora. Widget a cada 5 min.', 'ひつようは まとめて、であいと タマゴは すぐ', '필요는 묶어서, 만남과 알은 즉시'],
  H2: ['Sin servicio ni notificación fija. Los pasos se recuperan al abrir la app. Como mucho un aviso cada 2–3 h si una necesidad baja. Sin alertas de encuentros ni de huevo.', 'No background service or permanent notification. Steps are caught up when you open the app. At most one alert every 2–3 h when a need gets low. No encounter or egg alerts.', "Ni service ni notification permanente. Les pas sont rattrapés à l'ouverture de l'appli. Au plus un rappel toutes les 2–3 h si un besoin baisse. Pas d'alerte de rencontre ni d'œuf.", 'Kein Dienst, keine Daueranzeige. Schritte werden beim Öffnen nachgeholt. Höchstens alle 2–3 Std. ein Hinweis. Keine Begegnungs-/Ei-Hinweise.', 'Nessun servizio né notifica fissa. Passi recuperati all\'apertura. Al massimo un avviso ogni 2–3 h. Niente avvisi di incontri o uova.', 'Sem serviço nem notificação fixa. Passos recuperados ao abrir. No máximo um aviso a cada 2–3 h. Sem avisos de encontro ou ovo.', 'サービス なし。ほすうは ひらいた ときに。2〜3じかんに 1かい', '서비스 없음. 걸음은 열 때 반영. 2~3시간에 한 번'],
  QUIET: ['Horas tranquilas', 'Quiet hours', 'Heures calmes', 'Ruhezeiten', 'Ore tranquille', 'Horas de silêncio', 'しずかな じかん', '방해 금지 시간'],
  FROM: ['de', 'from', 'de', 'von', 'dalle', 'das', '', ''],
  TO: ['a', 'to', 'à', 'bis', 'alle', 'às', '〜', '~'],
  QEGG: ['El huevo avisa igualmente', 'Egg alerts still come through', "L'œuf prévient quand même", 'Ei meldet sich trotzdem', 'L\'uovo avvisa comunque', 'O ovo avisa mesmo assim', 'タマゴは つうち する', '알은 그래도 알림'],
  CATS: ['Avisos', 'Alerts', 'Alertes', 'Hinweise', 'Avvisi', 'Avisos', 'つうちの しゅるい', '알림 종류'],
  C_needs: ['Necesidades (hambre, sed, baño, ánimo)', 'Needs (hunger, thirst, bath, mood)', 'Besoins (faim, soif, bain, moral)', 'Bedürfnisse', 'Bisogni', 'Necessidades', 'ひつよう', '필요'],
  C_evo: ['Evolución y despedida', 'Evolution & farewell', 'Évolution et départ', 'Entwicklung', 'Evoluzione', 'Evolução', 'しんか', '진화'],
  C_enc: ['Pokémon salvajes', 'Wild Pokémon', 'POKEMON sauvages', 'Wilde Pokémon', 'Pokémon selvatici', 'Pokémon selvagens', 'やせいの ポケモン', '야생 포켓몬'],
  C_egg: ['Huevo / incubadora', 'Egg / incubator', 'Œuf / incubateur', 'Ei / Brutkasten', 'Uovo / incubatrice', 'Ovo / incubadora', 'タマゴ', '알 / 부화기'],
  C_daily: ['Racha y retos del día', 'Streak & daily challenges', 'Série et défis du jour', 'Serie & Tagesaufgaben', 'Serie e sfide', 'Sequência e desafios', 'れんぞく と チャレンジ', '연속 기록과 도전'],
  OFFALL: ['Notificaciones desactivadas (pastilla NOTIF en Ajustes)', 'Notifications are off (NOTIF pill in Settings)', 'Notifications coupées (pastille NOTIF dans Réglages)', 'Benachrichtigungen aus (NOTIF in Optionen)', 'Notifiche disattivate (NOTIF in Impost.)', 'Notificações desligadas (NOTIF em Ajustes)', 'つうち オフ', '알림 꺼짐'],
  TURNON: ['Activar notificaciones', 'Turn notifications on', 'Activer les notifications', 'Einschalten', 'Attiva', 'Ativar', 'オンにする', '켜기'],
};
const NST = (k, ...a) => sprintf(NSX[k][gLang], ...a);
const nel = (id) => document.getElementById(id);

function saveNotif(c) {
  prefs.put('notif', c); prefs.flush();
  applyService();
  sendPlan(true);
  renderNotifSet();
}
function hourOpts(sel) {
  let h = '';
  for (let i = 0; i < 24; i++) h += `<option value="${i * 60}"${i * 60 === sel ? ' selected' : ''}>${String(i).padStart(2, '0')}:00</option>`;
  return h;
}
function renderNotifSet() {
  const box = nel('opt-ns');
  if (!box) return;
  if (!bgAvailable()) { box.hidden = true; return; }
  box.hidden = false;
  const c = notifCfg();
  let h = `<h3>${esc(NST('TITLE'))}</h3>`;
  if (!bgEnabled) h += `<p class="small">${esc(NST('OFFALL'))}</p><div class="row"><button type="button" class="blue" data-ns="on">${esc(NST('TURNON'))}</button></div>`;
  h += `<div class="row tabs">${[0, 1, 2].map((m) => `<button type="button" data-mode="${m}" class="${c.mode === m ? 'on' : ''}">${esc(NST('M' + m))}</button>`).join('')}</div>`;
  h += `<p class="how">${esc(NST('H' + c.mode))}</p>`;
  h += `<div class="nsq"><label><input type="checkbox" data-q="quiet"${c.quiet ? ' checked' : ''}> ${esc(NST('QUIET'))}</label>
    <span>${esc(NST('FROM'))} <select data-q="qs">${hourOpts(c.qs)}</select> ${esc(NST('TO'))} <select data-q="qe">${hourOpts(c.qe)}</select></span>
    <label><input type="checkbox" data-q="qegg"${c.qegg ? ' checked' : ''}> ${esc(NST('QEGG'))}</label></div>`;
  h += `<p class="small" style="margin-top:10px">${esc(NST('CATS'))}</p><div class="nsc">` +
    ['needs', 'evo', 'enc', 'egg', 'daily'].map((k) => {
      const off = c.mode === 2 && (k === 'enc' || k === 'egg');
      return `<label class="${off ? 'off' : ''}"><input type="checkbox" data-cat="${k}"${c.cat[k] && !off ? ' checked' : ''}${off ? ' disabled' : ''}> ${esc(NST('C_' + k))}</label>`;
    }).join('') + '</div>';
  box.innerHTML = h;
}
nel('opt-ns').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.ns === 'on') { setBg(true); renderNotifSet(); return; }
  if (b.dataset.mode !== undefined) { const c = notifCfg(); c.mode = +b.dataset.mode; sfxPlay(SFX_TAP); saveNotif(c); }
});
nel('opt-ns').addEventListener('change', (e) => {
  const t = e.target, c = notifCfg();
  if (t.dataset.cat) c.cat[t.dataset.cat] = t.checked;
  else if (t.dataset.q === 'quiet' || t.dataset.q === 'qegg') c[t.dataset.q] = t.checked;
  else if (t.dataset.q) c[t.dataset.q] = +t.value;
  else return;
  saveNotif(c);
});
