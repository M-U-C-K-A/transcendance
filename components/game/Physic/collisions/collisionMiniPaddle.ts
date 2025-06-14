// collisionMiniPaddle.ts
// ----------------------

import { Vector3 } from "@babylonjs/core";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { Sound } from "@babylonjs/core/Audio/sound";

export function collideMiniPaddle(
  ball: Mesh,
  miniPaddle: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  allHitSounds: Sound[],
  superPad?: { player1: boolean; player2: boolean },
  volume: number = 0.5
): { newVelocity: Vector3; newSpeed: number } | null {
  // Collision mini-paddle
  if (
    Math.abs(ball.position.z - miniPaddle.position.z) < /*= MINI_PADDLE_HALF_DEPTH =*/ 0.25 &&
    Math.abs(ball.position.x - miniPaddle.position.x) < /*= MINI_PADDLE_HALF_WIDTH =*/ 2
  ) {
    // Calcul d'un angle en [-π/4, +π/4] selon la position X relative
    const relativeX = (ball.position.x - miniPaddle.position.x) / 2;
    const bounceAngle = relativeX * (Math.PI / 4);
    const dirX = Math.sin(bounceAngle);
    const dirZ = ballV.z > 0 ? -Math.cos(bounceAngle) : Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    
    // Le mini-pad garde la vitesse normale
    const newVelocity = dirAfter.scale(currentSpeed);
    return { newVelocity, newSpeed: currentSpeed };
  }
  return null;
}
