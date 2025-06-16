// gameTypes.ts
import type { MutableRefObject } from "react";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Scene } from "@babylonjs/core/scene";
import React from "react";
import type { Vector3 } from "@babylonjs/core/Maths/math.vector";

interface Controls {
  player1Up: string;
  player1Down: string;
  player2Up: string;
  player2Down: string;
  player1Special: string;
  player2Special: string;
}

/**
 * Props passées au composant Pong3D
 */
export interface Pong3DProps {
  paddle1Color: string;
  paddle2Color: string;
  MapStyle: "classic" | "red" | "neon";
  resetCamFlag: number;
}

/**
 * État du jeu
 */
export interface GameState {
  score: { player1: number; player2: number };
  winner: string | null;
  countdown: number | null;
  isPaused: boolean;
}

/**
 * Références "mutables" pour lire l'état en temps réel
 */
export interface GameRefs {
  score: MutableRefObject<{ player1: number; player2: number }>;
  winner: MutableRefObject<string | null>;
  countdown: MutableRefObject<number | null>;
  isPaused: MutableRefObject<boolean>;
  setScore: (score: { player1: number; player2: number }) => void;
  setWinner: (winner: string | null) => void;
  setCountdown: (countdown: number | null) => void;
  setIsPaused: (isPaused: boolean) => void;
  controls: React.MutableRefObject<Controls>;
  touchHistory: TouchHistory[];
  superPad: MutableRefObject<{ player1: boolean; player2: boolean }>;
  stamina: MutableRefObject<{ player1: number; player2: number }>;
  lastHitter: MutableRefObject<number | null>;
  triggerSuperPad: (player: 1 | 2) => void;
}

/**
 * Objets du jeu
 */
export interface GameObjects {
  scene: Scene;
  camera: ArcRotateCamera;
  paddle1: Mesh;
  paddle2: Mesh;
  miniPaddle: Mesh | null;
  ball: Mesh;
  ballV: Vector3;
  currentSpeed: number;
  bumperLeft: Mesh | null;
  bumperRight: Mesh | null;
  ballMat: StandardMaterial;
  p1Mat: StandardMaterial;
  p2Mat: StandardMaterial;
  rightTri: Mesh | null;
  leftTri: Mesh | null;
  rightTriOuterLeft: Mesh | null;
  leftTriOuterLeft: Mesh | null;
  rightTriOuterRight: Mesh | null;
  leftTriOuterRight: Mesh | null;
  malus: Mesh | null;
}

/**
 * Historique des touches
 */
export interface TouchHistory {
  player: number;
  timestamp: number;
}

/**
 * Fonction pour mettre à jour la stamina
 */
export type SetStaminaFunction = React.Dispatch<React.SetStateAction<{ player1: number; player2: number }>>;

/**
 * Fonction pour mettre à jour le super pad
 */
export type SetSuperPadFunction = React.Dispatch<React.SetStateAction<{ player1: boolean; player2: boolean }>>;
