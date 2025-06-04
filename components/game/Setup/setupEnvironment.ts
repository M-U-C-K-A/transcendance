// Setup/setupEnvironment.ts
// ------------------------

import {
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  HemisphericLight,
  Vector3,
  Color3,
  StandardMaterial,
  Sound,
  GlowLayer,
} from "@babylonjs/core";
import { createGround } from "./setupGround";

export const initEnvironment = (
  scene: Scene,
  MapStyle: "classic" | "red" | "neon",
  paddle1Color: string,
  paddle2Color: string
) => {
  // === GlowLayer pour “neon” ===
  if (MapStyle === "neon") {
    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.6; // Assure-toi que l'intensité du glow est bien appliquée
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
    // Ajoute d'autres sons si nécessaire
  ];

  // === Caméra – ajustée pour les deux joueurs ===
  const camera = new ArcRotateCamera(
    "cam",
    0, // axe Y pour tourner à droite / gauche
    Math.PI / 3.1, // axe X pour régler la hauteur / l’angle
    35, // distance (zoom-out)
    Vector3.Zero(),
    scene
  );
  camera.attachControl(
    scene.getEngine().getRenderingCanvas(),
    true
  ); // Permet de déplacer la caméra avec la souris
  camera.inputs.addMouseWheel(); // Permet le zoom avec la molette de la souris
  camera.inputs.removeByType(
    "ArcRotateCameraKeyboardMoveInput"
  ); // Désactive les déplacements via le clavier

  // === Lumières ===
  const dir = new DirectionalLight(
    "dir",
    new Vector3(1, -1, 0),
    scene
  ); // Lumière directionnelle inclinée vers le bas
  dir.intensity = 0.5;
  const hemi = new HemisphericLight("hemi", Vector3.Up(), scene);
  hemi.intensity = 0.3;

  // === Matériaux pour les paddles et la balle ===
  const p1Mat = new StandardMaterial("p1Mat", scene);
  p1Mat.diffuseColor = Color3.FromHexString(paddle1Color);

  const p2Mat = new StandardMaterial("p2Mat", scene);
  p2Mat.diffuseColor = Color3.FromHexString(paddle2Color);

  const ballMat = new StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = Color3.Black(); // La balle reste noire par défaut

  // === Création du sol selon MapStyle (implémenté dans setupGround.ts) ===
  createGround(scene, MapStyle);

  return {
    camera,
    allHitSounds,
    p1Mat,
    p2Mat,
    ballMat,
  };
};
