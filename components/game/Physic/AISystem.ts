import type { Scene } from "@babylonjs/core";
import type { GameRefs } from "../gameTypes";

export class AISystem {
  private scene: Scene;
  private gameRefs: GameRefs;
  private isActive: boolean = false;

  constructor(scene: Scene, gameRefs: GameRefs) {
    this.scene = scene;
    this.gameRefs = gameRefs;
  }

  public startAISystem() {
    this.isActive = true;
    this.scene.registerBeforeRender(() => {
      if (!this.isActive) return;
      this.updateAI();
    });
  }

  public stopAISystem() {
    this.isActive = false;
  }

  private updateAI() {
    // TODO: Implémenter la logique de l'IA ici
    // - Suivre la balle
    // - Déplacer la raquette
    // - Gérer la difficulté
  }
} 