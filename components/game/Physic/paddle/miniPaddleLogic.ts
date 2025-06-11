// src/Physic/paddle/miniPaddleLogic.ts
// ------------------------------------

import { MINI_SPEED, MINI_BOUND_X } from "../constants";
import { Mesh } from "@babylonjs/core";

export function updateMiniPaddle(miniPaddle: Mesh, miniDirRef: { current: number }, deltaTime: number) {
  if (!miniPaddle) {
    console.error("miniPaddle n'est pas défini");
    return;
  }

  miniPaddle.position.x += MINI_SPEED * miniDirRef.current * deltaTime;

  if (miniPaddle.position.x > MINI_BOUND_X) {
    miniPaddle.position.x = MINI_BOUND_X;
    miniDirRef.current = -1;
  } else if (miniPaddle.position.x < -MINI_BOUND_X) {
    miniPaddle.position.x = -MINI_BOUND_X;
    miniDirRef.current = 1;
  }
}


