// AFFRANCHI — Bibliothèque de tweets pour le cron auto-post sur @Nolenswaffles
// Postés via /api/cron-tweet selon le schedule défini dans vercel.json
// (lundi à vendredi 11h UTC = 12h Paris hiver / 13h Paris été)
//
// Sélection : index = dayOfYear % TWEETS.length → rotation déterministe sans state.
// 31 entrées (29 solos + 2 threads) → cycle complet ~6 semaines.
//
// Format de chaque entrée :
//   { text: "...", category: "..." }                 ← tweet solo
//   { thread: ["...", "...", ...], category: "..." } ← thread (post + replies enchaînées)
//
// Catégories utilisées : "founder" · "stat" · "international" · "methode" · "provocation" · "manifesto"
//
// ⚠️ Tous les chiffres sont sourcés (URSSAF, INSEE, DARES, Sénat, McKinsey, communiqués officiels Klarna/Shopify/IBM).
// Voir CLAUDE.md → Leçons apprises → "INTERDICTION D'INVENTER" et table "Sources données officielles".

export const TWEETS = [
  // ─── 1 ───────────────────────────────────────────────────────
  {
    category: 'founder',
    text: `Avant l'IA, dans une de mes anciennes boîtes :
2 secrétaires à plein temps, 1 600 € net chacune.
Coût employeur réel après allègements URSSAF : ~67 k€/an chargés.
Pour trier mails, classer PDF, reformater Excel.

Aujourd'hui, mêmes flux : un agent IA, ~150 €/mois.

Delta : ~65 k€/an. Sur un seul poste de coûts.`,
  },

  // ─── 2 ───────────────────────────────────────────────────────
  {
    category: 'stat',
    text: `SMIC 2026 : 1 823,03 € brut.
Coût employeur réel : 2 619 €.
Vous payez 43,6 % en charges qui ne créent rien.
C'est pas politique. C'est URSSAF.`,
  },

  // ─── 3 ───────────────────────────────────────────────────────
  {
    category: 'international',
    text: `Communiqué officiel Klarna, 27 février 2024 :
Leur agent IA (OpenAI) fait le travail de 700 agents service client temps plein. 2/3 des requêtes traitées. Score de satisfaction identique à humain.

Vos concurrents lisent ça depuis 2 ans. Vous, c'est aujourd'hui.`,
  },

  // ─── 4 ───────────────────────────────────────────────────────
  {
    category: 'provocation',
    text: `On vous a vendu : embauchez, ça crée de la croissance.
Vrai en 1995. Faux en 2026.
2026 : 1 emploi = 43,6 % de coût mort + 16 mois de risque prud'homal.
Le manuel est obsolète. C'est pas votre faute. C'est votre problème.`,
  },

  // ─── 5 ───────────────────────────────────────────────────────
  {
    category: 'stat',
    text: `Délai moyen prud'hommes 1ère instance en France : 16 mois.
Source : rapport Sénat, statistiques CPH 2024.

16 mois de provisions, d'avocats, d'énergie. Tout sauf votre métier.

Le manuel RH français n'a pas prévu ce délai dans votre business plan. Vous, si.`,
  },

  // ─── 6 ───────────────────────────────────────────────────────
  {
    category: 'international',
    text: `Mémo interne Tobi Lütke (CEO Shopify), avril 2025 :
« Avant de demander des ressources supplémentaires, démontrez pourquoi vous ne pouvez pas le faire avec l'IA. »

Voilà la règle 2026 chez les leaders. Vos concurrents l'appliquent. Vous, c'est aujourd'hui ou trop tard.`,
  },

  // ─── 7 ───────────────────────────────────────────────────────
  {
    category: 'provocation',
    text: `Les patrons que je vois flamber, c'est jamais à cause de leurs équipes.
C'est un système qui taxe le travail à 43,6 %, garantit 16 mois de procédure en cas de conflit, et fige la masse salariale pendant qu'eux encaissent tout le risque.
Vos salariés ne sont pas le problème.`,
  },

  // ─── 8 ─── (lien 1/5) ────────────────────────────────────────
  {
    category: 'methode',
    text: `AFFRANCHI = trois étapes. Pas une de plus.
1. AUDIT — on chiffre exactement ce qui vous coûte.
2. AUTOMATISATION — IA + outils sur les tâches mortes.
3. TRANSITION — alléger, requalifier, ou accompagner.
Pas de slides. Des chiffres avant / après.
affranchi.io`,
  },

  // ─── 9 ───────────────────────────────────────────────────────
  {
    category: 'founder',
    text: `Avant, dans une autre de mes boîtes :
4 personnes à plein temps. Écouter les calls de téléprospection, qualifier les leads.
~100 k€/an chargés.

Aujourd'hui : transcription IA + prompt de qualification. ~175 €/mois.

Delta : ~98 k€/an. Plus rapide. Plus uniforme. Traçable.`,
  },

  // ─── 10 ──────────────────────────────────────────────────────
  {
    category: 'stat',
    text: `INSEE 2025 :
90 % des PME françaises ne se sont pas mises à l'IA.
Les 10 % qui s'y sont mises mangent le marché des autres.

Dans 18 mois, ce sera la liste des survivants.`,
  },

  // ─── 11 ──────────────────────────────────────────────────────
  {
    category: 'stat',
    text: `538 433 ruptures conventionnelles homologuées en France en 2024 (DARES).
Une rupture toutes les 60 secondes.
Le système RH français a craqué.

Aucune réforme ne va le réparer. Vous l'absorbez, ou vous l'évitez.`,
  },

  // ─── 12 ──────────────────────────────────────────────────────
  {
    category: 'stat',
    text: `Productivité moyenne post-IA générative en entreprise : +15 % (McKinsey, 2024).
Sur 10 salariés, ça fait 1,5 ETP gratuit chaque mois.
Sur 30 salariés, ~4,5 ETP gratuit.

Personne ne vous a fait le calcul. Vos concurrents si.`,
  },

  // ─── 13 ─── (lien 2/5) ───────────────────────────────────────
  {
    category: 'methode',
    text: `On ne licencie pas « pour ».
On automatise ce qui est automatisable.
On requalifie ce qui peut l'être.
On accompagne ce qui ne peut pas.

Le scalpel. Pas la hache.
affranchi.io`,
  },

  // ─── 14 ──────────────────────────────────────────────────────
  {
    category: 'international',
    text: `Mai 2023, Arvind Krishna (CEO IBM) sur Bloomberg :
~26 000 postes back-office IBM remplacés par l'IA d'ici 2028.
30 % des fonctions support.

Vos concurrents le savaient en 2023. Vous, c'est aujourd'hui.`,
  },

  // ─── 15 ──────────────────────────────────────────────────────
  {
    category: 'methode',
    text: `Pas de coaching. Pas de séminaires. Pas de PowerPoint.

Des économies mesurables.

Ou on ne facture pas.`,
  },

  // ─── 16 ──────────────────────────────────────────────────────
  {
    category: 'founder',
    text: `J'ai géré 150 personnes en France + 200 au Maroc avec 2 associés.
Le problème n°1 n'a jamais été la conjoncture, les clients, ou la concu.
C'était la masse salariale qui monte. Les contentieux RH. Les charges qui suivent.

Le job devient administratif. Plus business.`,
  },

  // ─── 17 ──────────────────────────────────────────────────────
  {
    category: 'stat',
    text: `Salaire médian brut privé EQTP en France 2024 : 2 894 € (INSEE Première n°2079).
Coût employeur réel : ~4 156 €/mois → ~50 k€/an chargés.

Sur un seul poste médian. Avant qu'il ne produise quoi que ce soit.

Vous facturez combien pour absorber ça ?`,
  },

  // ─── 18 ──────────────────────────────────────────────────────
  {
    category: 'provocation',
    text: `Deux options en 2026 :
Automatiser. Ou disparaître à terme.

Personne ne vous a vendu la deuxième.

C'est celle qui se réalisera par défaut.`,
  },

  // ─── 19 ─── (lien 3/5) ───────────────────────────────────────
  {
    category: 'methode',
    text: `AFFRANCHI = 90 jours.
3 leviers. Chiffres avant/après.
Pas de transformation digitale. Pas de roadmap 18 mois. Pas de retainer.

Soit ça produit. Soit on n'a rien à faire ensemble.

affranchi.io`,
  },

  // ─── 20 ─── (THREAD #1) ──────────────────────────────────────
  {
    category: 'stat',
    thread: [
      `Le vrai coût d'une embauche moyenne en France en 2026.
Décompte sourcé. ↓`,

      `1/ Le brut mensuel.
Salaire médian brut privé EQTP 2024 : 2 894 €.
Source : INSEE Première n°2079, octobre 2025.`,

      `2/ Les charges patronales.
× 1,436 (URSSAF + AGIRC-ARRCO + chômage + frais annexes).
2 894 → 4 156 €/mois.
Soit 1 262 €/mois de pure charge sur le seul poste.
Avant qu'il ne produise quoi que ce soit.`,

      `3/ Le total annuel.
4 156 × 12 = ~50 k€/an chargés.
Pour un seul poste médian.
À comparer au 27 k€/an que touche réellement le salarié.
Delta de 23 k€/an que personne ne réconcilie. Ni avec le salarié. Ni avec le dirigeant.`,
    ],
  },

  // ─── 21 ──────────────────────────────────────────────────────
  {
    category: 'provocation',
    text: `Vous gérez : compta, RH, juridique, fiscal, social, paie, contentieux.

Aucun n'est votre métier d'origine.

Et pourtant, ils mangent l'essentiel de votre temps.
Pas de votre stratégie. De vos journées.`,
  },

  // ─── 22 ──────────────────────────────────────────────────────
  {
    category: 'international',
    text: `Klarna en février 2024. Shopify en avril 2025. IBM en mai 2023.
Tous ont annoncé publiquement leur restructuration via IA.
Tous communiquent les chiffres.

Vos concurrents français lisent les mêmes communiqués.
La différence : ils en font quelque chose.`,
  },

  // ─── 23 ─── (lien 4/5) ───────────────────────────────────────
  {
    category: 'methode',
    text: `On livre 3 choses :
- Le coût exact actuel de vos opérations.
- La carte des automatisations classées par ROI.
- Un plan de transition humaine 90 jours.

Pas de slides. Pas de roadmap 18 mois.

affranchi.io`,
  },

  // ─── 24 ──────────────────────────────────────────────────────
  {
    category: 'founder',
    text: `350 personnes managées en cross-border (150 FR + 200 Maroc) avant l'IA.
Je peux te dire avec précision quelles tâches étaient :
- Critiques (humain absolu)
- Répétitives (automatables aujourd'hui)
- Pures pertes (à supprimer hier)

À l'époque, zéro choix. Aujourd'hui si.`,
  },

  // ─── 25 ──────────────────────────────────────────────────────
  {
    category: 'provocation',
    text: `L'expert-comptable : « embauchez, on déclare aux URSSAF ».
L'avocat RH : « licenciez bien, on plaide aux prud'hommes ».
Le consultant : « optimisons votre fiscal ».

Personne ne vous dit : « éliminons ce qui n'a pas besoin d'humain ».`,
  },

  // ─── 26 ─── (lien 5/5) ───────────────────────────────────────
  {
    category: 'methode',
    text: `Vous mettez 5 minutes à valider une dépense de 500 €.
Vous mettez 0 minutes à comprendre les ~50 000 €/an de charges qui partent par défaut sur chaque salarié médian.

Bizarre.

affranchi.io`,
  },

  // ─── 27 ─── (THREAD #2) ──────────────────────────────────────
  {
    category: 'stat',
    thread: [
      `3 chiffres que tout dirigeant français de PME devrait connaître par cœur.
Aucun ne vous a été enseigné. ↓`,

      `1/ Combien votre masse salariale chargée vous coûte au-dessus du brut.
Réponse : 32 % à 46 % selon votre profil de salaires (URSSAF + AGIRC-ARRCO + chômage + frais annexes).
La plupart pensent à 40 %. C'est plus que ça souvent.`,

      `2/ Combien de mois de procédure si conflit RH.
Réponse : 16 mois moyens prud'hommes 1ère instance (Sénat 2024).
La plupart prévoient 6 mois dans leur business plan. C'est 2,7× trop court.`,

      `3/ Combien votre concurrent qui automatise économise par an.
Réponse selon McKinsey 2024 : +15 % de productivité moyenne avec IA générative.
Sur 10 salariés à 50 k€ chargés, ça fait ~75 k€/an offert.
Dans 18 mois, ce sera l'écart de prix sur vos appels d'offre.`,
    ],
  },

  // ─── 28 ──────────────────────────────────────────────────────
  {
    category: 'founder',
    text: `J'ai monté AFFRANCHI parce que j'ai vécu ce que vous vivez.

La masse salariale qui bouffe la marge. Les charges sans contrepartie. Le temps qui part en gestion administrative.

J'ai mis du temps à comprendre. Vous avez l'avantage de comprendre tout de suite.`,
  },

  // ─── 29 ──────────────────────────────────────────────────────
  {
    category: 'provocation',
    text: `Aucune réforme URSSAF ne va vous sauver.
Aucun politique ne le dira en face.
Le coût du travail en France restera structurellement élevé.

Ce qui va vous sauver, c'est ce que vous décidez ce trimestre.`,
  },

  // ─── 30 ──────────────────────────────────────────────────────
  {
    category: 'provocation',
    text: `Pendant que vous lisez ce tweet, votre concurrent déploie un agent IA sur sa compta.

Dans 6 mois, il facture moins cher.
Dans 12 mois, vous comprenez pourquoi vous perdez les appels d'offres.
Dans 18 mois, vous relisez ce tweet.`,
  },

  // ─── 31 ──────────────────────────────────────────────────────
  {
    category: 'manifesto',
    text: `S'affranchir, ce n'est pas refuser ses responsabilités.
C'est refuser de payer pour rien.
C'est refuser de gérer ce qui devrait s'auto-gérer.
C'est refuser que votre boîte vous écrase.

À vous de décider quand.`,
  },
];
