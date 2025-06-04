// serve.ts
// ----------------


import { Vector3 } from "@babylonjs/core";
import { TOTAL_SPEED, MAX_ANGLE } from "../constants";

export function serve(
  loserSide: "player1" | "player2"
): { velocity: Vector3; speed: number } {
  // Remet la vitesse courante à sa valeur initiale
  const speed = TOTAL_SPEED;
  // Calcule un angle aléatoire dans [-MAX_ANGLE, +MAX_ANGLE]
  const angle = (Math.random() * 2 - 1) * MAX_ANGLE;
  const vx = Math.sin(angle) * speed;
  // Si c’est au joueur1 de jouer (il a perdu), alors on envoie la balle vers +Z
  const vz = Math.cos(angle) * speed * (loserSide === "player1" ? -1 : 1);
  const velocity = new Vector3(vx, 0, vz);
  return { velocity, speed };
}
