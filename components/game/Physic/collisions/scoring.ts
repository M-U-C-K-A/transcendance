// scoring.ts
// ----------------

import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { GameRefs } from "../../gameTypes";

interface Score {
  player1: number;
  player2: number;
}

// Ajout du son de but (sifflet aléatoire)
const playGoalSound = (volume = 0.2) => {
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
const playApplause = (volume = 0.2) => {
  const audio = new window.Audio("/sounds/Applause  Sound Effect.mp3");
  audio.volume = volume;
  audio.play();
};

export function handleScoring(
  ball: Mesh,
  score: Score,
  setScore: (score: Score) => void,
  setWinner: (winner: string | null) => void,
  resetBall: (loser: "player1" | "player2") => void,
  gameRefs: GameRefs,
  volume: number
): void {
  if (ball.position.z < -20) {
    // Si le dernier marqueur était le joueur 1, c'est un malus pour le joueur 2
    if (gameRefs.lastHitter?.current === 1) {
      score.player2 -= 1;
      setScore({ ...score });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...score };
      }
      if (score.player2 <= -5) {
        playApplause(volume);
        setWinner("Joueur 1");
        return;
      }
    } else {
      score.player2 += 1;
      setScore({ ...score });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...score };
      }
      if (score.player2 >= 5) {
        playApplause(volume);
        setWinner("Joueur 2");
        return;
      }
    }
    if (gameRefs.lastHitter) gameRefs.lastHitter.current = 2;
    resetBall("player1");
    if (gameRefs.lastHitter) gameRefs.lastHitter.current = null;
  }

  if (ball.position.z > 20) {
    // Si le dernier marqueur était le joueur 2, c'est un malus pour le joueur 1
    if (gameRefs.lastHitter?.current === 2) {
      score.player1 -= 1;
      setScore({ ...score });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...score };
      }
      if (score.player1 <= -5) {
        playApplause(volume);
        setWinner("Joueur 2");
        return;
      }
    } else {
      score.player1 += 1;
      setScore({ ...score });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...score };
      }
      if (score.player1 >= 5) {
        playApplause(volume);
        setWinner("Joueur 1");
        return;
      }
    }
    if (gameRefs.lastHitter) gameRefs.lastHitter.current = 1;
    resetBall("player2");
    if (gameRefs.lastHitter) gameRefs.lastHitter.current = null;
  }
}
