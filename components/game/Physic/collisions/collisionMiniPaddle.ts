// collisionMiniPaddle.ts
// ----------------------


import { Vector3 } from "@babylonjs/core";
import { SPEED_INCREMENT } from "../constants";
import { playRandomCollisionSound } from "../sound";

export function collideMiniPaddle(
  ball: Mesh,
  miniPaddle: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  allHitSounds: Sound[],
  stamina?: { player1: number; player2: number },
  setStamina?: (s: { player1: number; player2: number }) => void,
  superPad?: { player1: boolean; player2: boolean },
  volume: number
): { newVelocity: Vector3; newSpeed: number } | null {
  // Collision mini-paddle
  if (
    Math.abs(ball.position.z - miniPaddle.position.z) < /*= MINI_PADDLE_HALF_DEPTH =*/ 0.25 &&
    Math.abs(ball.position.x - miniPaddle.position.x) < /*= MINI_PADDLE_HALF_WIDTH =*/ 2
  ) {
    // Gestion stamina (si le mini-paddle est côté joueur 1)
    if (setStamina && stamina && stamina.player1 < 10) {
      setStamina(prev => {
        if (prev.player1 < 10) {
          return { ...prev, player1: prev.player1 + 1 };
        }
        return prev;
      });
    }
    // Gestion coup spécial (si le mini-paddle est côté joueur 1)
    if (superPad && superPad.player1) {
      // On ne change pas la taille du mini-paddle, mais on applique l'effet de vitesse
      const relativeX = (ball.position.x - miniPaddle.position.x) / 2;
      const bounceAngle = relativeX * (Math.PI / 4);
      const dirX = Math.sin(bounceAngle);
      const dirZ = ballV.z > 0 ? -Math.cos(bounceAngle) : Math.cos(bounceAngle);
      const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
      const newSpeed = currentSpeed * SPEED_INCREMENT * 4; // Vitesse x4 si superPad est actif
      const newVelocity = dirAfter.scale(newSpeed);
      playRandomCollisionSound(allHitSounds, volume);
      return { newVelocity, newSpeed };
    }
    // Calcul d'un angle en [-π/4, +π/4] selon la position X relative
    const relativeX = (ball.position.x - miniPaddle.position.x) / 2;
    const bounceAngle = relativeX * (Math.PI / 4);
    const dirX = Math.sin(bounceAngle);
    const dirZ = ballV.z > 0 ? -Math.cos(bounceAngle) : Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    const newSpeed = currentSpeed * SPEED_INCREMENT;
    const newVelocity = dirAfter.scale(newSpeed);
    playRandomCollisionSound(allHitSounds, volume);
    return { newVelocity, newSpeed };
  }
  return null;
}
