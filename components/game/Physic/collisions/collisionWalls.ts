// collisionWalls.ts
// -----------------


import { Vector3 } from "@babylonjs/core";
import { SPEED_INCREMENT } from "../constants";
import { playRandomCollisionSound } from "../sound";


export function collideWalls(
  ball: any,
  ballV: Vector3,
  currentSpeed: number,
  allHitSounds: any[]
): { newVelocity: Vector3; newSpeed: number } | null {
  // Rebond murs latéraux
  if (ball.position.x > 10 || ball.position.x < -10) {
    const dirAfter = new Vector3(-ballV.x, 0, ballV.z).normalize();
    const newSpeed = currentSpeed * SPEED_INCREMENT;
    const newVelocity = dirAfter.scale(newSpeed);
    playRandomCollisionSound(allHitSounds);
    return { newVelocity, newSpeed };
  }
  return null;
}
