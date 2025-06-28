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
// Les paddles ont une hauteur de 6 unités (3 de chaque côté du centre)
// Le terrain fait 18 unités de large (-9 à +9), donc les limites doivent être ajustées
// Ces limites représentent les positions MINIMALES et MAXIMALES du CENTRE du paddle
export const PADDLE_BOUND_LEFT = -7;  // -9 + 2 (centre du paddle ne peut pas aller plus à gauche)
export const PADDLE_BOUND_RIGHT = 7;  // +9 - 2 (centre du paddle ne peut pas aller plus à droite)


// Limites horizontales des bumpers (en unites de position)
// Les bumpers ont une taille de 1x1x1, donc ils s'étendent de 0.5 de chaque côté
export const BUMPER_BOUND_LEFT  = -8.5;  // -9 + 0.5 (moitié de la taille du bumper)
export const BUMPER_BOUND_RIGHT = +8.5;  // +9 - 0.5 (moitié de la taille du bumper)
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



