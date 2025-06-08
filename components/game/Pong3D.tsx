// src/Pong3D.tsx
import { useEffect, useRef, useState } from "react";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine, Scene, Color3, Vector3, Color4, Mesh } from "@babylonjs/core";
import { setupGame } from "./Setup/setupGame";
import { initgamePhysic } from "./Physic/gamePhysic";
import { GameUI } from "../../app/[locale]/game/[mode]/GameUI";
import type { Pong3DProps, GameState, GameRefs, GameObjects, TouchHistory } from "./gameTypes";
import { MalusSystem } from "./Physic/Malus";
import { useControls } from "../../app/[locale]/game/[mode]/ControlsContext";

export default function Pong3D({
  paddle1Color,
  paddle2Color,
  MapStyle,
  resetCamFlag,
  enableSpecial = false,
  enableMaluses = false,
}: Pong3DProps & { enableSpecial?: boolean, enableMaluses?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const gameObjectsRef = useRef<GameObjects | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const MalusSystemRef = useRef<MalusSystem | null>(null);
  const { controls } = useControls();

  // ─── États React ─────────────────────────────────────────────
  const [score, setScore] = useState<GameState["score"]>({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<GameState["winner"]>(null);
  const [countdown, setCountdown] = useState<GameState["countdown"]>(0);
  const [isPaused, setIsPaused] = useState<GameState["isPaused"]>(false);
  const [MalusBarKey, setMalusBarKey] = useState(0);
  const [stamina, setStamina] = useState({ player1: 0, player2: 0 });
  const [superPad, setSuperPad] = useState({ player1: false, player2: false });
  const touchHistory: TouchHistory[] = [];

  // ─── Références pour synchroniser l'état ────────────────────
  const scoreRef = useRef(score);
  const winnerRef = useRef(winner);
  const countdownRef = useRef(countdown);
  const isPausedRef = useRef(isPaused);
  const superPadRef = useRef(superPad);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { winnerRef.current = winner; }, [winner]);
  useEffect(() => { countdownRef.current = countdown; }, [countdown]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { superPadRef.current = superPad; }, [superPad]);

  // ─── Handlers ───────────────────────────────────────────────
  const handleSetIsPaused = (paused: boolean) => {
    setIsPaused(paused);
  };

  // ─── Effet principal ────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current) return;

    // 1) Création de l'Engine et de la Scene
    const engine = new Engine(canvasRef.current, true);
    engineRef.current = engine;
    const scene = new Scene(engine);
    scene.clearColor = new Color4(1, 1, 1, 1);
    sceneRef.current = scene;

    // 2) Appel à setupGame qui retourne un objet conforme à GameObjects
    const objs = setupGame(scene, MapStyle, paddle1Color, paddle2Color);
    cameraRef.current = objs.camera;
    gameObjectsRef.current = objs;

    // 3) Création de l'objet gameRefs pour la physique
    const gameRefs = {
      score: scoreRef,
      winner: winnerRef,
      countdown: countdownRef,
      isPaused: isPausedRef,
      setScore,
      setWinner,
      setCountdown,
      setIsPaused,
      controls,
      touchHistory,
    };

    // 4) Initialisation de la physique
    const cleanupPhysic = initgamePhysic(
      scene,
      objs,
      { score, winner, countdown, isPaused },
      gameRefs,
      setStamina,
      setSuperPad,
      enableSpecial,
      superPadRef,
      touchHistory
    );

    // 5) Initialiser le système de Malus si activé
    if (enableMaluses) {
      MalusSystemRef.current = new MalusSystem(
        scene,
        { score, winner, countdown, isPaused },
        gameRefs,
        () => setMalusBarKey((k) => k + 1),
        setScore,
        setWinner
      );
      MalusSystemRef.current.startMalusSystem();
    }

    // 6) Boucle de rendu
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());

    // 7) Cleanup à la destruction du composant
    return () => {
      cleanupPhysic();
      if (MalusSystemRef.current) {
        MalusSystemRef.current.stopMalusSystem();
      }
      engine.dispose();
    };
  }, [paddle1Color, paddle2Color, MapStyle, enableMaluses]);

  // Reset de la caméra
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setPosition(new Vector3(35, 35, 0));
      cameraRef.current.setTarget(Vector3.Zero());
    }
  }, [resetCamFlag]);

  // Mettre à jour les couleurs
  useEffect(() => {
    if (gameObjectsRef.current) {
      const { p1Mat, p2Mat } = gameObjectsRef.current;
      p1Mat.diffuseColor = Color3.FromHexString(paddle1Color);
      p2Mat.diffuseColor = Color3.FromHexString(paddle2Color);
    }
  }, [paddle1Color, paddle2Color]);

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
      />
    </div>
  );
}
