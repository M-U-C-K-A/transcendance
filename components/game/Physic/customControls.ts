import { keys } from "./input";

interface Controls {
  player1Up: string;
  player1Down: string;
  player2Up: string;
  player2Down: string;
}

let currentControls: Controls = {
  player1Up: 'W',
  player1Down: 'S',
  player2Up: 'ArrowUp',
  player2Down: 'ArrowDown'
};

export function updateControls(newControls: Controls) {
  currentControls = newControls;
}

export function getControls(): Controls {
  return currentControls;
}

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