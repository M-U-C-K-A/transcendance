// src/Physic/gamePhysic.ts
import { Vector3 } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { SetStaminaFunction, SetSuperPadFunction } from "../gameTypes";
import React from "react";



import {
  // On reduit BUMPER_SPEED ici pour ralentir les bumpers
  BUMPER_SPEED,           // ex. passe de 8 → 4
  BUMPER_BOUND_LEFT,      // ex. -8
  BUMPER_BOUND_RIGHT,     // ex. +8
  BUMPER_MID_LEFT,        // ex. -4
  BUMPER_MID_RIGHT,       // ex. +4
} from "./constants";

import { serveBall } from "./movements/serveball";
import { startCountdown } from "./countdown";
import { handleScoring } from "./collisions/scoring";
import { registerInputListeners } from "./input";
import { movePaddles } from "./movements/paddleMovement";
import { updateMiniPaddle } from "./movements/miniPaddleLogic";
import { handleCollisions } from "./collisions/handleCollisions";
import type { GameRefs, GameObjects } from "../gameTypes";
import { movebumper } from "./movements/bumperMov";








export const initgamePhysic = (
  scene: Scene,
  gameObjects: GameObjects,
  gameRefs: GameRefs,
  setStamina: SetStaminaFunction,
  setSuperPad: SetSuperPadFunction,
  baseSpeed: number,
  volumeRef?: React.MutableRefObject<number>,
  enableSpecial?: boolean,
  superPadRef?: React.MutableRefObject<{ player1: boolean; player2: boolean }>,
): (() => void) => {
  const {
    ball,
    paddle1,
    paddle2,
    miniPaddle,
    bumperLeft,
    bumperRight,
    leftTri,
    rightTri,
    rightTriOuterLeft,
    leftTriOuterLeft,
    rightTriOuterRight,
    leftTriOuterRight
  } = gameObjects;



  // block les movements
  const blockPauseRef    = { current: false };
  const blockMovementRef = { current: false };





  // Directions : +1 = vers le centre, -1 = vers l'exterieur
  const miniDirRef   = { current: 1 };
  const bumperDirRef = { current: 1 };





  // reinit les pos (a chaque points)
  const resetBumpersAndMiniPaddle = () => 
  {
    // en right . un peut haut
    if (miniPaddle) 
    {
      miniPaddle.position.set(5, 0.25, 0);
    }


    if (bumperLeft && bumperRight) 
    {
      bumperLeft.position.set(BUMPER_BOUND_LEFT,  0.25, 0);
      bumperRight.position.set(BUMPER_BOUND_RIGHT, 0.25, 0);
    }

    // vers le centre 
    miniDirRef.current   = 1;
    bumperDirRef.current = 1;
  };




  // block l option pour mettre en pause ou non pdt le coutdown
  const safeSetIsPaused = (newPauseState: boolean) => 
  {
    if (!blockPauseRef.current) {
      gameRefs.setIsPaused(newPauseState);
    }
  };




  // Lance un countdown, bloque la pause/movement, reset des bumpers, puis debloque
  // Maj le ref en puis de relance a la fin de startcountdown pour garder actu partout
  const startCountdownWrapper = (
    duration: number,
    setIsPausedFn: (paused: boolean) => void,
    setCountdownFn: (countdown: number | null) => void,
    callback: () => void
  ) => 
  {

    

    blockPauseRef.current    = true;
    blockMovementRef.current = true;

  


    resetBumpersAndMiniPaddle();




    startCountdown(duration, setIsPausedFn, setCountdownFn, () => 
    {
      blockPauseRef.current    = false;
      blockMovementRef.current = false;
      callback();
    });
  };







  // acces dynamique 

    // on pourra use superPadTimeouts.P1 = settimetoute = a la fin redeviendra null
    // fil str p1 ou 2 et prend le return de la ft.
    // soit tu prend en dynamique le timer 
    // sinon ca redevient null
  const superPadTimeouts: { [key: string]: ReturnType<typeof setTimeout> | null } = 
  {
    player1: null,
    player2: null,
  };








  // Gestion du coup special
  const triggerSuperPad = (player: 1 | 2) => 
  {

    if (!enableSpecial)   // Ne rien faire si les coups speciaux sont desactives
      return;
    

    
    setStamina((prev) => 
    {
      // On ne peut activer que si la stamina est exactement à 10 et le superPad n'est pas dejà actif
      if (prev[`player${player}`] !== 10 || (superPadRef?.current && superPadRef.current[`player${player}`])) {
        return prev;
      }


      // Active 
      setSuperPad((prevPad) => 
      {

        // si on rappuye et que deja en cours, on ne fait rien
        if (prevPad[`player${player}`]) 
          return prevPad;

        // double les taille en x
        if (player === 1 && paddle1) 
          paddle1.scaling.x = 2;


        if (player === 2 && paddle2) 
          paddle2.scaling.x = 2;

        // retourne le pad actif 
        return { ...prevPad, [`player${player}`]: true };
      });



      // clear  avant pour relancer le timout si deja re dispo 
      if (superPadTimeouts[`player${player}`])
      {
        // ft ts donnee 
        clearTimeout(superPadTimeouts[`player${player}`]!);
      }


      // timeout  5 sec active une fois pdt 5 sec la fonction interne
      superPadTimeouts[`player${player}`] = setTimeout(() => 
      {
        // met sur pad a activer
        setSuperPad((prevPad) => 
        {
          if (player === 1 && paddle1) 
            paddle1.scaling.x = 1;
          if (player === 2 && paddle2) 
            paddle2.scaling.x = 1;
          return { ...prevPad, [`player${player}`]: false };
        });

        // met fin 
        superPadTimeouts[`player${player}`] = null;


      }, 5000);




      // Reset la stamina du joueur à 0
      return { ...prev, [`player${player}`]: 0 };
    });
  };









  // verifie si pad a ete trigger ( dans registerInputListeners )
  gameRefs.triggerSuperPad = triggerSuperPad;

  // ecoute les touche par input en permanence 
  const unregisterInputs = registerInputListeners(gameRefs, safeSetIsPaused);



  let ballV = Vector3.Zero();
  let currentSpeed = baseSpeed;
  let scoreLocal = { player1: 0, player2: 0 };






  // prend la vitesse et l angle (velocity prend les deux )  de la balle depuis serveball.
  // partage le vecteur ici dans le physique 
  const serve = (loserSide: "player1" | "player2") => 
  {
    const { velocity, speed } = serveBall(loserSide, baseSpeed);
    ballV = velocity;
    currentSpeed = speed;
  };




  // met la balle du cote de celui qui a pris le point (use dans handleScoring)
  const resetBall = (loser: "player1" | "player2") => {
    if (!ball || !paddle1 || !paddle2) return;
    
    const startY = 0.25;
    const startZ =
      loser === "player1"
        ? (paddle1.position.z as number) + 17
        : (paddle2.position.z as number) - 17;
    ball.position.set(0, startY, startZ);
    ballV = Vector3.Zero();
    startCountdownWrapper(3, safeSetIsPaused, gameRefs.setCountdown, () =>
      serve(loser)
    );
  };








  // ==================================================================================
  // ==================================================================================
  // =========================================  observables 




// observe le rendu JUSTE avant l image. verif si tout va bien JUSTE AVANT LE RENDU
  scene.onBeforeRenderObservable.add(() => 
  {











    //
    // if (
    //   !gameRefs.isPaused ||
    //   !gameRefs.countdown ||
    //   !gameRefs.winner ||
    //   // !ball ||
    //   // !paddle1 ||
    //   // !paddle2
    // ) {
    //   return;
    // }




    const isPausedNow   = gameRefs.isPaused.current;
    const countdownNow  = gameRefs.countdown.current;





    // Met en pause en skippant le rendu. 
    if (
      gameRefs.winner.current ||
      isPausedNow      ||
      countdownNow !== null ||
      blockMovementRef.current
    ) {
      return;
    }



    // Synchronisation du score avec la ref
    if (gameRefs.score.current) {
      scoreLocal = { ...gameRefs.score.current };
    }





    //  MVT base sur deltatime pour uniformiser



    // recup l engine de la scen,  puis le deltatime (temps entre 2 frame)  permet de se baser sur le temps et pas les FPS de  l ecran.
    // si on fait mvt sur frame = 30px par par sec si 30fps etc.
    // ici sera pareil partout.  
    const deltaTime = scene.getEngine().getDeltaTime() / 1000; // en secondes





    movePaddles(paddle1, paddle2, deltaTime);



    if (miniPaddle) {
      updateMiniPaddle(miniPaddle, miniDirRef, deltaTime);
    }





    // mvt des bumpers
    if (bumperLeft && bumperRight)
        movebumper(bumperLeft, bumperRight, bumperDirRef, deltaTime);
  




    // BalleV = vecteur 3d de la balle , ajuste selon le deltaTime
    // si au service ou si a subit collision  (collision result)
    // add in place permet le deplacement, il use le vecteur (plus il )

    // plus c est loin plus il va aller vite pour y etre en 1 frame.
    ball.position.addInPlace(ballV.scale(deltaTime));




// historique de touche de balle  = pour les malus (dif de last hitter pour les points)

    // detecte distance qui separe balle et paddle (avec limite, si trop proche = true)
    if (
      Math.abs(ball.position.z - paddle1.position.z) < 0.5 &&
      Math.abs(ball.position.x - paddle1.position.x) < 3 
    ) 
    {
      // met a jour le dernier hitter de la balle 
      if (gameRefs.touchHistory) 
      {
        // met en dernier elem du tableau
        gameRefs.touchHistory.push({ player: 1, timestamp: Date.now() });
        if (gameRefs.touchHistory.length > 10) 
          gameRefs.touchHistory.shift();
      }
    } 
    else if (
      Math.abs(ball.position.z - paddle2.position.z) < 0.5 &&
      Math.abs(ball.position.x - paddle2.position.x) < 3
    ) 
    {
      if (gameRefs.touchHistory) 
      {
        gameRefs.touchHistory.push({ player: 2, timestamp: Date.now() });
        if (gameRefs.touchHistory.length > 10)
           gameRefs.touchHistory.shift();
      }
    }










  
    handleScoring(
      ball,
      scoreLocal,
      gameRefs.setScore,
      (winner: string | null) => gameRefs.setWinner(winner),
      resetBall,
      gameRefs,
      volumeRef.current
    );







    
    // recupere le vecteur de la balle selon colision avec quoi
    const collisionResult = handleCollisions(
      ball as Mesh,
      paddle1 as Mesh,
      paddle2 as Mesh,
      miniPaddle,
      bumperLeft,
      bumperRight,
      ballV,
      currentSpeed,
      rightTri,
      leftTri,
      rightTriOuterLeft,
      leftTriOuterLeft,
      rightTriOuterRight,
      leftTriOuterRight,
      gameRefs.stamina.current,
      setStamina,
      volumeRef.current,
      gameRefs.superPad.current,
      enableSpecial,
    );

    // change le vecteur de balle selon la collision
    if (collisionResult) 
    {
      ballV = collisionResult.newVelocity;
      currentSpeed = collisionResult.newSpeed;
    }





  });




  // ==================================================================================
  // ==================================================================================












  // 5 sec et serve  a la fin en random
  startCountdownWrapper(5, safeSetIsPaused, gameRefs.setCountdown, () =>
    serve(Math.random() > 0.5 ? "player1" : "player2")
  );






  // clean l ecoute a la fin  (sans mettre de param == clean)
  return () => {
    unregisterInputs();
  };
};
