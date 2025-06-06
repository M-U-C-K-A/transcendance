// src/Physic/gamePhysic.ts
import { Vector3 } from "@babylonjs/core";
import { GameState, GameRefs } from "../gameTypes";

import {
  TOTAL_SPEED,
  BUMPER_SPEED,
  BUMPER_BOUND_LEFT,
  BUMPER_BOUND_RIGHT,
} from "./constants";
import { serve as serveBall } from "./paddle/serve";
import { startCountdown } from "./countdown";
import { handleScoring } from "./collisions/scoring";
import { registerInputListeners } from "./input";
import { movePaddles } from "./paddle/paddleMovement";
import { updateMiniPaddle } from "./paddle/miniPaddleLogic";
import { handleCollisions } from "./collisions/handleCollisions";

export const initgamePhysic = (
  scene: any,
  gameObjects: any,
  gameState: GameState,
  gameRefs: GameRefs,
  setScore: (score: { player1: number; player2: number }) => void,
  setWinner: (winner: string | null) => void,
  setCountdown: (countdown: number | null) => void,
  setIsPaused: (isPaused: boolean) => void
) => {
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
  } = gameObjects;

  // Blocage de la pause et du mouvement
  const blockPauseRef = { current: false };
  const blockMovementRef = { current: false };

  // Références pour diriger miniPaddle et bumpers
  const miniDirRef = { current: 1 };
  const bumperDirRef = { current: 1 };

  // Remet bumpers et miniPaddle à leurs positions de départ et réinitialise les directions
  const resetBumpersAndMiniPaddle = () => {
    if (miniPaddle) {
      // position de départ arbitraire ; ajustez selon vos coordonnées initiales
      miniPaddle.position.set(5, 0.25, 0);
    }
    if (bumperLeft && bumperRight) {
      bumperLeft.position.set(-8, 0.25, 0);
      bumperRight.position.set(8, 0.25, 0);
    }
    miniDirRef.current = 1;
    bumperDirRef.current = 1;
  };

  // Permet de bloquer la mise en pause tant que blockPauseRef.current === true
  const safeSetIsPaused = (newPauseState: boolean) => {
    if (!blockPauseRef.current) {
      setIsPaused(newPauseState);
    }
  };

  // Intercepte le compte à rebours : bloque pause + mouvement, réinitialise objets, puis débloque
  const startCountdownWrapper = (
    duration: number,
    setIsPausedFn: (paused: boolean) => void,
    setCountdownFn: (countdown: number | null) => void,
    callback: () => void
  ) => {
    blockPauseRef.current = true;
    blockMovementRef.current = true;
    resetBumpersAndMiniPaddle();

    startCountdown(duration, setIsPausedFn, setCountdownFn, () => {
      callback();
      blockPauseRef.current = false;
      blockMovementRef.current = false;
    });
  };

  // Enregistre les listeners d’entrée utilisateur en utilisant safeSetIsPaused
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
    startCountdownWrapper(3, safeSetIsPaused, setCountdown, () => serve(loser));
  };

  scene.onBeforeRenderObservable.add(() => {
    // Si partie gagnée, en pause manuelle ou en compte à rebours, on bloque tout
    if (
      gameRefs.winner.current ||
      gameRefs.isPaused.current ||
      blockMovementRef.current
    ) {
      return;
    }

    const deltaTime = scene.getEngine().getDeltaTime() / 1000;

    movePaddles(paddle1, paddle2, deltaTime);

    if (miniPaddle) {
      updateMiniPaddle(miniPaddle, miniDirRef, deltaTime);
    }

    if (bumperLeft && bumperRight) {
      bumperLeft.position.x += BUMPER_SPEED * bumperDirRef.current * deltaTime;
      bumperRight.position.x -= BUMPER_SPEED * bumperDirRef.current * deltaTime;

      if (
        bumperLeft.position.x >= 0 &&
        bumperRight.position.x <= 0
      ) {
        bumperDirRef.current = -bumperDirRef.current;
      }
      if (
        bumperLeft.position.x <= BUMPER_BOUND_LEFT &&
        bumperRight.position.x >= BUMPER_BOUND_RIGHT
      ) {
        bumperDirRef.current = -bumperDirRef.current;
      }
    }

    ball.position.addInPlace(ballV.scale(deltaTime));

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
      allHitSounds
    );
    ballV = collisionResult.newVelocity;
    currentSpeed = collisionResult.newSpeed;

    handleScoring(ball, scoreLocal, setScore, setWinner, resetBall, gameRefs);
  });

  // Premier service avec countdown
  startCountdownWrapper(5, safeSetIsPaused, setCountdown, () =>
    serve(Math.random() > 0.5 ? "player1" : "player2")
  );

  return () => {
    unregisterInputs();
  };
};
