// src/Physic/collisions/collisionTriangles.ts
import { Mesh, Vector3 } from "@babylonjs/core";
import { playRandomCollisionSound } from "../sound";  // Importation du son

interface CollisionResult {
  newVelocity: Vector3;
  newSpeed: number;
}

export function collideTrianglePrism(
  ball: Mesh,
  tri: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  allHitSounds: Sound[]  // Passer allHitSounds pour le son
): CollisionResult | null {
  // Paramètres (doivent matcher ceux de la création du prisme)
  const offX      = 10;   // X de la base du prisme
  const apexShift = 1.5;  // profondeur de la pointe
  const halfBaseZ = 1;    // demi-largeur de la base en Z
  const yBottom   = 0.26; // hauteur de la base sur Y
  const heightY   = 0.5;  // épaisseur du prisme en Y

  const p = ball.position;
  const r = ball.getBoundingInfo().boundingSphere.radius;

  // 1) Vérif zone verticale
  if (p.y + r < yBottom || p.y - r > yBottom + heightY) {
    return null;
  }

  // Fonction générique de collision pour un prisme côté droit/ gauche
  const testSide = (sign: 1 | -1): CollisionResult | null => {
    // X de la face verticale
    const faceX = sign * offX;
    // Borne avant de la zone collision (la face plate)
    const planeX = faceX - sign * apexShift;

    // 2) Vérif zone X
    if (sign === 1) {
      if (p.x - r > faceX) return null;      // trop à droite
      if (p.x + r < planeX) return null;     // pas arrivé à la face
    } else {
      if (p.x + r < faceX) return null;      // trop à gauche
      if (p.x - r > planeX) return null;     // pas arrivé à la face
    }

    // 3) Calcul de la largeur du trapèze à cette profondeur
    //    la largeur diminue linéairement de halfBaseZ → 0 sur [0, apexShift]
    const localX = Math.abs(p.x - (faceX - sign * apexShift));
    const maxZ   = halfBaseZ * (1 - localX / apexShift);

    // 4) Vérif zone Z
    if (Math.abs(p.z) - r > maxZ) {
      return null;
    }

    // 5) On y est : collision, on repositionne et on rebondit en X
    // repositionnement pour sortir du prisme
    p.x = planeX - sign * r;

    // réflexion de la vélocité sur l’axe X
    const newSpeed = currentSpeed;
    const newVx    = -ballV.x;
    const newVy    = ballV.y;
    const newVz    = ballV.z;
    const dirAfter = new Vector3(newVx, newVy, newVz).normalize().scale(newSpeed);

    // Ajouter le son de la collision
    playRandomCollisionSound(allHitSounds);

    return { newVelocity: dirAfter, newSpeed };
  };

  // Test côté droit (+1) puis gauche (-1)
  return testSide(1) || testSide(-1);
}
