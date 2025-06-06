// src/Physic/paddle/miniPaddleLogic.ts
// ------------------------------------

import { MINI_SPEED, MINI_BOUND_X } from "../constants";

export function updateMiniPaddle(miniPaddle: any, miniDirRef: { current: number }, deltaTime: number) {
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


