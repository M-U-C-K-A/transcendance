// Setup/setupEnvironment.ts
// ------------------------

import {
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  HemisphericLight,
  Vector3,
  StandardMaterial,
  Sound,
  GlowLayer,
} from "@babylonjs/core";
import { createGround } from "./setupGround";

export const initEnvironment = (
  scene: Scene,
  MapStyle: "classic" | "red" | "neon",
) => {





  // === GlowLayer pour "neon" ===
  if (MapStyle === "neon") {
    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.6;
  }






  // === Sons de collision (hit) ===
  const allHitSounds: Sound[] = [
    new Sound(
      "hit1",
      "/sounds/pong-1.mp3",
      scene,
      null,
      { volume: 0.5, autoplay: false }
    ),
  ];







  // === Caméra – ajustée pour les deux joueurs ===
  const camera = new ArcRotateCamera(
    "cam",
    0,
    Math.PI / 3.1,
    35,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(
    scene.getEngine().getRenderingCanvas(),
    true
  );
  camera.inputs.addMouseWheel();
  camera.inputs.removeByType(
    "ArcRotateCameraKeyboardMoveInput"
  );





  // Spot de lumiere sur la carte
  const dir = new DirectionalLight(
    "dir",
    new Vector3(1, -1, 0),
    scene
  );
  dir.intensity = 0.5;
  const hemi = new HemisphericLight("hemi", Vector3.Up(), scene);
  hemi.intensity = 0.3;






  // === Matériaux pour les paddles et la balle ===
  const p1Mat = new StandardMaterial("p1Mat", scene);
  const p2Mat = new StandardMaterial("p2Mat", scene);
  const ballMat = new StandardMaterial("ballMat", scene);

  





  // === Création du sol selon MapStyle ===
  createGround(scene, MapStyle);

  return {
    camera,
    allHitSounds,
    p1Mat,
    p2Mat,
    ballMat,
  };
};
