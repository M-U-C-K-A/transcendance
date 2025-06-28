// collisionPaddles.ts
// --------------------

import { Vector3, Mesh, StandardMaterial } from "@babylonjs/core";
import {
  BALL_DIAMETER,
  PADDLE_HALF_WIDTH,
  MINI_PADDLE_HALF_WIDTH,
  MAX_BOUNCE_ANGLE,
} from "../constants";
import type { SetStaminaFunction } from "../../gameTypes";
import { PlayRandomHitSound } from "../sound";
import React from "react";

// Cooldown de collision par paddle
const lastPaddleCollision: { [key: number]: number } = {};

export function collidePaddle(
  ball: Mesh,
  paddle: Mesh,
  ballV: Vector3,
  player: 1 | 2 | 3 | 4,
  setStamina: SetStaminaFunction,
  superPad?: React.MutableRefObject<{ player1: boolean; player2: boolean; player3: boolean; player4: boolean; }>,
  enableSpecial?: boolean,
  volumeRef?: React.MutableRefObject<number>,
  gameRefs?: any,
  enableAIRef?: React.MutableRefObject<boolean>
): { newVelocity: Vector3; newSpeed: number } | null {
  const cooldown = 50;
  const now = Date.now();
  const playerKey = `player${player}`;

  // Détermine de quel côté du terrain on se trouve
  const isTeam1 = player === 1 || player === 3;
  const isMiniPaddle = player === 3 || player === 4;
  
  // Profondeur de collision différente pour les mini-pads
  const collisionDepth = isMiniPaddle 
    ? (isTeam1 ? -17 : 17)  // Mini-pads positionnés à z = -17 et z = 17
    : (isTeam1 ? -19 : 19); // Paddles principaux positionnés à z = -19 et z = 19
    
  const zFactor = isTeam1 ? 1 : -1;

  // 1. Vérifier si la balle se dirige vers le paddle
  const isApproaching = isTeam1 ? ballV.z < 0 : ballV.z > 0;
  if (!isApproaching) {
      return null;
  }

  if (lastPaddleCollision[player] && now - lastPaddleCollision[player] < cooldown) {
  return null;
  }

  // Détermine si c'est un mini-pad (joueur 3 ou 4) ou un paddle principal
  const basePaddleWidth = isMiniPaddle ? MINI_PADDLE_HALF_WIDTH : PADDLE_HALF_WIDTH;
  
  const isSuperActive = enableSpecial && superPad?.current[playerKey as keyof typeof superPad.current];
  const paddleWidth = isSuperActive ? basePaddleWidth * 2 : basePaddleWidth;

  // 2. Vérifier si la balle est dans la zone de collision (profondeur et largeur)
  const paddleHalfDepth = 0.25; // La profondeur du paddle est 0.5
  const collisionThreshold = (BALL_DIAMETER / 2) + paddleHalfDepth;
  const inDepthZone = Math.abs(ball.position.z - collisionDepth) < collisionThreshold;
  const inLateralZone = Math.abs(ball.position.x - paddle.position.x) < paddleWidth;

  if (inDepthZone && inLateralZone) {
    lastPaddleCollision[player] = now;
    
    // Mise à jour des statistiques - touches de balles (seulement si pas d'IA et mode custom)
    if (gameRefs?.setMatchStats && !enableAIRef?.current && gameRefs.gamemode === "custom") {
      const isTeam1 = player === 1 || player === 3;
      const teamKey = isTeam1 ? 'player1' : 'player2';
      
      gameRefs.setMatchStats(prev => ({
        ...prev,
        touches: { ...prev.touches, [teamKey]: prev.touches[teamKey] + 1 }
      }));
    }
    
    // Repositionne la balle sur le bord du paddle pour éviter qu'elle ne le traverse
    ball.position.z = collisionDepth + (zFactor * -1 * (BALL_DIAMETER / 2));

    if (enableSpecial && setStamina) {
      setStamina((prev) => {
        // Détermine quelle équipe le joueur appartient
        const isTeam1 = player === 1 || player === 3;
        const teamKey = isTeam1 ? 'player1' : 'player2'; // Utilise la stamina de l'équipe
        const currentStamina = prev[teamKey];
        
        if (currentStamina < 5) {
          return { ...prev, [teamKey]: Math.min(5, currentStamina + 1) };
        }
        return prev;
      });
    }

    if (isSuperActive) {
      paddle.scaling.x = 2;
    } else {
      paddle.scaling.x = 1;
    }

    const relativeIntersectX = (ball.position.x - paddle.position.x) / paddleWidth;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle) * zFactor;
    const newDirection = new Vector3(dirX, 0, dirZ).normalize();
    
    let newSpeed = ballV.length();
    if (isSuperActive) {
      newSpeed *= 2;
    }

    const newVelocity = newDirection.scale(newSpeed);

    if (volumeRef) {
      PlayRandomHitSound(volumeRef.current);
    }

    return { newVelocity, newSpeed };
  }

  return null;
}
