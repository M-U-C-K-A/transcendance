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













  // les chiffre = rotation autour du point cible au centre (vector 0)
  // prend le render dans le canvas, true pour la lock (pour tourner)
  // add la souris pour zoom 
  // pas de module clavier car deja touches IG
  const camera = new ArcRotateCamera(
    "cam",
    0,
    1,
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
  // droite descend du haut, pas profondeur
  // soleil
  const dir = new DirectionalLight(
    "dir",
    new Vector3(1, -1, 0),
    scene
  );
  dir.intensity = 0.5;



  // lumiere un peu partout diffuse dans la scene.  : ciel
  const hemi = new HemisphericLight("hemi", Vector3.Up(), scene);
  hemi.intensity = 0.3;






  // l apperance (couleur brillance etc  = diffuse etc.  mais pas la form 3d)
  const p1Mat = new StandardMaterial("p1Mat", scene);
  const p2Mat = new StandardMaterial("p2Mat", scene);
  const ballMat = new StandardMaterial("ballMat", scene);

  





  // === Creation du sol selon MapStyle ===
  createGround(scene, MapStyle);

  return {
    camera,
    p1Mat,
    p2Mat,
    ballMat,
  };
};
