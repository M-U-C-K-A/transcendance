// src/setupCameraReset.ts
// -----------------------

import { Vector3 } from "@babylonjs/core";

export function addCameraResetButton(camera: ArcRotateCamera) {
  // === Bouton UI pour réinitialiser la caméra ===
  const resetCameraButton = document.createElement("button");
  resetCameraButton.textContent = "Réinitialiser la caméra";
  resetCameraButton.style.position = "absolute";
  resetCameraButton.style.top = "10px";
  resetCameraButton.style.left = "10px";
  resetCameraButton.style.padding = "10px";
  resetCameraButton.style.fontSize = "16px";
  resetCameraButton.style.cursor = "pointer";
  resetCameraButton.onclick = () => {
    camera.setPosition(new Vector3(35, 35, 0)); // Position d'origine de la caméra
    camera.setTarget(Vector3.Zero()); // Pointage vers l'origine
  };
  document.body.appendChild(resetCameraButton);
}
