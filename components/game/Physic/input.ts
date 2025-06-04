// input.ts
// ----------------

export const keys = new Set<string>();

export function onKeyDown(e: KeyboardEvent, gameRefs: { winner: any; isPaused: any }) {
  if (gameRefs.winner.current || gameRefs.isPaused.current) return;
  if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
    keys.add(e.key);
    e.preventDefault();
  }
}

export function onKeyUp(e: KeyboardEvent) {
  keys.delete(e.key);
}

export function onGlobalKeyDown(
  e: KeyboardEvent,
  setIsPaused: (b: boolean) => void
) {
  if (e.key === "Escape") {
    setIsPaused((prev) => !prev);
  }
}

// Installe tous les écouteurs clavier. Retourne une fonction de cleanup.
export function registerInputListeners(
  gameRefs: { winner: any; isPaused: any },
  setIsPaused: (b: boolean) => void
) {
  const down = (e: KeyboardEvent) => onKeyDown(e, gameRefs);
  const up = (e: KeyboardEvent) => onKeyUp(e);
  const global = (e: KeyboardEvent) => onGlobalKeyDown(e, setIsPaused);

  window.addEventListener("keydown", down, { passive: false });
  window.addEventListener("keyup", up);
  window.addEventListener("keydown", global);

  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("keydown", global);
  };
}
