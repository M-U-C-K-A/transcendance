// scoring.ts
// ----------------

import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { GameRefs } from "../../gameTypes";
import { playApplause, playGoalSound } from "../sound";

interface Score {
  player1: number;
  player2: number;
}






export function handleScoring(
  ball: Mesh,
  scoreLocal: Score,
  setScore: (score: Score) => void,
  setWinner: (winner: string | null) => void,
  resetBall: (loser: "player1" | "player2") => void,
  gameRefs: GameRefs,
  volume: number
): void {
  if (ball.position.z < -20) {
    // Si le dernier marqueur était le joueur 1, c'est un malus pour le joueur 2
    if (gameRefs.lastHitter?.current === 1) {
      scoreLocal.player2 -= 1;
      setScore({ ...scoreLocal });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player2 <= -5) {
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
    if (gameRefs.lastHitter) gameRefs.lastHitter.current = 2;
    resetBall("player1");
    if (gameRefs.lastHitter) gameRefs.lastHitter.current = null;
  }

  if (ball.position.z > 20) {
    // Si le dernier marqueur était le joueur 2, c'est un malus pour le joueur 1
    if (gameRefs.lastHitter?.current === 2) {
      scoreLocal.player1 -= 1;
      setScore({ ...scoreLocal });
      playGoalSound(volume);
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player1 <= -5) {
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
    if (gameRefs.lastHitter) gameRefs.lastHitter.current = 1;
    resetBall("player2");
    if (gameRefs.lastHitter) gameRefs.lastHitter.current = null;
  }
}
