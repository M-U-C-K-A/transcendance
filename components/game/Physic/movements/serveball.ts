// serve.ts
// ----------------

// les propriete de vitesse de la balle, et l angle de depart. 





import { Vector3 } from "@babylonjs/core";
import { MAX_ANGLE } from "../constants";

//  prend vitess + cote service
export function serveBall(
  loserSide: "player1" | "player2", // celui qui a pris un point recoit la balle
  baseSpeed: number
): { velocity: Vector3; speed: number } 
{

  // vitesse du menu
  const speed = baseSpeed;


  // angle serve aleatoire (random = methode ts de base), donne entre 1 et 0 (virgule possible).  * 2 - 1.  si 0 = -1 sinon 1. * l angle = chiffre  neg ou pos (vers haut ou bas)
  const angle = (Math.random() * 2 - 1) * MAX_ANGLE;


  // vecteur pour la droite que suivra la balle. (trace un "trait")
  const vx = Math.sin(angle) * speed;



  // selon le joueur perdant on envoit a droite ou gauche (gauche -1 si P1 a pris 1 point)
  const vz = Math.cos(angle) * speed * (loserSide === "player1" ? -1 : 1);



  // Vector3 = mouvement 3d. on lui donne les 3 et il fait la direction
  // combinaison des vecteur + stock la vitesse 
  const velocity = new Vector3(vx, 0, vz);


  return { velocity, speed };
}
