// paddleMovement.ts
// ----------------
// Déplacement des paddles (player1 & player2) à chaque frame, en fonction de `keys`.

import { keys } from "../input";
import { PADDLE_SPEED, PADDLE_BOUND_LEFT, PADDLE_BOUND_RIGHT } from "../constants";

export function movePaddles(paddle1: Mesh, paddle2: Mesh, deltaTime: number) {
  const moveAmount = PADDLE_SPEED * deltaTime;

  if (keys.has("w")) paddle1.position.x = Math.max(PADDLE_BOUND_LEFT, paddle1.position.x - moveAmount);
  if (keys.has("s")) paddle1.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle1.position.x + moveAmount);

  if (keys.has("ArrowUp")) paddle2.position.x = Math.max(PADDLE_BOUND_LEFT, paddle2.position.x - moveAmount);
  if (keys.has("ArrowDown")) paddle2.position.x = Math.min(PADDLE_BOUND_RIGHT, paddle2.position.x + moveAmount);
}


