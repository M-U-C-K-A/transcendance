// constants.ts
// -------------





// --- Vitesse ---
// Vitesse initiale de la balle (unités par frame avant deltaTime)
export const TOTAL_SPEED = 24;

// Incrément de vitesse à chaque rebond ou événement
export const SPEED_INCREMENT = 1.009;

// Vitesse de déplacement des mini-paddles (unités par seconde)
export const MINI_SPEED = 24;

// Vitesse de déplacement des bumpers (unités par seconde)
export const BUMPER_SPEED = 24;

// Vitesse de déplacement des paddles joueurs (unités par seconde)
export const PADDLE_SPEED = 48;






// --- Limites de déplacement ---
// Limite horizontale des mini-paddles (en unités de position)
export const MINI_BOUND_X = 6;

// Limites horizontales des bumpers (en unités de position)
export const BUMPER_BOUND_LEFT = -8;
export const BUMPER_BOUND_RIGHT = 8;

// Limites horizontales des paddles joueurs (en unités de position)
export const PADDLE_BOUND_LEFT = -9;
export const PADDLE_BOUND_RIGHT = 9;









// --- Angles ---
// Angle maximum d'émission de la balle lors du service (en radians)
export const MAX_ANGLE = Math.PI / 4;

// Angle maximum de rebond sur la raquette (en radians)
export const MAX_BOUNCE_ANGLE = Math.PI / 3;

// Dimensions des paddles (utilisées pour la physique)
export const PADDLE_HALF_WIDTH = 3;
export const MINI_PADDLE_HALF_WIDTH = 2;
export const MINI_PADDLE_HALF_DEPTH = 0.25;
