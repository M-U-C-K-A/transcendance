import { Scene, Mesh, Vector3, StandardMaterial, Color3, ActionManager, ExecuteCodeAction } from "@babylonjs/core";
import { GameState, GameRefs } from "../gameTypes";

export class MalusSystem {
  private scene: Scene;
  private MalusMesh: Mesh | null = null;
  private MalusMaterial: StandardMaterial;
  private spawnInterval: number = 15000; // 15 secondes
  private spawnTimer: number | null = null;
  private gameState: GameState;
  private gameRefs: GameRefs;
  private MalusTextMesh: Mesh | null = null;
  private onMalusSpawn?: () => void;
  private setScore?: (score: { player1: number; player2: number }) => void;
  private setWinner?: (winner: string | null) => void;

  constructor(
    scene: Scene, 
    gameState: GameState, 
    gameRefs: GameRefs,
    onMalusSpawn?: () => void, 
    setScore?: (score: { player1: number; player2: number }) => void, 
    setWinner?: (winner: string | null) => void
  ) {
    this.scene = scene;
    this.gameState = gameState;
    this.gameRefs = gameRefs;
    this.onMalusSpawn = onMalusSpawn;
    this.setScore = setScore;
    this.setWinner = setWinner;

    // Créer le matériau pour le Malus
    this.MalusMaterial = new StandardMaterial("MalusMaterial", scene);
    this.MalusMaterial.diffuseColor = new Color3(1, 0, 0); // Rouge
    this.MalusMaterial.emissiveColor = new Color3(0.5, 0, 0); // Légère lueur rouge
  }

  public startMalusSystem() {
    // Arrêter le timer existant s'il y en a un
    if (this.spawnTimer !== null) {
      clearInterval(this.spawnTimer);
    }

    // Démarrer le spawn des Malus
    this.spawnTimer = window.setInterval(() => {
      this.spawnMalus();
    }, this.spawnInterval);
  }

  public stopMalusSystem() {
    if (this.spawnTimer !== null) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
    // Supprimer le Malus existant
    if (this.MalusMesh) {
      this.MalusMesh.dispose();
      this.MalusMesh = null;
    }
    if (this.MalusTextMesh) {
      this.MalusTextMesh.dispose();
      this.MalusTextMesh = null;
    }
  }

  private spawnMalus() {
    // Supprimer l'ancien Malus s'il existe
    if (this.MalusMesh) {
      this.MalusMesh.dispose();
    }
    if (this.MalusTextMesh) {
      this.MalusTextMesh.dispose();
    }

    // Créer un nouveau Malus
    this.MalusMesh = Mesh.CreateBox("Malus", 4, this.scene); // 4x plus gros
    this.MalusMesh.material = this.MalusMaterial;

    // Position aléatoire sur la map
    const x = Math.random() * 20 - 10; // Entre -10 et 10
    const y = 0.25; // Même hauteur que la balle
    const z = 0;
    this.MalusMesh.position = new Vector3(x, y, z);

    // Ajouter le texte "-1"
    this.MalusTextMesh = Mesh.CreatePlane("MalusText", 4, this.scene);
    this.MalusTextMesh.position = new Vector3(x, y, z + 0.1);
    this.MalusTextMesh.rotation.y = Math.PI; // Faire face à la caméra

    // Ajouter la collision avec la balle
    this.MalusMesh.actionManager = new ActionManager(this.scene);
    this.MalusMesh.actionManager.registerAction(
      new ExecuteCodeAction(
        { trigger: ActionManager.OnIntersectionEnterTrigger, parameter: this.scene.getMeshByName("ball") },
        () => {
          // On retire 1 point à l'adversaire du dernier joueur ayant touché la balle
          const newScore = {
            player1: this.gameRefs.score.current.player1,
            player2: this.gameRefs.score.current.player2
          };
          
          // Récupérer le dernier touché de l'historique
          const lastTouch = this.gameRefs.touchHistory?.[this.gameRefs.touchHistory.length - 1];
          
          if (lastTouch) {
            if (lastTouch.player === 1) {
              // Joueur 1 a touché la balle en dernier → on enlève 1 à joueur 2
              newScore.player2 = newScore.player2 - 1;
              if (this.setScore) this.setScore(newScore);
              if (this.gameRefs.score) this.gameRefs.score.current = newScore;
              if (newScore.player2 <= -5 && this.setWinner) this.setWinner("Joueur 1");
              else if (newScore.player1 >= 5 && this.setWinner) this.setWinner("Joueur 1");
              else if (newScore.player2 >= 5 && this.setWinner) this.setWinner("Joueur 2");
            } else {
              // Joueur 2 a touché la balle en dernier → on enlève 1 à joueur 1
              newScore.player1 = newScore.player1 - 1;
              if (this.setScore) this.setScore(newScore);
              if (this.gameRefs.score) this.gameRefs.score.current = newScore;
              if (newScore.player1 <= -5 && this.setWinner) this.setWinner("Joueur 2");
              else if (newScore.player2 >= 5 && this.setWinner) this.setWinner("Joueur 2");
              else if (newScore.player1 >= 5 && this.setWinner) this.setWinner("Joueur 1");
            }
          } else {
            // Cas par défaut (aucun toucher connu) → on enlève à player2
            newScore.player2 = newScore.player2 - 1;
            if (this.setScore) this.setScore(newScore);
            if (this.gameRefs.score) this.gameRefs.score.current = newScore;
            if (newScore.player2 <= -5 && this.setWinner) this.setWinner("Joueur 1");
            else if (newScore.player1 >= 5 && this.setWinner) this.setWinner("Joueur 1");
            else if (newScore.player2 >= 5 && this.setWinner) this.setWinner("Joueur 2");
          }
          
          // Supprimer le Malus et le texte
          this.MalusMesh?.dispose();
          this.MalusMesh = null;
          this.MalusTextMesh?.dispose();
          this.MalusTextMesh = null;
        }
      )
    );

    if (this.onMalusSpawn) {
      this.onMalusSpawn();
    }
  }
} 