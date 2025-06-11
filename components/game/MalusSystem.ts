const handleMalusCollision = () => {
  if (!enableMaluses) return;

  const ball = gameObjects.ball;
  const malus = gameObjects.malus;

  if (!ball || !malus) return;

  const distance = Vector3.Distance(ball.position, malus.position);

<<<<<<< HEAD
  if (distance < 2) {
    // Jouer le son de collision
    if (gameRefs.malusSound) {
      gameRefs.malusSound.play();
    }

    // Debug : afficher qui a touché la balle en dernier
    const last = gameRefs.lastHitter?.current;
    console.log('[Malus] lastHitter:', last);
    console.log('[Malus] score avant:', gameRefs.score?.current);

    // Appliquer le malus à l'adversaire du dernier joueur ayant touché la balle
    if (last === 1) {
      setScore((prev) => {
        console.log('[Malus] -1 à player2');
        return { ...prev, player2: prev.player2 - 1 };
      });
    } else if (last === 2) {
      setScore((prev) => {
        console.log('[Malus] -1 à player1');
        return { ...prev, player1: prev.player1 - 1 };
      });
    } else {
      console.log('[Malus] Aucun lastHitter connu, pas de malus appliqué');
      return;
    }

    setTimeout(() => {
      console.log('[Malus] score après:', gameRefs.score?.current);
    }, 100);

    // Réinitialiser le malus
    resetMalus();
  }
}; 
=======
export class MalusSystem {
  private gameObjects: GameObjects;
  private gameRefs: GameRefs;
  private setScore: (score: Score) => void;
  private resetMalus: () => void;

  constructor(props: MalusSystemProps) {
    this.gameObjects = props.gameObjects;
    this.gameRefs = props.gameRefs;
    this.setScore = props.setScore;
    this.resetMalus = props.resetMalus;
  }

  handleMalusCollision = () => {
  if (!enableMaluses) return;

    const ball = this.gameObjects.ball;
    const malus = this.gameObjects.malus;

  if (!ball || !malus) return;

  const distance = Vector3.Distance(ball.position, malus.position);

  if (distance < 2) {
    // Appliquer le malus à l'adversaire du dernier joueur ayant touché la balle
      const last = this.gameRefs.lastHitter?.current;
    if (last === 1) {
        this.setScore({
          ...this.gameRefs.score.current,
          player2: this.gameRefs.score.current.player2 - 1
      });
    } else if (last === 2) {
        this.setScore({
          ...this.gameRefs.score.current,
          player1: this.gameRefs.score.current.player1 - 1
      });
      }
      // Jouer le son de malus (optionnel)
      if (this.gameRefs.malusSound) {
        this.gameRefs.malusSound.play();
      }
      // Détruire le malus immédiatement
      this.resetMalus();
      if (this.gameRefs.lastHitter) this.gameRefs.lastHitter.current = null;
  }
  };
} 
>>>>>>> e7042a0 (Fix on speed)
