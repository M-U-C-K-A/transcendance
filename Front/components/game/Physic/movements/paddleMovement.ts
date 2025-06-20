// paddleMovement.ts
// ----------------
// Deplacement des paddles (player1 & player2) à chaque frame, en fonction des contrôles personnalises.

import { PADDLE_SPEED, PADDLE_BOUND_LEFT, PADDLE_BOUND_RIGHT } from "../constants";
import { isPlayer1UpPressed, isPlayer1DownPressed, isPlayer2UpPressed, isPlayer2DownPressed } from "../customControls";
import { Mesh } from "@babylonjs/core";


// touche avec context + check les limit

// x = vers "haut"
// z = gauch droite
export function movePaddles(paddle1: Mesh, paddle2: Mesh, deltaTime: number, enableAI: boolean = false) {
  const moveAmount = PADDLE_SPEED * deltaTime;

  // Mouvements du joueur 1 (toujours actifs)
  if (isPlayer1UpPressed()) paddle1.position.x = Math.max(PADDLE_BOUND_LEFT, paddle1.position.x - moveAmount);
  if (isPlayer1DownPressed()) paddle1.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle1.position.x + moveAmount);

  // Mouvements du joueur 2 (désactivés si l'IA est active)
  if (!enableAI) {
    if (isPlayer2UpPressed()) paddle2.position.x = Math.max(PADDLE_BOUND_LEFT, paddle2.position.x - moveAmount);
    if (isPlayer2DownPressed()) paddle2.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle2.position.x + moveAmount);
  }
}