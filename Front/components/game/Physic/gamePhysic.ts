// src/Physic/gamePhysic.ts
import { Vector3 } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { SetStaminaFunction, SetSuperPadFunction } from "../gameTypes";
import React from "react";

import {
  BUMPER_BOUND_LEFT,
  BUMPER_BOUND_RIGHT,     // ex. +8
  PADDLE_SPEED,
  PADDLE_BOUND_LEFT,
  PADDLE_BOUND_RIGHT,
  AI_VISION_UPDATE_INTERVAL,
  AI_MAX_PREDICTION_ERROR,
  AI_MOVEMENT_TOLERANCE,
  AI_DIRECTION_CHANGE_PAUSE,
  AI_MIN_TOUCH_DURATION,
  AI_MAX_TOUCH_DURATION,
  AI_PAUSE_PROBABILITY,
  AI_MIN_PAUSE_DURATION,
  AI_MAX_PAUSE_DURATION,
  AI_MIN_DIRECTION_CHANGE_INTERVAL,
  AI_MIN_DIRECTION_CHANGE_DISTANCE,
  AI_MIN_DECISION_TIME,
  AI_DIRECTION_STABILITY_PROBABILITY,
  AI_MAX_REACH_DISTANCE,
  AI_ATTEMPT_RETURN_PROBABILITY,
  AI_MIN_ATTEMPT_DISTANCE,
  AI_CLOSE_MISS_DISTANCE,
  AI_USE_SUPER_PAD_PROBABILITY,
  AI_SUPER_PAD_MIN_DISTANCE,
  AI_SUPER_PAD_COOLDOWN,
  AI_TARGET_MALUS_PROBABILITY,
  AI_MALUS_TARGET_DISTANCE,
  AI_MALUS_PRIORITY,
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
  enableAIRef?: React.MutableRefObject<boolean>,
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





    movePaddles(paddle1, paddle2, deltaTime, enableAIRef?.current || false);



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
      volumeRef?.current || 0.5
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
      volumeRef?.current || 0.5,
      gameRefs.superPad.current,
      enableSpecial,
    );

    // change le vecteur de balle selon la collision
    if (collisionResult) 
    {
      ballV = collisionResult.newVelocity;
      currentSpeed = collisionResult.newSpeed;
    }

    // Déplacement fluide de l'IA (exécuté à chaque frame)
    if (enableAIRef?.current && paddle2) {
      simulateAIMovement(paddle2, deltaTime);
    }

  });




  // ==================================================================================
  // ==================================================================================

  // Logique de l'IA - simule des touches réelles comme un joueur humain
  let aiInterval: NodeJS.Timeout | null = null;
  let lastBallView = { position: new Vector3(0, 0, 0), velocity: new Vector3(0, 0, 0) };
  let aiTargetX = 0; // Position cible calculée par l'IA
  let aiPredictionError = 0; // Erreur de prédiction pour rendre l'IA moins parfaite
  let aiLastDecisionTime = 0; // Dernière fois que l'IA a pris une décision
  
  // Variables pour simuler des touches réelles
  let aiIsMovingUp = false; // L'IA appuie sur "haut"
  let aiIsMovingDown = false; // L'IA appuie sur "bas"
  let aiLastDirectionChange = 0; // Dernier changement de direction
  let aiMovementDuration = 0; // Durée d'une touche
  let aiPauseDuration = 0; // Durée de pause entre les touches
  
  // Variables anti-mouvements erratiques
  let aiLastTargetX = 0; // Dernière cible calculée
  let aiCurrentDirection = 'none'; // Direction actuelle: 'up', 'down', 'none'
  let aiStableTargetX = 0; // Cible stabilisée pour éviter les changements fréquents
  
  // Variables pour la logique de renvoi de balle
  let aiShouldAttemptReturn = false; // L'IA doit-elle essayer de renvoyer ?
  let aiLastBallPosition = new Vector3(0, 0, 0); // Dernière position de la balle
  let aiIsBallApproaching = false; // La balle s'approche-t-elle du paddle 2 ?
  
  // Variables pour éliminer les mouvements erratiques
  let aiDirectionCommitment = 0; // Temps d'engagement dans une direction
  let aiMinCommitmentTime = 400; // Temps minimum d'engagement (en ms) - réduit pour plus de réactivité
  let aiLastStableDirection = 'none'; // Dernière direction stable
  let aiDirectionChangeCount = 0; // Nombre de changements de direction récents
  
  // Variables pour les coups spéciaux de l'IA
  let aiLastSuperPadUse = 0; // Dernière utilisation du coup spécial
  let aiShouldUseSuperPad = false; // L'IA doit-elle utiliser son coup spécial ?
  
  // Variables pour le ciblage des malus
  let aiTargetMalus: string | null = null; // Malus ciblé actuellement
  let aiMalusTargetX = 0; // Position X du malus ciblé
  let aiShouldTargetMalus = false; // L'IA doit-elle viser un malus ?
  
  const updateAIVision = () => {
    if (!enableAIRef?.current || !ball) return;
    
    const currentTime = Date.now();
    
    // L'IA "voit" la balle seulement une fois par seconde
    lastBallView.position = ball.position.clone();
    lastBallView.velocity = ballV.clone();
    
    // Vérifier si la balle s'approche du paddle 2
    aiIsBallApproaching = lastBallView.velocity.z > 0 && lastBallView.position.z < 20;
    
    // Précision aléatoire dans la prédiction (entre 0 et AI_MAX_PREDICTION_ERROR)
    // Plus la valeur est élevée, moins l'IA est précise
    aiPredictionError = Math.random() * AI_MAX_PREDICTION_ERROR;
    
    // Anticipe où la balle va arriver quand elle atteint z=20
    const timeToReachPaddle = (20 - lastBallView.position.z) / lastBallView.velocity.z;
    
    if (timeToReachPaddle > 0 && lastBallView.velocity.z > 0) { // Balle va vers le paddle 2
      // Calcul de la position cible avec erreur de prédiction
      const predictedX = lastBallView.position.x + (lastBallView.velocity.x * timeToReachPaddle);
      
      // Ajouter l'erreur de précision dans une direction aléatoire
      const errorDirection = Math.random() > 0.5 ? 1 : -1;
      const newTargetX = predictedX + (aiPredictionError * errorDirection);
      
      // Limite la cible dans les bornes du paddle
      const clampedTargetX = Math.max(PADDLE_BOUND_LEFT + 1, Math.min(PADDLE_BOUND_RIGHT - 1, newTargetX));
      
      // Calculer la distance entre la cible et la position actuelle du paddle 2
      const distanceToTarget = Math.abs(clampedTargetX - (paddle2?.position.x || 0));
      
      // Logique de renvoi de balle : l'IA doit toujours essayer de renvoyer
      if (distanceToTarget <= AI_MAX_REACH_DISTANCE) {
        // L'IA peut atteindre la balle - elle doit essayer de renvoyer
        aiShouldAttemptReturn = true;
      } else if (distanceToTarget <= AI_MIN_ATTEMPT_DISTANCE) {
        // L'IA est trop loin mais peut essayer (30% de chance)
        aiShouldAttemptReturn = Math.random() < AI_ATTEMPT_RETURN_PROBABILITY;
      } else {
        // L'IA est très loin - elle ne peut pas renvoyer
        aiShouldAttemptReturn = false;
      }
      
      // Décider si l'IA doit utiliser son coup spécial
      decideSuperPadUsage(distanceToTarget);
      
      // Décider si l'IA doit viser un malus
      decideMalusTargeting();
      
      // Vérifier si on doit changer de cible (anti-mouvements erratiques)
      const timeSinceLastDecision = currentTime - aiLastDecisionTime;
      const distanceFromLastTarget = Math.abs(clampedTargetX - aiLastTargetX);
      
      // Si l'IA vise un malus, ajuster la cible
      let finalTargetX = clampedTargetX;
      if (aiShouldTargetMalus && aiTargetMalus) {
        // Mélanger la cible normale avec la cible du malus (70% malus, 30% normale)
        finalTargetX = aiMalusTargetX * 0.7 + clampedTargetX * 0.3;
        // Limiter dans les bornes
        finalTargetX = Math.max(PADDLE_BOUND_LEFT + 1, Math.min(PADDLE_BOUND_RIGHT - 1, finalTargetX));
      }
      
      // Changer de cible seulement si :
      // 1. Assez de temps s'est écoulé depuis la dernière décision
      // 2. La nouvelle cible est suffisamment différente
      // 3. Ou si c'est la première décision
      // 4. OU si l'IA doit essayer de renvoyer la balle
      if (aiLastDecisionTime === 0 || 
          aiShouldAttemptReturn ||
          (timeSinceLastDecision >= AI_MIN_DECISION_TIME && 
           distanceFromLastTarget >= AI_MIN_DIRECTION_CHANGE_DISTANCE)) {
        
        aiTargetX = finalTargetX;
        aiLastTargetX = finalTargetX;
        aiLastDecisionTime = currentTime;
        
        // Stabiliser la cible pour éviter les changements fréquents
        aiStableTargetX = finalTargetX;
      } else {
        // Maintenir la cible précédente pour la stabilité
        aiTargetX = aiStableTargetX;
      }
    } else {
      // La balle ne va pas vers le paddle 2
      aiShouldAttemptReturn = false;
      aiShouldTargetMalus = false;
      aiTargetMalus = null;
    }
    
    // Sauvegarder la position actuelle de la balle
    aiLastBallPosition = lastBallView.position.clone();
  };

  // Fonction pour simuler des touches réelles de l'IA (comme un joueur humain)
  const simulateAIMovement = (paddle2: Mesh, deltaTime: number) => {
    if (!enableAIRef?.current || !paddle2) return;
    
    const currentTime = Date.now();
    const currentX = paddle2.position.x;
    const moveAmount = PADDLE_SPEED * deltaTime;
    
    // Calcul de la distance à la cible
    const distanceToTarget = Math.abs(currentX - aiTargetX);
    
    // Si l'IA doit essayer de renvoyer la balle, elle doit bouger même si elle est proche
    if (aiShouldAttemptReturn && aiIsBallApproaching) {
      // L'IA doit essayer de renvoyer - réduire la zone de tolérance
      const returnTolerance = AI_MOVEMENT_TOLERANCE * 0.5; // Tolérance réduite pour le renvoi
      
      if (distanceToTarget <= returnTolerance) {
        // L'IA est très proche de sa cible - elle peut s'arrêter
        aiIsMovingUp = false;
        aiIsMovingDown = false;
        aiCurrentDirection = 'none';
        return;
      }
    } else {
      // Zone de tolérance normale pour considérer que l'IA est proche de sa cible
      if (distanceToTarget <= AI_MOVEMENT_TOLERANCE) {
        // L'IA est proche de sa cible - elle arrête de bouger
        aiIsMovingUp = false;
        aiIsMovingDown = false;
        aiCurrentDirection = 'none';
        return;
      }
    }
    
    // Déterminer la direction nécessaire
    let shouldMoveUp = currentX > aiTargetX;
    let shouldMoveDown = currentX < aiTargetX;
    
    // Système de commitment pour éviter les mouvements erratiques
    const timeSinceDirectionStart = currentTime - aiDirectionCommitment;
    
    // Si l'IA est engagée dans une direction, elle doit y rester un minimum de temps
    if (aiCurrentDirection !== 'none' && timeSinceDirectionStart < aiMinCommitmentTime) {
      // L'IA est engagée - maintenir sa direction actuelle
      if (aiCurrentDirection === 'up') {
        shouldMoveUp = true;
        shouldMoveDown = false;
      } else if (aiCurrentDirection === 'down') {
        shouldMoveUp = false;
        shouldMoveDown = true;
      }
    } else {
      // L'IA peut changer de direction si nécessaire
      // Vérifier si le changement est vraiment nécessaire
      const directionChangeNeeded = (shouldMoveUp && aiCurrentDirection !== 'up') || 
                                   (shouldMoveDown && aiCurrentDirection !== 'down');
      
      if (directionChangeNeeded) {
        // Vérifier les conditions strictes pour changer de direction
        const timeSinceLastChange = currentTime - aiLastDirectionChange;
        const distanceFromLastTarget = Math.abs(aiTargetX - aiLastTargetX);
        
        // Changer de direction seulement si :
        // 1. Assez de temps s'est écoulé depuis le dernier changement
        // 2. La nouvelle cible est suffisamment différente
        // 3. OU si l'IA doit essayer de renvoyer la balle
        // 4. ET si on n'a pas trop changé de direction récemment
        if ((aiShouldAttemptReturn || 
             (timeSinceLastChange >= AI_MIN_DIRECTION_CHANGE_INTERVAL && 
              distanceFromLastTarget >= AI_MIN_DIRECTION_CHANGE_DISTANCE)) &&
            aiDirectionChangeCount < 3) { // Maximum 3 changements par période
          
          // Changer de direction
          aiLastDirectionChange = currentTime;
          aiDirectionCommitment = currentTime;
          aiDirectionChangeCount++;
          
          // Réinitialiser le compteur après un certain temps
          if (timeSinceLastChange > 2000) {
            aiDirectionChangeCount = 0;
          }
        } else {
          // Maintenir la direction actuelle pour éviter les changements fréquents
          if (aiCurrentDirection === 'up') {
            shouldMoveUp = true;
            shouldMoveDown = false;
          } else if (aiCurrentDirection === 'down') {
            shouldMoveUp = false;
            shouldMoveDown = true;
          }
        }
      }
    }
    
    // Stabilité de direction renforcée : 90% de chance de maintenir la direction actuelle
    // Mais pas si l'IA doit essayer de renvoyer la balle
    if (!aiShouldAttemptReturn && aiCurrentDirection !== 'none' && Math.random() < AI_DIRECTION_STABILITY_PROBABILITY) {
      // 90% de chance de maintenir la direction actuelle (sauf si elle doit renvoyer)
      if (aiCurrentDirection === 'up') {
        shouldMoveUp = true;
        shouldMoveDown = false;
      } else if (aiCurrentDirection === 'down') {
        shouldMoveUp = false;
        shouldMoveDown = true;
      }
    }
    
    // Gestion des changements de direction avec pauses plus longues
    if ((shouldMoveUp && aiIsMovingDown) || (shouldMoveDown && aiIsMovingUp)) {
      const timeSinceDirectionChange = currentTime - aiLastDirectionChange;
      if (timeSinceDirectionChange < AI_DIRECTION_CHANGE_PAUSE) { // Pause plus longue lors du changement de direction
        aiIsMovingUp = false;
        aiIsMovingDown = false;
        return;
      }
    }
    
    // Simuler des touches avec des durées variables
    if (shouldMoveUp && !aiIsMovingDown) {
      // L'IA appuie sur "haut"
      aiIsMovingUp = true;
      aiIsMovingDown = false;
      aiCurrentDirection = 'up';
      
      // Durée de la touche variable
      aiMovementDuration = Math.random() * (AI_MAX_TOUCH_DURATION - AI_MIN_TOUCH_DURATION) + AI_MIN_TOUCH_DURATION;
      
      // Appliquer le mouvement comme un joueur humain
      paddle2.position.x = Math.max(PADDLE_BOUND_LEFT, currentX - moveAmount);
      
    } else if (shouldMoveDown && !aiIsMovingUp) {
      // L'IA appuie sur "bas"
      aiIsMovingUp = false;
      aiIsMovingDown = true;
      aiCurrentDirection = 'down';
      
      // Durée de la touche variable
      aiMovementDuration = Math.random() * (AI_MAX_TOUCH_DURATION - AI_MIN_TOUCH_DURATION) + AI_MIN_TOUCH_DURATION;
      
      // Appliquer le mouvement comme un joueur humain
      paddle2.position.x = Math.min(PADDLE_BOUND_RIGHT, currentX + moveAmount);
      
    } else {
      // L'IA relâche les touches
      aiIsMovingUp = false;
      aiIsMovingDown = false;
      aiCurrentDirection = 'none';
    }
    
    // Simuler des pauses entre les touches (comme un joueur qui réfléchit)
    // Mais pas si l'IA doit essayer de renvoyer la balle
    if (!aiShouldAttemptReturn && Math.random() < AI_PAUSE_PROBABILITY) {
      aiIsMovingUp = false;
      aiIsMovingDown = false;
      aiCurrentDirection = 'none';
      aiPauseDuration = Math.random() * (AI_MAX_PAUSE_DURATION - AI_MIN_PAUSE_DURATION) + AI_MIN_PAUSE_DURATION;
    }
    
    // Respecter la durée de pause
    if (aiPauseDuration > 0) {
      aiPauseDuration -= deltaTime * 1000;
      aiIsMovingUp = false;
      aiIsMovingDown = false;
      aiCurrentDirection = 'none';
    }
    
    // Utiliser le coup spécial si l'IA a décidé de l'utiliser
    if (aiShouldUseSuperPad && enableSpecial && gameRefs.triggerSuperPad) {
      gameRefs.triggerSuperPad(2); // Activer le coup spécial pour le joueur 2 (IA)
      aiShouldUseSuperPad = false; // Réinitialiser pour éviter les utilisations multiples
    }
  };

  // Démarre l'IA si elle est activée
  if (enableAIRef?.current) {
    aiInterval = setInterval(updateAIVision, AI_VISION_UPDATE_INTERVAL);
  }

  // 5 sec et serve  a la fin en random
  startCountdownWrapper(5, safeSetIsPaused, gameRefs.setCountdown, () =>
    serve(Math.random() > 0.5 ? "player1" : "player2")
  );

  // Fonction pour décider si l'IA doit utiliser son coup spécial
  const decideSuperPadUsage = (distanceToTarget: number) => {
    if (!enableSpecial || !superPadRef?.current || !gameRefs.stamina.current) return;
    
    const currentTime = Date.now();
    const timeSinceLastUse = currentTime - aiLastSuperPadUse;
    const currentStamina = gameRefs.stamina.current.player2;
    const isSuperPadActive = superPadRef.current.player2;
    
    // L'IA peut utiliser son coup spécial si :
    // 1. Elle a 10 de stamina
    // 2. Le coup spécial n'est pas déjà actif
    // 3. Assez de temps s'est écoulé depuis la dernière utilisation
    // 4. La balle est suffisamment loin (difficile à atteindre)
    if (currentStamina === 10 && 
        !isSuperPadActive && 
        timeSinceLastUse >= AI_SUPER_PAD_COOLDOWN &&
        aiShouldAttemptReturn &&
        distanceToTarget >= AI_SUPER_PAD_MIN_DISTANCE) {
      
      // 70% de chance d'utiliser le coup spécial
      if (Math.random() < AI_USE_SUPER_PAD_PROBABILITY) {
        aiShouldUseSuperPad = true;
        aiLastSuperPadUse = currentTime;
      }
    }
  };

  // Fonction pour décider si l'IA doit viser un malus
  const decideMalusTargeting = () => {
    if (!miniPaddle || !bumperLeft || !bumperRight) return;
    
    const currentTime = Date.now();
    
    // 40% de chance de considérer viser un malus
    if (Math.random() < AI_TARGET_MALUS_PROBABILITY) {
      
      // Calculer les distances aux différents malus
      const malusDistances = {
        MINI_PADDLE: Math.abs(aiTargetX - miniPaddle.position.x),
        BUMPER_LEFT: Math.abs(aiTargetX - bumperLeft.position.x),
        BUMPER_RIGHT: Math.abs(aiTargetX - bumperRight.position.x)
      };
      
      // Trouver le malus le plus proche et prioritaire
      let bestMalus = null;
      let bestScore = 0;
      
      for (const [malusType, distance] of Object.entries(malusDistances)) {
        if (distance <= AI_MALUS_TARGET_DISTANCE) {
          const priority = AI_MALUS_PRIORITY[malusType as keyof typeof AI_MALUS_PRIORITY];
          const score = priority / (distance + 1); // Plus proche = meilleur score
          
          if (score > bestScore) {
            bestScore = score;
            bestMalus = malusType;
          }
        }
      }
      
      // Si on a trouvé un malus intéressant, le cibler
      if (bestMalus) {
        aiShouldTargetMalus = true;
        aiTargetMalus = bestMalus;
        
        // Définir la position cible du malus
        switch (bestMalus) {
          case 'MINI_PADDLE':
            aiMalusTargetX = miniPaddle.position.x;
            break;
          case 'BUMPER_LEFT':
            aiMalusTargetX = bumperLeft.position.x;
            break;
          case 'BUMPER_RIGHT':
            aiMalusTargetX = bumperRight.position.x;
            break;
        }
      } else {
        aiShouldTargetMalus = false;
        aiTargetMalus = null;
      }
    } else {
      aiShouldTargetMalus = false;
      aiTargetMalus = null;
    }
  };

  // clean l ecoute a la fin  (sans mettre de param == clean)
  return () => {
    unregisterInputs();
    if (aiInterval) {
      clearInterval(aiInterval);
    }
  };
};
