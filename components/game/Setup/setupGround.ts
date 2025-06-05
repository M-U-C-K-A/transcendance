// Setup/setupGround.ts
// --------------------

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
  // === Table de jeu – couleur selon le MapStyle ===
  const groundMat = new StandardMaterial("groundMat", scene);

  // Sol plus sombre pour la map “classic”
  if (MapStyle === "classic") {
    groundMat.diffuseColor = Color3.FromHexString("#1A1A1A"); // Sol gris foncé pour “classic”
  }
  // Sol rouge pour la map “red”
  else if (MapStyle === "red") {
    groundMat.diffuseColor = Color3.FromHexString("#800020"); // Sol rouge pour “red”
  }
  // Sol à bandes fluorescentes pour la map “neon”
  else if (MapStyle === "neon") {
    // Couleurs des bandes
    const colors = [
      Color3.FromHexString("#FF00FF"), // Magenta
      Color3.FromHexString("#00FF00"), // Vert
      Color3.FromHexString("#FFFF00"), // Jaune
      Color3.FromHexString("#00FFFF"), // Cyan
      Color3.FromHexString("#FF0000"), // Rouge
      Color3.FromHexString("#0000FF"), // Bleu
    ];

    // Crée plusieurs bandes colorées sur le sol avec un effet lumineux
    const stripeHeight = 40 / colors.length;
    colors.forEach((color, index) => {
      const stripeMat = new StandardMaterial(
        `stripeMat${index}`,
        scene
      );
      stripeMat.diffuseColor = color;
      stripeMat.emissiveColor = color; // Couleur émissive pour l’effet glow
      stripeMat.specularColor = color;
      stripeMat.specularPower = 32;

      const stripe = MeshBuilder.CreateGround(
        `stripe${index}`,
        { width: 20, height: stripeHeight },
        scene
      );
      stripe.material = stripeMat;
      stripe.position.y = -0.25;
      stripe.position.z =
        -20 + stripeHeight / 2 + index * stripeHeight; // Espacement des bandes
    });
  }

  // Création du sol unique sous la table de jeu
  const ground = MeshBuilder.CreateBox(
    "ground",
    {
      width: 20,
      height: 1.5,    // ⬅ épaisseur du sol
      depth: 40       // ⬅ longueur du terrain
    },
    scene
  );
  ground.material = groundMat;
  ground.position.y = -0.75; // ⬅ pour que le haut du sol reste à y = 0

}
