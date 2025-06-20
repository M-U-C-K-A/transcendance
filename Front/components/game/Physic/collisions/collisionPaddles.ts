// collisionPaddles.ts
// --------------------

import { Vector3, Mesh, StandardMaterial } from "@babylonjs/core";
import {
  PADDLE_HALF_WIDTH,
  MAX_BOUNCE_ANGLE,
} from "../constants";
import type { SetStaminaFunction } from "../../gameTypes";
import { PlayRandomHitSound } from "../sound";





// Cooldown de collision par paddle (module scope)
const lastPaddleCollision = { p1: 0, p2: 0 };









export function collidePaddle1(
  ball: Mesh,
  paddle1: Mesh,
  currentSpeed: number,
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  superPad?: { player1: boolean; player2: boolean },
  enableSpecial?: boolean,
  volume?: number
): { newVelocity: Vector3; newSpeed: number } | null
{



  const cooldown = 50;
  const now = Date.now();






  const paddleWidth = (enableSpecial && superPad && superPad.player1) ? PADDLE_HALF_WIDTH * 2 : PADDLE_HALF_WIDTH;



  // abs :  absolu sru le resultat final pour simplifier les calcul. 
  //  (calcul l ecart sans se soucier du cote ou est cet ecart)
  if (
    ball.position.z < -19 &&
    Math.abs(ball.position.x - paddle1.position.x) < paddleWidth
  ) 
  {


    // pour les ms (avec le mur dans le coin)
    if (now - lastPaddleCollision.p1 < cooldown) 
      return null;



    lastPaddleCollision.p1 = now;
    ball.position.z = -19;



    if (enableSpecial && setStamina && stamina && stamina.player1 < 5)
      setStamina({ ...stamina, player1: Math.min(5, stamina.player1 + 1) });




    if (enableSpecial && superPad && superPad.player1)
      paddle1.scaling.x = 2;
    else 
      paddle1.scaling.x = 1;




    // Calcule l'angle de rebond selon la position X relative au centre du paddle
    const relativeIntersectX = (ball.position.x - paddle1.position.x) / paddleWidth;
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);
    const dirAfter = new Vector3(dirX, 0, dirZ).normalize();
    let speed = currentSpeed;



    if (enableSpecial && superPad && superPad.player1) 
      speed = currentSpeed * 4;



    const newVelocity = dirAfter.scale(speed);



    PlayRandomHitSound(volume);


    return { newVelocity, newSpeed: speed };
  }



  return null;


}







export function collidePaddle2(
  ball: Mesh,
  paddle2: Mesh,
  currentSpeed: number,
  stamina: { player1: number; player2: number },
  setStamina: SetStaminaFunction,
  superPad?: { player1: boolean; player2: boolean },
  enableSpecial?: boolean,
  volume?: number
): { newVelocity: Vector3; newSpeed: number } | null 
{



  const cooldown = 50;
  const now = Date.now();



  // widht = hauteur du paddle (map sur teko)
  const paddleWidth2 = (enableSpecial && superPad && superPad.player2) ? PADDLE_HALF_WIDTH * 2 : PADDLE_HALF_WIDTH;



  if (
    ball.position.z > 19 &&
    Math.abs(ball.position.x - paddle2.position.x) < paddleWidth2
  ) 
  {
    if (now - lastPaddleCollision.p2 < cooldown)
       return null;



    lastPaddleCollision.p2 = now;
    ball.position.z = 19;


    // stamina = tableau avec 2 chiffre : 1 par joue
    // copie le tableau mais pour p2 ajoute 1. j use min car j ai besoin d une ft.
    if (enableSpecial && setStamina && stamina && stamina.player2 < 5)
      setStamina({ ...stamina, player2: Math.min(5, stamina.player2 + 1) });



    // x2  le surface de collision a check
    if (enableSpecial && superPad && superPad.player2)
      paddle2.scaling.x = 2;
    else
      paddle2.scaling.x = 1;



    // paddle pos 12
    // balle 15
    //  hauteur = 6.

    // 15 - 12 = 3
    // 3 / 6 = 0.5
    // 
    //  0.5 = milieu moitie haute 
    //  -.0.5 aurait etee moitie basse
    const relativeIntersectX = (ball.position.x - paddle2.position.x) / paddleWidth2;



    // plus le max est divise par un grand nombre plus agnle aigue
    const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE;




    // transfo angle en position.
    const dirX = Math.sin(bounceAngle);
    const dirZ = Math.cos(bounceAngle);





    // normalise = garde la direction mais met la longuer a 1.
    // comme vecteur = droite
    // vitesse du jeux = longueur de la droite car va deplacer de la taille de la droite
    const dirAfter = new Vector3(dirX, 0, -dirZ).normalize();




    let speed = currentSpeed;

  // x2 vit si superapd
    if (enableSpecial && superPad && superPad.player2) 
      speed = currentSpeed * 2;


    // on ajoute la vitesse (taille de la droite) au vecteur
    // scale multiplie toutes les coordonnees par speed
    const newVelocity = dirAfter.scale(speed);

    PlayRandomHitSound(volume);

    return { newVelocity, newSpeed: speed };
  }




  return null;
}
