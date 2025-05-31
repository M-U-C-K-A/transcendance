import { useEffect, useRef, useState } from "react"
import {
  Engine,
  Scene,
  ArcRotateCamera,
  DirectionalLight,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  Color3,
  StandardMaterial,
} from "@babylonjs/core"

export default function Page() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center">
      {/* TITRE */}
      <h1 className="text-2xl font-bold mb-4 text-foreground">
        PongMaster – Duel
      </h1>

      {/* ZONE DE JEU */}
      <div className="w-[80vw] h-[80vh] relative bg-background rounded-lg border border-border">
        <Pong3D />
      </div>
    </div>
  )
}

function Pong3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // État React pour l'affichage du score
  const [score, setScore] = useState({ player1: 0, player2: 0 })
  // État React pour le nom du winner (affiché dans l'UI)
  const [winner, setWinner] = useState<string | null>(null)
  // Référentiel local pour que la boucle Babylon puisse lire le winner à jour
  const winnerRef = useRef<string | null>(null)

  const [countdown, setCountdown] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  // Même logique : on veut lire isPaused dans la boucle Babylon (référentiel)
  const isPausedRef = useRef(false)

  useEffect(() => {
    // Synchronisation automatique de isPausedRef avec isPaused
    isPausedRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    // Synchronisation automatique de winnerRef avec winner
    winnerRef.current = winner
  }, [winner])

  useEffect(() => {
    const canvas = canvasRef.current!
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    scene.clearColor = new Color3(1, 1, 1)

    // === Camera (souris pour bouger) ===
    const camera = new ArcRotateCamera(
      "cam", // nom de la cam
      0, // tourne autour axe x  (gauche droite)
      Math.PI / 3.1, // (y haut bas,  augmente le diviseur  pour voir de haut)  
      35,   // Zoom
      Vector3.Zero(),
      scene
    )
    camera.attachControl(canvas, true)
    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput")

    // === lumières ===
    const dir = new DirectionalLight(
      "dir",
      new Vector3(-1, -2, -1),
      scene
    )
    dir.intensity = 1.2
    const hemi = new HemisphericLight("hemi", Vector3.Up(), scene)
    hemi.intensity = 0.3

    // === Materials ===
    const whiteMat = new StandardMaterial("whiteMat", scene)
    whiteMat.diffuseColor = Color3.White()
    const groundMat = new StandardMaterial("groundMat", scene)
    groundMat.diffuseColor = new Color3(0.05, 0.05, 0.05)

    // === table de jeu ===
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 20, height: 40 },
      scene
    )
    ground.material = groundMat
    ground.position.y = -0.25

    // === les paddles  ===
    const paddleOpts = { width: 6, height: 0.5, depth: 0.5 }
    const paddle1 = MeshBuilder.CreateBox("p1", paddleOpts, scene)
    paddle1.material = whiteMat
    paddle1.position.z = -19
    const paddle2 = paddle1.clone("p2")
    paddle2.position.z = +19

    // === Ball ===
    const ball = MeshBuilder.CreateSphere(
      "ball",
      { diameter: 0.5 },
      scene
    )
    ball.material = whiteMat
    ball.position = Vector3.Zero()

    // === logique de la balle ===
    let ballV = Vector3.Zero()
    const keys = new Set<string>()

    // Local scoreboard pour la boucle de rendu
    const scoreLocal = { player1: 0, player2: 0 }

    // SERVICE

    const TOTAL_SPEED = 0.16 // vitesse de base 
    let currentSpeed = TOTAL_SPEED
    const SPEED_INCREMENT = 1.009// facteur d'augmentation à chaque collision

    // angle max (45°) en radians pour que le cône de dispersion soit ±45° autour de Z
    const MAX_ANGLE = Math.PI / 4

    const serve = (loserSide: "player1" | "player2") => {
      // Réinitialiser la vitesse courante à la vitesse de base
      currentSpeed = TOTAL_SPEED

      // On tire un angle entre –MAX_ANGLE et +MAX_ANGLE
      const angle = (Math.random() * 2 - 1) * MAX_ANGLE

      // On calcule la composante X et la composante Z (positif pour player2, négatif pour player1)
      const vx = Math.sin(angle) * currentSpeed
      const vz =
        Math.cos(angle) * currentSpeed * (loserSide === "player1" ? -1 : +1)

      ballV = new Vector3(vx, 0, vz)
    }

    // startCountdown reste inchangé
    const startCountdown = (
      duration: number,
      callback: () => void
    ) => {
      setIsPaused(true)
      setCountdown(duration)
      let cnt = duration
      const iv = setInterval(() => {
        cnt--
        if (cnt > 0) {
          setCountdown(cnt)
        } else {
          clearInterval(iv)
          setCountdown(null)
          setIsPaused(false)
          callback()
        }
      }, 500)
    }

    // On adapte resetBall pour qu'il reçoive le perdant du point
    const resetBall = (loser: "player1" | "player2") => {
      // Remet la balle au centre et stoppe sa vitesse
      ball.position = Vector3.Zero()
      ballV = Vector3.Zero()

      // Si le perdant est "player1", on envoie la balle vers -Z (côté player1)
      // Sinon, on l'envoie vers +Z (côté player2)
      const dirZ = loser === "player1" ? +1 : -1

      startCountdown(3, () => serve(dirZ as any))
    }

    // === gestion des touches ===
    const onKeyDown = (e: KeyboardEvent) => {
      if (winnerRef.current || isPausedRef.current) return

      if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
        keys.add(e.key)
        e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key)
    }
    window.addEventListener("keydown", onKeyDown, { passive: false })
    window.addEventListener("keyup", onKeyUp)

    // === Boucle principale de rendu ===
    scene.onBeforeRenderObservable.add(() => {
      if (winnerRef.current || isPausedRef.current) return

      // Déplacements des paddles
      if (keys.has("w"))
        paddle1.position.x = Math.max(-9, paddle1.position.x - 0.3)
      if (keys.has("s"))
        paddle1.position.x = Math.min(9, paddle1.position.x + 0.3)
      if (keys.has("ArrowUp"))
        paddle2.position.x = Math.max(-9, paddle2.position.x - 0.3)
      if (keys.has("ArrowDown"))
        paddle2.position.x = Math.min(9, paddle2.position.x + 0.3)

      // Déplace la balle
      ball.position.addInPlace(ballV)

      // === Rebond sur les murs latéraux (X = ±10) ===
      if (ball.position.x > 10 || ball.position.x < -10) {
        // On inverse la composante X
        const dirAfter = new Vector3(-ballV.x, 0, ballV.z).normalize()
        // On augmente légèrement la vitesse et on réaffecte ballV
        currentSpeed *= SPEED_INCREMENT
        ballV = dirAfter.scale(currentSpeed)
      }

      // === Rebonds avec les paddles (Pong “vrai”) ===
      // Largeur demi‐paddle = paddleOpts.width / 2 = 6 / 2 = 3
      const PADDLE_HALF_WIDTH = 3
      // Angle maximum (par exemple 60°) pour rebond en fonction du point de contact
      const MAX_BOUNCE_ANGLE = Math.PI / 3

      // Collision avec le paddle1 (côté bas)
      if (
        ball.position.z < -19 &&
        Math.abs(ball.position.x - paddle1.position.x) < PADDLE_HALF_WIDTH
      ) {
        // Calculer le point de contact relatif : entre –1 (extrême gauche) et +1 (extrême droit)
        const relativeIntersectX =
          (ball.position.x - paddle1.position.x) / PADDLE_HALF_WIDTH
        // Angle de rebond
        const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE
        // On calcule la direction du rebond (avant d’ajuster la vitesse)
        const dirX = Math.sin(bounceAngle)
        const dirZ = Math.cos(bounceAngle)
        const dirAfter = new Vector3(dirX, 0, dirZ).normalize() // vers +Z

        // On augmente légèrement la vitesse
        currentSpeed *= SPEED_INCREMENT
        ballV = dirAfter.scale(currentSpeed)
      }

      // Collision avec le paddle2 (côté haut)
      if (
        ball.position.z > 19 &&
        Math.abs(ball.position.x - paddle2.position.x) < PADDLE_HALF_WIDTH
      ) {
        // Point de contact relatif pour paddle2
        const relativeIntersectX =
          (ball.position.x - paddle2.position.x) / PADDLE_HALF_WIDTH
        const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE
        const dirX = Math.sin(bounceAngle)
        const dirZ = Math.cos(bounceAngle)
        const dirAfter = new Vector3(dirX, 0, -dirZ).normalize() // vers –Z

        // On augmente légèrement la vitesse
        currentSpeed *= SPEED_INCREMENT
        ballV = dirAfter.scale(currentSpeed)
      }

      // === Gestion des scores ===
      if (ball.position.z < -20) {
        // La balle est sortie côté player1 → point pour player2
        scoreLocal.player2 += 1
        setScore({
          player1: scoreLocal.player1,
          player2: scoreLocal.player2,
        })

        if (scoreLocal.player2 >= 5) {
          // player2 atteint 5 ⇒ fin de partie
          setWinner("Joueur 2")
          winnerRef.current = "Joueur 2"
        } else {
          // Perdant = player1, on informe resetBall pour qu'il serve vers –Z
          resetBall("player1")
        }
      }

      if (ball.position.z > 20) {
        // La balle est sortie côté player2 → point pour player1
        scoreLocal.player1 += 1
        setScore({
          player1: scoreLocal.player1,
          player2: scoreLocal.player2,
        })

        if (scoreLocal.player1 >= 5) {
          // player1 atteint 5 ⇒ fin de partie
          setWinner("Joueur 1")
          winnerRef.current = "Joueur 1"
        } else {
          // Perdant = player2, on informe resetBall pour qu'il serve vers +Z
          resetBall("player2")
        }
      }
    })

    engine.runRenderLoop(() => scene.render())
    window.addEventListener("resize", () => engine.resize())

    // === Lancement du match avec décompte initial de 5 secondes ===
    // Au premier service, on choisit aléatoirement un sens (comme avant)
    startCountdown(5, () =>
      serve(Math.random() > 0.5 ? ("player1" as any) : ("player2" as any))
    )

    // === Cleanup ===
    return () => {
      engine.dispose()
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, []) // ← empty deps: s'exécute une seule fois

  return (
    <div className="relative">
      {/* Score */}
      <div className="flex justify-center mb-4 text-lg font-bold text-foreground">
        <span>
          {score.player1} - {score.player2}
        </span>
      </div>

      {/* --- Affichage des touches de contrôle --- */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-20">
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          W
        </div>
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          S
        </div>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-20">
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          ↑
        </div>
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          ↓
        </div>
      </div>


      {/* Affichage du gagnant */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/50">
          <div className="bg-background px-8 py-6 rounded-lg shadow-lg flex flex-col items-center">
            <span className="text-green-500 text-4xl font-extrabold mb-6">
              🏆 {winner} a gagné !
            </span>

            {/* rejouer + quitter */}
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Rejouer
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay gris : décompte avant service */}
      {countdown !== null && (
        <div className="absolute inset-0 bg-gray-400/40 flex items-center justify-center z-10">
          <span className="text-foreground text-2xl font-bold">
            {countdown}
          </span>
        </div>
      )}

      {/* bouton pause / reprendre */}
      <div className="absolute top-2 right-2 z-20">
        {isPaused ? (
          <button
            onClick={() => setIsPaused(false)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Reprendre
          </button>
        ) : (
          <button
            onClick={() => setIsPaused(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Pause
          </button>
        )}
      </div>

      {/* taille du jeu */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
