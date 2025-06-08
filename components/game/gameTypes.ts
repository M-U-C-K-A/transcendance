// gameTypes.ts
import type { MutableRefObject } from "react";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import type { Sound } from "@babylonjs/core/Audio/sound";

/**
 * Props passées au composant Pong3D
 */
export type Pong3DProps = {
  resetCamFlag : ArcRotateCamera
  paddle1Color: string;
  paddle2Color: string;
  MapStyle: "classic" | "red" | "neon";
};

/**
 * État de la partie
 */
export type GameState = {
  score: { player1: number; player2: number };
  winner: string | null;
  countdown: number | null;
  isPaused: boolean;
  lastScorer?: number;
  lastHitter?: number;
};

/**
 * Références “mutables” pour lire l’état en temps réel
 */
export interface GameRefs {
  score: React.MutableRefObject<any>;
  winner: React.MutableRefObject<any>;
  countdown: React.MutableRefObject<any>;
  isPaused: React.MutableRefObject<any>;
  setScore?: any;
  setWinner?: any;
  setCountdown?: any;
  setIsPaused?: any;
  triggerSuperPad?: (player: 1 | 2) => void;
  controls?: any;
  lastHitter?: React.MutableRefObject<number | null>;
  touchHistory?: TouchHistory[];
  superPad: { player1: boolean; player2: boolean };
  stamina: { player1: number; player2: number };
}

/**
 * Tous les objets retournés par setupGame
 */
export interface GameObjects {
  ball: Mesh;
  paddle1: Mesh;
  paddle2: Mesh;
  miniPaddle: Mesh | null;
  bumperLeft: Mesh | null;
  bumperRight: Mesh | null;
  allHitSounds: Sound[];
  ballMat: StandardMaterial;
  p1Mat: StandardMaterial;
  p2Mat: StandardMaterial;
  camera: ArcRotateCamera;
  leftTri: Mesh | null;
  rightTri: Mesh | null;
  rightTriOuterLeft: Mesh | null,
  leftTriOuterLeft: Mesh | null,
  rightTriOuterRight: Mesh | null,
  leftTriOuterRight: Mesh | null
}

export type TouchHistory = {
  player: number;
  timestamp: number;
};

export type SetStaminaFunction = (stamina: { player1: number; player2: number } | ((prev: { player1: number; player2: number }) => { player1: number; player2: number })) => void;
export type SetSuperPadFunction = (superPad: { player1: boolean; player2: boolean } | ((prev: { player1: boolean; player2: boolean }) => { player1: boolean; player2: boolean })) => void;
