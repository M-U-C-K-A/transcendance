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
};

/**
 * Références “mutables” pour lire l’état en temps réel
 */
export type GameRefs = {
  winner: MutableRefObject<string | null>;
  isPaused: MutableRefObject<boolean>;
  countdown: MutableRefObject<number | null>;
};

/**
 * Tous les objets retournés par setupGame
 */
export interface GameObjects {
  ball: Mesh;
  paddle1: Mesh;
  paddle2: Mesh;
  miniPaddle?: Mesh;
  bumperLeft?: Mesh;
  bumperRight?: Mesh;
  allHitSounds: Sound[];
  ballMat: StandardMaterial;
  p1Mat: StandardMaterial;
  p2Mat: StandardMaterial;
  camera: ArcRotateCamera;
}
