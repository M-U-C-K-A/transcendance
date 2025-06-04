// paddleMovement.ts
// ----------------
// Déplacement des paddles (player1 & player2) à chaque frame, en fonction de `keys`.

import { keys } from "../input";

export function movePaddles(paddle1: any, paddle2: any) {
  // Déplacement paddle1
  if (keys.has("w")) paddle1.position.x = Math.max(-9, paddle1.position.x - 0.3);
  if (keys.has("s")) paddle1.position.x = Math.min(9, paddle1.position.x + 0.3);
  // Déplacement paddle2
  if (keys.has("ArrowUp"))
    paddle2.position.x = Math.max(-9, paddle2.position.x - 0.3);
  if (keys.has("ArrowDown"))
    paddle2.position.x = Math.min(9, paddle2.position.x + 0.3);
}
