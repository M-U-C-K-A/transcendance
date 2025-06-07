import { Vector3, Mesh } from "@babylonjs/core";
import { collideWalls } from "./collisionWalls";
import { collidePaddle1, collidePaddle2 } from "./collisionPaddles";
import { collideMiniPaddle } from "./collisionMiniPaddle";
import { collideBumper } from "./collisionBumpers";
import { collideTrianglePrism } from "./collisionTriangles"; // Assurez-vous d'importer la fonction de collision avec les triangles

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
  allHitSounds: Sound[],
  rightTri: Mesh | null,
  leftTri: Mesh | null
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

  // 7) Collision avec les triangles (si définis)
  if (rightTri) {
    const tri1 = collideTrianglePrism(ball, rightTri, ballV, currentSpeed, allHitSounds);
    if (tri1) {
      return { newVelocity: tri1.newVelocity, newSpeed: tri1.newSpeed };
    }
  }
  if (leftTri) {
    const tri2 = collideTrianglePrism(ball, leftTri, ballV, currentSpeed, allHitSounds);
    if (tri2) {
      return { newVelocity: tri2.newVelocity, newSpeed: tri2.newSpeed };
    }
  }

  // 8) Pas de collision : on renvoie la vélocité inchangée
  return { newVelocity: ballV, newSpeed: currentSpeed };
}
