// src/Physic/collisions/collideBumper.ts
// --------------------------------------

<<<<<<< HEAD
import { Vector3 } from "@babylonjs/core";
import { SPEED_INCREMENT } from "../constants";
=======
import { Vector3, Mesh } from "@babylonjs/core";
import type { Sound } from "@babylonjs/core/Audio/sound";
>>>>>>> e7042a0 (Fix on speed)
import { playRandomCollisionSound } from "../sound";

export function collideBumper(
  ball: Mesh,
  bumper: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  allHitSounds: Sound[],
  volume: number
): { newVelocity: Vector3; newSpeed: number } | null {
  if (!ball || !bumper) return null;

  const dx = ball.position.x - bumper.position.x;
  const dz = ball.position.z - bumper.position.z;
  const distanceXZ = Math.sqrt(dx * dx + dz * dz);

  const bumperRadius = 1.25; // (diameter 2.5) / 2
  const ballRadius   = 0.25; // (diameter 0.5) / 2

  // 1) Vérifier la proximité en Y (tube du donut centré à y = 0.25, half-thickness = 0.3)
  if (Math.abs(ball.position.y - bumper.position.y) > (ballRadius + 0.3)) {
    return null; // pas dans la hauteur du donut
  }

  // 2) Collision circulaire en plan XZ
  if (distanceXZ < bumperRadius + ballRadius) {
    // 2a) Normaliser la direction entre centre du bumper et balle
    const nx = dx / distanceXZ;
    const nz = dz / distanceXZ;

    // 2b) Repositionner la balle à l'extérieur du cercle pour éviter "profondeur"
    ball.position.x = bumper.position.x + nx * (bumperRadius + ballRadius);
    ball.position.z = bumper.position.z + nz * (bumperRadius + ballRadius);

    // 2c) Créer un nouveau vecteur de rebond en réfléchissant ballV sur la normale (nx,nz)
    const dot = ballV.x * nx + ballV.z * nz;
    const reflectX = ballV.x - 2 * dot * nx;
    const reflectZ = ballV.z - 2 * dot * nz;
    const dirAfter = new Vector3(reflectX, 0, reflectZ).normalize();

    const newVelocity = dirAfter.scale(currentSpeed);
    playRandomCollisionSound(allHitSounds, volume);
    return { newVelocity, newSpeed: currentSpeed };
  }

  return null;
}
