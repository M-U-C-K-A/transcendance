import { keys } from "./input";

interface Controls {
  player1Up: string;
  player1Down: string;
  player2Up: string;
  player2Down: string;
  player1Special: string;
  player2Special: string;
  player3Up: string;
  player3Down: string;
  player4Up: string;
  player4Down: string;
  player3Special: string;
  player4Special: string;
}

let currentControls: Controls = {
  player1Up: 'W',
  player1Down: 'S',
  player2Up: 'ArrowUp',
  player2Down: 'ArrowDown',
  player1Special: 'E',
  player2Special: 'ArrowLeft',
  player3Up: 'T',
  player3Down: 'G',
  player4Up: 'O',
  player4Down: 'L',
  player3Special: 'Y',
  player4Special: 'P',
};


// fonction utilise dans les menu de maj de touche 
// currentControls = le contexte des touche du jeu
export function updateControls(newControls: Controls) {
  // Mise à jour des contrôles
  currentControls = newControls;
  
  // Nettoyage des touches actuellement pressees
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


export function isPlayer3UpPressed(): boolean {
  return keys.has(currentControls.player3Up.toLowerCase());
}


export function isPlayer3DownPressed(): boolean {
  return keys.has(currentControls.player3Down.toLowerCase());
}


export function isPlayer4UpPressed(): boolean {
  return keys.has(currentControls.player4Up.toLowerCase());
}


export function isPlayer4DownPressed(): boolean {
  return keys.has(currentControls.player4Down.toLowerCase());
}


export function getCurrentControls(): Controls {
  return { ...currentControls };
} 
