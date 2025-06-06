// src/Physic/gamePhysic.ts
import { Vector3 } from "@babylonjs/core";
import { Scene }   from "@babylonjs/core/scene";
import type { Mesh }              from "@babylonjs/core/Meshes/mesh";
import type { StandardMaterial }  from "@babylonjs/core/Materials/standardMaterial";
import type { ArcRotateCamera }   from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Sound }             from "@babylonjs/core/Audio/sound";
import { Dispatch, SetStateAction } from "react";

import {
  TOTAL_SPEED,
  // On réduit BUMPER_SPEED ici pour ralentir les bumpers
  BUMPER_SPEED,           // ex. passe de 8 → 4
  BUMPER_BOUND_LEFT,      // ex. -8
  BUMPER_BOUND_RIGHT,     // ex. +8
  BUMPER_MID_LEFT,        // ex. -4
  BUMPER_MID_RIGHT,       // ex. +4
} from "./constants";

import { serve as serveBall }      from "./paddle/serve";
import { startCountdown }          from "./countdown";
import { handleScoring }           from "./collisions/scoring";
import { registerInputListeners }  from "./input";
import { movePaddles }             from "./paddle/paddleMovement";
import { updateMiniPaddle }        from "./paddle/miniPaddleLogic";
import { handleCollisions }        from "./collisions/handleCollisions";
import { collideTrianglePrism }    from "./collisions/collisionTriangles";
import type { GameState, GameRefs, GameObjects } from "../gameTypes";

export const initgamePhysic = (
  scene: Scene,
  gameObjects: GameObjects,
  gameState: GameState,
  gameRefs: GameRefs,
  setScore: Dispatch<SetStateAction<{ player1: number; player2: number }>>,
  setWinner: Dispatch<SetStateAction<string | null>>,
  setCountdown: Dispatch<SetStateAction<number | null>>,
  setIsPaused: Dispatch<SetStateAction<boolean>>
): (() => void) => {
  const {
    ball,
    paddle1,
    paddle2,
    miniPaddle,
    bumperLeft,
    bumperRight,
    allHitSounds,
    ballMat,
    p1Mat,
    p2Mat,
    leftTri,
    rightTri,
    rightTriOuterLeft,
    leftTriOuterLeft,
    rightTriOuterRight,
    leftTriOuterRight
  } = gameObjects;

  // Référentiel pour bloquer pause et mouvement
  const blockPauseRef    = { current: false };
  const blockMovementRef = { current: false };

  // Directions : +1 = vers le centre, -1 = vers l’extérieur
  const miniDirRef   = { current: 1 };
  const bumperDirRef = { current: 1 };

  // Réinitialise miniPaddle et bumpers à leur position de départ
  const resetBumpersAndMiniPaddle = () => {
    if (miniPaddle) {
      miniPaddle.position.set(5, 0.25, 0); // exemple, ajustez à votre coordonnée initiale
    }
    if (bumperLeft && bumperRight) {
      bumperLeft.position.set(BUMPER_BOUND_LEFT,  0.25, 0);
      bumperRight.position.set(BUMPER_BOUND_RIGHT, 0.25, 0);
    }
    miniDirRef.current   = 1;
    bumperDirRef.current = 1;
  };

  // Version “sûre” pour bloquer pause durant countdown
  const safeSetIsPaused = (newPauseState: boolean) => {
    if (!blockPauseRef.current) {
      setIsPaused(newPauseState);
    }
  };

  // Lance un countdown, bloque la pause/movement, reset des bumpers, puis débloque
  const startCountdownWrapper = (
    duration: number,
    setIsPausedFn: (paused: boolean) => void,
    setCountdownFn: (countdown: number | null) => void,
    callback: () => void
  ) => {
    blockPauseRef.current    = true;
    blockMovementRef.current = true;
    resetBumpersAndMiniPaddle();

    startCountdown(duration, setIsPausedFn, setCountdownFn, () => {
      callback();
      blockPauseRef.current    = false;
      blockMovementRef.current = false;
    });
  };

  // Enregistre les listeners clavier (mouvement + escape), utilContinu
  const unregisterInputs = registerInputListeners(gameRefs, safeSetIsPaused);

  let ballV = Vector3.Zero();
  let currentSpeed = TOTAL_SPEED;
  let scoreLocal = { player1: 0, player2: 0 };

  const serve = (loserSide: "player1" | "player2") => {
    const { velocity, speed } = serveBall(loserSide);
    ballV = velocity;
    currentSpeed = speed;
  };

  const resetBall = (loser: "player1" | "player2") => {
    const startY = 0.25;
    const startZ =
      loser === "player1"
        ? (paddle1.position.z as number) + 17
        : (paddle2.position.z as number) - 17;
    ball.position.set(0, startY, startZ);
    ballV = Vector3.Zero();
    startCountdownWrapper(3, safeSetIsPaused, setCountdown, () =>
      serve(loser)
    );
  };

  scene.onBeforeRenderObservable.add(() => {
    const isPausedNow   = gameRefs.isPaused.current;
    const countdownNow  = gameRefs.countdown.current;

    // Si partie terminée, en pause, ou mouvement bloqué, on skip le rendu physique
    if (
      gameRefs.winner.current ||
      isPausedNow      ||
      countdownNow !== null ||
      blockMovementRef.current
    ) {
      return;
    }

    const deltaTime = scene.getEngine().getDeltaTime() / 1000; // en secondes

    // ─── Déplacement des paddles ───────────────────────────────────
    movePaddles(paddle1, paddle2, deltaTime);

    // ─── Mini-paddle, si présent ──────────────────────────────────
    if (miniPaddle) {
      updateMiniPaddle(miniPaddle, miniDirRef, deltaTime);
    }

    // ─── Bumpers ───────────────────────────────────────────────────
    if (bumperLeft && bumperRight) {
      // Calcul du déplacement pour chaque bumper
      const moveAmount = BUMPER_SPEED * deltaTime * bumperDirRef.current;

      // On calcule la nouvelle position brute
      let newLeftX  = bumperLeft.position.x  + moveAmount;
      let newRightX = bumperRight.position.x - moveAmount;

      // 1) Clampuer à l’intérieur des bornes (pour éviter hors-map)
      //    BUMPER_BOUND_LEFT ≤ leftX ≤ BUMPER_BOUND_RIGHT
      //    BUMPER_BOUND_LEFT ≤ rightX ≤ BUMPER_BOUND_RIGHT
      newLeftX  = Math.max(BUMPER_BOUND_LEFT,  Math.min(BUMPER_BOUND_RIGHT, newLeftX));
      newRightX = Math.max(BUMPER_BOUND_LEFT,  Math.min(BUMPER_BOUND_RIGHT, newRightX));

      // 2) Définir exactement la “mi-distance” si on dépasse
      //    Si on avance vers l’intérieur (dir = +1) :
      if (bumperDirRef.current > 0) {
        // Si left dépasse la mi-distance, on le clamp précisément à BUMPER_MID_LEFT
        if (newLeftX >= BUMPER_MID_LEFT) {
          newLeftX = BUMPER_MID_LEFT;
        }
        // Si right descend sous la mi-distance, clamp au BUMPER_MID_RIGHT
        if (newRightX <= BUMPER_MID_RIGHT) {
          newRightX = BUMPER_MID_RIGHT;
        }
      }
      //    Si on repart vers l’extérieur (dir = -1) :
      else {
        // Si left revient sous la borne extérieure
        if (newLeftX <= BUMPER_BOUND_LEFT) {
          newLeftX = BUMPER_BOUND_LEFT;
        }
        // Si right revient au-delà de sa borne extérieure
        if (newRightX >= BUMPER_BOUND_RIGHT) {
          newRightX = BUMPER_BOUND_RIGHT;
        }
      }

      // 3) Mettre à jour les positions
      bumperLeft.position.x  = newLeftX;
      bumperRight.position.x = newRightX;

      // 4) Inversion de direction lorsqu’on atteint la cible
      if (bumperDirRef.current > 0) {
        // On inverse si l’un des deux a atteint sa mi-distance
        if (newLeftX  === BUMPER_MID_LEFT || newRightX === BUMPER_MID_RIGHT) {
          bumperDirRef.current = -1;
        }
      } else {
        // On inverse si l’un revient à sa borne extérieure
        if (newLeftX  === BUMPER_BOUND_LEFT || newRightX === BUMPER_BOUND_RIGHT) {
          bumperDirRef.current = 1;
        }
      }
    }




    // ─── Mouvement de la balle ─────────────────────────────────────
    ball.position.addInPlace(ballV.scale(deltaTime));

    // ─── Collisions & ajustement de vélocité ───────────────────────
    const collisionResult = handleCollisions(
      ball,
      paddle1,
      paddle2,
      miniPaddle,
      bumperLeft,
      bumperRight,
      ballV,
      currentSpeed,
      ballMat,
      p1Mat,
      p2Mat,
      allHitSounds,
      rightTri,
      leftTri,
      rightTriOuterLeft,
      leftTriOuterLeft,
      rightTriOuterRight,
      leftTriOuterRight
    );
    ballV = collisionResult.newVelocity;
    currentSpeed = collisionResult.newSpeed;

    // ─── Gestion du score (resetBall appelle startCountdownWrapper) ──
    handleScoring(ball, scoreLocal, setScore, setWinner, resetBall, gameRefs);
  });

  // Premier countdown avant le service initial
  startCountdownWrapper(5, safeSetIsPaused, setCountdown, () =>
    serve(Math.random() > 0.5 ? "player1" : "player2")
  );

  return () => {
    unregisterInputs();
  };
};
