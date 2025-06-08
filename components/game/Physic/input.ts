// input.ts
// ----------------

import type { GameRefs } from "../gameTypes";

export const keys = new Set<string>();

export function onKeyDown(e: KeyboardEvent, gameRefs: GameRefs) {
  if (!gameRefs?.winner?.current && !gameRefs?.isPaused?.current) {
    // On accepte toutes les touches pour permettre la personnalisation
    keys.add(e.key.toLowerCase());
    // Coup spécial joueur 1 (touche personnalisée)
    if (
      gameRefs.controls &&
      e.key.toLowerCase() === gameRefs.controls.player1Special?.toLowerCase() &&
      gameRefs.triggerSuperPad
    ) {
      gameRefs.triggerSuperPad(1);
    }
    // Coup spécial joueur 2 (touche personnalisée)
    if (
      gameRefs.controls &&
      e.key === gameRefs.controls.player2Special &&
      gameRefs.triggerSuperPad
    ) {
      gameRefs.triggerSuperPad(2);
    }
    e.preventDefault();
  }
}

export function onKeyUp(e: KeyboardEvent) {
  keys.delete(e.key.toLowerCase());
}

export function onGlobalKeyDown(
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

// Installe tous les écouteurs clavier. Retourne une fonction de cleanup.
export function registerInputListeners(
  gameRefs: GameRefs,
  setIsPaused: (isPaused: boolean) => void
) {
  const down = (e: KeyboardEvent) => onKeyDown(e, gameRefs);
  const up = (e: KeyboardEvent) => onKeyUp(e);
  const global = (e: KeyboardEvent) => onGlobalKeyDown(e, setIsPaused, gameRefs);

  window.addEventListener("keydown", down, { passive: false });
  window.addEventListener("keyup", up);
  window.addEventListener("keydown", global);

  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("keydown", global);
  };
}
