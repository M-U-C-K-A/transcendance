import { useEffect, useRef, useState } from "react";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine, Scene, Color3, Vector3, Color4 } from "@babylonjs/core";
import { setupGame } from "./Setup/setupGame";
import { initgamePhysic } from "./Physic/gamePhysic";
import { GameUI } from "../../app/[locale]/game/[mode]/GameUI";
import type { Pong3DProps, GameState, GameRefs, GameObjects, TouchHistory } from "./gameTypes";
import { MalusSystem } from "./Physic/Malus";
import { useControls } from "../../app/[locale]/game/[mode]/ControlsContext";
import type { Sound } from "@babylonjs/core/Audio/sound";
import { handleCollisions } from "./Physic/collisions/handleCollisions";

export default function Pong3D({
  paddle1Color,
  paddle2Color,
  MapStyle,
  resetCamFlag,
  enableSpecial = false,
  enableMaluses = false,
  volume = 0.2,
  enableAcceleration = true,
  speedIncrement = 0.009,
}: Pong3DProps & { enableSpecial?: boolean, enableMaluses?: boolean, volume?: number, enableAcceleration?: boolean, speedIncrement?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const gameObjectsRef = useRef<GameObjects | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const MalusSystemRef = useRef<MalusSystem | null>(null);
  const { controls } = useControls();
  const controlsRef = useRef(controls);

  // ─── États React ─────────────────────────────────────────────
  const [score, setScore] = useState<GameState["score"]>({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<GameState["winner"]>(null);
  const [countdown, setCountdown] = useState<GameState["countdown"]>(0);
  const [isPaused, setIsPaused] = useState<GameState["isPaused"]>(false);
  const [MalusBarKey, setMalusBarKey] = useState(0);
  const [stamina, setStamina] = useState({ player1: 0, player2: 0 });
  const [superPad, setSuperPad] = useState({ player1: false, player2: false });
  const touchHistory = useRef<TouchHistory[]>([]);
  const [showGoal, setShowGoal] = useState(false);
  const [lastScoreType, setLastScoreType] = useState<'goal' | 'malus'>('goal');
  const prevScore = useRef(score);
  const allHitSounds = useRef<Sound[]>([]);

  // ─── Références pour synchroniser l'état ────────────────────
  const scoreRef = useRef(score);
  const winnerRef = useRef(winner);
  const countdownRef = useRef(countdown);
  const isPausedRef = useRef(isPaused);
  const superPadRef = useRef(superPad);
  const staminaRef = useRef(stamina);
  const volumeRef = useRef(volume);
  const lastHitterRef = useRef<number | null>(null);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { winnerRef.current = winner; }, [winner]);
  useEffect(() => { countdownRef.current = countdown; }, [countdown]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { superPadRef.current = superPad; }, [superPad]);
  useEffect(() => { staminaRef.current = stamina; }, [stamina]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);

  useEffect(() => {
    if (
      score.player1 !== prevScore.current.player1 ||
      score.player2 !== prevScore.current.player2
    ) {
      // Détection du type de score
      const diff1 = score.player1 - prevScore.current.player1;
      const diff2 = score.player2 - prevScore.current.player2;
      if ((diff1 > 0 && diff2 === 0) || (diff2 > 0 && diff1 === 0)) {
        setLastScoreType('goal');
      } else if ((diff1 < 0 && diff2 === 0) || (diff2 < 0 && diff1 === 0)) {
        setLastScoreType('malus');
      }
      setShowGoal(true);
      setTimeout(() => setShowGoal(false), 700);
      prevScore.current = { ...score };
    }
  }, [score]);

  useEffect(() => {
    controlsRef.current = controls;
  }, [controls]);

  const handleSetIsPaused = (paused: boolean) => {
    setIsPaused(paused);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new Engine(canvasRef.current, true);
    engineRef.current = engine;
    const scene = new Scene(engine);
    scene.clearColor = new Color4(1, 1, 1, 1);
    sceneRef.current = scene;
    const objs = setupGame(scene, MapStyle, paddle1Color, paddle2Color);
    cameraRef.current = objs.camera;
    gameObjectsRef.current = objs;
    const gameRefs: GameRefs = {
      score: scoreRef,
      winner: winnerRef,
      countdown: countdownRef,
      isPaused: isPausedRef,
      setScore,
      setWinner,
      setCountdown,
      setIsPaused,
      controls: controlsRef,
      touchHistory: touchHistory.current,
      superPad: superPadRef,
      stamina: staminaRef,
      malusSound: null,
      lastHitter: lastHitterRef,
      triggerSuperPad: () => {},
    };
    const cleanupPhysic = initgamePhysic(
      scene,
      objs,
      gameRefs,
      setStamina,
      setSuperPad,
      enableSpecial,
      superPadRef,
      volumeRef,
      enableAcceleration,
      speedIncrement
    );
    if (enableMaluses) {
      MalusSystemRef.current = new MalusSystem(
        scene,
        { 
          score: scoreRef.current, 
          winner: winnerRef.current, 
          countdown: countdownRef.current, 
          isPaused: isPausedRef.current 
        },
        gameRefs,
        () => setMalusBarKey((k) => k + 1),
        setScore,
        setWinner
      );
      MalusSystemRef.current.startMalusSystem();
    }
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
    return () => {
      cleanupPhysic();
      if (MalusSystemRef.current) {
        MalusSystemRef.current.stopMalusSystem();
      }
      engine.dispose();
    };
  }, [paddle1Color, paddle2Color, MapStyle, enableMaluses, enableSpecial, enableAcceleration, speedIncrement]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setPosition(new Vector3(35, 35, 0));
      cameraRef.current.setTarget(Vector3.Zero());
    }
  }, [resetCamFlag]);

  useEffect(() => {
    if (gameObjectsRef.current) {
      const { p1Mat, p2Mat } = gameObjectsRef.current;
      p1Mat.diffuseColor = Color3.FromHexString(paddle1Color);
      p2Mat.diffuseColor = Color3.FromHexString(paddle2Color);
    }
  }, [paddle1Color, paddle2Color]);

  useEffect(() => {
    if (winner && (volumeRef.current ?? volume) > 0) {
      const applause = new window.Audio("/sounds/Applause  Sound Effect.mp3");
      applause.volume = volumeRef.current ?? volume;
      applause.play();
    }
  }, [winner, volume]);

  useEffect(() => {
    if (!isPaused && !winner) {
      const interval = setInterval(() => {
        if (gameObjectsRef.current && sceneRef.current) {
          const { ball, ballV, currentSpeed } = gameObjectsRef.current;
          if (ball && ballV) {
            const result = handleCollisions(
              ball,
              gameObjectsRef.current.paddle1,
              gameObjectsRef.current.paddle2,
              gameObjectsRef.current.miniPaddle,
              gameObjectsRef.current.bumperLeft,
              gameObjectsRef.current.bumperRight,
              ballV,
              currentSpeed,
              gameObjectsRef.current.ballMat,
              gameObjectsRef.current.p1Mat,
              gameObjectsRef.current.p2Mat,
              allHitSounds.current,
              gameObjectsRef.current.rightTri,
              gameObjectsRef.current.leftTri,
              gameObjectsRef.current.rightTriOuterLeft,
              gameObjectsRef.current.leftTriOuterLeft,
              gameObjectsRef.current.rightTriOuterRight,
              gameObjectsRef.current.leftTriOuterRight,
              volumeRef.current,
              speedIncrement,
              stamina,
              setStamina,
              superPad
            );
            ballV.copyFrom(result.newVelocity);
            gameObjectsRef.current.currentSpeed = result.newSpeed;
          }
        }
      }, 1000 / 60);
      return () => clearInterval(interval);
    }
  }, [isPaused, winner, countdown, enableAcceleration, score, speedIncrement, stamina, superPad]);

  useEffect(() => {
    if (allHitSounds.current.length > 0) {
      allHitSounds.current.forEach((sound: Sound) => {
        sound.setVolume(volume);
      });
    }
  }, [volume]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <GameUI
        score={score}
        winner={winner}
        countdown={countdown}
        isPaused={isPaused}
        setIsPaused={handleSetIsPaused}
        enableMaluses={enableMaluses}
        MalusBarKey={MalusBarKey}
        stamina={enableSpecial ? stamina : { player1: 0, player2: 0 }}
        superPad={enableSpecial ? superPad : { player1: false, player2: false }}
        enableSpecial={enableSpecial}
        showGoal={showGoal}
        lastScoreType={lastScoreType}
      />
    </div>
  );
}