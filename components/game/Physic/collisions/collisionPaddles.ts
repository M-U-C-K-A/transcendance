// collisionPaddles.ts
// --------------------

import { Vector3, Color3, Mesh, StandardMaterial } from "@babylonjs/core";
import type { Sound } from "@babylonjs/core/Audio/sound";
import {
  PADDLE_HALF_WIDTH,
  MAX_BOUNCE_ANGLE,
} from "../constants";
import { playRandomCollisionSound } from "../sound";
import type { SetStaminaFunction } from "../../gameTypes";

// Cooldown de collision par paddle (module scope)
const lastPaddleCollision = { p1: 0, p2: 0 };

export function collidePaddle1(
  ball: Mesh,
  paddle: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  ballMat: StandardMaterial,
  p1Mat: StandardMaterial,
  allHitSounds: Sound[],
  volume: number,
  speedIncrement: number,
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  superPad?: { player1: boolean; player2: boolean }
): { newVelocity: Vector3; newSpeed: number } | null {
  const now = Date.now();
  if (now - lastPaddleCollision.p1 < 100) return null;
  if (!ball || !paddle || !ballMat || !p1Mat) return null;

  // Collision paddle1
  const paddleWidth = (superPad && superPad.player1) ? PADDLE_HALF_WIDTH * 2 : PADDLE_HALF_WIDTH;
  if (
    ball.position.z < -19 &&
    Math.abs(ball.position.x - paddle.position.x) < paddleWidth
  ) {
    // Replace la balle juste à la limite
    ball.position.z = -19;
    // Gestion stamina
    if (setStamina && stamina && stamina.player1 < 10) {
      setStamina((prev) => {
        const newStamina = { ...prev };
        newStamina.player1 = Math.min(10, prev.player1 + 1);
        return newStamina;
      });
    }
    // Calcule l'angle de rebond selon la position X relative au centre du paddle
    const relativeIntersectX = (ball.position.x - paddle.position.x) / paddleWidth;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    let newSpeed = currentSpeed * (1 + speedIncrement);
    if (superPad && superPad.player1) newSpeed *= 4;
    const newVelocity = dirAfter.scale(newSpeed);

    // Changement couleur balle si elle n'est pas noire (pour "Neon")
    if (!ballMat.diffuseColor.equals(Color3.Black())) {
      ballMat.diffuseColor = p1Mat.diffuseColor.clone();
    }

    playRandomCollisionSound(allHitSounds, Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 0.5)));
    return { newVelocity, newSpeed };
  }
  return null;
}

export function collidePaddle2(
  ball: Mesh,
  paddle2: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  ballMat: StandardMaterial,
  p2Mat: StandardMaterial,
  allHitSounds: Sound[],
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  superPad?: { player1: boolean; player2: boolean },
  volume: number = 0.5,
  speedIncrement: number = 0.009
): { newVelocity: Vector3; newSpeed: number } | null {
  if (!ball || !paddle2 || !ballMat || !p2Mat) return null;
  const cooldown = 50; // ms
  const now = Date.now();
  // Collision paddle2
  const paddleWidth2 = (superPad && superPad.player2) ? PADDLE_HALF_WIDTH * 2 : PADDLE_HALF_WIDTH;
  if (
    ball.position.z > 19 &&
    Math.abs(ball.position.x - paddle2.position.x) < paddleWidth2
  ) {
    if (now - lastPaddleCollision.p2 < cooldown) return null;
    lastPaddleCollision.p2 = now;
    // Replace la balle juste à la limite
    ball.position.z = 19;
    // Gestion stamina
    if (setStamina && stamina && stamina.player2 < 10) {
      setStamina((prev) => {
        const newStamina = { ...prev };
        newStamina.player2 = Math.min(10, prev.player2 + 1);
        return newStamina;
      });
    }
    // Calcule l'angle de rebond selon la position X relative au centre du paddle
    const relativeIntersectX =
      (ball.position.x - paddle2.position.x) / paddleWidth2;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, -dirZ).normalize();
    let newSpeed = currentSpeed * (1 + speedIncrement);
    if (superPad && superPad.player2) newSpeed *= 2;
    const newVelocity = dirAfter.scale(newSpeed);

    // --- AJOUT D'UNE VÉRIFICATION AVANT equals() ---
    if (ballMat?.diffuseColor && !ballMat.diffuseColor.equals(Color3.Black())) {
      ballMat.diffuseColor = p2Mat.diffuseColor.clone();
    }

    playRandomCollisionSound(allHitSounds, Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 0.5)));
    return { newVelocity, newSpeed };
  }
  return null;
}
