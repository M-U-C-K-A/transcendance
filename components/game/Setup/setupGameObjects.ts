// src/setupGameObjects.ts
// ------------------------

import {
  Scene,
  MeshBuilder,
  Color3,
  StandardMaterial,
  Vector3,
  Mesh,
} from "@babylonjs/core";
import { initEnvironment } from "./setupEnvironment";

export function setupGameObjects(
  scene: Scene,
  MapStyle: "classic" | "red" | "neon",
  paddle1Color: string,
  paddle2Color: string
) {
  // 1) Initialisation de l’environnement (caméra, lumières, sol, etc.)
  const { camera, allHitSounds, p1Mat, p2Mat, ballMat } = initEnvironment(
    scene,
    MapStyle,
    paddle1Color,
    paddle2Color
  );

  // === Paddles ===
  const paddleOpts = { width: 6, height: 0.5, depth: 0.5 };

  const paddle1 = MeshBuilder.CreateBox("p1", paddleOpts, scene);
  paddle1.position.set(0, 0.25, -19);
  paddle1.material = p1Mat;

  const paddle2 = paddle1.clone("p2");
  paddle2.position.set(0, 0.25, 19);
  paddle2.material = p2Mat;

  // === Couleurs spéciales pour map "neon" ===
  if (MapStyle === "neon") {
    const adjustNeonColor = (color: string) => {
      const hex = color.toUpperCase();
      if (hex === "#0000FF") return "#000000"; // bleu foncé → noir
      if (hex === "#FF00FF") return "#FFFFFF"; // rose       → blanc
      return color;
    };

    const p1Color = adjustNeonColor(paddle1Color);
    const p2Color = adjustNeonColor(paddle2Color);

    p1Mat.diffuseColor = Color3.FromHexString(p1Color);
    p1Mat.emissiveColor = Color3.FromHexString(p1Color);

    p2Mat.diffuseColor = Color3.FromHexString(p2Color);
    p2Mat.emissiveColor = Color3.FromHexString(p2Color);

    ballMat.diffuseColor = Color3.White();
    ballMat.emissiveColor = Color3.White();
  }

  paddle1.material = p1Mat;
  paddle2.material = p2Mat;

  // === Mini-paddle (seulement pour "red") ===
  let miniPaddle: Mesh | null = null;
  if (MapStyle === "red") {
    const miniPaddleOpts = { width: 4, height: 0.5, depth: 0.5 };
    miniPaddle = MeshBuilder.CreateBox("miniPaddle", miniPaddleOpts, scene);
    miniPaddle.material = new StandardMaterial("whiteMat", scene);
    miniPaddle.position.set(5, 0.25, 0);
  }

  // === Balle ===
  const ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, scene);
  ball.material = ballMat;
  ball.position.y = 0.25;

  // === Bumpers pour map "neon" ===
  let bumperLeft: Mesh | null = null;
  let bumperRight: Mesh | null = null;

  if (MapStyle === "neon") {
    // Matériau violet très visible (différent du cyan/jaune du sol)
    const bumperMat = new StandardMaterial("bumperMat", scene);
    bumperMat.diffuseColor = Color3.FromHexString("#8000FF"); // violet
    bumperMat.emissiveColor = Color3.FromHexString("#8000FF");

    // Diamètre plus grand et épaisseur pour mieux intercepter la balle
    const donutOpts = { diameter: 3.5, thickness: 0.4, tessellation: 32 };

    bumperLeft = MeshBuilder.CreateTorus("bumperLeft", donutOpts, scene);
    bumperLeft.material = bumperMat;
    // Placement initial à gauche, z=0
    bumperLeft.position.set(-8, 0.25, 0);

    bumperRight = bumperLeft.clone("bumperRight");
    bumperRight.material = bumperMat;
    // Placement initial à droite, z=0
    bumperRight.position.x = 8;
  }

  // === Logique dynamique de la balle (hors neon) ===
  if (MapStyle !== "neon") {
    scene.onBeforeRenderObservable.add(() => {
      if (
        ball.position.z < -18.5 &&
        Math.abs(ball.position.x - paddle1.position.x) < paddleOpts.width / 2
      ) {
        ballMat.diffuseColor = p1Mat.diffuseColor;
      } else if (
        ball.position.z > 18.5 &&
        Math.abs(ball.position.x - paddle2.position.x) < paddleOpts.width / 2
      ) {
        ballMat.diffuseColor = p2Mat.diffuseColor;
      }
    });
  }

  return {
    scene,
    camera,
    allHitSounds,
    paddle1,
    paddle2,
    miniPaddle,
    ball,
    bumperLeft,
    bumperRight,
    p1Mat,
    p2Mat,
    ballMat,
  };
}
