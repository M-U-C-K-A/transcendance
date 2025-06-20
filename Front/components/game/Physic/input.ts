// input.ts
// ----------------

import { GameRefs } from "../gameTypes";


// set string =  tableau sans doublon + integre des methode comme has, add, delete
export const keys = new Set<string>();





// Keyboardevent  =  de typscritp pour detect touche.
// recoit ici les input in game
// 
// comportement special in game (plus que detecter les touches on met des conditions)
export function onKeyDown(
  e: KeyboardEvent,
  gameRefs: GameRefs,
  enableAIRef?: React.MutableRefObject<boolean>
)
{


  if (!gameRefs?.winner?.current && !gameRefs?.isPaused?.current) 
  {
    // On accepte toutes les touches pour permettre la personnalisation
    // meme si on est en CAPSLOCK on aura les meme comportement 
    keys.add(e.key.toLowerCase());

  

    // tente d activer le super pad.
    if (
      gameRefs.controls &&
      e.key.toLowerCase() === gameRefs.controls.current.player1Special?.toLowerCase() &&
      gameRefs.triggerSuperPad
    ) 
    {
      gameRefs.triggerSuperPad(1);
    }



    // Coup special joueur 2 (touche personnalisee)
    if (
      gameRefs.controls &&
      e.key.toLowerCase() ===
        gameRefs.controls.current.player2Special?.toLowerCase() &&
      gameRefs.triggerSuperPad
    ) {
      if (enableAIRef?.current) return; // Ne fait rien si l'IA est activée pour le joueur 2
      gameRefs.triggerSuperPad(2);
    }
    e.preventDefault();
  }


}




// met fin a la touche appuye 
export function onKeyUp(e: KeyboardEvent) 
{
  keys.delete(e.key.toLowerCase());
}





export function onEscapeKeyDown(
  e: KeyboardEvent,
  setIsPaused: (isPaused: boolean) => void,
  gameRefs: GameRefs
) 
{
  if (e.key === "Escape") {
    if (gameRefs.isPaused && gameRefs.isPaused.current) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  }
}






// listener du DOM (navigateur)
// connecte aux touche in game
export function registerInputListeners(
  gameRefs: GameRefs,
  setIsPaused: (isPaused: boolean) => void,
  enableAIRef?: React.MutableRefObject<boolean>
) {

  // ft qui redirige les touches
  const down = (e: KeyboardEvent) => onKeyDown(e, gameRefs, enableAIRef);
  const up = (e: KeyboardEvent) => onKeyUp(e);

  // touche pour pause 
  const escape = (e: KeyboardEvent) => onEscapeKeyDown(e, setIsPaused, gameRefs);


  // deteecte touche partout dans le fenetre 
  // et envoyer ces touches aux ft 
  window.addEventListener("keydown", down, { passive: false }); // desactive les touches appuyes dans le nav
  window.addEventListener("keyup", up); 
  window.addEventListener("keydown", escape); // 



  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("keydown", escape);
  };
}
