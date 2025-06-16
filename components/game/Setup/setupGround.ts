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
) 
{

  // couche coloree (pour neon ct plus simple)
  const groundMat = new StandardMaterial("groundMat", scene);


  // FromHexString = hexa to rgb 
  if (MapStyle === "classic")
    groundMat.diffuseColor = Color3.FromHexString("#1A1A1A");
  else if (MapStyle === "red")
    groundMat.diffuseColor = Color3.FromHexString("#800020");




  // Sol principal (epais)
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
      Color3.FromHexString("#FF3500"), // Orange neon
      Color3.FromHexString("#FF00FF"), // Magenta neon
      Color3.FromHexString("#00CBFF"), // Cyan neon
      Color3.FromHexString("#00FF00"), // Vert neon
      Color3.FromHexString("#0000FF"), // Bleu neon
    ];

    // divise en autant de couleur qu il y a 
    // height car de base le mesh est vers le haut 
    // 8 de large 
    const stripeHeight = 40 / colors.length;



    colors.forEach((color, index) => 
    {
      const stripeMat = new StandardMaterial(`stripeMat${index}`, scene);
      stripeMat.diffuseColor = color;
      stripeMat.emissiveColor = color; // eclarage
      stripeMat.specularColor = color; // brillance
      stripeMat.specularPower = 32; // brillance

      // pas le create ground a nous celui de babylon
      const stripe = MeshBuilder.CreateGround(`stripe${index}`, 
      {
        width: 20,
        height: stripeHeight,
      }, 
      scene);

    
      stripe.material = stripeMat;
      stripe.position.y = 0.01; // legèrement sur le sol epais


      // -20 = position de depart a gauche. on divise par 2 pour le centre (le meche fait 8 mais 4 de chaque cote)
      // index * 8  = avancer de centre en centre
      // premier a -16 puis - 8 etc. jus a qu 16
      stripe.position.z = -20 + stripeHeight / 2 + index * stripeHeight;
    });
  }



}
