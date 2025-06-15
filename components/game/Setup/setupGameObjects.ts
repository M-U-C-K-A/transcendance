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
  paddle2Color: string,
) {


  //  cam, sol, balle. 
  const { camera, allHitSounds, p1Mat, p2Mat, ballMat } = initEnvironment(
    scene,
    MapStyle,
  );




  // === couleur joueur
  p1Mat.diffuseColor = Color3.FromHexString(paddle1Color);
  p2Mat.diffuseColor = Color3.FromHexString(paddle2Color);
  ballMat.diffuseColor = Color3.White();


  // couleur joueur pour neon
  if (MapStyle === "neon") {
    p1Mat.emissiveColor = p1Mat.diffuseColor;
    p2Mat.emissiveColor = p2Mat.diffuseColor;
    ballMat.emissiveColor = Color3.White();
  }



  // === Paddles ===
  const paddleOpts = { width: 6, height: 0.5, depth: 0.5 };
  const paddle1 = MeshBuilder.CreateBox("p1", paddleOpts, scene);
  paddle1.position.set(0, 0.25, -19);
  paddle1.material = p1Mat;
  const paddle2 = paddle1.clone("p2");
  paddle2.position.set(0, 0.25, 19);
  paddle2.material = p2Mat;

  

  // === Mini-paddle (pour "red") ===
  let miniPaddle: Mesh | null = null;
  if (MapStyle === "red") {
    const opts = { width: 4, height: 0.5, depth: 0.5 };
    miniPaddle = MeshBuilder.CreateBox("miniPaddle", opts, scene);
    miniPaddle.material = new StandardMaterial("whiteMat", scene);
    miniPaddle.position.set(5, 0.25, 0);
  }

  // === Triangles épais pour "red" ===
  let leftTri: Mesh | null = null;
  let rightTri: Mesh | null = null;
  let leftTriOuterLeft: Mesh | null = null;
  let leftTriOuterRight: Mesh | null = null;
  let rightTriOuterLeft: Mesh | null = null;
  let rightTriOuterRight: Mesh | null = null;

  if (MapStyle === "red") {
    // Création du matériau
    const triMat = new StandardMaterial("triMat", scene);
    triMat.diffuseColor = Color3.FromHexString("#9B3030");
    triMat.emissiveColor = Color3.FromHexString("#9B3030");
    triMat.backFaceCulling = false;

    // Paramètres géométriques
    const offX = 10;
    const apexShift = 1.5;
    const halfBaseZ = 1;
    const heightY = 0.5;
    const yBottom = 0;

    // Vecteurs de base
    const A = new Vector3(offX - apexShift, yBottom, 0);
    const B = new Vector3(offX, yBottom, +halfBaseZ);
    const C = new Vector3(offX, yBottom, -halfBaseZ);
    const D = A.add(new Vector3(0, heightY, 0));
    const E = B.add(new Vector3(0, heightY, 0));
    const F = C.add(new Vector3(0, heightY, 0));

    // Positions, indices et normales
    const positions = [
      A.x, A.y, A.z, B.x, B.y, B.z, C.x, C.y, C.z,
      D.x, D.y, D.z, E.x, E.y, E.z, F.x, F.y, F.z
    ];
    const indices = [
      0,1,2, 5,4,3, 0,3,4, 0,4,1, 1,4,5, 1,5,2, 2,5,3, 2,3,0
    ];
    const normals = Array(6).fill([0,1,0]).flat();

    // Triangle droit
    rightTri = new Mesh("triRightPrism", scene);
    rightTri.setVerticesData("position", positions);
    rightTri.setVerticesData("normal", normals);
    rightTri.setIndices(indices);
    rightTri.material = triMat;

    // Triangle gauche (miroir)
    const mirror = (v: Vector3) => new Vector3(-v.x, v.y, v.z);
    const positionsL: number[] = [];
    for (let i = 0; i < positions.length; i += 3) {
      positionsL.push(...mirror(new Vector3(
        positions[i], positions[i+1], positions[i+2]
      )).asArray());
    }
    leftTri = new Mesh("triLeftPrism", scene);
    leftTri.setVerticesData("position", positionsL);
    leftTri.setVerticesData("normal", normals);
    leftTri.setIndices(indices);
    leftTri.material = triMat;

    // Clones extérieurs
    const extraOffsetsZ = [4, -4];
    extraOffsetsZ.forEach((zOff, idx) => {
      // droit
      const triR = rightTri!.clone(`triRightExtra${idx}`);
      triR.position.z = zOff;
      triR.material = triMat;
      if (idx === 0) rightTriOuterRight = triR;
      else            rightTriOuterLeft  = triR;

      // gauche
      const triL = leftTri!.clone(`triLeftExtra${idx}`);
      triL.position.z = zOff;
      triL.material = triMat;
      if (idx === 0) leftTriOuterRight = triL;
      else            leftTriOuterLeft  = triL;
    });
  }

  // === Balle ===
  const ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, scene);
  ball.material = ballMat;
  ball.position.y = 0.25;

  // === Bumpers pour "neon" ===
  let bumperLeft: Mesh | null = null;
  let bumperRight: Mesh | null = null;
  if (MapStyle === "neon") {
    const bumperMat = new StandardMaterial("bumperMat", scene);
    bumperMat.diffuseColor = Color3.FromHexString("#8000FF");
    bumperMat.emissiveColor = Color3.FromHexString("#8000FF");
    const opts = { diameter: 3.5, thickness: 0.4, tessellation: 32 };
    bumperLeft = MeshBuilder.CreateTorus("bumperLeft", opts, scene);
    bumperLeft.material = bumperMat;
    bumperLeft.position.set(-8, 0.25, 0);
    bumperRight = bumperLeft.clone("bumperRight");
    bumperRight.position.x = 8;
    bumperRight.material = bumperMat;
  }

  // === Logique dynamique balle ===
  if (MapStyle !== "neon") {
    scene.onBeforeRenderObservable.add(() => {
      if (
        ball.position.z < -18.5 &&
        Math.abs(ball.position.x - paddle1.position.x) < paddleOpts.width/2
      ) ballMat.diffuseColor = p1Mat.diffuseColor;
      else if (
        ball.position.z > 18.5 &&
        Math.abs(ball.position.x - paddle2.position.x) < paddleOpts.width/2
      ) ballMat.diffuseColor = p2Mat.diffuseColor;
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
    ballV: new Vector3(0, 0, 0),
    currentSpeed: 0.2,
    bumperLeft,
    bumperRight,
    p1Mat,
    p2Mat,
    ballMat,
    leftTri,
    rightTri,
    leftTriOuterLeft,
    leftTriOuterRight,
    rightTriOuterLeft,
    rightTriOuterRight,
  };
}
