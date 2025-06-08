// collisionPaddles.ts
// --------------------


import { Vector3, Color3, Mesh, StandardMaterial } from "@babylonjs/core";
import type { Sound } from "@babylonjs/core/Audio/sound";
import {
  SPEED_INCREMENT,
  PADDLE_HALF_WIDTH,
  MAX_BOUNCE_ANGLE,
} from "../constants";
import { playRandomCollisionSound } from "../sound";

// Cooldown de collision par paddle (module scope)
let lastPaddleCollision = { p1: 0, p2: 0 };

export function collidePaddle1(
  ball: Mesh,
  paddle1: Mesh,
  currentSpeed: number,
  ballMat: StandardMaterial,
  p1Mat: StandardMaterial,
  allHitSounds: Sound[],
  stamina?: { player1: number; player2: number },
  setStamina?: (s: { player1: number; player2: number }) => void,
  superPad?: { player1: boolean; player2: boolean }
): { newVelocity: Vector3; newSpeed: number } | null {
  const cooldown = 50; // ms
  const now = Date.now();
  // Collision paddle1
  if (
    ball.position.z < -19 &&
    Math.abs(ball.position.x - paddle1.position.x) < PADDLE_HALF_WIDTH
  ) {
    if (now - lastPaddleCollision.p1 < cooldown) return null;
    lastPaddleCollision.p1 = now;
    // Replace la balle juste à la limite
    ball.position.z = -19;
    // Gestion stamina
    if (setStamina && stamina && stamina.player1 < 10) {
      setStamina((prev: { player1: number; player2: number }) => {
        if (prev.player1 < 10) {
          return { ...prev, player1: prev.player1 + 1 };
        }
        return prev;
      });
    }
    // Gestion coup spécial
    if (superPad && superPad.player1) {
      paddle1.scaling.x = 2;
    } else {
      paddle1.scaling.x = 1;
    }
    // Calcule l'angle de rebond selon la position X relative au centre du paddle
    const relativeIntersectX = (ball.position.x - paddle1.position.x) / PADDLE_HALF_WIDTH;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    let newSpeed = currentSpeed * SPEED_INCREMENT;
    if (superPad && superPad.player1) newSpeed *= 4;
    const newVelocity = dirAfter.scale(newSpeed);

    // Changement couleur balle si elle n'est pas noire (pour "Neon")
    if (!ballMat.diffuseColor.equals(Color3.Black())) {
      ballMat.diffuseColor = p1Mat.diffuseColor.clone();
    }

    playRandomCollisionSound(allHitSounds);
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
  stamina?: { player1: number; player2: number },
  setStamina?: (s: { player1: number; player2: number }) => void,
  superPad?: { player1: boolean; player2: boolean }
): { newVelocity: Vector3; newSpeed: number } | null {
  const cooldown = 50; // ms
  const now = Date.now();
  // Collision paddle2
  if (
    ball.position.z > 19 &&
    Math.abs(ball.position.x - paddle2.position.x) < PADDLE_HALF_WIDTH
  ) {
    if (now - lastPaddleCollision.p2 < cooldown) return null;
    lastPaddleCollision.p2 = now;
    // Replace la balle juste à la limite
    ball.position.z = 19;
    // Gestion stamina
    if (setStamina && stamina && stamina.player2 < 10) {
      setStamina((prev: { player1: number; player2: number }) => {
        if (prev.player2 < 10) {
          return { ...prev, player2: prev.player2 + 1 };
        }
        return prev;
      });
    }
    // Gestion coup spécial
    if (superPad && superPad.player2) {
      paddle2.scaling.x = 2;
    } else {
      paddle2.scaling.x = 1;
    }
    const relativeIntersectX =
      (ball.position.x - paddle2.position.x) / PADDLE_HALF_WIDTH;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, -dirZ).normalize();
    let newSpeed = currentSpeed * SPEED_INCREMENT;
    if (superPad && superPad.player2) newSpeed *= 2;
    const newVelocity = dirAfter.scale(newSpeed);

    // --- AJOUT D'UNE VÉRIFICATION AVANT equals() ---
    if (ballMat?.diffuseColor && !ballMat.diffuseColor.equals(Color3.Black())) {
      ballMat.diffuseColor = p2Mat.diffuseColor.clone();
    }

    playRandomCollisionSound(allHitSounds);
    return { newVelocity, newSpeed };
  }
  return null;
}
