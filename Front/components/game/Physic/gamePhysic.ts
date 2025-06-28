// src/Physic/gamePhysic.ts
import { Vector3 } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { SetStaminaFunction, SetSuperPadFunction } from "../gameTypes";
import React from "react";

import {
  BUMPER_BOUND_LEFT,
  BUMPER_BOUND_RIGHT,
} from "./constants";

import { serveBall } from "./movements/serveball";
import { startCountdown } from "./countdown";
import { handleScoring } from "./collisions/scoring";
import { registerInputListeners } from "./input";
import { movePaddles } from "./movements/paddleMovement";
import { moveMiniPaddles } from "./movements/miniPaddleMovement";
import { updateMiniPaddle } from "./movements/miniPaddleLogic";
import { handleCollisions } from "./collisions/handleCollisions";
import type { GameRefs, GameObjects } from "../gameTypes";
import { movebumper } from "./movements/bumperMov";
import { AIState, initializeAI, updateAIMovement } from "./movements/aiMovement";

export const initgamePhysic = (
  scene: Scene,
  gameObjects: GameObjects,
  gameRefs: GameRefs,
  setStamina: SetStaminaFunction,
  setSuperPad: SetSuperPadFunction,
  baseSpeed: number,
  volumeRef?: React.MutableRefObject<number>,
  enableSpecial?: boolean,
  superPadRef?: React.MutableRefObject<{ player1: boolean; player2: boolean; player3: boolean; player4: boolean; }>,
  enableAIRef?: React.MutableRefObject<boolean>,
  is2v2Mode?: boolean,
): (() => void) => {
  const {
    ball,
    paddle1,
    paddle2,
    paddle3,
    paddle4,
    miniPaddle,
    miniPaddle3,
    miniPaddle4,
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
    player3: null,
    player4: null,
  };

  // Gestion du coup special
  const triggerSuperPad = (player: 1 | 2 | 3 | 4) => 
  {
    if (!enableSpecial)   // Ne rien faire si les coups speciaux sont desactives
      return;
    
    setStamina((prev) => 
    {
      // Détermine quelle équipe le joueur appartient
      const isTeam1 = player === 1 || player === 3;
      const teamKey = isTeam1 ? 'player1' : 'player2';
      
      // On ne peut activer que si la stamina de l'équipe est exactement à 5 et le superPad du joueur n'est pas déjà actif
      const playerKey = `player${player}`;
      const isPlayerActive = superPadRef?.current && superPadRef.current[playerKey as keyof typeof superPadRef.current];
      
      if (prev[teamKey] !== 5 || isPlayerActive) {
        return prev;
      }

      // Active le super pad pour le joueur spécifique uniquement
      setSuperPad((prevPad) => 
      {
        // si on rappuye et que deja en cours, on ne fait rien
        const isPlayerActive = prevPad[playerKey as keyof typeof prevPad];
        if (isPlayerActive) 
          return prevPad;

        // Active le super pad pour le joueur spécifique uniquement
        const newPadState = { ...prevPad };
        newPadState[playerKey as keyof typeof newPadState] = true;
        
        // Double la taille du paddle du joueur spécifique
        if (player === 1 && paddle1) paddle1.scaling.x = 2;
        if (player === 2 && paddle2) paddle2.scaling.x = 2;
        if (player === 3 && paddle3) paddle3.scaling.x = 2;
        if (player === 4 && paddle4) paddle4.scaling.x = 2;

        // Mise à jour des statistiques - spécial utilisé (seulement si pas d'IA et mode custom)
        if (!enableAIRef?.current && gameRefs.gamemode === "custom") {
          gameRefs.setMatchStats(prev => ({
            ...prev,
            special: { ...prev.special, [teamKey]: prev.special[teamKey] + 1 }
          }));
        }

        return newPadState;
      });

      // clear avant pour relancer le timeout si déjà re dispo 
      if (superPadTimeouts[playerKey])
      {
        clearTimeout(superPadTimeouts[playerKey]!);
      }

      // timeout 5 sec active une fois pdt 5 sec la fonction interne
      superPadTimeouts[playerKey] = setTimeout(() => 
      {
        // remet le pad du joueur à la taille normale
        setSuperPad((prevPad) => 
        {
          const newPadState = { ...prevPad };
          newPadState[playerKey as keyof typeof newPadState] = false;
          
          // Remet la taille normale du paddle du joueur spécifique
          if (player === 1 && paddle1) paddle1.scaling.x = 1;
          if (player === 2 && paddle2) paddle2.scaling.x = 1;
          if (player === 3 && paddle3) paddle3.scaling.x = 1;
          if (player === 4 && paddle4) paddle4.scaling.x = 1;
          
          return newPadState;
        });

        // met fin 
        superPadTimeouts[playerKey] = null;

      }, 5000);

      // Reset la stamina de l'équipe entière à 0
      return { ...prev, [teamKey]: 0 };
    });
  };

  // verifie si pad a ete trigger ( dans registerInputListeners )
  gameRefs.triggerSuperPad.current = triggerSuperPad;

  // ecoute les touche par input en permanence 
  const unregisterInputs = registerInputListeners(gameRefs, safeSetIsPaused, enableAIRef);

  let ballV = Vector3.Zero();
  let currentSpeed = baseSpeed;
  let scoreLocal = { player1: 0, player2: 0 };
  let aiState: AIState | null = null;

  if (enableAIRef?.current) {
    aiState = initializeAI();
  }

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
    const deltaTime = scene.getEngine().getDeltaTime() / 1000; // en secondes

    movePaddles(paddle1, paddle2, miniPaddle3, miniPaddle4, deltaTime, enableAIRef?.current || false, is2v2Mode);

    // Applique le scaling des mini-paddles selon l'état du super pad
    if (enableSpecial && superPadRef?.current) {
      if (miniPaddle3) {
        miniPaddle3.scaling.x = superPadRef.current.player3 ? 2 : 1;
      }
      if (miniPaddle4) {
        miniPaddle4.scaling.x = superPadRef.current.player4 ? 2 : 1;
      }
    }

    if (miniPaddle)
      updateMiniPaddle(miniPaddle, miniDirRef, deltaTime);

    if (enableAIRef?.current && paddle2 && ball && aiState) {
      updateAIMovement(
        ball,
        ballV,
        paddle2,
        aiState,
        deltaTime,
        gameRefs.stamina.current,
        gameRefs.superPad.current,
        gameRefs.triggerSuperPad.current,
        enableSpecial || false
      );
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
      // met a jour le dernier hitter de la balle (équipe 1)
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
    // Vérification des paddles 3 et 4 en mode 2v2 - partagent l'historique avec leur équipe
    else if (
      is2v2Mode &&
      miniPaddle3 &&
      Math.abs(ball.position.z - miniPaddle3.position.z) < 0.5 &&
      Math.abs(ball.position.x - miniPaddle3.position.x) < 3
    ) 
    {
      if (gameRefs.touchHistory) 
      {
        // J3 partage l'historique avec J1 (équipe 1)
        gameRefs.touchHistory.push({ player: 1, timestamp: Date.now() });
        if (gameRefs.touchHistory.length > 10)
           gameRefs.touchHistory.shift();
      }
    }
    else if (
      is2v2Mode &&
      miniPaddle4 &&
      Math.abs(ball.position.z - miniPaddle4.position.z) < 0.5 &&
      Math.abs(ball.position.x - miniPaddle4.position.x) < 3
    ) 
    {
      if (gameRefs.touchHistory) 
      {
        // J4 partage l'historique avec J2 (équipe 2)
        gameRefs.touchHistory.push({ player: 2, timestamp: Date.now() });
        if (gameRefs.touchHistory.length > 10)
           gameRefs.touchHistory.shift();
      }
    }
  
    handleScoring(
      ball,
      scoreLocal,
      gameRefs.setScore,
      gameRefs.setWinner,
      () => resetBall("player1"),
      gameRefs,
      volumeRef?.current
    );
    
    // recupere le vecteur de la balle selon colision avec quoi
    const collisionResult = handleCollisions(
      ball, 
      ballV, 
      paddle1, 
      paddle2,
      null, // paddle3 n'existe plus
      null, // paddle4 n'existe plus
      miniPaddle3,
      miniPaddle4,
      bumperLeft,
      bumperRight,
      leftTri,
      rightTri,
      rightTriOuterLeft,
      leftTriOuterLeft,
      rightTriOuterRight,
      leftTriOuterRight,
      miniPaddle,
      gameRefs.stamina.current,
      setStamina,
      volumeRef,
      enableSpecial,
      superPadRef,
      is2v2Mode,
      gameRefs,
      currentSpeed
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
