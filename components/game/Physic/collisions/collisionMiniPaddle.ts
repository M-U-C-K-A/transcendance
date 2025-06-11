// collisionMiniPaddle.ts
// ----------------------


import { Vector3 } from "@babylonjs/core";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { Sound } from "@babylonjs/core/Audio/sound";
import { playRandomCollisionSound } from "../sound";

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


    // Gestion coup spécial (si le mini-paddle est côté joueur 1)
    if (superPad && superPad.player1) {
      // On ne change pas la taille du mini-paddle, mais on applique l'effet de vitesse
      const relativeX = (ball.position.x - miniPaddle.position.x) / 2;
      const bounceAngle = relativeX * (Math.PI / 4);
      const dirX = Math.sin(bounceAngle);
      const dirZ = ballV.z > 0 ? -Math.cos(bounceAngle) : Math.cos(bounceAngle);
      const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
      const speed = currentSpeed * 4;
      const newVelocity = dirAfter.scale(speed);
      playRandomCollisionSound(allHitSounds, volume);
      return { newVelocity, newSpeed: speed };
    }
    // Calcul d'un angle en [-π/4, +π/4] selon la position X relative
    const relativeX = (ball.position.x - miniPaddle.position.x) / 2;
    const bounceAngle = relativeX * (Math.PI / 4);
    const dirX = Math.sin(bounceAngle);
    const dirZ = ballV.z > 0 ? -Math.cos(bounceAngle) : Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    let speed = currentSpeed;
    if (superPad && superPad.player1) speed = currentSpeed * 4;
    const newVelocity = dirAfter.scale(speed);
    playRandomCollisionSound(allHitSounds, volume);
    return { newVelocity, newSpeed: speed };
  }
  return null;
}
