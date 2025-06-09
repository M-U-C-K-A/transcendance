// sound.ts
// ----------------
// Fonction de lecture de son aléatoire lors des collisions. 

import { Sound } from "@babylonjs/core";

export const playRandomCollisionSound = (sounds: Sound[], volume: number = 0.5) => {
  const randomIndex = Math.floor(Math.random() * sounds.length);
  if (sounds[randomIndex]) {
    sounds[randomIndex].setVolume(volume);
  sounds[randomIndex].play();
  }
};
