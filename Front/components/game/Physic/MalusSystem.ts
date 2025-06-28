import { Scene, Mesh, Vector3, StandardMaterial, Color3, ActionManager, ExecuteCodeAction } from "@babylonjs/core";
import { GameRefs } from "../gameTypes";

export class MalusSystem {
  private scene: Scene;
  private MalusMesh: Mesh | null = null;
  private MalusMaterial: StandardMaterial;
  private spawnInterval: number | null = null;
  private gameRefs: GameRefs;
  private onMalusSpawn?: () => void;
  private setScore?: (score: { player1: number; player2: number }) => void;
  private setWinner?: (winner: string | null) => void;
  private remainingTime = 15000;
  private lastUpdateTime = Date.now();
  private isPaused = false;





  constructor(
    scene: Scene,
    gameRefs: GameRefs,
    onMalusSpawn?: () => void,
    setScore?: (score: { player1: number; player2: number }) => void,
    setWinner?: (winner: string | null) => void
  ) {
    this.scene = scene;
    this.gameRefs = gameRefs;
    this.onMalusSpawn = onMalusSpawn;
    this.setScore = setScore;
    this.setWinner = setWinner;
    this.MalusMaterial = new StandardMaterial("MalusMaterial", scene);
    this.MalusMaterial.diffuseColor = new Color3(1, 0, 0);
    this.MalusMaterial.emissiveColor = new Color3(0.5, 0, 0);
    this.MalusMaterial.alpha = 0.8;
  }








  // check les pauses 
  public startMalusSystem() 
  {

    this.spawnInterval = setInterval(() => 
    {

      // si on pause on save le temps. si pause return en boucle.
      if (this.gameRefs.isPaused?.current) 
      {
        if (!this.isPaused) 
          this.lastUpdateTime = Date.now();
        return;
      }
    

      // si partie fini que ca spwan plus 
      if (this.gameRefs.winner?.current) 
      {
        this.stopMalusSystem();
        return;
      }
    


      // 1 - 0 = 1
      // 
      // pause 3 sec

      // pas de maj 

      // 4 - 1 = 3
      const deltaTime = Date.now() - this.lastUpdateTime;

      // 1

      // pas de maj

      // 4
      this.lastUpdateTime = Date.now();



      // max de 0 pour jamais de negatif. si plus de temps de pause que de restant.

      // 15 - 1 = 14
      //
      // pas de maj

      // 14 - 1 = 13
      this.remainingTime = Math.max(0, this.remainingTime - deltaTime);







      // fin du compteur = spawn malus
      if (this.remainingTime <= 0) 
      {
        this.spawnMalus();
        this.remainingTime = 15000;
      }



    }, 100);


  }







  // clean stop tout
  public stopMalusSystem() 
  {
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
      this.spawnInterval = null;
    }

    
    if (this.MalusMesh) {
      this.MalusMesh.dispose();
      this.MalusMesh = null;
    }
  }







  // temps en sec : pour le timer + useeffet
  public getRemainingTime(): number 
  {
    return Math.ceil(this.remainingTime / 1000);
  }








  private spawnMalus() 
  {
    // remove si compteur a la fin et tjrs la : zone inaccessible
    if (this.MalusMesh) 
      this.MalusMesh.dispose();




    this.MalusMesh = Mesh.CreateBox("Malus", 4, this.scene);
    this.MalusMesh.material = this.MalusMaterial;
    const x = Math.random() * 20 - 10;
    this.MalusMesh.position = new Vector3(x, 0.25, 0);



    
    this.MalusMesh.actionManager = new ActionManager(this.scene);
    this.MalusMesh.actionManager.registerAction(
      new ExecuteCodeAction(
        { trigger: ActionManager.OnIntersectionEnterTrigger, parameter: this.scene.getMeshByName("ball") },
        () => 
        {

          // recup score et touchs
          const score = { ...this.gameRefs.score.current };
          const lastTouch = this.gameRefs.touchHistory?.[this.gameRefs.touchHistory.length - 1];
          


          if (lastTouch) 
          {
            if (lastTouch.player === 1) 
              score.player2--;
            else 
              score.player1--;
          }

          // Mise à jour des statistiques - malus infligés/reçus (seulement si pas d'IA et mode custom)
          if (lastTouch && !this.gameRefs.enableAIRef?.current && this.gameRefs.gamemode === "custom") {
            const malusInfligePlayer = lastTouch.player === 1 ? 'player1' : 'player2';
            const malusRecuPlayer = lastTouch.player === 1 ? 'player2' : 'player1';
            
            this.gameRefs.setMatchStats(prev => ({
              ...prev,
              malusInfliges: { ...prev.malusInfliges, [malusInfligePlayer]: prev.malusInfliges[malusInfligePlayer] + 1 },
              malusRecus: { ...prev.malusRecus, [malusRecuPlayer]: prev.malusRecus[malusRecuPlayer] + 1 }
            }));
          }

          if (this.setScore) 
            this.setScore(score);

          if (this.gameRefs.score) 
            this.gameRefs.score.current = score;



          const win1 = score.player1 >= 3, win2 = score.player2 >= 3, lose1 = score.player1 <= -3, lose2 = score.player2 <= -3;



          if ((lose2 || win1) && this.setWinner) 
            this.setWinner("Joueur 1");


          else if ((lose1 || win2) && this.setWinner) 
            this.setWinner("Joueur 2");


          this.MalusMesh?.dispose();
          this.MalusMesh = null;
        }
      )
    );



  }
} 