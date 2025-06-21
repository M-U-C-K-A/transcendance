// src/setupGame.ts
// ----------------

import { setupGameObjects } from "./setupGameObjects";
import { Scene, Vector3 } from "@babylonjs/core";

export const setupGame = (
  scene: Scene,
  MapStyle: "classic" | "red" | "neon",
  paddle1Color: string,
  paddle2Color: string,
  paddle3Color: string | null,
  paddle4Color: string | null,
  is2v2Mode: boolean,
) => {
  
  // obs destructures
  // je return tous les props dans obj dans Pong3D
  // rename scene pour typer sans redondance
  const {
    scene: scn,
    camera,
    paddle1,
    paddle2,
    paddle3,
    paddle4,
    miniPaddle,
    miniPaddle3,
    miniPaddle4,
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
  } = setupGameObjects(scene, MapStyle, paddle1Color, paddle2Color, paddle3Color, paddle4Color, is2v2Mode);

  return {
    scene: scn,
    camera,
    paddle1,
    paddle2,
    paddle3,
    paddle4,
    miniPaddle,
    miniPaddle3,
    miniPaddle4,
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
