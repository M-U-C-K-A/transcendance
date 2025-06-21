// miniPaddleMovement.ts
// --------------------

import { PADDLE_SPEED, PADDLE_BOUND_LEFT, PADDLE_BOUND_RIGHT } from "../constants";
import { 
    isPlayer3UpPressed, isPlayer3DownPressed,
    isPlayer4UpPressed, isPlayer4DownPressed 
} from "../customControls";
import { Mesh } from "@babylonjs/core";

// Mouvement des mini-pads pour les joueurs 3 et 4
// Ces pads sont plus petits et positionnés devant les pads principaux
export function moveMiniPaddles(
    miniPaddle3: Mesh | null,
    miniPaddle4: Mesh | null,
    deltaTime: number,
    is2v2Mode: boolean = false
) {
  if (!is2v2Mode || !miniPaddle3 || !miniPaddle4) return;

  const moveAmount = PADDLE_SPEED * deltaTime;

  // Mouvement du mini-pad du joueur 3 (équipe 1)
  if (isPlayer3UpPressed()) {
    miniPaddle3.position.x = Math.max(PADDLE_BOUND_LEFT, miniPaddle3.position.x - moveAmount);
  }
  if (isPlayer3DownPressed()) {
    miniPaddle3.position.x = Math.min(PADDLE_BOUND_RIGHT, miniPaddle3.position.x + moveAmount);
  }

  // Mouvement du mini-pad du joueur 4 (équipe 2)
  if (isPlayer4UpPressed()) {
    miniPaddle4.position.x = Math.max(PADDLE_BOUND_LEFT, miniPaddle4.position.x - moveAmount);
  }
  if (isPlayer4DownPressed()) {
    miniPaddle4.position.x = Math.min(PADDLE_BOUND_RIGHT, miniPaddle4.position.x + moveAmount);
  }
} 