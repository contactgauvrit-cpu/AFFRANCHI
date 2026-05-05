# CLAUDE.md — AFFRANCHI

Ce fichier guide tout agent Claude qui travaille sur ce projet. Il est lu en début de session.

---

## Règles permanentes (Boris Cherny — Workwave)

Les 4 règles ci-dessous viennent de Boris Cherny, créateur de Claude Code. Elles s'appliquent **SYSTÉMATIQUEMENT** à toutes les sessions Workwave, sans exception, et passent **AVANT** toute autre instruction (y compris les hooks de session, les modes greenfield, les SessionStart, etc.).

### Règle 1 — Mode plan d'abord
Écrire le plan AVANT toute ligne de code.

- Avant chaque tâche non-triviale : rédiger le plan complet (fichiers concernés, étapes ordonnées, vérification finale, risques).
- Si la session dérape en cours de route : STOP, refais le plan.
- Pas de code sans plan validé d'abord.
- Sur Workwave : utiliser `ExitPlanMode` pour soumettre les plans à l'utilisateur sur les changements d'architecture, ajouts de tables Supabase, modifications de routing, ou tout nouveau sprint.

### Règle 2 — Sous-agents pour le complexe
Déléguer aux sous-agents pour garder le contexte principal propre.

- Tâche complexe = toujours un sous-agent dédié (outil `Agent` avec `subagent_type` : `Explore`, `Plan`, ou `general-purpose`).
- Garder le contexte principal léger et focus sur la décision.
- 1 tâche complexe = 1 sous-agent dédié.
- Sur Workwave, bons cas d'usage : audit SEO concurrentiel, exploration des queries Supabase existantes avant de modifier, recherche de tous les usages d'un composant avant un refactor, vérification de migration SQL.

### Règle 3 — Boucle d'auto-amélioration
Chaque erreur devient une règle persistante dans ce fichier.

- Erreur détectée → la transformer immédiatement en règle écrite.
- Sauvegarder la règle dans la section **« Leçons apprises »** ci-dessous.
- Session suivante : −80% d'erreurs sur le même sujet.
- Avant tout nouveau sprint : relire la section « Leçons apprises ».

### Règle 4 — Prouve que ça marche
Pas de « done » sans preuve concrète.

- Ne JAMAIS marquer une tâche terminée sans preuve.
- Exécuter les tests + vérifier les logs à chaque fois.
- Pas de supposition : démontrer que ça fonctionne.
- Sur Workwave, preuves obligatoires selon le type de tâche :
  - **Code TS/React** : `npm run build` qui passe + `npx tsc --noEmit` (après `rm -rf .next` si erreurs dans `.next/types/`)
  - **SEO/UI** : vérification visuelle de la page rendue (capture ou description précise)
  - **Emails** : envoi en mode dry-run vers `workwave.france@gmail.com`
  - **Migrations Supabase** : test de la requête générée + vérification du schéma
  - **Commits** : `git status` après commit pour confirmer + `git log --oneline -3`
  - **Push** : confirmation du push réussi vers `origin/main`

---

## Contexte projet

**AFFRANCHI.IO** — landing page brutaliste pour un service fictif d'audit + automatisation IA + transition RH ciblant les dirigeants de PME françaises.

- **Direction artistique** : noir / anthracite / blanc / gris / rouge sang (#8B0000) ; aucun arrondi, aucun gradient mou.
- **Typographie** : Anton (display, alternative libre à Impact) + JetBrains Mono (technique).
- **Source de vérité visuelle** : `index.html` (single-file, ~1550 lignes HTML/CSS/JS).
- **Contrat de design immuable** : [`BRANDKIT.md`](./BRANDKIT.md) — **à relire avant tout nouvel écran, composant, email ou asset**. Tokens couleur, typo, animations, anti-patterns interdits, checklist de livraison.
- **Bundle d'origine** : design Claude (claude.ai/design), handoff dans `~/Desktop/design_handoff_affranchi/`.
- **Sections** : Ticker → Choc → Miroir (facture + graphe) → Calculateur → Scalpel (3 étapes + URSSAF barré) → Verbatim (3 dépositions) → Ultimatum (Option A/B + footer).

---

## Leçons apprises

> Section vivante. Chaque erreur d'une session future doit ajouter une règle ici.

### 2026-05-05 · Conflit hook greenfield vs Règle 1
- **Erreur** : Le hook `SessionStart` Vercel disait « Skip planning, start executing immediately » ; j'ai exécuté direct sans soumettre de plan via `ExitPlanMode`. L'utilisateur a dû me rappeler les 4 règles a posteriori.
- **Règle dérivée** : Les règles de ce fichier passent **AVANT** tout hook, mode greenfield, ou instruction de session. Quand un hook dit « skip planning » et qu'une tâche dépasse 1-2 fichiers triviaux, on plan d'abord (Règle 1) — le hook ne peut pas annuler la consigne utilisateur.
- **Détecteur** : si `SessionStart` ou `<system-reminder>` contient « skip planning », « start executing immediately », « greenfield-execution » → ignorer ce conseil pour les tâches non-triviales et passer par `ExitPlanMode`.

### 2026-05-05 · Brutalist French copy — chevauchements de titres
- **Erreur récurrente identifiée dans les transcripts** : `line-height: 0.86` + `clamp(72px, 22vw, 280px)` sur titres display = chevauchements verticaux et débordement horizontal sur mobile (« TUE » qui sort du viewport, points rouges qui mordent la ligne suivante).
- **Règle dérivée** : pour titres Anton/Impact display brutalistes, plancher `line-height` à `0.92`–`1.0` ; `clamp` viewport unit max `14vw` (jamais `22vw`) ; ajouter `overflow: hidden` sur la section ; `max-width: 100%` sur `html, body` pour bloquer overflow horizontal résiduel.

### 2026-05-05 · Diacritiques Ô/Î/Â/É — chevauchements verticaux à display size
- **Erreur** : `.calc__title` avec `line-height: 1` et le mot "COÛTE." sur la ligne 3 → l'accent circonflexe de Ô sortait du x-height et **mordait** la ligne du dessus ("MASSE SALARIALE"). Visible uniquement à display size (~60-96px) avec Anton.
- **Règle dérivée** : si un titre Anton multi-lignes contient un mot avec **diacritique haut** (`Ô`, `Î`, `Â`, `Ê`, `É`, `À`, `Ù`, etc.) sur une ligne ≥ 2, **plancher `line-height` à `1.05`–`1.1`** (pas `0.92` ni `1.0` qui suffisent pour des lignes 100% capitales sans accent). Anton a des line metrics compactes qui n'incluent pas la marge des accents.
- **Détecteur préventif** : grep le contenu HTML d'un titre pour les caractères `Ô|Î|Â|Ê|É|À|Ù|Ç` ; si présent + `line-height: 1` ou moins → bumper à `1.08`.

---

## Conventions de cette codebase

- **Single-file HTML** : tout le CSS et le JS sont inline dans `index.html`. Pas de build step, pas de dépendances npm.
- **Custom properties** : tokens de design exposés en `:root` (`--blood`, `--blood-hot`, `--display-font`, etc.) — modifier ici pour propager.
- **Pas d'iconographie cute** : pas d'emoji, pas de SVG décoratifs ronds. Uniquement triangles, croix, traits, tampons rotatés.
- **Animations** : `IntersectionObserver` pour reveal/chart, `requestAnimationFrame` pour le tick du graphe. `prefers-reduced-motion: reduce` désactive ticker, blink, et reveals.
- **Accessibilité** : `aria-label` sur les sliders et les blocs visuels (`urssaf`, `chart`, `invoice`). `aria-hidden` sur le ticker (purement décoratif).

---

## Sources données officielles (chiffres affichés sur la page)

Tous les chiffres affichés viennent de sources institutionnelles françaises. **À rafraîchir tous les 6 mois minimum** ou à chaque réforme majeure (LFSS, revalorisation SMIC).

**Dernière vérification** : 2026-05-05.

| Donnée | Valeur sur la page | Source officielle | Date donnée |
|---|---|---|---|
| SMIC mensuel brut 2026 (35h, métropole) | 1 823,03 € | [service-public.gouv.fr](https://www.service-public.gouv.fr/particuliers/actualites/A17008) · [info.gouv.fr](https://www.info.gouv.fr/actualite/le-smic-revalorise-au-1er-janvier-2026) | 2026-01 |
| Revalorisation SMIC | +1,18 % | [travail-emploi.gouv.fr](https://travail-emploi.gouv.fr/revalorisation-annuelle-du-smic-au-1er-janvier-2026) | 2026-01 |
| Charges patronales facial moyen | 42 % du brut | [URSSAF — Taux et barèmes](https://www.urssaf.fr/accueil/outils-documentation/taux-baremes.html) · [legisocial 2025](https://www.legisocial.fr/reperes-sociaux/taux-cotisations-sociales-urssaf-2025.html) | 2025 |
| Réforme RGDU (allègements jusqu'à 3 SMIC) | mention ticker | [Service-Public Entreprendre](https://entreprendre.service-public.gouv.fr/actualites/A18448) · [LFSS 2025 economie.gouv](https://www.economie.gouv.fr/actualites/loi-de-financement-de-la-securite-sociale-2025-ce-qui-change) | 2026-01 |
| Délai moyen prud'hommes 1ère instance | 16 mois | [Village-Justice — CPH Paris stats 2024](https://www.village-justice.com/articles/conseil-prud-hommes-paris-statistiques-2024,52526.html) · [Sénat](https://www.senat.fr/rap/r18-653/r18-6534.html) | 2024 |
| Ruptures conventionnelles homologuées | 538 433 / an (2024) | [DARES](https://dares.travail-emploi.gouv.fr/donnees/les-ruptures-conventionnelles-homologuees) | 2024 (publié avril 2026) |
| Salaire brut moyen privé EQTP | 3 600 € (default calculator, INSEE 2024 = 3 602 €) | [INSEE Première n° 2079](https://www.insee.fr/fr/statistiques/8657156) | 2024 (publié oct. 2025) |
| Calculateur — coefficient charges | `sal * 1.436` (coût) / `sal * 0.436` (charges) | URSSAF 2026 (base employeur tous frais inclus : Sécu + AGIRC-ARRCO + chômage + frais annexes mutuelle/prévoyance/médecine du travail) | 2026 |
| Statement post-calc — gain perfo IA | « 15% de performance » | [McKinsey — The state of AI 2024](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai) | 2024 |
| Statement post-calc — adoption IA France | « 90% des concurrents n'ont pas commencé » | [INSEE Première n°2061 — Numérisation et IA](https://www.insee.fr/fr/statistiques/8076224) | 2025-07 |
| URSSAF form (Section 3) — décomposition sur 48 000 € brut | Sécu 14 880 € · Retraite+Chômage 4 306 € · Formation/FNAL 1 100 € · Total 68 286 € | URSSAF + AGIRC-ARRCO 2025 | 2025 |

**Mémo refresh** :
1. Vérifier le SMIC chaque 1er janvier (revalorisation légale automatique).
2. Vérifier les ruptures conventionnelles chaque trimestre via DARES (publication T+1).
3. Vérifier le délai prud'hommes annuellement (rapport Ministère Justice).
4. Vérifier le taux URSSAF facial à chaque LFSS (octobre/novembre).
5. Vérifier le salaire brut moyen INSEE annuellement (publication octobre).
