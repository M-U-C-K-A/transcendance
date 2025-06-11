import { Vector3, Mesh, StandardMaterial } from "@babylonjs/core";
import type { Sound } from "@babylonjs/core/Audio/sound";
import { collidePaddle1, collidePaddle2 } from "./collisionPaddles";
import { collideBumper } from "./collisionBumpers";
import { collideMiniPaddle } from "./collisionMiniPaddle";
import { collideTrianglePrism } from "./collisionTriangles";
import { collideWalls } from "./collisionWalls";
import type { SetStaminaFunction } from "../../gameTypes";

export function handleCollisions(
  ball: Mesh,
  paddle1: Mesh,
  paddle2: Mesh,
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
  enableAcceleration: boolean,
  volume: number,
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  superPad?: { player1: boolean; player2: boolean }
): { newVelocity: Vector3; newSpeed: number } | null {
  // Collision avec les paddles
  const paddle1Collision = collidePaddle1(
    ball,
    paddle1,
    ballV,
    currentSpeed,
    ballMat,
    p1Mat,
    allHitSounds,
    volume,
    stamina,
    setStamina,
    superPad
  );
  if (paddle1Collision) return paddle1Collision;

  const paddle2Collision = collidePaddle2(
    ball,
    paddle2,
    ballV,
    currentSpeed,
    ballMat,
    p2Mat,
    allHitSounds,
    stamina,
    setStamina,
    superPad,
    volume
  );
  if (paddle2Collision) return paddle2Collision;

  // Collision avec les bumpers
  if (bumperLeft) {
    const bumperLeftCollision = collideBumper(
      ball,
      bumperLeft,
      ballV,
      currentSpeed,
      allHitSounds,
      volume
    );
    if (bumperLeftCollision) return bumperLeftCollision;
  }
  if (bumperRight) {
    const bumperRightCollision = collideBumper(
      ball,
      bumperRight,
      ballV,
      currentSpeed,
      allHitSounds,
      volume
    );
    if (bumperRightCollision) return bumperRightCollision;
  }

  // Collision avec le mini-paddle
  if (miniPaddle) {
    const miniPaddleCollision = collideMiniPaddle(
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
    if (miniPaddleCollision) return miniPaddleCollision;
  }

  // Collision avec les triangles
  const triangles = [rightTri, leftTri, rightTriOuterLeft, leftTriOuterLeft, rightTriOuterRight, leftTriOuterRight];
  for (const tri of triangles) {
    if (tri) {
      const triangleCollision = collideTrianglePrism(
        ball,
        tri,
        ballV,
        currentSpeed,
        allHitSounds,
        volume
      );
      if (triangleCollision) return triangleCollision;
    }
  }

  // Collision avec les murs
  const wallCollision = collideWalls(
    ball,
    ballV,
    currentSpeed,
    allHitSounds,
    volume
  );
  if (wallCollision) return wallCollision;

  return null;
}
