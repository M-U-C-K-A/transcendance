export function startCountdown(
  duration: number,
  setIsPaused: (isPaused: boolean) => void,
  setCountdown: (countdown: number | null) => void,
  callback: () => void
) {
  setIsPaused(true);
  setCountdown(duration);
  
  // Créer un état pour bloquer les changements de pause
  const blockPauseChanges = { current: true };
  
  let cnt = duration;
  const iv = setInterval(() => {
    cnt--;
    if (cnt > 0) {
      setCountdown(cnt);
    } else {
      clearInterval(iv);
      setCountdown(null);
      setIsPaused(false);
      blockPauseChanges.current = false; // Débloque après le décompte
      callback();
    }
  }, 500);

  // Retourne la fonction pour débloquer si nécessaire
  return () => {
    blockPauseChanges.current = false;
  };
}
