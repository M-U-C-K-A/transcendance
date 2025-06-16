
//  call back possible (serve par ex)

export function startCountdown(
  duration: number,
  setIsPaused: (isPaused: boolean) => void,
  setCountdown: (countdown: number | null) => void,
  callback: () => void
) 
{


  setIsPaused(true);
  setCountdown(duration);



  // Créer un état pour bloquer les changements de pause
  const blockPauseChanges = { current: true };

  let cnt = duration;

  // setInterval == fonction typescript   va activer le code suivant toutes les ms donne en fin
  const iv = setInterval(() => 
  {

    cnt--; 


    // actualise le coutdown  ref dans pong3d et envoye dans GameUI
    if (cnt > 0) 
    {
      setCountdown(cnt);
    } 



    else 
    {
      clearInterval(iv); // ft ts qui le stop en fin de chiffre
      setCountdown(null); // met a null. pour l affichage game UI
      setIsPaused(false); // remet en marche 
      blockPauseChanges.current = false; // Débloque après le décompte
      callback(); // active la fonction si y a
    }



  }, 500); // inteval de demi seconde entre les chiffres 



  // Retourne la fonction pour débloquer si nécessaire
  return () => {
    blockPauseChanges.current = false;
  };
}
