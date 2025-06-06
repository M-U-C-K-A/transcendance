// collisionPaddles.ts
// --------------------


import { Vector3, Color3 } from "@babylonjs/core";
import {
  SPEED_INCREMENT,
  PADDLE_HALF_WIDTH,
  MAX_BOUNCE_ANGLE,
} from "../constants";
import { playRandomCollisionSound } from "../sound";


export function collidePaddle1(
  ball: Mesh,
  paddle1: Mesh,
  currentSpeed: number,
  ballMat: StandardMaterial,
  p1Mat: StandardMaterial,
  allHitSounds: Sound[]
): { newVelocity: Vector3; newSpeed: number } | null {
  // Collision paddle1
  if (
    ball.position.z < -19 &&
    Math.abs(ball.position.x - paddle1.position.x) < PADDLE_HALF_WIDTH
  ) {
    // Calcule l’angle de rebond selon la position X relative au centre du paddle
    const relativeIntersectX = (ball.position.x - paddle1.position.x) / PADDLE_HALF_WIDTH;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    const newSpeed = currentSpeed * SPEED_INCREMENT;
    const newVelocity = dirAfter.scale(newSpeed);

    // Changement couleur balle si elle n’est pas noire (pour “Neon”)
    if (!ballMat.diffuseColor.equals(Color3.Black())) {
      ballMat.diffuseColor = p1Mat.diffuseColor.clone();
    }

    playRandomCollisionSound(allHitSounds);
    return { newVelocity, newSpeed };
  }
  return null;
}

export function collidePaddle2(
  ball: Mesh,
  paddle2: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  ballMat: StandardMaterial,
  p2Mat: StandardMaterial,
  allHitSounds: Sound[]
): { newVelocity: Vector3; newSpeed: number } | null {
  // Collision paddle2
  if (
    ball.position.z > 19 &&
    Math.abs(ball.position.x - paddle2.position.x) < PADDLE_HALF_WIDTH
  ) {
    const relativeIntersectX =
      (ball.position.x - paddle2.position.x) / PADDLE_HALF_WIDTH;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, -dirZ).normalize();
    const newSpeed = currentSpeed * SPEED_INCREMENT;
    const newVelocity = dirAfter.scale(newSpeed);

    // --- AJOUT D’UNE VÉRIFICATION AVANT equals() ---
    if (ballMat?.diffuseColor && !ballMat.diffuseColor.equals(Color3.Black())) {
      ballMat.diffuseColor = p2Mat.diffuseColor.clone();
    }

    playRandomCollisionSound(allHitSounds);
    return { newVelocity, newSpeed };
  }
  return null;
}
