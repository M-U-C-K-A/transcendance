// collisionPaddles.ts
// --------------------

import { Vector3, Color3, Mesh, StandardMaterial } from "@babylonjs/core";
import type { Sound } from "@babylonjs/core/Audio/sound";
import {
  PADDLE_HALF_WIDTH,
  MAX_BOUNCE_ANGLE,
} from "../constants";
import type { SetStaminaFunction } from "../../gameTypes";

// Cooldown de collision par paddle (module scope)
const lastPaddleCollision = { p1: 0, p2: 0 };

export function collidePaddle1(
  ball: Mesh,
  paddle1: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  ballMat: StandardMaterial,
  p1Mat: StandardMaterial,
  allHitSounds: Sound[],
  volume: number,
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  superPad?: { player1: boolean; player2: boolean }
): { newVelocity: Vector3; newSpeed: number } | null {
  const cooldown = 50; // ms
  const now = Date.now();
  // Collision paddle1
  const paddleWidth = (superPad && superPad.player1) ? PADDLE_HALF_WIDTH * 2 : PADDLE_HALF_WIDTH;
  const PADDLE_HALF_HEIGHT = 1; // Hauteur du paddle
  if (
    ball.position.z < -19 &&
    Math.abs(ball.position.x - paddle1.position.x) < paddleWidth &&
    Math.abs(ball.position.y - paddle1.position.y) < PADDLE_HALF_HEIGHT
  ) {
    if (now - lastPaddleCollision.p1 < cooldown) return null;
    lastPaddleCollision.p1 = now;
    // Replace la balle juste à la limite
    ball.position.z = -19;
    // Gestion stamina
    if (setStamina && stamina && stamina.player1 < 10) {
      setStamina({ ...stamina, player1: Math.min(10, stamina.player1 + 1) });
    }
    // Gestion coup spécial
    if (superPad && superPad.player1) {
      paddle1.scaling.x = 2;
    } else {
      paddle1.scaling.x = 1;
    }
    // Calcule l'angle de rebond selon la position X relative au centre du paddle
    const relativeIntersectX = (ball.position.x - paddle1.position.x) / paddleWidth;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    let speed = currentSpeed;
    if (superPad && superPad.player1) speed = currentSpeed * 4;
    const newVelocity = dirAfter.scale(speed);

    // Changement couleur balle si elle n'est pas noire (pour "Neon")
    if (!ballMat.diffuseColor.equals(Color3.Black())) {
      ballMat.diffuseColor = p1Mat.diffuseColor.clone();
    }

    return { newVelocity, newSpeed: speed };
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
  volume: number = 0.5
): { newVelocity: Vector3; newSpeed: number } | null {
  const cooldown = 50; // ms
  const now = Date.now();
  // Collision paddle2
  const paddleWidth2 = (superPad && superPad.player2) ? PADDLE_HALF_WIDTH * 2 : PADDLE_HALF_WIDTH;
  const PADDLE_HALF_HEIGHT = 1; // Hauteur du paddle
  if (
    ball.position.z > 19 &&
    Math.abs(ball.position.x - paddle2.position.x) < paddleWidth2 &&
    Math.abs(ball.position.y - paddle2.position.y) < PADDLE_HALF_HEIGHT
  ) {
    if (now - lastPaddleCollision.p2 < cooldown) return null;
    lastPaddleCollision.p2 = now;
    // Replace la balle juste à la limite
    ball.position.z = 19;
    // Gestion stamina
    if (setStamina && stamina && stamina.player2 < 10) {
      setStamina({ ...stamina, player2: Math.min(10, stamina.player2 + 1) });
    }
    // Gestion coup spécial
    if (superPad && superPad.player2) {
      paddle2.scaling.x = 2;
    } else {
      paddle2.scaling.x = 1;
    }
    const relativeIntersectX =
      (ball.position.x - paddle2.position.x) / paddleWidth2;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, -dirZ).normalize();
    let speed = currentSpeed;
    if (superPad && superPad.player2) speed = currentSpeed * 2;
    const newVelocity = dirAfter.scale(speed);

    // --- AJOUT D'UNE VÉRIFICATION AVANT equals() ---
    if (ballMat?.diffuseColor && !ballMat.diffuseColor.equals(Color3.Black())) {
      ballMat.diffuseColor = p2Mat.diffuseColor.clone();
    }

    return { newVelocity, newSpeed: speed };
  }
  return null;
}
