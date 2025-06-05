// setupGround.ts

import {
  Scene,
  MeshBuilder,
  Color3,
  StandardMaterial,
} from "@babylonjs/core";

export function createGround(
  scene: Scene,
  MapStyle: "classic" | "red" | "neon"
) {
  const groundMat = new StandardMaterial("groundMat", scene);

  if (MapStyle === "classic") {
    groundMat.diffuseColor = Color3.FromHexString("#1A1A1A");
  } else if (MapStyle === "red") {
    groundMat.diffuseColor = Color3.FromHexString("#800020");
  }

  // Sol principal (épais)
  const ground = MeshBuilder.CreateBox("ground", {
    width: 20,
    height: 1.5,
    depth: 40,
  }, scene);
  ground.material = groundMat;
  ground.position.y = -0.75;

  // Bandes fluo sur la map neon
  if (MapStyle === "neon") {
    const colors = [
      Color3.FromHexString("#FF00FF"),
      Color3.FromHexString("#00FF00"),
      Color3.FromHexString("#FFFF00"),
      Color3.FromHexString("#00FFFF"),
      Color3.FromHexString("#FF0000"),
      Color3.FromHexString("#0000FF"),
    ];

    const stripeHeight = 40 / colors.length;

    colors.forEach((color, index) => {
      const stripeMat = new StandardMaterial(`stripeMat${index}`, scene);
      stripeMat.diffuseColor = color;
      stripeMat.emissiveColor = color;
      stripeMat.specularColor = color;
      stripeMat.specularPower = 32;

      const stripe = MeshBuilder.CreateGround(`stripe${index}`, {
        width: 20,
        height: stripeHeight,
      }, scene);
      stripe.material = stripeMat;
      stripe.position.y = 0.01; // légèrement au-dessus du sol épais
      stripe.position.z = -20 + stripeHeight / 2 + index * stripeHeight;
    });
  }
}
