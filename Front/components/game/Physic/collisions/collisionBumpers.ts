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

  // on est en vectoriel donc on bouge droite gauche haut bas donc on veut le la droite par rapport au centre
  // comme c est un rond cest jamais sur le meme x ou z

  // c est la distance reelle entre leur centre 
  const distanceXZ = Math.sqrt(dx * dx + dz * dz);




  const bumperRadius = 1.25;
  const ballRadius   = BALL_DIAMETER / 2;



  





  // radiuse = point a la surface par rapport au centre ( les position sont au centre)
  // si la surface touche le point de colision : addition de ces radius = distance minimal pour que ca se touche.
  if (distanceXZ <= bumperRadius + ballRadius)
  {


    // diviser les cote opose par leur hypothenuse. = donne des angles 
    const nx = dx / distanceXZ; // cos
    const nz = dz / distanceXZ; // sin


    // remet a la surface du bumper
    ball.position.x = bumper.position.x + nx * (bumperRadius + ballRadius);
    ball.position.z = bumper.position.z + nz * (bumperRadius + ballRadius);



    // maj le vecteur avec les angles 
    const dot = ballV.x * nx + ballV.z * nz;

    // inverse le vecteur pour envoyer a l opposer 
    const reflectX = ballV.x - 2 * dot * nx;
    const reflectZ = ballV.z - 2 * dot * nz;




    const dirAfter = new Vector3(reflectX, 0, reflectZ).normalize();




    const newVelocity = dirAfter.scale(currentSpeed);



    PlayRandomHitSound(volume);



    return { newVelocity, newSpeed: currentSpeed };
  }




  return null;
}
