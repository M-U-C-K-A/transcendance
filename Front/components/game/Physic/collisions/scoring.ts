// scoring.ts
// ----------------

import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { GameRefs } from "../../gameTypes";
import { playGoalSound } from "../sound";



interface Score
{
  player1: number;
  player2: number;
}




export function handleScoring(
  ball: Mesh,
  score: Score,
  setScore: (score: Score) => void,
  setWinner: (winner: string | null) => void,
  resetBall: (loser: "player1" | "player2") => void,
  gameRefs: GameRefs,
  volume?: number
): void
{


  if (ball.position.z < -20)
  {
      score.player2 += 1;
      setScore({ ...score });
      playGoalSound(volume);

      if (gameRefs.score.current)
        gameRefs.score.current = score;

      // Mise à jour des statistiques - points marqués/concédés (seulement si pas d'IA et mode custom)
      if (!gameRefs.enableAIRef?.current && gameRefs.gamemode === "custom") {
        gameRefs.setMatchStats(prev => ({
          ...prev,
          pointsMarques: { ...prev.pointsMarques, player2: prev.pointsMarques.player2 + 1 },
          pointsConcedes: { ...prev.pointsConcedes, player1: prev.pointsConcedes.player1 + 1 }
        }));
      }

      if (score.player2 === 3)
        setWinner("player2");


      resetBall("player1");
  }




  if (ball.position.z > 20)
  {
    score.player1 += 1;
    setScore({ ...score });
    playGoalSound(volume);

    if (gameRefs.score.current)
      gameRefs.score.current = score;

    // Mise à jour des statistiques - points marqués/concédés (seulement si pas d'IA et mode custom)
    if (!gameRefs.enableAIRef?.current && gameRefs.gamemode === "custom") {
      gameRefs.setMatchStats(prev => ({
        ...prev,
        pointsMarques: { ...prev.pointsMarques, player1: prev.pointsMarques.player1 + 1 },
        pointsConcedes: { ...prev.pointsConcedes, player2: prev.pointsConcedes.player2 + 1 }
      }));
    }

    if (score.player1 === 3)
      setWinner("player1");


    resetBall("player2");
  } 
}
