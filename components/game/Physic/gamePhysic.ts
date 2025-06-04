// gamePhysic.ts
// -------------


import { Vector3 } from "@babylonjs/core";
import { GameState, GameRefs } from "./gameTypes";

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
  const { ball, paddle1, paddle2, miniPaddle, allHitSounds, ballMat, p1Mat, p2Mat } =
    gameObjects;

  let ballV = Vector3.Zero();
  let currentSpeed = TOTAL_SPEED;
  let scoreLocal = { player1: 0, player2: 0 };
  const miniDirRef = { current: 1 };

  // 1) Installation des écouteurs clavier
  const unregisterInputs = registerInputListeners(gameRefs, setIsPaused);

  // 2) Fonction “serve” : remet la balle en jeu
  const serve = (loserSide: "player1" | "player2") => {
    const { velocity, speed } = serveBall(loserSide);
    ballV = velocity;
    currentSpeed = speed;
  };

  // 3) Remise à zéro de la balle après un point
  const resetBall = (loser: "player1" | "player2") => {
    ball.position = Vector3.Zero();
    ballV = Vector3.Zero();
    const dirZ = loser === "player1" ? -1 : 1;
    startCountdown(3, setIsPaused, setCountdown, () => serve(dirZ as any));
  };

  // 4) Boucle de jeu (exécutée avant chaque frame)
  scene.onBeforeRenderObservable.add(() => {
    if (gameRefs.winner.current || gameRefs.isPaused.current) return;

    // Déplacement des paddles
    movePaddles(paddle1, paddle2);

    // Logique mini-paddle
    updateMiniPaddle(miniPaddle, miniDirRef);

    // Déplacement de la balle
    ball.position.addInPlace(ballV);

    // Détection et traitement des collisions
    const collisionResult = handleCollisions(
      ball,
      paddle1,
      paddle2,
      miniPaddle,
      ballV,
      currentSpeed,
      ballMat,
      p1Mat,
      p2Mat,
      allHitSounds
    );
    ballV = collisionResult.newVelocity;
    currentSpeed = collisionResult.newSpeed;

    // Gestion des scores
    handleScoring(ball, scoreLocal, setScore, setWinner, resetBall, gameRefs);
  });

  // 5) Démarrage initial : compte à rebours 5s, puis serve aléatoire
  startCountdown(5, setIsPaused, setCountdown, () =>
    serve(Math.random() > 0.5 ? "player1" : "player2")
  );

  // 6) Retourne la fonction de cleanup pour désinscrire les événements clavier
  return () => {
    unregisterInputs();
  };
};
