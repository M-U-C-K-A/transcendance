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
  volume: number,
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  superPad?: { player1: boolean; player2: boolean },
  enableSpecial?: boolean
): { newVelocity: Vector3; newSpeed: number } | null {
  // Collision avec les paddles
  const paddle1Collision = collidePaddle1(
    ball,
    paddle1,
    currentSpeed,
    ballMat,
    p1Mat,
    stamina,
    setStamina,
    superPad,
    enableSpecial
  );
  if (paddle1Collision) return paddle1Collision;

  const paddle2Collision = collidePaddle2(
    ball,
    paddle2,
    currentSpeed,
    ballMat,
    p2Mat,
    stamina,
    setStamina,
    superPad,
    enableSpecial
  );
  if (paddle2Collision) return paddle2Collision;

  // Collision avec les bumpers
  if (bumperLeft) {
    const bumperLeftCollision = collideBumper(
      ball,
      bumperLeft,
      ballV,
      currentSpeed,
    );
    if (bumperLeftCollision) return bumperLeftCollision;
  }
  if (bumperRight) {
    const bumperRightCollision = collideBumper(
      ball,
      bumperRight,
      ballV,
      currentSpeed,
    );
    if (bumperRightCollision) return bumperRightCollision;
  }

  // Collision avec le mini-paddle
  if (miniPaddle) {
    const miniPaddleCollision = collideMiniPaddle(
      ball,
      miniPaddle,
      stamina,
      setStamina,
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
      );
      if (triangleCollision) return triangleCollision;
    }
  }

  // Collision avec les murs
  const wallCollision = collideWalls(
    ball,
    ballV,
    currentSpeed,
  );
  if (wallCollision) return wallCollision;

  return null;
}
