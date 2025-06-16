// sound.ts
// ----------------
// Gestion centralisee de tous les sons du jeu






// de base a 0.2 mais reassigne dans score
export const playGoalSound = (volume? : number) => 
{
  const whistles = [
    "/sounds/sifflet-1.mp3",
    "/sounds/sifflet-2.mp3",
    "/sounds/sifflet-3.mp3"
  ];
  const randomIndex = Math.floor(Math.random() * whistles.length);
  const audio = new window.Audio(whistles[randomIndex]);
  audio.volume = volume ?? 0.2;
  audio.play();
};



  // === Sons de collision (hit) ===
export const PlayRandomHitSound = (volume?: number) => 
{

  const hits = [
    "/sounds/pong-1.mp3",
    "/sounds/pong-2.mp3",
    "/sounds/pong-3.mp3",
  ];
  const randomIndex = Math.floor(Math.random() * hits.length);
  const audio = new window.Audio(hits[randomIndex]);
  audio.volume = volume ?? 0.2;
  audio.play();
}

