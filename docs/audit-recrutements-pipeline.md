# Audit — Contexte pipeline recrutement

Date : 2026-06-03
Module audité : `src/routes/recrutements.tsx`
URL concernées :

- `/recrutements`
- `/recrutements?pipeline=pipe-001`
- `/recrutements?pipeline=pipe-002`
- `/recrutements?pipeline=pipe-003`

## Objectif de l'audit

Vérifier que les données affichées dans l'espace Recrutements changent bien selon le contexte :

- Vue globale `/recrutements` : affichage de tous les pipelines et des tâches ouvertes globales de l'utilisateur.
- Vue pipeline `/recrutements?pipeline=...` : affichage uniquement des données rattachées au pipeline sélectionné.

## Résultat global

Le module est désormais majoritairement contextuel par `pipelineId`.

Les éléments suivants sont bien filtrés par pipeline en vue détail :

- tâches du pipeline ;
- candidatures du pipeline ;
- formulaires rattachés au pipeline ;
- ajout de tâche complémentaire ;
- ajout de formulaire ;
- panneau latéral des tâches utilisateur.

## Points validés

### 1. Tâches principales

En vue détail pipeline, les tâches affichées dans l'onglet `Tâches rattachées` sont calculées avec :

```ts
const selectedTaches = taches.filter((tache) => tache.pipelineId === selected?.id);
```

Conclusion : conforme.

### 2. Panneau latéral Mes tâches

Depuis la correction précédente, le panneau latéral utilise deux niveaux :

```ts
const mesTachesGlobales = taches.filter((tache) => tache.responsable === currentUser && tache.statut !== "Terminé");
const mesTachesAffichees = selected
  ? mesTachesGlobales.filter((tache) => tache.pipelineId === selected.id)
  : mesTachesGlobales;
```

Comportement attendu :

- `/recrutements` : toutes les tâches ouvertes de l'utilisateur.
- `/recrutements?pipeline=pipe-001` : uniquement les tâches ouvertes de l'utilisateur sur `pipe-001`.
- `/recrutements?pipeline=pipe-002` : uniquement les tâches ouvertes de l'utilisateur sur `pipe-002`.

Conclusion : conforme.

### 3. Candidatures

Les candidatures sont correctement rattachées :

```ts
const selectedCandidatures = candidatures.filter((candidature) => candidature.pipelineId === selected?.id);
```

Conclusion : conforme.

### 4. Formulaires rattachés

Les formulaires sont correctement filtrés :

```ts
const selectedFormulaires = formulaires.filter((formulaire) => formulaire.pipelineId === selected?.id);
```

Conclusion : conforme.

### 5. Création d'une tâche complémentaire

La création utilise bien le pipeline sélectionné :

```ts
pipelineId: selected.id
```

Conclusion : conforme.

### 6. Création d'un formulaire

La création utilise bien le pipeline sélectionné :

```ts
pipelineId: selected.id
```

Conclusion : conforme.

## Points à améliorer

### 1. URL avec pipeline invalide

Cas :

```txt
/recrutements?pipeline=pipe-inexistant
```

Le composant affiche bien `Pipeline introuvable`, mais le panneau latéral peut encore afficher les tâches globales car `selected` vaut `null`.

Correction recommandée :

```ts
const mesTachesAffichees = selected
  ? mesTachesGlobales.filter((tache) => tache.pipelineId === selected.id)
  : isDetailMode
    ? []
    : mesTachesGlobales;
```

### 2. Manque d'un résumé contextuel en haut de la vue pipeline

La vue détail affiche déjà le nombre total de tâches, mais pour une démo équipe il serait plus clair d'ajouter un bloc de contexte avec :

- nombre de tâches du pipeline ;
- nombre de tâches ouvertes de l'utilisateur sur ce pipeline ;
- nombre de candidatures rattachées ;
- nombre de formulaires rattachés.

Objectif : rendre évident que toutes les données sont filtrées par pipeline.

### 3. Historique / commentaires / documents

Le module actuel ne contient pas encore de collections indépendantes pour :

- commentaires ;
- historique d'activité ;
- documents ;
- notifications ;
- candidats présentés.

Il n'y a donc pas de fuite de données globales sur ces éléments pour l'instant.

Recommandation pour les futures versions : chaque nouvelle collection doit obligatoirement contenir un champ `pipelineId` et être filtrée selon `selected.id` dans la vue détail.

## Règle technique à appliquer partout

Pour toute donnée affichée dans une page pipeline :

```ts
const selectedItems = items.filter((item) => item.pipelineId === selected?.id);
```

Pour toute donnée créée depuis une page pipeline :

```ts
pipelineId: selected.id
```

Pour toute donnée globale affichée depuis `/recrutements` :

```ts
const globalItems = items;
```

## Conclusion

Le module Recrutements respecte maintenant la logique attendue :

- la page globale affiche une vision globale ;
- la page détail pipeline affiche les données du pipeline sélectionné ;
- les tâches ne doivent plus se mélanger entre pipelines ;
- les candidatures et formulaires sont déjà correctement isolés.

Les deux prochaines corrections prioritaires sont :

1. bloquer l'affichage de tâches globales si l'URL contient un pipeline invalide ;
2. ajouter un bandeau de contexte en vue détail pipeline pour rendre le filtrage visible en démo.
