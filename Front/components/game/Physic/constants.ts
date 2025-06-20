// constants.ts
// -------------





// --- Vitesse ---
// Vitesse initiale de la balle (unites par frame avant deltaTime)
export const TOTAL_SPEED = 24;

// Increment de vitesse à chaque rebond ou evenement


// Vitesse de deplacement des mini-paddles (unites par seconde)
export const MINI_SPEED = 24;

// Vitesse de deplacement des bumpers (unites par seconde)
export const BUMPER_SPEED = 12;

// Vitesse de deplacement des paddles joueurs (unites par seconde)
export const PADDLE_SPEED = 48;






// --- Limites de deplacement ---
// Limite horizontale des mini-paddles (en unites de position)
export const MINI_BOUND_X = 6;



// Limites horizontales des paddles joueurs (en unites de position)
export const PADDLE_BOUND_LEFT = -9;
export const PADDLE_BOUND_RIGHT = 9;


// Limites horizontales des bumpers (en unites de position)
export const BUMPER_BOUND_LEFT  = -8;
export const BUMPER_BOUND_RIGHT = +8;
// VRAI milieu (moitie du chemin) :
export const BUMPER_MID_LEFT  = -2
export const BUMPER_MID_RIGHT = +2





export const BALL_DIAMETER = 0.5;


// --- Angles ---
// Angle maximum d'emission de la balle lors du service (en radians)
export const MAX_ANGLE = Math.PI / 4;

// Angle maximum de rebond sur la raquette (en radians)
export const MAX_BOUNCE_ANGLE = Math.PI / 3;

// Dimensions des paddles (utilisees pour la physique)
export const PADDLE_HALF_WIDTH = 3;
export const MINI_PADDLE_HALF_WIDTH = 2;
export const MINI_PADDLE_HALF_DEPTH = 0.25;

// --- Configuration de l'IA ---
// Fréquence de mise à jour de la vision de l'IA (en millisecondes)
export const AI_VISION_UPDATE_INTERVAL = 300;

// Précision de prédiction maximum de l'IA (en unités)
// Plus la valeur est élevée, moins l'IA est précise dans sa prédiction
export const AI_MAX_PREDICTION_ERROR = 2;

// Zone de tolérance pour considérer que l'IA est proche de sa cible (élargie)
export const AI_MOVEMENT_TOLERANCE = 0.8;

// Pause lors du changement de direction (augmentée)
export const AI_DIRECTION_CHANGE_PAUSE = 200;

// Durée minimum d'une touche (en millisecondes)
export const AI_MIN_TOUCH_DURATION = 30;

// Durée maximum d'une touche (en millisecondes)
export const AI_MAX_TOUCH_DURATION = 150;

// Probabilité de pause entre les touches (0.015 = 1.5%)
export const AI_PAUSE_PROBABILITY = 0.01;

// Durée minimum d'une pause (en millisecondes)
export const AI_MIN_PAUSE_DURATION = 30;

// Durée maximum d'une pause (en millisecondes)
export const AI_MAX_PAUSE_DURATION = 100;

// --- Anti-mouvements erratiques ---
// Temps minimum entre les changements de direction (en millisecondes)
export const AI_MIN_DIRECTION_CHANGE_INTERVAL = 300;

// Distance minimum pour changer de direction (en unités)
export const AI_MIN_DIRECTION_CHANGE_DISTANCE = 1.5;

// Temps minimum d'une décision (en millisecondes)
export const AI_MIN_DECISION_TIME = 200;

// Probabilité de maintenir la direction actuelle (0.9 = 90%)
export const AI_DIRECTION_STABILITY_PROBABILITY = 0.85;

// --- Logique de renvoi de balle ---
// Distance maximum pour que l'IA considère qu'elle peut renvoyer la balle
export const AI_MAX_REACH_DISTANCE = 2.5;

// Probabilité que l'IA essaie de renvoyer même si elle est loin (0.3 = 30%)
export const AI_ATTEMPT_RETURN_PROBABILITY = 0.3;

// Distance minimum pour que l'IA essaie de renvoyer (même si elle rate)
export const AI_MIN_ATTEMPT_DISTANCE = 4.0;

// Zone de "ratage de peu" (distance où l'IA rate mais de très peu)
export const AI_CLOSE_MISS_DISTANCE = 1.5;

// --- Logique des coups spéciaux de l'IA ---
// Probabilité que l'IA utilise son coup spécial quand elle a 10 de stamina (0.7 = 70%)
export const AI_USE_SUPER_PAD_PROBABILITY = 0.7;

// Distance minimum pour que l'IA considère utiliser son coup spécial
export const AI_SUPER_PAD_MIN_DISTANCE = 3.0;

// Temps minimum entre les utilisations de coups spéciaux (en millisecondes)
export const AI_SUPER_PAD_COOLDOWN = 3000;

// --- Logique de ciblage des malus ---
// Probabilité que l'IA vise un malus spécifique (0.4 = 40%)
export const AI_TARGET_MALUS_PROBABILITY = 0.4;

// Distance maximum pour que l'IA considère viser un malus
export const AI_MALUS_TARGET_DISTANCE = 5.0;

// Priorité des malus (plus élevé = plus prioritaire)
export const AI_MALUS_PRIORITY = {
  MINI_PADDLE: 3,    // Le plus prioritaire
  BUMPER_LEFT: 2,    // Moyennement prioritaire
  BUMPER_RIGHT: 2,   // Moyennement prioritaire
  TRIANGLES: 1       // Le moins prioritaire
};
