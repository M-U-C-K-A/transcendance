import { Mesh, Vector3 } from "@babylonjs/core"
import { PlayRandomHitSound } from "../sound"

interface CollisionResult {
  newVelocity: Vector3
  newSpeed: number
}

export function collideTrianglePrism(
  ball: Mesh,
  tri: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  volume?: number
): CollisionResult | null 
{
  // forme du triangle (taille / pos)
  const offX = 10
  const apexShift = 1.5
  const halfBaseZ = 1
  const yBottom = 0.26
  const heightY = 0.5



  // pos balle + rayon
  const p = ball.position
  const r = ball.getBoundingInfo().boundingSphere.radius

  // si balle trop haut ou trop bas → pas touche triangle
  if (p.y + r < yBottom || p.y - r > yBottom + heightY)
    return null



  // test 2 triangles (gauche et droite)
  for (const sign of [1 as const, -1 as const]) 
  {

    // pos du triangle et du sommet (face = base du triangle / plane = sommet)
    const faceX = sign * offX
    const planeX = faceX - sign * apexShift


    // si balle est trop loin sur X → pas touche
    if (sign === 1) {
      if (p.x - r > faceX || p.x + r < planeX) continue
    } else {
      if (p.x + r < faceX || p.x - r > planeX) continue
    }



    // calcule combien balle est loin du sommet
    const localX = Math.abs(p.x - planeX)
    // calcule largeur max autorisee en z a cette pos x
    const maxZ = halfBaseZ * (1 - localX / apexShift)
    const localZ = p.z - tri.position.z

    // si balle est trop loin sur z → pas touche
    if (Math.abs(localZ) > maxZ + r) 
      continue



    // collision detectee → on recale balle juste au bord du triangle
    const correctedX = planeX - sign * r
    ball.position.x = correctedX



    // calcule un angle de rebond selon pos sur z
    const impactRatio = localZ / maxZ
    const maxAngle = Math.PI / 3
    const bounceAngle = impactRatio * maxAngle



    // direction rebond calculee
    const dirX = -sign * Math.cos(bounceAngle)
    const dirZ = Math.sin(bounceAngle)

    // vecteur final de direction + normalise + garde vitesse
    const dir = new Vector3(dirX, ballV.y / currentSpeed, dirZ).normalize().scale(currentSpeed)

    // joue son rebond
    PlayRandomHitSound(volume)

    // retourne la new direction
    return { newVelocity: dir, newSpeed: currentSpeed }
  }

  // si rien touche → null
  return null
}
