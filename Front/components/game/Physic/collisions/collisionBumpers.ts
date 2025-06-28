// src/Physic/collisions/collideBumper.ts
// --------------------------------------

import { BALL_DIAMETER } from "../constants";
import { Vector3, Mesh } from "@babylonjs/core";
import { PlayRandomHitSound } from "../sound";




export function collideBumper(
  ball: Mesh,
  bumper: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  volume?: number
): { newVelocity: Vector3; newSpeed: number } | null 
{
  if (!ball || !bumper) 
    return null;

  // distance entre les centre sur les deux axe.
  const dx = ball.position.x - bumper.position.x;
  const dz = ball.position.z - bumper.position.z;

  // somme des distance au carre = hypothenuse. 
  const distanceXZ = Math.sqrt(dx * dx + dz * dz);

  // Les bumpers sont des tores avec diameter: 3.5, thickness: 0.4
  // Rayon du tore = 1.75, épaisseur = 0.2 (moitié de 0.4)
  const bumperRadius = 1.75; // Rayon du tore
  const bumperThickness = 0.2; // Moitié de l'épaisseur
  const ballRadius = BALL_DIAMETER / 2;

  // Distance minimale pour collision (rayon du tore + épaisseur + rayon de la balle)
  const collisionDistance = bumperRadius + bumperThickness + ballRadius;

  // Vérifier si la balle touche le tore
  if (distanceXZ <= collisionDistance) {
    // Normaliser le vecteur de direction
    const nx = dx / distanceXZ;
    const nz = dz / distanceXZ;

    // Repositionner la balle à la surface du tore (pas à l'intérieur)
    const repositionDistance = bumperRadius + bumperThickness + ballRadius;
    ball.position.x = bumper.position.x + nx * repositionDistance;
    ball.position.z = bumper.position.z + nz * repositionDistance;

    // Calculer la réflexion
    const dot = ballV.x * nx + ballV.z * nz;
    const reflectX = ballV.x - 2 * dot * nx;
    const reflectZ = ballV.z - 2 * dot * nz;

    const dirAfter = new Vector3(reflectX, 0, reflectZ).normalize();
    const newVelocity = dirAfter.scale(currentSpeed);

    PlayRandomHitSound(volume);

    return { newVelocity, newSpeed: currentSpeed };
  }

  return null;
}
