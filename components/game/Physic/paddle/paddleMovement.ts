// paddleMovement.ts
// ----------------
// Déplacement des paddles (player1 & player2) à chaque frame, en fonction des contrôles personnalisés.

import { PADDLE_SPEED, PADDLE_BOUND_LEFT, PADDLE_BOUND_RIGHT } from "../constants";
import { isPlayer1UpPressed, isPlayer1DownPressed, isPlayer2UpPressed, isPlayer2DownPressed } from "../customControls";

export function movePaddles(paddle1: Mesh, paddle2: Mesh, deltaTime: number) {
  const moveAmount = PADDLE_SPEED * deltaTime;

  if (isPlayer1UpPressed()) paddle1.position.x = Math.max(PADDLE_BOUND_LEFT, paddle1.position.x - moveAmount);
  if (isPlayer1DownPressed()) paddle1.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle1.position.x + moveAmount);

  if (isPlayer2UpPressed()) paddle2.position.x = Math.max(PADDLE_BOUND_LEFT, paddle2.position.x - moveAmount);
  if (isPlayer2DownPressed()) paddle2.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle2.position.x + moveAmount);
}


