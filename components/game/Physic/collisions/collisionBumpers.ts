// src/Physic/collisions/collideBumper.ts
// --------------------------------------

import { Vector3 } from "@babylonjs/core";
import { SPEED_INCREMENT } from "../constants";
import { playRandomCollisionSound } from "../sound";

export function collideBumper(
  ball: any,
  bumper: any,
  ballV: Vector3,
  currentSpeed: number,
  allHitSounds: any[]
): { newVelocity: Vector3; newSpeed: number } | null {
  if (!ball || !bumper) return null;

  // Calcul de la distance en XZ entre balle et bumper
  const dx = ball.position.x - bumper.position.x;
  const dz = ball.position.z - bumper.position.z;
  const distanceXZ = Math.sqrt(dx * dx + dz * dz);

  const bumperRadius = 1.25; // 2.5 / 2
  const ballRadius = 0.25;   // 0.5 / 2

  if (distanceXZ < bumperRadius + ballRadius) {
    // Inversion de la composante X de la vitesse
    const dirAfter = new Vector3(-ballV.x, 0, ballV.z).normalize();
    const newSpeed = currentSpeed * SPEED_INCREMENT;
    const newVelocity = dirAfter.scale(newSpeed);
    playRandomCollisionSound(allHitSounds);
    return { newVelocity, newSpeed };
  }
  return null;
}
