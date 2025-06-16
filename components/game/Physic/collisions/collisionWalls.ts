// collisionWalls.ts
// -----------------

import { Vector3, Mesh } from "@babylonjs/core";
import type { Sound } from "@babylonjs/core/Audio/sound";

// Cooldown de collision par mur (module scope)
const lastWallCollision = { left: 0, right: 0 };

export function collideWalls(
  ball: Mesh,
  ballV: Vector3,
  currentSpeed: number,
): { newVelocity: Vector3; newSpeed: number } | null 
{


  // contre les rebond glitch 
  const cooldown = 50; // ms
  const now = Date.now();




  // Rebond mur droit
  if (ball.position.x > 10) 
  {

    // si derniere collision a 150 et mtn = 170  = 20ms  = trop rapide
    if (now - lastWallCollision.right < cooldown) 
      return null;
      
    lastWallCollision.right = now;


    // Replace la balle juste à la limite
    ball.position.x = 10;

    // inverse x et garde Z (que mur droite gauche)
    const dirAfter = new Vector3(-Math.abs(ballV.x), 0, ballV.z).normalize(); // vecteur sans vitess
    const newVelocity = dirAfter.scale(currentSpeed); // avec vitesse 


    return { newVelocity, newSpeed: currentSpeed };
  }




  if (ball.position.x < -10)
  {
    if (now - lastWallCollision.left < cooldown) 
      return null;
    
    lastWallCollision.left = now;


    ball.position.x = -10;


    const dirAfter = new Vector3(Math.abs(ballV.x), 0, ballV.z).normalize();
    const newVelocity = dirAfter.scale(currentSpeed);


    return { newVelocity, newSpeed: currentSpeed };
  }




  return null;
}
