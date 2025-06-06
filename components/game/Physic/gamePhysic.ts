import { Vector3 } from "@babylonjs/core";
import { GameState, GameRefs } from "../gameTypes";

import {
  TOTAL_SPEED,
  MINI_SPEED,
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

  let ballV = Vector3.Zero();
  let currentSpeed = TOTAL_SPEED;
  let scoreLocal = { player1: 0, player2: 0 };
  const miniDirRef = { current: 1 };
  const bumperDirRef = { current: 1 };
  const BUMPER_SPEED = 6; // unités / seconde, ajusté

  const unregisterInputs = registerInputListeners(gameRefs, setIsPaused);

  const serve = (loserSide: "player1" | "player2") => {
	const { velocity, speed } = serveBall(loserSide);
	ballV = velocity;
	currentSpeed = speed;
  };

  const resetBall = (loser: "player1" | "player2") => {
  const startY = 0.25;
  const startZ = loser === "player1" ? paddle1.position.z + 17: paddle2.position.z - 17;
  ball.position.set(0, startY, startZ);
  ballV = Vector3.Zero();
  startCountdown(3, setIsPaused, setCountdown, () => serve(loser));
  };


  scene.onBeforeRenderObservable.add(() => {
	if (gameRefs.winner.current || gameRefs.isPaused.current) return;

  	const deltaTime = scene.getEngine().getDeltaTime() / 1000; // en secondes

  	movePaddles(paddle1, paddle2, deltaTime);

  	if (miniPaddle) {
  	  updateMiniPaddle(miniPaddle, miniDirRef, deltaTime);
  	}

	if (bumperLeft && bumperRight) {
	  bumperLeft.position.x += BUMPER_SPEED * bumperDirRef.current * deltaTime;
	  bumperRight.position.x -= BUMPER_SPEED * bumperDirRef.current * deltaTime;

	  if (
	    bumperLeft.position.x >= 0 ||
	    bumperRight.position.x <= 0
	  ) {
	    bumperDirRef.current = -bumperDirRef.current;
	  }
	  if (
	    bumperLeft.position.x <= BUMPER_BOUND_LEFT ||
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

  startCountdown(5, setIsPaused, setCountdown, () =>
	serve(Math.random() > 0.5 ? "player1" : "player2")
  );

  return () => {
	unregisterInputs();
  };
};
