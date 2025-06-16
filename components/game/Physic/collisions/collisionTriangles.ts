// src/Physic/collisions/collisionTriangles.ts
import { Mesh, Vector3 } from "@babylonjs/core";
import { PlayRandomHitSound } from "../sound";


interface CollisionResult {
  newVelocity: Vector3;
  newSpeed: number;
}

export function collideTrianglePrism(
  ball: Mesh,
  tri: Mesh,
  ballV: Vector3,
  currentSpeed: number,
  volume?: number
): CollisionResult | null 
{
  // Geometrie du prisme (doit correspondre à setupGameObjects)
  const offX = 10;
  const apexShift = 1.5;
  const halfBaseZ = 1;
  const yBottom = 0.26;
  const heightY = 0.5;





  const p = ball.position;
  const r = ball.getBoundingInfo().boundingSphere.radius;

  if (p.y + r < yBottom || p.y - r > yBottom + heightY)
    return null;




  

  for (const sign of [1 as const, -1 as const]) 
  {
    const faceX = sign * offX;
    const planeX = faceX - sign * apexShift;



    if (sign === 1)
      if (p.x - r > faceX || p.x + r < planeX) continue;
    else
      if (p.x + r < faceX || p.x - r > planeX) continue;




    const localX = Math.abs(p.x - planeX);
    const maxZ = halfBaseZ * (1 - localX / apexShift);
    const localZ = p.z - tri.position.z;
    if (Math.abs(localZ) - r > maxZ) continue;




    p.x = planeX - sign * r;







    const impactRatio = localZ / maxZ;

    const maxAngle = Math.PI / 3;

    const bounceAngle = impactRatio * maxAngle;




    const dirX = -sign * Math.cos(bounceAngle);
    const dirZ = Math.sin(bounceAngle);





    const dir = new Vector3(dirX, ballV.y / currentSpeed, dirZ).normalize().scale(currentSpeed);



    PlayRandomHitSound(volume);


    return { newVelocity: dir, newSpeed: currentSpeed };




  }








  return null;
}
