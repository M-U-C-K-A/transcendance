// src/Physic/gamePhysic.ts
// -------------------------

import { Vector3 } from "@babylonjs/core";
import { GameState, GameRefs } from "../gameTypes";

import { TOTAL_SPEED } from "./constants";
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
  // 1) Déstructuration de tous les objets, y compris bumpers
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

  let ballV = Vector3.Zero();
  let currentSpeed = TOTAL_SPEED;
  let scoreLocal = { player1: 0, player2: 0 };
  const miniDirRef = { current: 1 };
  const bumperDirRef = { current: 1 }; // 1 = vers centre, -1 = vers bord
  const BUMPER_SPEED = 0.08;

  // 2) Installation des écouteurs clavier
  const unregisterInputs = registerInputListeners(gameRefs, setIsPaused);

  // 3) Fonction “serve”
  const serve = (loserSide: "player1" | "player2") => {
    const { velocity, speed } = serveBall(loserSide);
    ballV = velocity;
    currentSpeed = speed;
  };

  // 4) Remise à zéro de la balle après un point
  const resetBall = (loser: "player1" | "player2") => {
    ball.position = Vector3.Zero();
    ballV = Vector3.Zero();
    const dirZ = loser === "player1" ? -1 : 1;
    startCountdown(3, setIsPaused, setCountdown, () => serve(dirZ as any));
  };

  // 5) Boucle de jeu (avant chaque frame)
  scene.onBeforeRenderObservable.add(() => {
    // Si pause ou partie terminée, on suspend tous les mouvements
    if (gameRefs.winner.current || gameRefs.isPaused.current) return;

    // 5.1) Déplacement des paddles
    movePaddles(paddle1, paddle2);

    // 5.2) Logique mini-paddle (si défini)
    if (miniPaddle) {
      updateMiniPaddle(miniPaddle, miniDirRef);
    }

    // 5.3) Déplacement bumpers (si défini)
    if (bumperLeft && bumperRight) {
      // BumperLeft : démarre à x=-8, va vers centre (x=0), puis vers +8, etc.
      bumperLeft.position.x += BUMPER_SPEED * bumperDirRef.current;
      bumperRight.position.x -= BUMPER_SPEED * bumperDirRef.current;

      // Si bumperLeft atteint ou dépasse centre (x >= 0) OU bumperRight atteint centre (x <= 0), on inverse la direction
      if (bumperLeft.position.x >= 0 || bumperRight.position.x <= 0) {
        bumperDirRef.current = -bumperDirRef.current;
      }
      // Si bumperLeft revient à bord gauche (x <= -8) OU bumperRight revient à bord droit (x >= +8), on inverse à nouveau
      if (bumperLeft.position.x <= -8 || bumperRight.position.x >= 8) {
        bumperDirRef.current = -bumperDirRef.current;
      }
    }

    // 5.4) Déplacement de la balle
    ball.position.addInPlace(ballV);

    // 5.5) Détection et traitement des collisions (en passant bumpers)
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

    // 5.6) Gestion des scores
    handleScoring(ball, scoreLocal, setScore, setWinner, resetBall, gameRefs);
  });

  // 6) Démarrage initial : compte à rebours 5s, puis “serve”
  startCountdown(5, setIsPaused, setCountdown, () =>
    serve(Math.random() > 0.5 ? "player1" : "player2")
  );

  // 7) Cleanup : désinscrire les inputs
  return () => {
    unregisterInputs();
  };
};
