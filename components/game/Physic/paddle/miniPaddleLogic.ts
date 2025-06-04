// miniPaddleLogic.ts
// ----------------
// Logique de déplacement du miniPaddle (va–vient).

import { MINI_SPEED, MINI_BOUND_X } from "../constants";

export function updateMiniPaddle(miniPaddle: any, miniDirRef: { current: number }) {
  if (!miniPaddle) {
    console.error("miniPaddle n'est pas défini");
    return;
  }
  miniPaddle.position.x += MINI_SPEED * miniDirRef.current;
  if (miniPaddle.position.x > MINI_BOUND_X) {
    miniPaddle.position.x = MINI_BOUND_X;
    miniDirRef.current = -1;
  } else if (miniPaddle.position.x < -MINI_BOUND_X) {
    miniPaddle.position.x = -MINI_BOUND_X;
    miniDirRef.current = 1;
  }
}
