// src/Physic/collisions/handleCollisions.ts
// -----------------------------------------

import { Vector3 } from "@babylonjs/core";

import { collideWalls } from "./collisionWalls";
import { collidePaddle1, collidePaddle2 } from "./collisionPaddles";
import { collideMiniPaddle } from "./collisionMiniPaddle";
import { collideBumper } from "./collisionBumpers";

export function handleCollisions(
  ball: Mesh,
  paddle1: Mesh,
  paddle2: Mesh,
  miniPaddle: Mesh,
  bumperLeft: Mesh,
  bumperRight: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  ballMat: StandardMaterial,
  p1Mat: StandardMaterial,
  p2Mat: StandardMaterial,
  allHitSounds: Sound[]
): { newVelocity: Vector3; newSpeed: number } {
  // 1) Collision murs latéraux
  const wallResult = collideWalls(ball, ballV, currentSpeed, allHitSounds);
  if (wallResult) {
    return {
      newVelocity: wallResult.newVelocity,
      newSpeed: wallResult.newSpeed,
    };
  }

  // 2) Collision paddle1
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

  // 3) Collision paddle2
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

  // 5) Collision bumperLeft (si défini)
  if (bumperLeft) {
    const bump1 = collideBumper(
      ball,
      bumperLeft,
      ballV,
      currentSpeed,
      allHitSounds
    );
    if (bump1) {
      return {
        newVelocity: bump1.newVelocity,
        newSpeed: bump1.newSpeed,
      };
    }
  }

  // 6) Collision bumperRight (si défini)
  if (bumperRight) {
    const bump2 = collideBumper(
      ball,
      bumperRight,
      ballV,
      currentSpeed,
      allHitSounds
    );
    if (bump2) {
      return {
        newVelocity: bump2.newVelocity,
        newSpeed: bump2.newSpeed,
      };
    }
  }

  // 7) Pas de collision : on renvoie la vélocité inchangée
  return { newVelocity: ballV, newSpeed: currentSpeed };
}
