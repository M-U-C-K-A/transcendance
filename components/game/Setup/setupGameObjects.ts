// src/setupGameObjects.ts
// ----------------

// cree objs 3d

import {
  Scene,
  MeshBuilder,
  Color3,
  StandardMaterial,
} from "@babylonjs/core";
import { initEnvironment } from "./setupEnvironment";


export function setupGameObjects(
  scene: Scene,
  MapStyle: "classic" | "red" | "neon",
  paddle1Color: string,
  paddle2Color: string
) {
  // 1) Initialisation de l’environnement (caméra, lumières, sol, matériaux, sons, glow)
  const { camera, allHitSounds, p1Mat, p2Mat, ballMat } = initEnvironment(
    scene,
    MapStyle,
    paddle1Color,
    paddle2Color
  );

  // === Paddles ===
  const paddleOpts = { width: 6, height: 0.5, depth: 0.5 };
  const paddle1 = MeshBuilder.CreateBox("p1", paddleOpts, scene);
  paddle1.material = p1Mat;
  paddle1.position.z = -19;

  // Paddle du joueur 2 (clone de paddle1)
  const paddle2 = paddle1.clone("p2");
  paddle2.material = p2Mat;
  paddle2.position.z = 19;

  // Si la map est “neon”, appliquer un effet fluo aux paddles
  if (MapStyle === "neon") {
    p1Mat.emissiveColor = new Color3(1, 0.5, 0); // Fluo orange pour le joueur 1
    p1Mat.specularPower = 32; // Augmente la brillance pour un effet lumineux

    p2Mat.emissiveColor = new Color3(1, 1, 1); // Fluo blanc pour le joueur 2
    p2Mat.specularPower = 32; // Augmente la brillance pour un effet lumineux

    // Appliquer une couleur fluorescente à la balle sur la map neon
    ballMat.diffuseColor = Color3.Black(); // Balle reste noire sur la map neon
  }

  // === Mini-paddle ===
  const miniPaddleOpts = { width: 4, height: 0.5, depth: 0.5 };
  const miniPaddle = MeshBuilder.CreateBox(
    "miniPaddle",
    miniPaddleOpts,
    scene
  );
  miniPaddle.material = new StandardMaterial("whiteMat", scene);
  miniPaddle.position.set(0, 0, 0);

  // === Balle ===
  const ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, scene);
  ball.material = ballMat;

  // === Gestion du changement de couleur de la balle en fonction du paddle touché ===
  // (sauf pour “neon” – la balle reste noire)
  scene.onBeforeRenderObservable.add(() => {
    // Si la balle touche un paddle, changer de couleur en fonction du joueur qui touche
    if (
      ball.position.z < -19 &&
      Math.abs(ball.position.x - paddle1.position.x) < 3
    ) {
      if (MapStyle !== "neon")
        ballMat.diffuseColor = p1Mat.diffuseColor; // La balle devient la couleur du joueur 1
    } else if (
      ball.position.z > 19 &&
      Math.abs(ball.position.x - paddle2.position.x) < 3
    ) {
      if (MapStyle !== "neon")
        ballMat.diffuseColor = p2Mat.diffuseColor; // La balle devient la couleur du joueur 2
    }
  });

  // Retourne tous les objets créés afin que le code appelant puisse les manipuler
  return {
    scene,
    camera,
    allHitSounds,
    paddle1,
    paddle2,
    miniPaddle,
    ball,
    p1Mat,
    p2Mat,
    ballMat,
  };
}
