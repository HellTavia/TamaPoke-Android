#!/usr/bin/env python3
"""Extrait les attaques de Rouge/Bleu depuis les CSV de PokeAPI -> tools/gen1_moves.json

    python3 tools/gen1_moves.py <dossier pokeapi/data/v2/csv>

- attaques 1 à 165 (1re génération), valeurs de Rouge/Bleu (move_changelog
  remet type, puissance, précision et PP d'origine) ;
- apprentissage par niveau de Rouge/Bleu (version_group 1, méthode 1) ;
- noms dans les 8 langues du jeu (portugais : anglais, PokeAPI n'en a pas).
On garde les attaques offensives, celles qui changent les statistiques et
celles qui soignent ; les attaques à statut pur (sommeil, paralysie…) et les
cas spéciaux (Téléport, Trempette, Morphing…) sont laissés de côté.
"""
import csv, json, sys
from pathlib import Path

src = Path(sys.argv[1])
rd = lambda f: list(csv.DictReader(open(src / f, encoding='utf-8')))
TYPES = {int(r['id']): r['identifier'] for r in rd('types.csv')}

moves = {int(r['id']): r for r in rd('moves.csv') if int(r['id']) <= 165}
# valeurs d'origine : la 1re entrée du changelog (version la plus ancienne) qui touche le champ
chg = sorted(rd('move_changelog.csv'), key=lambda r: int(r['changed_in_version_group_id']))
gen1 = {}
for mid, r in moves.items():
    m = {'type': TYPES[int(r['type_id'])], 'pow': int(r['power']) if r['power'] else 0,
         'acc': int(r['accuracy']) if r['accuracy'] else 0, 'pp': int(r['pp'] or 0), 'id': r['identifier']}
    done = set()
    for c in chg:
        if int(c['move_id']) != mid or int(c['changed_in_version_group_id']) <= 2:
            continue
        for k, f in (('type', 'type_id'), ('pow', 'power'), ('acc', 'accuracy'), ('pp', 'pp')):
            if c[f] and k not in done:
                m[k] = TYPES[int(c[f])] if k == 'type' else int(c[f])
                done.add(k)
    gen1[mid] = m

meta = {int(r['move_id']): r for r in rd('move_meta.csv')}
stat = {}
for r in rd('move_meta_stat_changes.csv'):
    stat.setdefault(int(r['move_id']), []).append((int(r['stat_id']), int(r['change'])))
STAT = {2: 'atk', 3: 'def', 4: 'atk', 5: 'def', 6: 'spe', 7: 'acc', 8: 'eva'}  # Gen 1 : Spécial ~ ATQ/DEF

# dégâts fixes ou spéciaux : une puissance équivalente pour ce jeu
FIXED = {'sonic-boom': 45, 'dragon-rage': 60, 'seismic-toss': 65, 'night-shade': 65, 'psywave': 60, 'super-fang': 70}
OHKO = {'guillotine', 'horn-drill', 'fissure'}
SKIP = {'teleport', 'splash', 'transform', 'mimic', 'metronome', 'mirror-move', 'substitute', 'whirlwind', 'roar',
        'counter', 'bide', 'disable', 'conversion', 'haze', 'light-screen', 'reflect', 'mist', 'focus-energy',
        'struggle', 'rage', 'leech-seed'}
out = {}
for mid, m in gen1.items():
    ident = m['id']
    if ident in SKIP:
        continue
    mt = meta.get(mid, {})
    heal = int(mt.get('healing') or 0)
    eff = {}
    tgt_self = int(moves[mid]['target_id']) == 7
    if m['pow'] == 0 and ident in FIXED:
        m['pow'] = FIXED[ident]
    if ident in OHKO:
        m['pow'], m['acc'] = 100, 30
    if ident == 'rest':
        heal = 100
    if m['pow'] == 0 and heal <= 0:
        sc = stat.get(mid)
        if not sc:
            continue                      # statut pur : non gardé
        for sid, ch in sc:
            k = STAT.get(sid)
            if k:
                eff[k] = eff.get(k, 0) + ch
        if not eff:
            continue
        eff['self'] = 1 if tgt_self else 0
        # Gen 1 : Spécial ↑ (Amnésie, Croissance) ne compte qu'une fois
        if ident in ('amnesia',):
            eff = {'def': 2, 'self': 1}
        if ident in ('growth',):
            eff = {'atk': 1, 'self': 1}
    rec = {'t': m['type'], 'p': m['pow'], 'a': m['acc']}
    if eff:
        rec['e'] = eff
    if heal > 0:
        rec['h'] = heal
    out[mid] = rec

names = {}
LANGS = {7: 'ES', 9: 'EN', 5: 'FR', 6: 'DE', 8: 'IT', 1: 'JA', 3: 'KO'}
for r in rd('move_names.csv'):
    mid, lid = int(r['move_id']), int(r['local_language_id'])
    if mid in out and lid in LANGS:
        names.setdefault(mid, {})[LANGS[lid]] = r['name']
for mid in out:
    n = names.get(mid, {})
    out[mid]['n'] = [n.get('ES', n.get('EN')), n.get('EN'), n.get('FR', n.get('EN')), n.get('DE', n.get('EN')),
                     n.get('IT', n.get('EN')), n.get('EN'), n.get('JA', n.get('EN')), n.get('KO', n.get('EN'))]

learn = {}
for r in rd('pokemon_moves.csv'):
    pid, vg, mid, meth = int(r['pokemon_id']), int(r['version_group_id']), int(r['move_id']), int(r['pokemon_move_method_id'])
    if pid <= 151 and vg == 1 and meth == 1 and mid in out:
        learn.setdefault(pid, []).append([int(r['level']), mid])
for pid in learn:
    learn[pid] = sorted(set(map(tuple, learn[pid])), key=lambda x: (x[0], x[1]))
    learn[pid] = [list(x) for x in learn[pid]]

json.dump({'moves': out, 'learn': learn}, open(Path(__file__).resolve().parent / 'gen1_moves.json', 'w', encoding='utf-8'),
          ensure_ascii=False, separators=(',', ':'))
print(len(out), 'attaques,', len(learn), 'espèces')
