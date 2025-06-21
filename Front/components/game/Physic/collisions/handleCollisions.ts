import { Vector3, Mesh } from "@babylonjs/core";
import React from "react";
import { collideBumper } from "./collisionBumpers";
import { collideMiniPaddle } from "./collisionMiniPaddles";
import { collideTrianglePrism } from "./collisionTriangles";
import { collideWalls } from "./collisionWalls";
import { collidePaddle } from "./collisionPaddles";
import type { SetStaminaFunction } from "../../gameTypes";

export function handleCollisions(
  ball: Mesh,
  ballV: Vector3,
  paddle1: Mesh,
  paddle2: Mesh,
  paddle3: Mesh | null,
  paddle4: Mesh | null,
  miniPaddle3: Mesh | null,
  miniPaddle4: Mesh | null,
  bumperLeft: Mesh | null,
  bumperRight: Mesh | null,
  rightTri: Mesh | null,
  leftTri: Mesh | null,
  rightTriOuterLeft: Mesh | null,
  leftTriOuterLeft: Mesh | null,
  rightTriOuterRight: Mesh | null,
  leftTriOuterRight: Mesh | null,
  miniPaddle: Mesh | null,
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  volumeRef?: React.MutableRefObject<number>,
  enableSpecial?: boolean,
  superPad?: React.MutableRefObject<{ player1: boolean; player2: boolean; player3: boolean; player4: boolean; }>,
  is2v2Mode?: boolean,
  gameRefs?: any,
  currentSpeed?: number
): { newVelocity: Vector3; newSpeed: number } | null {
  // Collision avec les paddles
  const paddles = [
    { mesh: paddle1, player: 1 },
    { mesh: paddle2, player: 2 },
  ];

  if (is2v2Mode && miniPaddle3 && miniPaddle4) {
    paddles.push({ mesh: miniPaddle3, player: 3 });
    paddles.push({ mesh: miniPaddle4, player: 4 });
  }

  for (const { mesh, player } of paddles) {
    const paddleCollision = collidePaddle(
    ball,
      mesh,
      ballV,
      player as 1 | 2 | 3 | 4,
    setStamina,
    superPad,
    enableSpecial,
    volumeRef
  );
    if (paddleCollision) return paddleCollision;
  }

  // Collision avec les bumpers
  if (bumperLeft) {
    const bumperLeftCollision = collideBumper(
      ball,
      bumperLeft,
      ballV,
      currentSpeed || ballV.length(),
      volumeRef?.current
    );
    if (bumperLeftCollision) return bumperLeftCollision;
  }
  
  if (bumperRight) {
    const bumperRightCollision = collideBumper(
      ball,
      bumperRight,
      ballV,
      currentSpeed || ballV.length(),
      volumeRef?.current
    );
    if (bumperRightCollision) return bumperRightCollision;
  }

  // Collision avec le mini-paddle
  if (miniPaddle) {
    // Le mini-paddle normal n'est pas utilisé en mode 2v2
    // et nécessite une logique différente
    // TODO: Implémenter la collision pour le mini-paddle normal si nécessaire
  }

  const triangles = [rightTri, leftTri, rightTriOuterLeft, leftTriOuterLeft, rightTriOuterRight, leftTriOuterRight];
  
  // pour chaque elem de "triangles"  on cree une var qui lui est = pour itere sur tous ces types "mesh"
  for (const tri of triangles) 
  {
    if (tri) 
    {
      const triangleCollision = collideTrianglePrism(
        ball,
        tri,
        ballV,
        currentSpeed || ballV.length(),
        volumeRef?.current
      );
      if (triangleCollision) 
        return triangleCollision;
    }
  }

  const wallCollision = collideWalls(ball, ballV, currentSpeed || ballV.length(), volumeRef?.current);
  if (wallCollision) return wallCollision;

  return null;
}
