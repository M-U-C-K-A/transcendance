import { Vector3, Mesh } from "@babylonjs/core";
import React from "react";
import { collideBumper } from "./collisionBumpers";
import { collideMiniPaddle } from "./collisionMiniPaddle";
import { collideTrianglePrism } from "./collisionTriangles";
import { collideWalls } from "./collisionWalls";
import { collidePaddle1 } from "./collisionPaddles";
import { collidePaddle2 } from "./collisionPaddles";
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
  rightTri: Mesh | null,
  leftTri: Mesh | null,
  rightTriOuterLeft: Mesh | null,
  leftTriOuterLeft: Mesh | null,
  rightTriOuterRight: Mesh | null,
  leftTriOuterRight: Mesh | null,
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  volumeRef?: number,
  superPad?: { player1: boolean; player2: boolean },
  enableSpecial?: boolean,
): { newVelocity: Vector3; newSpeed: number } | null
{




  // Collision avec les paddles
  const paddle1Collision = collidePaddle1(
    ball,
    paddle1,
    currentSpeed,
    stamina,
    setStamina,
    superPad,
    enableSpecial,
    volumeRef
  );
  if (paddle1Collision) return paddle1Collision;





  const paddle2Collision = collidePaddle2(
    ball,
    paddle2,
    currentSpeed,
    stamina,
    setStamina,
    superPad,
    enableSpecial,
    volumeRef
  );
  if (paddle2Collision) return paddle2Collision;







  // Collision avec les bumpers
  if (bumperLeft) 
  {
    const bumperLeftCollision = collideBumper(
      ball,
      bumperLeft,
      ballV,
      currentSpeed,
      volumeRef
    );
    if (bumperLeftCollision) 
      return bumperLeftCollision;
  }
  
  
  if (bumperRight) 
  {
    const bumperRightCollision = collideBumper(
      ball,
      bumperRight,
      ballV,
      currentSpeed,
      volumeRef
    );
    if (bumperRightCollision) 
      return bumperRightCollision;
  }






  // Collision avec le mini-paddle
  if (miniPaddle) 
  {
    const miniPaddleCollision = collideMiniPaddle(
      ball,
      miniPaddle,
      ballV,
      currentSpeed,
      volumeRef
    );
    if (miniPaddleCollision) 
      return miniPaddleCollision;
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
        currentSpeed,
        volumeRef
      );
      if (triangleCollision) 
        return triangleCollision;
    }
  }







  const wallCollision = collideWalls(
    ball,
    ballV,
    currentSpeed,
    volumeRef
  );
  if (wallCollision)
    return wallCollision;




  return null;
}
