// sound.ts
// ----------------
// Fonction de lecture de son aléatoire lors des collisions. 

import { Sound } from "@babylonjs/core";

export const playRandomCollisionSound = (sounds: Sound[]) => {
  const randomIndex = Math.floor(Math.random() * sounds.length);
  sounds[randomIndex].play();
};
