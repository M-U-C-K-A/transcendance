// src/Pong3D.tsx
import { useEffect, useRef, useState } from "react";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine, Scene, Color3, Vector3 } from "@babylonjs/core";
import { setupGame } from "./Setup/setupGame";
import { initgamePhysic } from "./Physic/gamePhysic";
import { GameUI } from "../../app/[locale]/game/[mode]/GameUI";
import type { Pong3DProps, GameState, GameRefs, GameObjects } from "./gameTypes";

export default function Pong3D({
  paddle1Color,
  paddle2Color,
  MapStyle,
}: Pong3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ─── États React ─────────────────────────────────────────────
  const [score, setScore] = useState<{ player1: number; player2: number }>({
    player1: 0,
    player2: 0,
  });
  const [winner, setWinner] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // ─── Refs pour GameRefs (y compris maintenant countdown) ──────
  const winnerRef = useRef<string | null>(winner);
  const isPausedRef = useRef<boolean>(isPaused);
  const countdownRef = useRef<number | null>(countdown);

  useEffect(() => {
    winnerRef.current = winner;
  }, [winner]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  // Wrapper pour interdire la pause tant que countdown !== null
  const handleSetIsPaused = (pause: boolean) => {
    if (countdown !== null) return;
    setIsPaused(pause);
  };

  // ─── Réf pour la caméra Babylon ────────────────────────────────
  const cameraRef = useRef<ArcRotateCamera | null>(null);

  // ─── Réf pour stocker tous les objets du jeu ──────────────────
  const gameObjectsRef = useRef<GameObjects | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1) Création de l’Engine et de la Scene
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color3(1, 1, 1);

    // 2) Appel à setupGame qui retourne un objet conforme à GameObjects
    const objs = setupGame(scene, MapStyle, paddle1Color, paddle2Color);
    cameraRef.current = objs.camera;

    // On stocke dans la ref pour y accéder depuis gamePhysic si besoin
    gameObjectsRef.current = objs;

    // 3) Préparer l’objet gameRefs à passer à initgamePhysic
    const gameRefs: GameRefs = {
      winner: winnerRef,
      isPaused: isPausedRef,
      countdown: countdownRef,
    };

    // 4) Lancer la logique physique
    const cleanupPhysic = initgamePhysic(
      scene,
      objs,
      { score, winner, countdown, isPaused },
      gameRefs,
      setScore,
      setWinner,
      setCountdown,
      handleSetIsPaused
    );

    // 5) Boucle de rendu
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());

    // 6) Cleanup à la destruction du composant
    return () => {
      cleanupPhysic();
      engine.dispose();
    };
  }, [paddle1Color, paddle2Color, MapStyle]);

  return (
    <div className="relative">
      <GameUI
        score={score}
        winner={winner}
        countdown={countdown}
        isPaused={isPaused}
        setIsPaused={handleSetIsPaused}
      />
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
