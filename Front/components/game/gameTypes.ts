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


export interface Pong3DProps {
  paddle1Color: string;
  paddle2Color: string;
  paddle3Color: string | null;
  paddle4Color: string | null;
  MapStyle: "classic" | "red" | "neon";
  resetCamFlag: number;
  is2v2Mode: boolean;
}


export interface GameState {
  score: { player1: number; player2: number };
  winner: string | null;
  countdown: number | null;
  isPaused: boolean;
}


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
  superPad: MutableRefObject<{ player1: boolean; player2: boolean; player3: boolean; player4: boolean; }>;
  stamina: MutableRefObject<{ player1: number; player2: number; player3: number; player4: number; }>;
  lastHitter: MutableRefObject<number | null>;
  triggerSuperPad: MutableRefObject<(player: 1 | 2 | 3 | 4) => void>;
  matchStats: MutableRefObject<MatchStats>;
  setMatchStats: React.Dispatch<React.SetStateAction<MatchStats>>;
}



export interface GameObjects {
  scene: Scene;
  camera: ArcRotateCamera;
  paddle1: Mesh;
  paddle2: Mesh;
  paddle3: Mesh | null;
  paddle4: Mesh | null;
  miniPaddle: Mesh | null;
  miniPaddle3: Mesh | null;
  miniPaddle4: Mesh | null;
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


export interface TouchHistory {
  player: number;
  timestamp: number;
}

// type qui prend une ft qui elle meme prend des param precis
export type SetStaminaFunction = React.Dispatch<React.SetStateAction<{ player1: number; player2: number; player3: number; player4: number; }>>;


export type SetSuperPadFunction = React.Dispatch<React.SetStateAction<{ player1: boolean; player2: boolean; player3: boolean; player4: boolean; }>>;

export interface MatchStats {
  touches: { player1: number; player2: number };
  pointsMarques: { player1: number; player2: number };
  pointsConcedes: { player1: number; player2: number };
  special: { player1: number; player2: number };
  malusInfliges: { player1: number; player2: number };
  malusRecus: { player1: number; player2: number };
  rebondsTotal: number;
}
