import { Vector3 } from "@babylonjs/core";
import type { GameObjects } from "./gameTypes";
import type { GameRefs } from "./gameTypes";

interface Score {
  player1: number;
  player2: number;
}

interface MalusSystemProps {
  gameObjects: GameObjects;
  gameRefs: GameRefs & { lastHitter?: { current: number | null }, setWinner?: (winner: string) => void };
  setScore: (score: Score) => void;
  resetMalus: () => void;
}

const enableMaluses = true;

export class MalusSystem {
  private gameObjects: GameObjects;
  private gameRefs: GameRefs;
  private setScore: (score: Score) => void;
  private resetMalus: () => void;

  constructor(props: MalusSystemProps) {
    this.gameObjects = props.gameObjects;
    this.gameRefs = props.gameRefs;
    this.setScore = props.setScore;
    this.resetMalus = props.resetMalus;
  }

  handleMalusCollision = () => {
    if (!enableMaluses) return;

    const ball = this.gameObjects.ball;
    const malus = this.gameObjects.malus;

    if (!ball || !malus) return;

    const distance = Vector3.Distance(ball.position, malus.position);

    if (distance < 2) {
      // Appliquer le malus à l'adversaire du dernier joueur ayant touché la balle
      const last = this.gameRefs.lastHitter?.current;
      if (last === 1) {
        this.setScore({
          ...this.gameRefs.score.current,
          player2: this.gameRefs.score.current.player2 - 1
        });
      } else if (last === 2) {
        this.setScore({
          ...this.gameRefs.score.current,
          player1: this.gameRefs.score.current.player1 - 1
        });
      }
      // Jouer le son de malus (optionnel)
      if (this.gameRefs.malusSound) {
        this.gameRefs.malusSound.play();
      }
      // Détruire le malus immédiatement
      this.resetMalus();
      if (this.gameRefs.lastHitter) this.gameRefs.lastHitter.current = null;
    }
  };
} 