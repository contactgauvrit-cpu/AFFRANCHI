# BRANDKIT — AFFRANCHI.IO

Contrat de design **immuable**. Toute page, composant, email ou asset livré pour AFFRANCHI doit respecter ce document à la lettre. En cas de doute → relire ce fichier avant de coder.

> Source de vérité visuelle : `index.html`. Ce brandkit en extrait les tokens — si un conflit apparaît, le HTML rendu fait foi.

---

## 1. Identité & ton

**Positionnement** : diagnostic médico-légal pour dirigeants de PME. On ne vend pas, on **constate**. La page n'est pas une publicité, c'est une **pièce de dossier**.

**Voix** :
- Française, accusatoire, froide.
- Vocabulaire judiciaire / médical / comptable : *DOSSIER, PIÈCE, DÉPOSITION, AVERTISSEMENT, DIAGNOSTIC, IMPAYÉ, SUPPRIMÉ, RÉCURRENT, DÉFINITIF, CONFIDENTIEL, NDA, VERBATIM, AUDIT, CHIRURGIE, SCALPEL, MIROIR, ULTIMATUM*.
- Phrases courtes. Points en rafale. Aucun adjectif décoratif.
- Tutoiement interdit. Vouvoiement uniquement.
- TOUTES LES MAJUSCULES sur tout titre, label, métadonnée, bouton.
- Le point `.` est une arme : on l'utilise seul (`L'URSSAF.`) pour scander.

**Mots interdits** : *innovant, solution, accompagnement, ensemble, partenariat, journey, expérience, magique, simple, facile.*

**Mots à privilégier** : *exécuter, supprimer, remplacer, sortir, trancher, scanner, identifier, sécuriser, définitif, brut.*

---

## 2. Tokens couleur

Tous exposés en CSS custom properties dans `:root` — modifier ici pour propager.

| Token | Hex | Rôle |
|---|---|---|
| `--black` | `#000000` | Fond principal |
| `--anthracite` | `#111111` | Fond secondaire (Miroir, Verbatim, calc__grid) |
| `--white` | `#FFFFFF` | Texte principal, bordures fortes (2-4px) |
| `--gray` | `#AAAAAA` | Texte secondaire, métadonnées, scale labels |
| `--gray-dim` | `#555555` | Bordures faibles, dashed/dotted, désactivé |
| `--blood` | `#8B0000` | Rouge sang — barres, tampons, fond CTA, slider thumb, croix barrée |
| `--blood-hot` | `#B30000` | Rouge accent — texte d'urgence, hover CTA, points rouges, borders stamp |

**Règle** :
- Un seul accent de couleur : le rouge sang. Pas de bleu, pas de vert, pas de jaune. Jamais.
- Le rouge est précieux : il **ponctue**, il ne décore pas. Si plus de 3 éléments rouges sont visibles dans un même viewport → trop.
- Les nuances de gris suivent un escalier strict : `#000 → #111 → #555 → #AAA → #FFF`. **Pas d'autre gris**.

---

## 3. Typographie

### Familles
- **Display (titres, boutons, labels structurels)** : `'Anton', 'Impact', 'Arial Narrow Bold', sans-serif`
  - Variable CSS : `--display-font`
  - Alternatives autorisées (via Tweaks) : Bebas Neue, Oswald, Impact. **Aucune autre.**
- **Technique (corps de texte, métadonnées, chiffres, factures)** : `'JetBrains Mono', monospace`

### Règles dimensionnelles (toujours en `clamp()`)
- Hero ultime : `clamp(56px, 14vw, 200px)` — **plafonner à 14vw**, jamais 22vw (cause débordement mobile).
- Titres section : `clamp(40px, 9vw, 96px)` à `clamp(48px, 10vw, 120px)`.
- Titres composant (urssaf, chart-block) : `22px` à `36px` fixe.
- Sous-titres / labels JetBrains : `10px–13px` avec `letter-spacing: 0.15em–0.3em`.

### Règles `line-height`
- Titres display : **plancher à `0.92`** (jamais en dessous), idéal `0.95`–`1.0`.
- Texte technique : `1.4`–`1.7`.
- Une seule ligne (totaux, `VOTRE VIE.`, `2 800 €`) : `line-height: 1` + `white-space: nowrap`.

### Règles `letter-spacing`
- Display titres : `-0.02em` à `0.005em` (resserré, jamais espacé).
- Display labels (boutons, totaux) : `0.005em` à `0.04em`.
- Tech UPPERCASE labels : `0.15em` à `0.3em` selon hiérarchie (plus c'est haut, plus c'est espacé).

---

## 4. Layout & spacing

### Breakpoints
```
Mobile-first par défaut
@media (min-width: 768px)  → tablette / desktop léger
@media (min-width: 1100px) → desktop large
```
**Pas d'autres breakpoints**.

### Padding sections
| Breakpoint | Padding section |
|---|---|
| Mobile | `80–90px 20px` |
| 768+ | `100–120px 48px` |
| 1100+ | `140px 72px` |

### Bordures
- **Inter-sections** : `border-bottom: 4px solid var(--white)` — barre nette qui coupe la page.
- **Composants** (invoice, urssaf, calc__grid, deposition) : `border: 2px solid var(--white)`.
- **Champs internes** : `1px solid` (pleine), `1px dashed` (séparateurs), `1px dotted` (urssaf__field).
- **Border-radius** : `0`. **Toujours.** Jamais d'arrondi. C'est non-négociable.

### Max-widths
- Composants larges : `max-width: 920px` (invoice, chart-block, verdict).
- Composants moyens : `max-width: 720px` (urssaf, choc__sub).
- Texte : `max-width: 14ch–16ch` pour les titres, `max-width: 52ch–60ch` pour le corps.

---

## 5. Composants signatures

### 5.1 Bouton primaire `.btn`
```
font: var(--display-font), uppercase, 0.04em
padding: 22px 32px
font-size: clamp(20px, 4vw, 28px)
background: var(--blood) → hover: var(--blood-hot)
transform hover: translate(2px, -2px)
shadow hover (JS): 6px 6px 0 0 #FFFFFF
suffixe: " →" (JetBrains Mono, 0.85em)
border-radius: 0
```
Variant `.btn--block` : `width: 100%`, `justify-content: space-between`.
Variant `.btn--ghost` : transparent + `1px solid var(--gray-dim)`, JetBrains 11px, pas de flèche.

### 5.2 Tampon rotaté
Pattern récurrent (`IMPAYÉ`, `SUPPRIMÉ`, `PIÈCE 0X`) :
```
border: 1.5px–2.5px solid var(--blood-hot)
color: var(--blood-hot)
padding: 4px 8px → 8px 14px selon taille
transform: rotate(-8deg) | rotate(-3deg) | rotate(3deg)
font-family: var(--display-font) ou JetBrains Mono uppercase
letter-spacing: 0.08em–0.2em
background: var(--black) (pour passer au-dessus de motifs)
```

### 5.3 Barré rouge (strike)
**Deux versions, à ne pas confondre** :
- **Barre superposée** (`.choc__title .strike::after`) : `position: absolute`, hauteur `clamp(6px, 1.4vw, 14px)`, `background: var(--blood)`, `transform: rotate(-2deg)` — pour les hero qui doivent rester lisibles.
- **Text-decoration** (`.option--a .option__title .strike`) : `text-decoration: line-through`, `text-decoration-color: var(--blood)`, `thickness: 3px` — pour les phrases entières en mode "rejeté".

### 5.4 Croix barrée plein cadre `.urssaf__cross`
Deux pseudo-éléments en X, `height: 8px`, `width: 130%`, `transform: rotate(±7deg)`. Sert à invalider un formulaire entier.

### 5.5 Section tag `.section-tag`
```
JetBrains Mono 11px / 0.3em / uppercase
color: var(--blood-hot)
::before { content:""; width: 28px; height: 1px; background: var(--blood-hot) }
```
Un trait rouge horizontal de 28px précède toujours le label de section.

### 5.6 Avertissement clignotant `.warning`
Bordure haute + basse `1px solid var(--blood)`, padding `10px 0`, triangle `▲` en `::before`, animation `blink` 1.4s.

### 5.7 Step numéroté outline → rouge
Chiffres énormes en outline (`-webkit-text-stroke: 2px var(--white); color: transparent`) qui passent en `var(--blood-hot)` au hover du `.step` parent.

---

## 6. Animations — catalogue exhaustif

| Nom | Cible | Durée | Easing | Trigger |
|---|---|---|---|---|
| `tickerScroll` | `.ticker__track` | `40s` | `linear infinite` | Toujours actif |
| `blink` | `.warning .blink` | `1.4s steps(2)` | `infinite` | Toujours actif |
| Reveal | `.reveal` → `.reveal.in` | `0.6s` | `ease-out` | `IntersectionObserver` threshold `0.12` |
| Chart collapse | `#linePath`, `#areaPath`, `#endDot`, `#deltaText` | `1800ms` | `1 - (1-t)^3` (cubic ease-out) | `IntersectionObserver` threshold `0.4`, **une seule fois** |
| Btn hover | `.btn` | `0.12s` | `linear` | `:hover` — `transform: translate(2px,-2px)` + JS box-shadow `6px 6px 0 0 #FFF` |
| Btn active | `.btn` | `0.12s` | `linear` | `:active` — `transform: translate(0,0)` |
| Step hover | `.step`, `.step__num` | `0.2s` | `linear` | `:hover` — bg → anthracite, num → blood-hot |
| Option hover | `.option` | `0.15s` | `linear` | `:hover` |
| Final CTA shake | `#finalCta` | `280ms` | `steps(4, end)` | `click` — keyframes `(-4,2)(4,-2)(-2,1)(0,0)` puis remplace texte par `DOSSIER OUVERT — CONFIRMATION PAR EMAIL` + inversion noir/blanc |

**Règle** :
- Toujours respecter `prefers-reduced-motion: reduce` → désactiver ticker, blink, reveals.
- Aucune animation `ease-in-out` molle. On préfère `linear`, `steps(N)`, ou cubic-out brutal (`1 - (1-t)^3`).
- Aucune transition sur `all`. Toujours nommer les propriétés.
- Aucun `transform: scale()` ni `rotate()` au hover sauf rotation déjà figée des tampons.

---

## 7. Iconographie & glyphes

**Autorisés uniquement** :
- `▲` — avertissement
- `●` — point ticker / liste
- `→` — suffixe CTA (Mono)
- `↓` — scroll cue, ghost CTA
- `▼` — delta négatif chart
- `«` `»` — guillemets français (verbatim)
- `—` `–` — tirets longs
- `№` — numéro de dossier
- `×` — multiplication (×2,4 EBITDA)

**Interdits, sans exception** :
- Emojis colorés (😀 🔥 ✨ 💼 etc.)
- SVG décoratifs avec coins arrondis
- Icônes Font Awesome / Material / Lucide
- Photos d'humains, photos stock
- Illustrations vectorielles "friendly"
- Dégradés, ombres molles, glows
- Drop-shadow `rgba(0,0,0,0.1)` etc. — la seule shadow autorisée est le `6px 6px 0 0 #FFF` du hover CTA (offset dur, pas de blur)

---

## 8. Patterns de copy récurrents

- **Ponctuation rouge** : terminer chaque mot/segment d'une énumération par un point rouge → `LES PRUD'HOMMES<span class="punct">.</span> L'URSSAF<span class="punct">.</span>`
- **Séparateur visuel** dans le corps : `— — —` en gris.
- **Format facture** : `— 0X` (numéro) + label en Anton + tag JetBrains à droite (`RÉCURRENT`, `PSYCHIQUE`, `HEBDO`, `DÉFINITIF`).
- **Format déposition** : `« quote en Anton avec mots-clés rouges. »` + meta 4 cellules `SECTEUR / EFFECTIF / RÉGION / KPI`.
- **Format step** : `0X` outline + LABEL Anton + barre rouge 60×4 + corps Mono + meta tags (1 en rouge `.hot`).
- **Total / verdict** : phrase ultra-courte en Anton rouge (`VOTRE VIE.`, `COÛT EMPLOYEUR — 81 360 €`).
- **Footer brand** : nom géant + `<span class="dot">.</span>` rouge, signature `CECI N'EST PAS UNE PUBLICITÉ. C'EST UN DIAGNOSTIC.`

---

## 9. Données chiffrées

- **Format monétaire** : `Math.round(n).toLocaleString('fr-FR') + ' €'` — espaces fines insécables remplacées par espaces normaux. Exemple : `204 624 €`.
- **Pourcentages** : nombre + `%` collé ou avec espace insécable selon contexte. Décimal avec virgule (`−68,4 %`), jamais point.
- **Nombres tabulaires** : `font-variant-numeric: tabular-nums` sur tout chiffre qui s'incrémente.
- **Délais** : `72H`, `21 JOURS`, `47 MIN` — unités attachées en majuscules.

---

## 10. Accessibilité — minimums obligatoires

- `lang="fr"` sur `<html>`.
- `aria-label` sur tout bouton-icône, slider, et bloc visuel sans texte explicite (`urssaf`, `chart`, `invoice`).
- `aria-hidden="true"` sur le ticker (purement décoratif).
- Contraste : noir/blanc OK partout. Le rouge `#B30000` sur noir ≈ 5.4:1 → OK pour AA. **Ne jamais** utiliser `--blood` (`#8B0000`) sur noir comme texte (3.2:1, échec AA).
- `prefers-reduced-motion` respecté (cf. §6).
- Cibles tactiles ≥ 44×44px sur mobile.

---

## 11. Anti-patterns — interdits absolus

| ❌ Interdit | ✅ À la place |
|---|---|
| `border-radius` > 0 | `0` partout |
| Dégradés (`linear-gradient`, `radial-gradient`) | Aplats opaques |
| Ombres avec blur (`box-shadow: 0 4px 8px rgba(...)`) | Ombre dure offset uniquement (`6px 6px 0 0 #FFF`) ou rien |
| Couleur bleue, verte, jaune, violette | Rouge sang ou neutre uniquement |
| Photos, illustrations, mascotte | Composants typographiques (factures, formulaires barrés) |
| Emojis colorés | Glyphes monochromes (§7) |
| Fonts serif, fonts script, fonts "fun" | Anton + JetBrains Mono uniquement |
| Texte en sentence case sur titres | Tout en MAJUSCULES |
| Animations `cubic-bezier` molles | `linear`, `steps()`, ou cubic-out brutal |
| Boutons "Get started", "Learn more" | "JE M'AFFRANCHIS", "DESCENDRE EN ENFER", "PLANIFIER MON AFFRANCHISSEMENT" |
| Messages d'erreur polis | Verdicts secs (`DIAGNOSTIC : VOUS BRÛLEZ X € PAR AN`) |
| `border-radius: 9999px` (pills) | Rectangles bruts |
| Hover qui fait grossir l'élément | Hover qui translate (offset) ou inverse les couleurs |

---

## 12. Checklist avant de livrer un nouvel écran

- [ ] Aucune couleur hors des 7 tokens du §2
- [ ] Aucun `border-radius`
- [ ] Tous les titres en Anton, tout le reste en JetBrains Mono
- [ ] `line-height ≥ 0.92` sur display, vérifié sans chevauchement à 320px / 768px / 1100px
- [ ] `clamp()` sur toute taille de titre, max ≤ `14vw`
- [ ] Au moins une preuve de "rugosité" : tampon rotaté, croix barrée, strike, ou triangle d'avertissement
- [ ] Glyphes uniquement issus de la liste §7
- [ ] `prefers-reduced-motion` testé (les animations s'éteignent proprement)
- [ ] Copy en majuscules, vouvoiement, ponctuation accusatoire (§1)
- [ ] Accessibilité : `aria-label` sur composants visuels, contraste vérifié
- [ ] Aucun overflow horizontal sur mobile (`max-width: 100%; overflow-x: hidden` sur `html, body`)
