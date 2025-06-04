// scoring.ts
// ----------------


import { GameRefs } from "./gameTypes";

export const handleScoring = (
  ball: any,
  scoreLocal: { player1: number; player2: number },
  setScore: (score: { player1: number; player2: number }) => void,
  setWinner: (winner: string | null) => void,
  resetBall: (loser: "player1" | "player2") => void,
  gameRefs: GameRefs
) => {
  if (ball.position.z < -20) {
    scoreLocal.player2 += 1;
    setScore({ ...scoreLocal });
    if (scoreLocal.player2 >= 5) {
      setWinner("Joueur 2");
    } else {
      resetBall("player1");
    }
  }

  if (ball.position.z > 20) {
    scoreLocal.player1 += 1;
    setScore({ ...scoreLocal });
    if (scoreLocal.player1 >= 5) {
      setWinner("Joueur 1");
    } else {
      resetBall("player2");
    }
  }
};
