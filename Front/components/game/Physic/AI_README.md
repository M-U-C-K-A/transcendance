# Système d'IA avec Précision Aléatoire, Anti-Mouvements Erratiques Renforcé, Renvoi Obligatoire, Coups Spéciaux et Ciblage des Malus

## Vue d'ensemble

Le nouveau système d'IA simule des touches réelles comme un joueur humain, avec une précision aléatoire dans la prédiction de la position de la balle, des mécanismes renforcés pour éviter les mouvements erratiques, une logique qui s'assure que l'IA essaie toujours de renvoyer la balle, et des capacités avancées d'utilisation des coups spéciaux et de ciblage stratégique des malus.

## Caractéristiques principales

### 1. Vision limitée
- L'IA ne "voit" la balle que toutes les 1000ms (configurable via `AI_VISION_UPDATE_INTERVAL`)
- Cela simule les limitations de perception humaine

### 2. Précision aléatoire
- L'IA a une précision variable dans sa prédiction (0 à 2 unités d'erreur)
- Plus l'erreur est élevée, moins l'IA est précise
- Réaction immédiate mais prédiction imparfaite

### 3. Renvoi de balle obligatoire
- **L'IA doit toujours essayer de renvoyer** quand la balle s'approche
- **Distance de renvoi** : 2.5 unités maximum pour un renvoi garanti
- **Tentative de renvoi** : 30% de chance même si elle est loin (jusqu'à 4.0 unités)
- **Zone de ratage de peu** : 1.5 unités pour simuler des ratages réalistes
- **Pas de point sans mouvement** : L'IA ne gagne jamais sans avoir bougé

### 4. Coups spéciaux intelligents
- **Utilisation stratégique** : L'IA utilise son coup spécial quand elle a 10 de stamina
- **Conditions d'utilisation** : Balle difficile à atteindre (distance ≥ 3.0 unités)
- **Probabilité d'utilisation** : 70% de chance quand les conditions sont remplies
- **Cooldown** : 3 secondes minimum entre les utilisations
- **Double vitesse** : La balle va deux fois plus vite avec le coup spécial

### 5. Ciblage stratégique des malus
- **Vise les malus** : L'IA peut viser stratégiquement les malus sur le terrain
- **Probabilité de ciblage** : 40% de chance de considérer viser un malus
- **Priorité des malus** : Mini-paddle (3) > Bumpers (2) > Triangles (1)
- **Distance de ciblage** : 5.0 unités maximum pour considérer un malus
- **Ciblage mixte** : 70% malus + 30% position normale pour équilibre

### 6. Anti-mouvements erratiques renforcé
- **Système de commitment** : L'IA s'engage dans une direction pour 600ms minimum
- **Stabilité de cible** : L'IA ne change de cible que si elle est suffisamment différente
- **Temps minimum entre décisions** : 400ms minimum entre les changements de cible
- **Distance minimum** : 2.0 unités minimum pour changer de cible
- **Stabilité de direction** : 90% de chance de maintenir la direction actuelle
- **Temps minimum entre changements de direction** : 500ms
- **Limite de changements** : Maximum 3 changements de direction par période
- **Zone de tolérance élargie** : 0.8 unité pour éviter les micro-mouvements

### 7. Mouvements discrets
- L'IA appuie et relâche les touches comme un joueur humain
- Durées de touches variables (40-180ms)
- Pauses lors des changements de direction (250ms)
- Pauses aléatoires entre les touches (50-150ms)

## Configuration

Toutes les constantes d'IA sont définies dans `constants.ts` :

```typescript
// Fréquence de mise à jour de la vision
export const AI_VISION_UPDATE_INTERVAL = 1000;

// Précision de prédiction (plus élevé = moins précis)
export const AI_MAX_PREDICTION_ERROR = 2;

// Zone de tolérance pour la cible (élargie)
export const AI_MOVEMENT_TOLERANCE = 0.8;

// Pause lors du changement de direction (augmentée)
export const AI_DIRECTION_CHANGE_PAUSE = 250;

// Durées des touches
export const AI_MIN_TOUCH_DURATION = 40;
export const AI_MAX_TOUCH_DURATION = 180;

// Pauses aléatoires
export const AI_PAUSE_PROBABILITY = 0.015;
export const AI_MIN_PAUSE_DURATION = 50;
export const AI_MAX_PAUSE_DURATION = 150;

// Anti-mouvements erratiques renforcé
export const AI_MIN_DIRECTION_CHANGE_INTERVAL = 500;
export const AI_MIN_DIRECTION_CHANGE_DISTANCE = 2.0;
export const AI_MIN_DECISION_TIME = 400;
export const AI_DIRECTION_STABILITY_PROBABILITY = 0.9;

// Logique de renvoi de balle
export const AI_MAX_REACH_DISTANCE = 2.5;
export const AI_ATTEMPT_RETURN_PROBABILITY = 0.3;
export const AI_MIN_ATTEMPT_DISTANCE = 4.0;
export const AI_CLOSE_MISS_DISTANCE = 1.5;

// Logique des coups spéciaux
export const AI_USE_SUPER_PAD_PROBABILITY = 0.7;
export const AI_SUPER_PAD_MIN_DISTANCE = 3.0;
export const AI_SUPER_PAD_COOLDOWN = 3000;

// Logique de ciblage des malus
export const AI_TARGET_MALUS_PROBABILITY = 0.4;
export const AI_MALUS_TARGET_DISTANCE = 5.0;
export const AI_MALUS_PRIORITY = {
  MINI_PADDLE: 3,
  BUMPER_LEFT: 2,
  BUMPER_RIGHT: 2,
  TRIANGLES: 1
};
```

## Fonctionnement technique

### 1. `updateAIVision()`
- Exécutée toutes les 1000ms
- Capture la position et vitesse de la balle
- Calcule la position cible avec erreur de précision aléatoire
- **Logique de renvoi** : Détermine si l'IA doit essayer de renvoyer
- **Coups spéciaux** : Décide si l'IA doit utiliser son coup spécial
- **Ciblage des malus** : Décide si l'IA doit viser un malus spécifique
- **Stabilité de cible** : Ne change de cible que si elle est suffisamment différente
- **Temps minimum** : 400ms minimum entre les changements de cible

### 2. `simulateAIMovement()`
- Exécutée à chaque frame (60 FPS)
- Simule des touches réelles : `aiIsMovingUp` et `aiIsMovingDown`
- **Système de commitment** : L'IA s'engage dans une direction pour 600ms minimum
- **Renvoi obligatoire** : L'IA bouge même si elle est proche de sa cible
- **Tolérance réduite** : Zone de tolérance réduite quand elle doit renvoyer
- **Stabilité de direction** : 90% de chance de maintenir la direction actuelle
- **Temps minimum entre changements** : 500ms minimum entre les inversions
- **Limite de changements** : Maximum 3 changements par période
- **Pas de pauses** : L'IA ne fait pas de pause si elle doit renvoyer
- **Utilisation des coups spéciaux** : Active le coup spécial quand décidé

### 3. `decideSuperPadUsage()`
- Évalue si l'IA doit utiliser son coup spécial
- **Conditions** : 10 de stamina, pas déjà actif, cooldown respecté
- **Stratégie** : Utilise quand la balle est difficile à atteindre
- **Probabilité** : 70% de chance quand les conditions sont remplies

### 4. `decideMalusTargeting()`
- Évalue si l'IA doit viser un malus spécifique
- **Calcul des distances** : Évalue la distance à chaque malus
- **Système de priorité** : Mini-paddle > Bumpers > Triangles
- **Ciblage mixte** : Combine position malus et position normale
- **Probabilité** : 40% de chance de considérer viser un malus

### 5. États de touches
- `aiIsMovingUp = true` : L'IA appuie sur "haut"
- `aiIsMovingDown = true` : L'IA appuie sur "bas"
- `aiIsMovingUp = false && aiIsMovingDown = false` : L'IA relâche les touches

### 6. Système de commitment
- **Engagement minimum** : 600ms dans une direction
- **Changements limités** : Maximum 3 changements par période
- **Conditions strictes** : Distance et temps minimums pour changer
- **Stabilité renforcée** : 90% de chance de maintenir la direction

### 7. Logique de renvoi de balle
- **Distance ≤ 2.5** : L'IA essaie toujours de renvoyer
- **Distance ≤ 4.0** : 30% de chance d'essayer de renvoyer
- **Distance > 4.0** : L'IA ne peut pas renvoyer
- **Tolérance réduite** : Zone de tolérance réduite de moitié pour le renvoi
- **Pas de stabilité** : L'IA ignore la stabilité de direction si elle doit renvoyer
- **Pas de pauses** : L'IA ne fait pas de pause si elle doit renvoyer

## Avantages

1. **Réactivité immédiate** : L'IA réagit instantanément aux changements
2. **Précision variable** : Difficile mais pas imbattable
3. **Mouvements réalistes** : Exactement comme un joueur humain
4. **Pas de saccades** : Mouvements discrets et naturels
5. **Pas de mouvements erratiques** : Mouvements stables et prévisibles
6. **Renvoi obligatoire** : L'IA ne gagne jamais sans avoir bougé
7. **Ratages réalistes** : L'IA rate parfois de peu, comme un vrai joueur
8. **Engagement stable** : L'IA s'engage dans ses mouvements
9. **Coups spéciaux intelligents** : Utilise stratégiquement ses capacités
10. **Ciblage des malus** : Stratégie avancée pour viser les obstacles
11. **Configurabilité** : Tous les paramètres sont ajustables

## Ajustements recommandés

- **IA plus difficile** : Réduire `AI_MAX_PREDICTION_ERROR` (plus précis)
- **IA plus facile** : Augmenter `AI_MAX_PREDICTION_ERROR` (moins précis)
- **Renvoi plus agressif** : Augmenter `AI_MAX_REACH_DISTANCE`
- **Renvoi moins agressif** : Réduire `AI_MAX_REACH_DISTANCE`
- **Plus de tentatives** : Augmenter `AI_ATTEMPT_RETURN_PROBABILITY`
- **Moins de tentatives** : Réduire `AI_ATTEMPT_RETURN_PROBABILITY`
- **Coups spéciaux plus fréquents** : Augmenter `AI_USE_SUPER_PAD_PROBABILITY`
- **Coups spéciaux moins fréquents** : Réduire `AI_USE_SUPER_PAD_PROBABILITY`
- **Ciblage des malus plus fréquent** : Augmenter `AI_TARGET_MALUS_PROBABILITY`
- **Ciblage des malus moins fréquent** : Réduire `AI_TARGET_MALUS_PROBABILITY`
- **Mouvements plus stables** : Augmenter `AI_DIRECTION_STABILITY_PROBABILITY`
- **Mouvements plus réactifs** : Réduire `AI_MIN_DIRECTION_CHANGE_INTERVAL`
- **Engagement plus long** : Augmenter `aiMinCommitmentTime`
- **Engagement plus court** : Réduire `aiMinCommitmentTime` 