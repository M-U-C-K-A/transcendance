// src/Physic/collisions/collideBumper.ts
// --------------------------------------

import { Vector3, Mesh } from "@babylonjs/core";
import type { Sound } from "@babylonjs/core/Audio/sound";




export function collideBumper(
  ball: Mesh,
  bumper: Mesh,
  ballV: Vector3,
  currentSpeed: number,
): { newVelocity: Vector3; newSpeed: number } | null 
{
  if (!ball || !bumper) 
    return null;




  const dx = ball.position.x - bumper.position.x;
  const dz = ball.position.z - bumper.position.z;
  const distanceXZ = Math.sqrt(dx * dx + dz * dz);




  const bumperRadius = 1.25;
  const ballRadius   = 0.25;


  if (Math.abs(ball.position.y - bumper.position.y) > (ballRadius + 0.3)) 
    return null;


  if (distanceXZ < bumperRadius + ballRadius)
  {
    // 2a) Normaliser la direction entre centre du bumper et balle
    const nx = dx / distanceXZ;
    const nz = dz / distanceXZ;

    // 2b) Repositionner la balle à l'exterieur du cercle pour eviter "profondeur"
    ball.position.x = bumper.position.x + nx * (bumperRadius + ballRadius);
    ball.position.z = bumper.position.z + nz * (bumperRadius + ballRadius);

    // 2c) Creer un nouveau vecteur de rebond en reflechissant ballV sur la normale (nx,nz)
    const dot = ballV.x * nx + ballV.z * nz;
    const reflectX = ballV.x - 2 * dot * nx;
    const reflectZ = ballV.z - 2 * dot * nz;
    const dirAfter = new Vector3(reflectX, 0, reflectZ).normalize();

    const newVelocity = dirAfter.scale(currentSpeed);



    return { newVelocity, newSpeed: currentSpeed };
  }




  return null;
}
