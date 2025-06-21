// collisionMiniPaddles.ts
// ----------------------

import { Vector3, Mesh } from "@babylonjs/core";
import {
  PADDLE_HALF_WIDTH,
  MAX_BOUNCE_ANGLE,
} from "../constants";
import type { SetStaminaFunction } from "../../gameTypes";
import { PlayRandomHitSound } from "../sound";
import React from "react";

// Cooldown de collision par mini-paddle
const lastMiniPaddleCollision: { [key: number]: number } = {};

export function collideMiniPaddle(
  ball: Mesh,
  miniPaddle: Mesh,
  ballV: Vector3,
  player: 3 | 4,
  setStamina: SetStaminaFunction,
  superPad?: React.MutableRefObject<{ player1: boolean; player2: boolean; player3: boolean; player4: boolean; }>,
  enableSpecial?: boolean,
  volumeRef?: React.MutableRefObject<number>,
  gameRefs?: any
): { newVelocity: Vector3; newSpeed: number } | null {
  const cooldown = 50;
  const now = Date.now();
  const playerKey = `player${player}`;

  // Détermine de quel côté du terrain on se trouve
  const isTeam1 = player === 3;
  const collisionDepth = isTeam1 ? -17 : 17; // Plus proche du centre que les pads principaux
  const zFactor = isTeam1 ? 1 : -1;

  if (lastMiniPaddleCollision[player] && now - lastMiniPaddleCollision[player] < cooldown) {
    return null;
  }

  // Les mini-pads sont plus petits (moitié de la taille des pads principaux)
  const miniPaddleWidth = PADDLE_HALF_WIDTH * 0.5;
  const isSuperActive = enableSpecial && superPad?.current[playerKey as keyof typeof superPad.current];
  const paddleWidth = isSuperActive ? miniPaddleWidth * 2 : miniPaddleWidth;

  const inCollisionZone = isTeam1
    ? ball.position.z < collisionDepth
    : ball.position.z > collisionDepth;

  if (inCollisionZone && Math.abs(ball.position.x - miniPaddle.position.x) < paddleWidth) {
    lastMiniPaddleCollision[player] = now;
    ball.position.z = collisionDepth;

    // Mise à jour de l'historique des touches de l'équipe
    if (gameRefs?.touchHistory) {
      const teamPlayer = isTeam1 ? 1 : 2; // J3 -> équipe 1 (J1), J4 -> équipe 2 (J2)
      gameRefs.touchHistory.push({ player: teamPlayer, timestamp: Date.now() });
      if (gameRefs.touchHistory.length > 10) {
        gameRefs.touchHistory.shift();
      }
    }

    if (enableSpecial && setStamina) {
      setStamina((prev) => {
        // Détermine quelle équipe le joueur appartient
        const isTeam1 = player === 3;
        const teamKey = isTeam1 ? 'player1' : 'player2'; // Utilise la stamina de l'équipe
        const currentStamina = prev[teamKey];
        
        if (currentStamina < 5) {
          return { ...prev, [teamKey]: Math.min(5, currentStamina + 1) };
        }
        return prev;
      });
    }

    const relativeIntersectX = (ball.position.x - miniPaddle.position.x) / paddleWidth;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle) * zFactor;
    const newDirection = new Vector3(dirX, 0, dirZ).normalize();
    
    let newSpeed = ballV.length();
    if (isSuperActive) {
      newSpeed *= 1.5; // Boost moins important que les pads principaux
    }

    const newVelocity = newDirection.scale(newSpeed);

    if (volumeRef) {
      PlayRandomHitSound(volumeRef.current);
    }

    return { newVelocity, newSpeed };
  }

  return null;
} 