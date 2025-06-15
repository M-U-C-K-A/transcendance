// src/setupGame.ts
// ----------------

import { setupGameObjects } from "./setupGameObjects";
import { addCameraResetButton } from "./setupCameraReset";
import { Scene, Vector3 } from "@babylonjs/core";

export const setupGame = (
  scene: Scene,
  MapStyle: "classic" | "red" | "neon",
  paddle1Color: string,
  paddle2Color: string,
  enableAI: boolean = false
) => {
  // 1) Création des objets 3D (paddles, mini-paddle, balle, bumpers, etc.)
  const {
    scene: scn,
    camera,
    allHitSounds,
    paddle1,
    paddle2,
    miniPaddle,
    ball,
    leftTri,
    rightTri,
    bumperLeft,
    bumperRight,
    p1Mat,
    p2Mat,
    ballMat,
    rightTriOuterLeft,
    leftTriOuterLeft,
    rightTriOuterRight,
    leftTriOuterRight
  } = setupGameObjects(scene, MapStyle, paddle1Color, enableAI ? "#FFFFFF" : paddle2Color);

  // 2) Ajout du bouton "Réinitialiser la caméra"
  addCameraResetButton(camera);

  // 3) Retourne tous les objets créés pour manipulation ultérieure
  return {
    scene: scn,
    camera,
    allHitSounds,
    paddle1,
    paddle2,
    miniPaddle,
    ball,
    bumperLeft,
    bumperRight,
    leftTri,
    rightTri, 
    p1Mat,
    p2Mat,
    ballMat,
    rightTriOuterLeft,
    leftTriOuterLeft,
    rightTriOuterRight,
    leftTriOuterRight,
    malus: null,
    ballV: new Vector3(0, 0, 0),
    currentSpeed: 0.2
  };
};
