// sound.ts
// ----------------
// Gestion centralisée de tous les sons du jeu

import { Sound } from "@babylonjs/core";



// Mise à jour du volume pour tous les sons
export const updateAllSoundsVolume = (sounds: Sound[], volume: number) => {
  const safeVolume = Math.max(0, Math.min(1, Number.isFinite(volume) ? volume : 0.5));
  sounds.forEach((sound: Sound) => {
    if (sound) {
      sound.volume = safeVolume;
    }
  });
};

// Ajout du son de but (sifflet aléatoire)
export const playGoalSound = (volume = 0.2) => {
  const whistles = [
    "/sounds/sifflet-1.mp3",
    "/sounds/sifflet-2.mp3",
    "/sounds/sifflet-3.mp3"
  ];
  const randomIndex = Math.floor(Math.random() * whistles.length);
  const audio = new window.Audio(whistles[randomIndex]);
  audio.volume = volume;
  audio.play();
};

// Fonction pour jouer le son d'applaudissements à la victoire
export const playApplause = (volume = 0.2) => {
  const audio = new window.Audio("/sounds/Applause  Sound Effect.mp3");
  audio.volume = volume;
  audio.play();
};
