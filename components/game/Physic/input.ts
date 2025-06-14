// input.ts
// ----------------

import { GameRefs } from "../gameTypes";

export const keys = new Set<string>();
// set fournit has, delete, add etc.
// set strock tableau sans doublon. + fournit les methode utiles.
// donc peut stocker plusieurs touches en meme temps.





// Installe tous les écouteurs clavier. Retourne une fonction de cleanup.
export function registerInputListeners(
  gameRefs: GameRefs,
  setIsPaused: (isPaused: boolean) => void // 
) {
  const down = (e: KeyboardEvent) => onKeyDown(e, gameRefs); // fleche = callback quane e est pressé = touche pressée. alors déclanche onkeydownl 
  const up = (e: KeyboardEvent) => onKeyUp(e);
  const global = (e: KeyboardEvent) => EscapeKeyDown(e, setIsPaused, gameRefs);

  window.addEventListener("keydown", down, { passive: false }); // ajoute un event a la fenetre, de type keydown, déclache la fonction down aui déclanche onKeyDown. permet de prendre touche pour jeu meme si désactiver le bas
  window.addEventListener("keyup", up);
  window.addEventListener("keydown", global); // prend les touche global escape. 

  return () => {
    window.removeEventListener("keydown", down); 
    window.removeEventListener("keyup", up);
    window.removeEventListener("keydown", global);
  };
}



// keybordevent = fournit par niavigateur. (MDN)
// gamerefs : interface avec tous nos mutables = donc la touches dans .control
export function onKeyDown(e: KeyboardEvent, gameRefs: GameRefs) {



  // si pas de gagnant et pas de pause.
  if (!gameRefs?.winner?.current && !gameRefs?.isPaused?.current) {

    // Selon les inputs on fait des actions.

    // On accepte toutes les touches pour permettre la personnalisation et ont met en lower pour portabilité si maj ou pas.
    // add ajoute la key dans le set. (pour dire que presse, on la rm du set a la fin)
    keys.add(e.key.toLowerCase());
    // Coup spécial joueur 1 (trigger le supper pad) : 
    // .current = acceder a un ref/mutable.
    // verifie si touche alloué
    // si touche pressé = touche pour spécial du J1 et si la ft trigger existe. 
    if (
      gameRefs.controls && 
      e.key.toLowerCase() === gameRefs.controls.current.player1Special?.toLowerCase() &&
      gameRefs.triggerSuperPad
    ) {
      gameRefs.triggerSuperPad(1);
    }
    // Coup spécial joueur 2
    if (
      gameRefs.controls &&
      e.key.toLowerCase() === gameRefs.controls.current.player2Special?.toLowerCase() &&
      gameRefs.triggerSuperPad
    ) {
      gameRefs.triggerSuperPad(2);
    }
    e.preventDefault();
  }
}

// indiaque que la touche est relachée. (la delete du set)
export function onKeyUp(e: KeyboardEvent) {
  keys.delete(e.key.toLowerCase());
}

export function EscapeKeyDown(
  e: KeyboardEvent,
  setIsPaused: (isPaused: boolean) => void,
  gameRefs: GameRefs
) {
  if (e.key === "Escape") {
    if (gameRefs.isPaused && gameRefs.isPaused.current) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  }
}

