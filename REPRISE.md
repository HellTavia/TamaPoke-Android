# TamaPoke Android — fiche de reprise (pour une nouvelle conversation)

> À coller/joindre au début d'une nouvelle conversation avec : `tamapoke-android-source.zip`
> (sources) et, si un build est demandé, `tamapoke-release.jks` (clé de signature).
> Version actuelle : **1.17-android.18** (versionCode 18). Utilisateur : fLO, en français.

## Le projet en bref
Fork Android (APK) de github.com/socquique/TamaPoke (tamagotchi Pokémon, firmware ESP32
v1.17). Le C++ du firmware est porté en JavaScript dans une WebView (écran rond 466×466,
police CP437 5×7, sprites PMD). Package `com.flo.tamapoke`, minSdk 26, **targetSdk 34**.
Testé par l'utilisateur sur **Pixel 7 Pro, Android 17** (Health Connect OK).

## Construire (sans Android Studio ni SDK)
```bash
git clone https://github.com/socquique/TamaPoke ../TamaPoke
git clone --depth 1 https://github.com/moononournation/Arduino_GFX ../Arduino_GFX
# tools/apktool.jar (2.12.1) et tools/uber-apk-signer.jar à télécharger (pas dans le zip)
./build.sh ../TamaPoke ../Arduino_GFX      # -> dist/TamaPoke-<versionName>.apk
```
- Version : `android/AndroidManifest.xml` (versionCode/versionName) **et** `APP_VERSION` dans `www/core.js`. Toujours incrémenter versionCode.
- Signature : `tamapoke-release.jks`, mot de passe `tamapoke` (dans build.sh), empreinte
  SHA-256 `a07191d6218295ee570966827fe6729e28f41f2427ec0b154cbe557493293f84`.
  Vérifier : `java -jar tools/uber-apk-signer.jar -y -a dist/X.apk --verifySha256 <empreinte>`.
  **Sans la même clé, la mise à jour ne s'installe pas (perte de la partie).** Ne jamais publier la clé.
- Zip source : exclure `www/mons/*`, `dist/`, `build/`, `tools/*.jar`, `icon-512.png`, `*.jks`.

## Arborescence
```
www/index.html   page, CSS, feuilles (sheets) HTML, ordre des scripts
www/data.js      GÉNÉRÉ par tools/gen_data.py (tables firmware + TYPES + MOVES) — ne pas éditer
www/core.js      logique (pet.cpp/i18n/audio) + fork : eau, pas, rencontres, équipe/PC, types,
                 attaques (useMove/aiMove/knownMoves), plafonds LV 100 / stats 255, zones/nuit
www/game.js      rendu canvas (TamaPoke.ino), combats, Balade, nav, alertes (buildAlerts/sendPlan), widget
www/duel.js      duels QR (cartes TPD1-4, TPD4 = 3 contre 3), simulation déterministe (mulberry32)
www/team.js      écran Équipe (canvas)       www/pc.js      PC + espace Échanges (HTML)
www/trade.js     échanges QR (TPT1/TPK1)     www/options.js OPTIONS, sauvegarde (TPS1), QR animés, sauvegarde auto
www/adventure.js Aventure : défis, sac/objets, pension, badges (crochets sur Pet.prototype)
www/health.js    Health Connect (pas de la montre)   www/notifset.js modes notifications/batterie
android/smali/com/flo/tamapoke/  code natif écrit à la main en smali :
  MainActivity (WebView, onActivityResult 0x2b fichier / 0x2c ouvrir / 0x2d dossier), Bridge (JS `TPStore`),
  PetService (podomètre en arrière-plan, FGS specialUse), AlarmReceiver, Notif, Widget(+Provider),
  Files (SAF), StartAct, Health (HealthConnectManager.aggregate), HcOpen
tools/  gen_data.py, make_icon.py, gen1_types.json, gen1_moves.py -> gen1_moves.json (PokeAPI)
test/   diff_driver.cpp + diff.js : test différentiel firmware C++ ↔ JS
```

## Règles importantes
- **`TP_EXT`** (core.js) : `false` = firmware exact. Tout ajout de gameplay doit être conditionné à
  `TP_EXT` pour garder le test différentiel identique :
  ```bash
  g++ -std=c++17 -O1 -w -I ../TamaPoke/test/shim -I ../TamaPoke -o /tmp/diff test/diff_driver.cpp \
      ../TamaPoke/test/shim/shim.cpp ../TamaPoke/pet.cpp ../TamaPoke/i18n.cpp
  for s in 1 2 3 4; do cmp <(/tmp/diff $s 5000) <(node test/diff.js $s 5000) && echo "seed $s OK"; done
  ```
- Textes : 8 langues dans l'ordre **ES, EN, FR, DE, IT, PT, JA, KO** (`gLang` 0-7). Sur le canvas,
  passer le texte par `toCp437()` sauf JA/KO (`gCjkFont`) ; `toast()` le fait tout seul.
- Smali : registres v0-v15 pour les invoke non-range ; `.registers` = locaux + paramètres ;
  vérifier les API contre `android-34/android.jar` (javap) ; **attention au sens des tests
  `SDK_INT`** (bug déjà eu : `if-ge`/`if-lt` inversés → Health Connect « Android < 14 »).
- Tester l'UI : `cd www && python3 -m http.server`, Playwright/Chromium avec un faux `TPStore`
  (localStorage) ; console de debug `tpDebug('LVL 16')`, `tpDebug('WILD')`, `tpDebug('HATCH')`.
- Sauvegarde : tout est dans `prefs` (JSON via `TPStore` SharedPreferences) ; export TPS1 exclut
  `stepLast`, `bkDir/bkList/bkLast` (propres au téléphone).

## Fonctions ajoutées (historique court)
v2 eau + podomètre/rencontres/combats · v3 arrière-plan, notifs, horloge · v4-6 duels QR entre amis
+ stats par ami · v7 équipe (6) + incubateur · v8 sauvegarde/transfert, types Gen 1, échanges QR,
widget, vibrations · v9 PC (240) + Échanges · v10 shinies, PC (recherche/filtre/favoris/multi),
sauvegarde auto hebdo (SAF), historique des pas · v11 Aventure (zones hebdo + Pokémon de nuit,
défis du jour, sac : Potion/Super Bonbon/5 pierres, pension → œufs, 8 badges) · v12 vraies
attaques Rouge/Bleu (4 par Pokémon) + duel 3 contre 3 (TPD4) · v13-16 Health Connect (Android 14+,
targetSdk 34, bugs corrigés) · v14 combat auto (l'attaque choisie se répète, boutons toujours
actifs) · v17 Notifications et batterie (Réactif / Équilibré / Économie, heures calmes, cases par
type d'alerte) · v18 niveau max 100, stats max 255 (PV compris).

## Idées en attente (proposées, pas faites)
- Lecture Health Connect en arrière-plan (permission READ_HEALTH_DATA_IN_BACKGROUND + service).
- Statuts (sommeil, paralysie…) et PP pour les attaques ; accélérer encore les duels.
