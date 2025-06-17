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
