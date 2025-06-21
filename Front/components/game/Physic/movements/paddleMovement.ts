// paddleMovement.ts
// ----------------
// Deplacement des paddles (player1 & player2) à chaque frame, en fonction des contrôles personnalises.

import { PADDLE_SPEED, PADDLE_BOUND_LEFT, PADDLE_BOUND_RIGHT } from "../constants";
import { 
    isPlayer1UpPressed, isPlayer1DownPressed, 
    isPlayer2UpPressed, isPlayer2DownPressed,
    isPlayer3UpPressed, isPlayer3DownPressed,
    isPlayer4UpPressed, isPlayer4DownPressed 
} from "../customControls";
import { Mesh } from "@babylonjs/core";


// touche avec context + check les limit

// x = vers "haut"
// z = gauch droite
export function movePaddles(
    paddle1: Mesh, 
    paddle2: Mesh, 
    paddle3: Mesh | null,
    paddle4: Mesh | null,
    deltaTime: number, 
    enableAI: boolean = false,
    is2v2Mode: boolean = false
) {
  const moveAmount = PADDLE_SPEED * deltaTime;

  // Mouvements du joueur 1 (toujours actifs)
  if (isPlayer1UpPressed()) paddle1.position.x = Math.max(PADDLE_BOUND_LEFT, paddle1.position.x - moveAmount);
  if (isPlayer1DownPressed()) paddle1.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle1.position.x + moveAmount);

  // Mouvements du joueur 2 (désactivés si l'IA est active)
  if (!enableAI) {
    if (isPlayer2UpPressed()) paddle2.position.x = Math.max(PADDLE_BOUND_LEFT, paddle2.position.x - moveAmount);
    if (isPlayer2DownPressed()) paddle2.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle2.position.x + moveAmount);
  }

  // Mouvements des joueurs 3 et 4 (uniquement en mode 2v2)
  if (is2v2Mode) {
    if (paddle3) {
      if (isPlayer3UpPressed()) paddle3.position.x = Math.max(PADDLE_BOUND_LEFT, paddle3.position.x - moveAmount);
      if (isPlayer3DownPressed()) paddle3.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle3.position.x + moveAmount);
    }
    if (paddle4) {
      if (isPlayer4UpPressed()) paddle4.position.x = Math.max(PADDLE_BOUND_LEFT, paddle4.position.x - moveAmount);
      if (isPlayer4DownPressed()) paddle4.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle4.position.x + moveAmount);
    }
  }
}