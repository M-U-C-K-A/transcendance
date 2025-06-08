// scoring.ts
// ----------------

export const handleScoring = (
  ball: Mesh,
  scoreLocal: { player1: number; player2: number },
  setScore: (score: { player1: number; player2: number }) => void,
  setWinner: (winner: string | null) => void,
  resetBall: (loser: "player1" | "player2") => void,
  gameRefs: any // on garde pour compatibilité, mais on n'utilise que les setters
) => {
  if (ball.position.z < -20) {
    // Si le dernier marqueur était le joueur 1, c'est un malus pour le joueur 2
    if (gameRefs?.gameState?.lastScorer === 1) {
      scoreLocal.player2 -= 1;
      setScore({ ...scoreLocal });
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player2 <= -3) {
        setWinner("Joueur 1");
        return;
      }
    } else {
      scoreLocal.player2 += 1;
      setScore({ ...scoreLocal });
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player2 >= 5) {
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
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player1 <= -3) {
        setWinner("Joueur 2");
        return;
      }
    } else {
      scoreLocal.player1 += 1;
      setScore({ ...scoreLocal });
      if (gameRefs.score.current) {
        gameRefs.score.current = { ...scoreLocal };
      }
      if (scoreLocal.player1 >= 5) {
        setWinner("Joueur 1");
        return;
      }
    }
    if (gameRefs && gameRefs.gameState) gameRefs.gameState.lastScorer = 1;
    resetBall("player2");
  }
};
