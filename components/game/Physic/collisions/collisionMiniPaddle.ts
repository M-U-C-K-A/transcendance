// collisionMiniPaddle.ts
// ----------------------

import { Vector3 } from "@babylonjs/core";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import { PlayRandomHitSound } from "../sound";

export function collideMiniPaddle(
  ball: Mesh,
  miniPaddle: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  volume?: number
): { newVelocity: Vector3; newSpeed: number } | null
{



  if (
    Math.abs(ball.position.z - miniPaddle.position.z) <  0.25 &&
    Math.abs(ball.position.x - miniPaddle.position.x) <  2
  ) 
  {
    
    
    const relativeX = (ball.position.x - miniPaddle.position.x) / 2;
    const bounceAngle = relativeX * (Math.PI / 4);
    const dirX = Math.sin(bounceAngle);
    const dirZ = ballV.z > 0 ? -Math.cos(bounceAngle) : Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    
    // Le mini-pad garde la vitesse normale
    const newVelocity = dirAfter.scale(currentSpeed);


    PlayRandomHitSound(volume);

    return { newVelocity, newSpeed: currentSpeed };
  }


  return null;



}
