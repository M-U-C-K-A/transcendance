// collisionWalls.ts
// -----------------

import { Vector3, Mesh } from "@babylonjs/core";
import { SPEED_INCREMENT } from "../constants";
import { playRandomCollisionSound } from "../sound";
import type { Sound }             from "@babylonjs/core/Audio/sound";


export function collideWalls(
  ball: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  allHitSounds: Sound[]
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
