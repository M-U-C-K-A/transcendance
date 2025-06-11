import { collideWalls } from "./collisionWalls";
import { collidePaddle1, collidePaddle2 } from "./collisionPaddles";
import { collideMiniPaddle } from "./collisionMiniPaddle";
import { collideBumper } from "./collisionBumpers";
import { collideTrianglePrism } from "./collisionTriangles";
import { Mesh, Vector3, StandardMaterial } from "@babylonjs/core";
import type { Sound } from "@babylonjs/core/Audio/sound";
import type { SetStaminaFunction } from "../../gameTypes";

interface StaminaState {
  player1: number;
  player2: number;
}

export function handleCollisions(
  ball: Mesh | null,
  paddle1: Mesh | null,
  paddle2: Mesh | null,
  miniPaddle: Mesh | null,
  bumperLeft: Mesh | null,
  bumperRight: Mesh | null,
  ballV: Vector3,
  currentSpeed: number,
  ballMat: StandardMaterial,
  p1Mat: StandardMaterial,
  p2Mat: StandardMaterial,
  allHitSounds: Sound[],
  rightTri: Mesh | null,
  leftTri: Mesh | null,
  rightTriOuterLeft: Mesh | null,
  leftTriOuterLeft: Mesh | null,
  rightTriOuterRight: Mesh | null,
  leftTriOuterRight: Mesh | null,
  volume: number,
  stamina?: StaminaState,
  setStamina?: SetStaminaFunction,
  superPad?: { player1: boolean; player2: boolean }
): { newVelocity: Vector3; newSpeed: number } {
  if (!ball || !paddle1 || !paddle2) {
    return { newVelocity: ballV, newSpeed: currentSpeed };
  }

  // 1) Collision murs latéraux
  const wallResult = collideWalls(ball, ballV, currentSpeed, allHitSounds, volume);
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
    ballV,
    currentSpeed,
    ballMat,
    p1Mat,
    allHitSounds,
    volume,
    stamina || { player1: 0, player2: 0 },
    setStamina || (() => {}),
    superPad
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
    allHitSounds,
    stamina || { player1: 0, player2: 0 },
    setStamina || (() => {}),
    superPad,
    volume
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
      allHitSounds,
      stamina,
      setStamina,
      superPad,
      volume
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
      allHitSounds,
      volume
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
      allHitSounds,
      volume
    );
    if (bump2) {
      return {
        newVelocity: bump2.newVelocity,
        newSpeed: bump2.newSpeed,
      };
    }
  }

  // 7) Collision avec les triangles (si définis)
  const tris: Array<Mesh | null> = [
    rightTri,
    leftTri,
    rightTriOuterLeft,
    leftTriOuterLeft,
    rightTriOuterRight,
    leftTriOuterRight,
  ];
  for (const tri of tris) {
    if (tri instanceof Mesh) {
      const triHit = collideTrianglePrism(ball, tri, ballV, currentSpeed, allHitSounds, volume);
      if (triHit) {
        return { newVelocity: triHit.newVelocity, newSpeed: triHit.newSpeed };
      }
    }
  }

     
  // 8) Pas de collision : on renvoie la vélocité inchangée
  return { newVelocity: ballV, newSpeed: currentSpeed };
}
