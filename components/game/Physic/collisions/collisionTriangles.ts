// src/Physic/collisions/collisionTriangles.ts
import { Mesh, Vector3 } from "@babylonjs/core";
import type { Sound }             from "@babylonjs/core/Audio/sound";

interface CollisionResult {
  newVelocity: Vector3;
  newSpeed: number;
}

export function collideTrianglePrism(
  ball: Mesh,
  tri: Mesh,
  ballV: Vector3,
  currentSpeed: number,
): CollisionResult | null {
  // Géométrie du prisme (doit correspondre à setupGameObjects)
  const offX = 10;
  const apexShift = 1.5;
  const halfBaseZ = 1;
  const yBottom = 0.26;
  const heightY = 0.5;

  const p = ball.position;
  const r = ball.getBoundingInfo().boundingSphere.radius;

  // 1) Zone verticale
  if (p.y + r < yBottom || p.y - r > yBottom + heightY) {
    return null;
  }

  // Test des deux côtés
  for (const sign of [1 as const, -1 as const]) {
    const faceX = sign * offX;
    const planeX = faceX - sign * apexShift;

    // 2) Zone X
    if (sign === 1) {
      if (p.x - r > faceX || p.x + r < planeX) continue;
    } else {
      if (p.x + r < faceX || p.x - r > planeX) continue;
    }

    // 3) Largeur du trapèze à cette profondeur
    const localX = Math.abs(p.x - planeX);
    const maxZ = halfBaseZ * (1 - localX / apexShift);
    const localZ = p.z - tri.position.z;
    if (Math.abs(localZ) - r > maxZ) continue;

    // Collision détectée
    // Repositionner hors du prisme
    p.x = planeX - sign * r;

    // Calcul effet "pong-like" en fonction de la hauteur de l'impact sur Z
    // Normaliser localZ ∈ [-maxZ, maxZ] → facteur ∈ [-1, 1]
    const impactRatio = localZ / maxZ;
    // Angle max en radians (≈ 60°)
    const maxAngle = Math.PI / 3;
    // Nouvelle direction en plan XZ
    const bounceAngle = impactRatio * maxAngle;
    // Vitesse horizontale conservée, ajustée
    const dirX = -sign * Math.cos(bounceAngle);
    const dirZ = Math.sin(bounceAngle);

    const dir = new Vector3(dirX, ballV.y / currentSpeed, dirZ)
      .normalize()
      .scale(currentSpeed);


    return { newVelocity: dir, newSpeed: currentSpeed };
  }

  return null;
}
