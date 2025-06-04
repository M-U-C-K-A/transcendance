// components/game/Physic/collisions/handleCollisions.ts
import { Vector3 } from "@babylonjs/core";

import { collideWalls } from "./collisionWalls";
import { collidePaddle1, collidePaddle2 } from "./collisionPaddles";
import { collideMiniPaddle } from "./collisionMiniPaddle";

export function handleCollisions(
  ball: any,
  paddle1: any,
  paddle2: any,
  miniPaddle: any,
  ballV: Vector3,
  currentSpeed: number,
  ballMat: any,
  p1Mat: any,
  p2Mat: any,
  allHitSounds: any[]
): { newVelocity: Vector3; newSpeed: number } {
  // 1) Collision murs latéraux
  const wallResult = collideWalls(ball, ballV, currentSpeed, allHitSounds);
  if (wallResult) {
    return {
      newVelocity: wallResult.newVelocity,
      newSpeed: wallResult.newSpeed,
    };
  }

  // 2) Collision paddle1 (on passe currentSpeed en 3e position)
  const p1Result = collidePaddle1(
    ball,
    paddle1,
    currentSpeed,
    ballMat,
    p1Mat,
    allHitSounds
  );
  if (p1Result) {
    return {
      newVelocity: p1Result.newVelocity,
      newSpeed: p1Result.newSpeed,
    };
  }

  // 3) Collision paddle2 (on passe ballV puis currentSpeed)
  const p2Result = collidePaddle2(
    ball,
    paddle2,
    ballV,
    currentSpeed,
    ballMat,
    p2Mat,
    allHitSounds
  );
  if (p2Result) {
    return {
      newVelocity: p2Result.newVelocity,
      newSpeed: p2Result.newSpeed,
    };
  }

  // 4) Collision mini-paddle (si défini)
  if (miniPaddle) {
    const miniResult = collideMiniPaddle(
      ball,
      miniPaddle,
      ballV,
      currentSpeed,
      allHitSounds
    );
    if (miniResult) {
      return {
        newVelocity: miniResult.newVelocity,
        newSpeed: miniResult.newSpeed,
      };
    }
  }

  // 5) Pas de collision : renvoyer ballV et currentSpeed inchangés
  return { newVelocity: ballV, newSpeed: currentSpeed };
}
