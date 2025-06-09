// scoring.ts
// ----------------

import type { Mesh } from "@babylonjs/core/Meshes/mesh";

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

export const handleScoring = (
  ball: Mesh,
  scoreLocal: { player1: number; player2: number },
  setScore: (score: { player1: number; player2: number }) => void,
  setWinner: (winner: string | null) => void,
  resetBall: (loser: "player1" | "player2") => void,
  gameRefs: any, // on garde pour compatibilité, mais on n'utilise que les setters
  volume: number = 0.2
) => {
  if (ball.position.z < -20) {
    // Si le dernier marqueur était le joueur 1, c'est un malus pour le joueur 2
    if (gameRefs?.gameState?.lastScorer === 1) {
      scoreLocal.player2 -= 1;
      setScore({ ...scoreLocal });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player2 <= -3) {
        playApplause(volume);
        setWinner("Joueur 1");
        return;
      }
    } else {
      scoreLocal.player2 += 1;
      setScore({ ...scoreLocal });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player2 >= 5) {
        playApplause(volume);
        setWinner("Joueur 2");
        return;
      }
    }
    if (gameRefs && gameRefs.gameState) gameRefs.gameState.lastScorer = 2;
    resetBall("player1");
  }

  if (ball.position.z > 20) {
    // Si le dernier marqueur était le joueur 2, c'est un malus pour le joueur 1
    if (gameRefs?.gameState?.lastScorer === 2) {
      scoreLocal.player1 -= 1;
      setScore({ ...scoreLocal });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player1 <= -3) {
        playApplause(volume);
        setWinner("Joueur 2");
        return;
      }
    } else {
      scoreLocal.player1 += 1;
      setScore({ ...scoreLocal });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player1 >= 5) {
        playApplause(volume);
        setWinner("Joueur 1");
        return;
      }
    }
    if (gameRefs && gameRefs.gameState) gameRefs.gameState.lastScorer = 1;
    resetBall("player2");
  }
};
