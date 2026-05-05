# AFFRANCHI

Landing page brutaliste pour **AFFRANCHI.IO** — service fictif combinant audit + automatisation IA + transition RH, ciblant les dirigeants de PME françaises.

🔗 **En ligne** : https://affranchi-fx2c.vercel.app/

---

## Stack

- HTML / CSS / JavaScript inline dans un seul fichier (`index.html`) — aucun build, aucune dépendance npm.
- Polices : **Anton** (display) + **JetBrains Mono** (technique) via Google Fonts.
- Déploiement : **Vercel**, auto-deploy sur push vers `main`.

## Sections de la page

1. **Ticker en direct** — chiffres officiels charges, SMIC, prud'hommes, ruptures conv.
2. **CHOC** — hero "Votre boîte vous écrase" + double CTA.
3. **MIROIR** — facture mensuelle stylée + graphe SVG marge nette qui s'effondre au scroll.
4. **CALCULATEUR** — 3 sliders → 4 sorties URSSAF 2026 + statement McKinsey/INSEE.
5. **SCALPEL** — méthode 3 étapes + formulaire DSN URSSAF barré.
6. **DOSSIER À CHARGE** — 1 pièce maîtresse Matthew Gallagher + 3 dépositions PME anonymes.
7. **ULTIMATUM** — Option A (statu quo, barré) vs Option B (l'affranchissement) + footer.

## Fichiers du projet

| Fichier | Rôle |
|---|---|
| [`index.html`](./index.html) | La page complète. |
| [`BRANDKIT.md`](./BRANDKIT.md) | **Contrat de design immuable** : tokens couleur, typo, animations, glyphes autorisés, anti-patterns interdits, checklist de livraison. À relire avant tout nouvel écran ou composant. |
| [`CLAUDE.md`](./CLAUDE.md) | Règles d'agent (4 règles Boris Cherny / Workwave) + leçons apprises + table des sources de données officielles avec mémo de refresh. |
| [`.claude/launch.json`](./.claude/launch.json) | Configurations dev server local (Live Server, npx serve, Python http.server). |

## Sources données officielles

Tous les chiffres affichés viennent de sources institutionnelles françaises (URSSAF, INSEE, DARES, service-public.gouv.fr, AGIRC-ARRCO). Détails et URLs dans [`CLAUDE.md`](./CLAUDE.md#sources-données-officielles-chiffres-affichés-sur-la-page).

Dernière vérification : **mai 2026**.

## Convention de commits

```
feat(scope): nouvelle fonctionnalité
fix(scope):  correction
refactor(scope): refacto sans changement fonctionnel
docs(scope): doc uniquement
```

Scopes utiles : `verbatim`, `calc`, `miroir`, `choc`, `scalpel`, `ticker`, `ultimatum`, `brand`.

## Développement local

```bash
# Option 1 — Python (zéro install)
python3 -m http.server 8000

# Option 2 — npx serve
npx -y serve -l 5173 .

# Option 3 — Live reload (recommandé pour itérer sur le copy)
npx -y live-server --port=5500 --entry-file=index.html
```

Puis : http://localhost:8000 (ou 5173 / 5500).
