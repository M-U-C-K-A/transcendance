import { keys } from "./input";

interface Controls {
  player1Up: string;
  player1Down: string;
  player2Up: string;
  player2Down: string;
  player1Special: string;
  player2Special: string;
}

let currentControls: Controls = {
  player1Up: 'W',
  player1Down: 'S',
  player2Up: 'ArrowUp',
  player2Down: 'ArrowDown',
  player1Special: 'E',
  player2Special: 'ArrowLeft',
};


// fonction utilise dans les menu de maj de touche 
// currentControls = le contexte des touche du jeu
export function updateControls(newControls: Controls) {
  // Mise à jour des contrôles
  currentControls = newControls;
  
  // Nettoyage des touches actuellement pressées
  keys.clear();
}


// has permet de verif. un Set (voir assignation de key dans input)
// return la key
export function isPlayer1UpPressed(): boolean {
  return keys.has(currentControls.player1Up.toLowerCase());
}


export function isPlayer1DownPressed(): boolean {
  return keys.has(currentControls.player1Down.toLowerCase());
}


export function isPlayer2UpPressed(): boolean {
  return keys.has(currentControls.player2Up.toLowerCase());
}


export function isPlayer2DownPressed(): boolean {
  return keys.has(currentControls.player2Down.toLowerCase());
}


export function getCurrentControls(): Controls {
  return { ...currentControls };
} 
