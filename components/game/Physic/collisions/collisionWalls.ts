// collisionWalls.ts
// -----------------

import { Vector3, Mesh } from "@babylonjs/core";
import { playRandomCollisionSound } from "../sound";
import type { Sound } from "@babylonjs/core/Audio/sound";

// Cooldown de collision par mur (module scope)
const lastWallCollision = { left: 0, right: 0 };

export function collideWalls(
  ball: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  allHitSounds: Sound[],
  volume: number
): { newVelocity: Vector3; newSpeed: number } | null {
  const cooldown = 50; // ms
  const now = Date.now();

  // Rebond mur droit
  if (ball.position.x > 10) {
    if (now - lastWallCollision.right < cooldown) return null;
    lastWallCollision.right = now;
    // Replace la balle juste à la limite
    ball.position.x = 10;
    const dirAfter = new Vector3(-Math.abs(ballV.x), 0, ballV.z).normalize();
    const newVelocity = dirAfter.scale(currentSpeed);
    playRandomCollisionSound(allHitSounds, volume);
    return { newVelocity, newSpeed: currentSpeed };
  }
  // Rebond mur gauche
  if (ball.position.x < -10) {
    if (now - lastWallCollision.left < cooldown) return null;
    lastWallCollision.left = now;
    ball.position.x = -10;
    const dirAfter = new Vector3(Math.abs(ballV.x), 0, ballV.z).normalize();
    const newVelocity = dirAfter.scale(currentSpeed);
    playRandomCollisionSound(allHitSounds, volume);
    return { newVelocity, newSpeed: currentSpeed };
  }
  return null;
}
