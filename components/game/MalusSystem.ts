const handleMalusCollision = () => {
  if (!enableMaluses) return;

  const ball = gameObjects.ball;
  const malus = gameObjects.malus;

  if (!ball || !malus) return;

  const distance = Vector3.Distance(ball.position, malus.position);

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