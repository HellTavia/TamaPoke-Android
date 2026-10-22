# TamaPoke pour Android

Portage Android du tamagotchi [TamaPoke](https://github.com/socquique/TamaPoke)
(firmware v1.17 pour Waveshare ESP32-S3-Touch-AMOLED-1.75).

Le firmware C++ a été traduit en JavaScript fonction par fonction et tourne dans
une WebView : mêmes règles, mêmes chiffres (cf. « Game manual » du dépôt
d'origine), même écran rond 466×466, mêmes 8 langues, mêmes 151 + shinies avec
les sprites PMD animés.

## Ajouts de ce fork (jusqu'à la version 1.17-android.18)

- **Soif** : 5ᵉ besoin, jauge EAU (−1/min éveillé, plus lent en dormant, plancher à 15 appli fermée), bouton verre pour boire (+35). Les baies donnent +5 d'eau, le mini-jeu et le sac −5. Sous 30 la joie baisse plus vite ; l'eau compte comme les autres besoins pour l'évolution (≥ 40), les négligences (≤ 10), la défense et la fugue.
- **Podomètre** : capteur de pas matériel d'Android (`TYPE_STEP_COUNTER`, il compte même appli fermée ; permission « Activité physique » sur Android 10+). Repli sur l'accéléromètre appli ouverte si le téléphone n'a pas de capteur. Marcher : +1 VIT tous les 1000 pas, −1 de poids tous les 300.
- **Rencontres sauvages** (à la Digimon) : une jauge de 400 à 1200 pas se remplit en marchant ; pleine, un POKEMON sauvage apparaît (3 en attente au maximum). Surtout des formes de base communes, parfois des rares, des formes évoluées une fois ton compagnon assez fort, très rarement un légendaire (Pokédex ≥ 25). Shiny à 1/64.
- **Combat** au tour par tour (le plus rapide commence) avec les stats ATQ/DEF/VIT de la fiche. À ton tour, un anneau se resserre sur l'adversaire : touche l'écran quand il entre dans la cible pour un coup parfait (×1,5). Combattre fatigue (énergie ≥ 20 requise).
- **Victoire** = capture : l'espèce entre dans le Pokédex (et le Pokédex shiny), +1 ATQ/DEF d'entraînement, et tu peux garder son œuf : il remplace le prochain œuf tiré au sort.

- **Notifications et arrière-plan** (v3) : service avec notification permanente (pas du jour), alerte de rencontre écran verrouillé, rappels faim/soif/bain/ennui/œuf/évolution/série, horloge au-dessus de l'écran rond. Pastille NOTIF dans Réglages.
- **Duel entre amis** (v4–v5) : pas de réseau ni de Bluetooth. Chaque téléphone affiche une carte de combat (QR ou code texte) ; chacun scanne ou colle celle de l'autre. Le combat est calculé à partir des deux cartes (tirage pseudo-aléatoire dont la graine vient des deux codes, joueur 1 = carte au plus petit numéro) : il est identique sur les deux téléphones, un seul gagnant. Un **code de vérification** de 4 caractères s'affiche à la fin : s'il est le même chez les deux, c'est le même combat. La carte reste figée 24 h, même si le compagnon évolue (bouton « Nouvelle carte » pour la renouveler à la main). 5 duels récompensés par jour.
- **Adversaires** (v6) : la carte (TPD2) contient un identifiant de dresseur permanent et un nom de dresseur facultatif. L'écran Duel liste chaque ami (nom ou surnom local modifiable) avec nombre de duels, victoires/défaites, son dernier Pokémon et la date. Un même combat rejoué n'est compté qu'une fois. Les cartes TPD1 des versions 4–5 restent lisibles.
- **Équipe et incubateur** (v7) : jusqu'à 6 POKEMON gardés « en pension » (temps figé : ni faim ni niveau), échangeables à tout moment avec le compagnon (un œuf en cours part alors à l'incubateur). Après une capture : dans l'équipe, son œuf, ou juste le Pokédex. L'incubateur fait éclore l'œuf en marchant : 2 000 pas (commun), 5 000 (rare), 10 000 (légendaire) ; le bébé rejoint l'équipe et le Pokédex. L'ancien « œuf gardé » des versions 2–6 est transféré à l'incubateur.
- **Types** (v8) : types de la 1re génération (Rouge/Bleu, 15 types, données PokeAPI) avec leurs forces, faiblesses et immunités ; seul le bug Spectre → Psy est corrigé (×2). Chaque POKEMON attaque avec son meilleur type ; s'il n'a aucun effet, il utilise Lutte (×0,5). Duels : cartes TPD3 (types appliqués seulement si les deux cartes sont TPD3).
- **Sauvegarde et transfert** (v8) : Réglages → OPTIONS. Fichier (sélecteur d'Android), texte à partager/coller, ou transfert direct en QR codes animés. L'ancienne partie est gardée (« Annuler le dernier import »).
- **Échange par QR** (v8) : un POKEMON → ÉCHANGER. Offre puis confirmation (la confirmation contient l'offre, l'ordre des scans n'a pas d'importance) ; une offre ne peut être reçue qu'une fois. Évolutions par échange : Kadabra, Machopeur, Gravalanch, Spectrum.
- **PC** (v9) : bouton PC dans la barre du bas. Jusqu'à 240 POKEMON hors équipe (temps figé). Après une capture : équipe, PC, son œuf ou juste le Pokédex ; un œuf de l'incubateur éclos avec l'équipe pleine part au PC. Tri par numéro, niveau ou date ; depuis le PC : vers l'équipe, comme compagnon, échanger, relâcher (deux touches). Depuis l'équipe : AU PC.
- **Échanges** (v9) : bouton dédié dans la barre du bas (au lieu de passer par l'équipe) : choix du POKEMON à proposer parmi l'équipe et le PC, reprise de l'échange en cours, historique. Le POKEMON proposé reste bloqué (⇄) jusqu'à la fin ou l'annulation.
- **PC pratique** (v10) : recherche (nom, surnom ou n°), filtre par type ou favoris, ♥ favoris protégés contre le relâcher (PC et équipe), relâcher plusieurs POKEMON d'un coup. Miniatures shiny aux vraies couleurs (PC, équipe, capture).
- **Sauvegarde automatique** (v10) : OPTIONS → choisir un dossier (sélecteur d'Android, permission persistante) ; une copie par semaine (`TamaPoke-auto-….txt`, les 4 dernières gardées), relue par « Charger un fichier ». Le dossier n'est pas transmis par l'export.
- **Historique des pas** (v10) : Balade → toucher le nombre de pas : 7 jours (barres + valeurs), puis 30 jours, moyenne, total, record. Les pas faits appli fermée sont comptés le jour où l'appli les récupère.
- **Aventure** (v11, bouton dans la barre du bas) :
  - *Zones et heure* : chaque semaine (lundi → dimanche) une zone tirée des biomes du firmware (prairie, plage, forêt, volcan, montagne) : ~60 % des rencontres en viennent. La nuit (21 h–6 h) apparaissent Nosferapti, Fantominus, Mélofée, Mimitoss, Soporifik… et plus de Roucool, Chenipan, Aspicot… (et l'inverse le jour).
  - *Défis du jour* : 3 défis par jour (marcher, gagner des combats, boire, manger, jouer, toilette, duel), un objet chacun, un Super Bonbon pour les trois.
  - *Sac* : tous les 1000 pas, 30 % de chances de trouver un objet. Potion (+40 énergie), Super Bonbon (+1 niveau), Pierres Feu/Eau/Foudre/Plante/Lune (évolutions de la 1re génération, dont Évoli au choix).
  - *Pension* : 2 POKEMON (équipe ou PC) ; après 2 500 pas, un œuf de la forme de base du premier déposé (Métamorph va avec tous, les légendaires ne pondent pas) à mettre dans l'incubateur.
  - *Badges* : 8 badges (pas, Pokédex, victoires, défis, duels), un Super Bonbon chacun ; aussi en 5ᵉ page de la Fiche.
- **Attaques** (v12) : vraies listes d'apprentissage de Rouge/Bleu (PokeAPI, `tools/gen1_moves.py` → `tools/gen1_moves.json`) : chaque POKEMON connaît les 4 dernières attaques apprises à son niveau, avec type, puissance et précision d'origine. En combat sauvage, le combat se déroule tout seul : l'attaque choisie (la meilleure au départ) se répète jusqu'à ce que tu touches une autre des 4 attaques, toujours affichées ; toucher ailleurs au bon moment dans l'anneau = coup parfait ×1,5 (v14). Gardées : attaques offensives, attaques qui changent les stats (étages −6…+6), soins (Soin, E-Coque, Repos). Laissés de côté : statuts (sommeil, paralysie…), PP, effets secondaires, charges (Lance-Soleil, Tunnel…). Bonus de même type ×1,2. Sans attaque offensive (Abra, Magicarpe < 15…) : Lutte.
- **Duel 3 contre 3** (v12) : cartes TPD4 = compagnon + 2 POKEMON de l'équipe choisis dans l'écran Duel ; chacun avec ses attaques, choix des attaques par l'IA, tirages identiques sur les deux téléphones, même code de vérification. Toucher l'écran pendant le duel = accéléré ×3. Avec une carte TPD1–3 d'une ancienne version : duel 1 contre 1 comme avant (l'ancienne version ne lit pas les cartes TPD4 : il faut la v12 des deux côtés).
- **Montre via Health Connect** (v13, Android 14+) : OPTIONS → Montre. Lit le total de pas de Health Connect (toutes sources, dédoublonnées par Health Connect : Fitbit, Withings…) à l'ouverture de l'appli, à l'ouverture de la Balade et toutes les 5 min. Règle : on garde le plus grand des deux totaux du jour (téléphone ou Health Connect) — la différence est ajoutée, jamais retirée, donc pas de double comptage. Hier est rattrapé une fois par jour. API système `android.health.connect` (pas de bibliothèque Jetpack) : pas disponible sous Android 13. v14 : l'APK cible désormais Android 14 (targetSdk 34), sans quoi Health Connect ignore l'appli ; service de premier plan de type `specialUse`, alarmes exactes `USE_EXACT_ALARM`, permission des notifications demandée au premier lancement.
- **Notifications et batterie** (v17, OPTIONS) : 3 modes. *Réactif* : tout à la minute (alarmes exactes, widget toutes les 15 s). *Équilibré* (défaut) : besoins regroupés sur 30 min et alarmes non exactes (Android les cale sur ses propres réveils), rencontres et œuf immédiats, widget toutes les 5 min. *Économie* : pas de service ni de notification permanente (les pas sont rattrapés à l'ouverture grâce au compteur matériel), au plus un rappel par tranche de 2 h 30. Heures calmes (22 h–8 h par défaut, rappels repoussés à la fin, l'œuf peut passer quand même), cases par type d'alerte (besoins, évolution, rencontres, œuf, série et défis — nouveau rappel à 18 h s'il reste des défis).
- **Plafonds** (v18) : niveau max 100 (le firmware allait jusqu'à 999) et stats max 255 (ATQ, DEF, VIT et PV) ; l'âge continue d'avancer, la Fiche affiche « NIVEAU MAX ». Une évolution qui demanderait plus que le niveau 100 (beaucoup de négligences) se fait au niveau 100. Avec `TP_EXT = false`, le firmware est inchangé.
- **Widget** d'écran d'accueil (jauges qui descendent appli fermée, pas du jour), **notification d'éclosion** de l'incubateur appli fermée, **vibrations** (désactivables dans OPTIONS).

Avec `TP_EXT = false` (dans `core.js`), le jeu redevient exactement le firmware : c'est ce que vérifie le test différentiel.

## Ce qui change par rapport à la carte

| Carte ESP32 | Android |
|---|---|
| RTC PCF85063 | heure du téléphone (le réglage d'heure applique un décalage) |
| Carte microSD | sprites intégrés à l'APK (`assets/www/mons`) |
| NVS (flash) | SharedPreferences via le pont `TPStore` |
| Haut-parleur ES8311 | WebAudio (mêmes notes carrées) |
| Bouton PWR / atténuation AMOLED | gérés par Android |
| Gestes seuls | gestes + barre Pokédex / Fiche / Équipe / PC / Échanges / Balade / Réglages + bouton retour |
| Langue par défaut : anglais | langue du téléphone si le jeu la connaît |

La progression hors ligne est celle du firmware : appli fermée, la créature
vieillit (2 semaines max), les barres descendent avec un plancher à 15, sans
négligence ni fugue en ton absence.

## Structure

```
www/            le jeu (index.html, core.js = pet.cpp/i18n/audio, game.js = TamaPoke.ino)
www/data.js     tables générées depuis le firmware (ne pas éditer)
android/        manifeste, ressources, code natif en smali (WebView + pont)
tools/          gen_data.py, make_icon.py, apktool.jar, uber-apk-signer.jar
test/           test différentiel C++ ↔ JavaScript de la logique du jeu
build.sh        construit et signe l'APK
```

## Reconstruire

Prérequis : Java 11+, Python 3 + Pillow, le dépôt TamaPoke et Arduino_GFX
(pour la police 5×7) clonés à côté.

```bash
git clone https://github.com/socquique/TamaPoke ../TamaPoke
git clone --depth 1 https://github.com/moononournation/Arduino_GFX ../Arduino_GFX
./build.sh ../TamaPoke ../Arduino_GFX      # -> dist/TamaPoke-<version>.apk
```

Pas besoin d'Android Studio ni du SDK : apktool embarque aapt2 et smali.
**Garde `tamapoke-release.jks`** : une mise à jour doit être signée avec la même
clé, sinon Android refuse de l'installer par-dessus (il faudrait désinstaller et
perdre la partie). Pour changer de version : `versionCode`/`versionName` dans
`android/AndroidManifest.xml`.

Tester dans un navigateur : `cd www && python3 -m http.server`, puis
http://localhost:8000. Console de debug (mêmes commandes que la console série) :
`tpDebug('HATCH')`, `tpDebug('LVL 16')`, `tpDebug('STATS')`, `tpDebug('WIPE')`…

## Vérifier la logique contre le firmware

```bash
g++ -std=c++17 -O1 -w -I ../TamaPoke/test/shim -I ../TamaPoke -o /tmp/diff test/diff_driver.cpp \
    ../TamaPoke/test/shim/shim.cpp ../TamaPoke/pet.cpp ../TamaPoke/i18n.cpp
for s in 1 2 3; do cmp <(/tmp/diff $s 5000) <(node test/diff.js $s 5000) && echo "seed $s OK"; done
```

Les deux implémentations jouent la même séquence d'actions aléatoires (même
générateur que le shim du dépôt) et doivent produire un état identique à chaque pas.

## Licences

Code d'origine : MIT (Quique Tortosa) ; ce portage reste sous MIT. Sprites :
PMD SpriteCollab, CC BY-NC 4.0. Pokémon © Nintendo / Game Freak / The Pokémon
Company. Projet de fan **non commercial** : ne pas vendre ni publier sur un store.
