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
  Sound,
} from "@babylonjs/core"

export default function Page() {
  // ──────────────────────────────────────────────────────────────────
  //  Musique des la selection de couleur
  // ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    // musique d ambiance
    const music = new Audio("/sounds/AGST - Force (Royalty Free Music).mp3")
    music.loop = true
    music.volume = 0.2
    music
      .play()
      .catch(() => {
        // Si l'autoplay est bloqué, on attend un premier clic pour relancer
        const resumeOnFirstInteraction = () => {
          music.play().catch(() => {})
          window.removeEventListener("click", resumeOnFirstInteraction)
        }
        window.addEventListener("click", resumeOnFirstInteraction)
      })
    // Pas de cleanup ; on laisse la musique tourner tant que Page est la.
  }, [])

  // ----------------------------------------------------------------
  //  les 6 couleurs au choix
  // ----------------------------------------------------------------
  const COLORS = [
    "#FF0000", // Rouge
    "#00FF00", // Vert
    "#0000FF", // Bleu
    "#FFFF00", // Jaune
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
  ]

  // ----------------------------------------------------------------
  //  États React pour :
  //    - la couleur choisie par Joueur 1
  //    - la couleur choisie par Joueur 2
  //    - quel joueur est en train de sélectionner (1 ou 2)
  //    - si la partie a démarré ou non
  // ----------------------------------------------------------------
  const [colorP1, setColorP1] = useState<string | null>(null)
  const [colorP2, setColorP2] = useState<string | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [gameStarted, setGameStarted] = useState(false)

  // ----------------------------------------------------------------
  //  Bouton “Démarrer” activé uniquement si P1 et P2 ont chacun choisi
  //    une couleur et que ces deux couleurs sont différentes.
  // ----------------------------------------------------------------
  const bothChosenAndDistinct =
    colorP1 !== null && colorP2 !== null && colorP1 !== colorP2

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center px-4">
      {/* TITRE */}
      <h1 className="text-2xl font-bold mb-4 text-foreground">
        PongMaster – Duel
      </h1>

      {!gameStarted ? (
        <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
          {/* Sélecteur de joueur */}
          <div className="mb-4 flex justify-center space-x-4">
            <button
              onClick={() => setCurrentPlayer(1)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPlayer === 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🎖️ Joueur 1
            </button>
            <button
              onClick={() => setCurrentPlayer(2)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPlayer === 2
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              🎖️ Joueur 2
            </button>
          </div>

          {/*  Texte d’instruction pour couleur */}
          <div className="text-center mb-4 text-lg font-medium text-foreground">
            Sélectionnez la couleur pour{" "}
            <span className="font-bold">
              {currentPlayer === 1 ? "Joueur 1" : "Joueur 2"}
            </span>
          </div>

          {/* Grille de couleur */}
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-3 mx-auto">
              {COLORS.map((hex) => {
                // Est-ce que cette couleur est déjà prise ?
                const takenByP1 = colorP1 === hex
                const takenByP2 = colorP2 === hex

                // Si prise par l’autre joueur → rendre indispo
                const isDisabled =
                  (currentPlayer === 1 && takenByP2) ||
                  (currentPlayer === 2 && takenByP1)

                // Bordure autour de couleur prise pour dire qui a quelle couleur
                // - prise par P1 → bordure blanche épaisse
                // - prise par P2 → bordure noire épaisse
                // - sinon → bordure transparente
                let borderStyle = "2px solid transparent"
                if (takenByP1) borderStyle = "3px solid white"
                if (takenByP2) borderStyle = "3px solid black"

                return (
                  <button
                    key={hex}
                    onClick={() => {
                      if (isDisabled) return
                      if (currentPlayer === 1) {
                        setColorP1(hex)
                      } else {
                        setColorP2(hex)
                      }
                    }}
                    disabled={isDisabled}
                    aria-label={`Couleur ${hex} ${
                      isDisabled ? "(déjà prise)" : ""
                    }`}
                    className="relative h-12 w-12 rounded-lg focus:outline-none"
                    style={{
                      backgroundColor: hex,
                      opacity: isDisabled ? 0.4 : 1,
                      border: borderStyle,
                    }}
                  >
                    {/* Si prise, on affiche un badge “1” ou “2” */}
                    {(takenByP1 || takenByP2) && (
                      <span
                        className={`
                          absolute -top-1 -left-1
                          bg-foreground text-background
                          text-xs font-bold
                          w-5 h-5 rounded-full
                          flex items-center justify-center
                        `}
                      >
                        {takenByP1 ? "1" : "2"}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bouton “Démarrer la partie” */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setGameStarted(true)}
              disabled={!bothChosenAndDistinct}
              className={`
                px-5 py-2 rounded-lg font-bold text-white
                ${
                  bothChosenAndDistinct
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              Démarrer la partie
            </button>
          </div>
        </div>
      ) : (
        // Si gameStarted = true, on affiche directement le jeu
        <div className="w-[80vw] h-[80vh] relative bg-background rounded-lg border border-border">
          <Pong3D paddle1Color={colorP1!} paddle2Color={colorP2!} />
        </div>
      )}
    </div>
  )
}


// --------------------------------------------------------------------
// PARTIE PONG (composant Pong3D)
// --------------------------------------------------------------------

type Pong3DProps = {
  paddle1Color: string
  paddle2Color: string
}

function Pong3D({ paddle1Color, paddle2Color }: Pong3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState({ player1: 0, player2: 0 })
  const [winner, setWinner] = useState<string | null>(null)
  const winnerRef = useRef<string | null>(null)

  const [countdown, setCountdown] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(false)

  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    winnerRef.current = winner
  }, [winner])

  useEffect(() => {
    const canvas = canvasRef.current!
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    scene.clearColor = new Color3(1, 1, 1)

    // ——————————————  SON ——————————————
    // On prépare un tableau de 5 sons “pong” (URL dans /public/sounds/)
    const allHitSounds: Sound[] = [
      new Sound("hit1", "/sounds/pong-1.mp3", scene, null, {
        volume: 0.5,
        autoplay: false,
      }),
      new Sound("hit2", "/sounds/pong-2.mp3", scene, null, {
        volume: 0.5,
        autoplay: false,
      }),
      new Sound("hit3", "/sounds/pong-3.mp3", scene, null, {
        volume: 0.5,
        autoplay: false,
      }),
      new Sound("hit4", "/sounds/pong-4.mp3", scene, null, {
        volume: 0.5,
        autoplay: false,
      }),
      new Sound("hit5", "/sounds/pong-5.mp3", scene, null, {
        volume: 0.5,
        autoplay: false,
      }),
    ]
    // ————————————————————————————

    // ==== Caméra ====
    const camera = new ArcRotateCamera(
      "cam",
      0,
      Math.PI / 3.1,
      35,
      Vector3.Zero(),
      scene
    )
    camera.attachControl(canvas, true)
    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput")

    // ==== Lumières ====
    const dir = new DirectionalLight(
      "dir",
      new Vector3(-1, -2, -1),
      scene
    )
    dir.intensity = 1.2
    const hemi = new HemisphericLight("hemi", Vector3.Up(), scene)
    hemi.intensity = 0.3

    // ==== sol + paddles + balle (matieres) ====
    const groundMat = new StandardMaterial("groundMat", scene)
    groundMat.diffuseColor = new Color3(0.05, 0.05, 0.05)

    const p1Mat = new StandardMaterial("p1Mat", scene)
    p1Mat.diffuseColor = Color3.FromHexString(paddle1Color)

    const p2Mat = new StandardMaterial("p2Mat", scene)
    p2Mat.diffuseColor = Color3.FromHexString(paddle2Color)

    const ballMat = new StandardMaterial("ballMat", scene)
    ballMat.diffuseColor = Color3.White()

    const whiteMat = new StandardMaterial("whiteMat", scene)
    whiteMat.diffuseColor = Color3.White()

    // ==== Table de jeu ====
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 20, height: 40 },
      scene
    )
    ground.material = groundMat
    ground.position.y = -0.25

    // ==== Les paddles ====
    const paddleOpts = { width: 6, height: 0.5, depth: 0.5 }
    const paddle1 = MeshBuilder.CreateBox("p1", paddleOpts, scene)
    paddle1.material = p1Mat
    paddle1.position.z = -19

    const paddle2 = paddle1.clone("p2")
    paddle2.material = p2Mat
    paddle2.position.z = +19

    // ==== Mini–paddle ====
    const miniPaddleOpts = { width: 4, height: 0.5, depth: 0.5 }
    const miniPaddle = MeshBuilder.CreateBox(
      "miniPaddle",
      miniPaddleOpts,
      scene
    )
    miniPaddle.material = whiteMat
    miniPaddle.position.y = 0
    miniPaddle.position.z = 0
    miniPaddle.position.x = -6
    let miniDir = 1
    const MINI_SPEED = 0.1
    const MINI_BOUND_X = 6

    // ==== Balle ====
    const ball = MeshBuilder.CreateSphere(
      "ball",
      { diameter: 0.5 },
      scene
    )
    ball.material = ballMat
    ball.position = Vector3.Zero()

    // ==== Logique de la balle ====
    let ballV = Vector3.Zero()
    const keys = new Set<string>()
    const scoreLocal = { player1: 0, player2: 0 }

    const TOTAL_SPEED = 0.16
    let currentSpeed = TOTAL_SPEED
    const SPEED_INCREMENT = 1.009
    const MAX_ANGLE = Math.PI / 4

    const serve = (loserSide: "player1" | "player2") => {
      currentSpeed = TOTAL_SPEED
      const angle = (Math.random() * 2 - 1) * MAX_ANGLE
      const vx = Math.sin(angle) * currentSpeed
      const vz =
        Math.cos(angle) *
        currentSpeed *
        (loserSide === "player1" ? -1 : +1)
      ballV = new Vector3(vx, 0, vz)
    }

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

    const resetBall = (loser: "player1" | "player2") => {
      ball.position = Vector3.Zero()
      ballV = Vector3.Zero()
      const dirZ = loser === "player1" ? -1 : +1
      startCountdown(3, () => serve(dirZ as any))
    }

    // ==== Gestion des touches pour le jeu ====
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

    // ==== Écouteur pour mettre en pause/reprendre avec Échap ====
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPaused((prev: boolean) => !prev)
      }
    }
    window.addEventListener("keydown", onGlobalKeyDown)

    // ==== Boucle principale de rendu ====
    scene.onBeforeRenderObservable.add(() => {
      if (winnerRef.current || isPausedRef.current) return

      // → Déplacement des paddles
      if (keys.has("w"))
        paddle1.position.x = Math.max(-9, paddle1.position.x - 0.3)
      if (keys.has("s"))
        paddle1.position.x = Math.min(9, paddle1.position.x + 0.3)
      if (keys.has("ArrowUp"))
        paddle2.position.x = Math.max(-9, paddle2.position.x - 0.3)
      if (keys.has("ArrowDown"))
        paddle2.position.x = Math.min(9, paddle2.position.x + 0.3)

      // → Mouvement du mini-paddle
      miniPaddle.position.x += MINI_SPEED * miniDir
      if (miniPaddle.position.x > MINI_BOUND_X) {
        miniPaddle.position.x = MINI_BOUND_X
        miniDir = -1
      } else if (miniPaddle.position.x < -MINI_BOUND_X) {
        miniPaddle.position.x = -MINI_BOUND_X
        miniDir = 1
      }

      // → Déplacement de la balle
      ball.position.addInPlace(ballV)

      // → Rebond sur les murs latéraux
      if (ball.position.x > 10 || ball.position.x < -10) {
        const dirAfter = new Vector3(-ballV.x, 0, ballV.z).normalize()
        currentSpeed *= SPEED_INCREMENT
        ballV = dirAfter.scale(currentSpeed)

        // ← Jouer un bruit de pong aléatoire
        const randomIndex = Math.floor(
          Math.random() * allHitSounds.length
        )
        allHitSounds[randomIndex].play()
      }

      // → Rebonds “vrais” avec les paddles
      const PADDLE_HALF_WIDTH = 3
      const MAX_BOUNCE_ANGLE = Math.PI / 3

      // Collision avec paddle1
      if (
        ball.position.z < -19 &&
        Math.abs(ball.position.x - paddle1.position.x) < PADDLE_HALF_WIDTH
      ) {
        const relativeIntersectX =
          (ball.position.x - paddle1.position.x) / PADDLE_HALF_WIDTH
        const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE
        const dirX = Math.sin(bounceAngle)
        const dirZ = Math.cos(bounceAngle)
        const dirAfter = new Vector3(dirX, 0, dirZ).normalize()
        currentSpeed *= SPEED_INCREMENT
        ballV = dirAfter.scale(currentSpeed)

        // ← Changer la couleur de la balle pour celle du paddle1
        ballMat.diffuseColor = p1Mat.diffuseColor.clone()

        // ← Jouer un bruit de pong aléatoire
        const idx1 = Math.floor(Math.random() * allHitSounds.length)
        allHitSounds[idx1].play()
      }

      // Collision avec paddle2
      if (
        ball.position.z > 19 &&
        Math.abs(ball.position.x - paddle2.position.x) < PADDLE_HALF_WIDTH
      ) {
        const relativeIntersectX =
          (ball.position.x - paddle2.position.x) / PADDLE_HALF_WIDTH
        const bounceAngle = relativeIntersectX * MAX_BOUNCE_ANGLE
        const dirX = Math.sin(bounceAngle)
        const dirZ = Math.cos(bounceAngle)
        const dirAfter = new Vector3(dirX, 0, -dirZ).normalize()
        currentSpeed *= SPEED_INCREMENT
        ballV = dirAfter.scale(currentSpeed)

        // ← Changer la couleur de la balle pour celle du paddle2
        ballMat.diffuseColor = p2Mat.diffuseColor.clone()

        // ← Jouer un bruit de pong aléatoire
        const idx2 = Math.floor(Math.random() * allHitSounds.length)
        allHitSounds[idx2].play()
      }

      // Collision avec le mini-paddle
      {
        const PADDLE_HALF_W = miniPaddleOpts.width / 2 // = 2
        const PADDLE_HALF_D = miniPaddleOpts.depth / 2 // = 0.25
        if (
          Math.abs(ball.position.z - miniPaddle.position.z) < PADDLE_HALF_D &&
          Math.abs(ball.position.x - miniPaddle.position.x) < PADDLE_HALF_W
        ) {
          const relativeX =
            (ball.position.x - miniPaddle.position.x) / PADDLE_HALF_W
          const bounceAngle = relativeX * (Math.PI / 4)
          const dirX = Math.sin(bounceAngle)
          const dirZ =
            ballV.z > 0
              ? -Math.cos(bounceAngle)
              : +Math.cos(bounceAngle)
          const dirAfter = new Vector3(dirX, 0, dirZ).normalize()
          currentSpeed *= SPEED_INCREMENT
          ballV = dirAfter.scale(currentSpeed)
        }
      }

      //   scores 
      if (ball.position.z < -20) {
        scoreLocal.player2 += 1
        setScore({
          player1: scoreLocal.player1,
          player2: scoreLocal.player2,
        })

        if (scoreLocal.player2 >= 5) {
          setWinner("Joueur 2")
          winnerRef.current = "Joueur 2"
        } else {
          resetBall("player1")
        }
      }

      if (ball.position.z > 20) {
        scoreLocal.player1 += 1
        setScore({
          player1: scoreLocal.player1,
          player2: scoreLocal.player2,
        })

        if (scoreLocal.player1 >= 5) {
          setWinner("Joueur 1")
          winnerRef.current = "Joueur 1"
        } else {
          resetBall("player2")
        }
      }
    })

    engine.runRenderLoop(() => scene.render())
    window.addEventListener("resize", () => engine.resize())

    // Lancement initial (décompte 5 secondes)
    startCountdown(5, () =>
      serve(Math.random() > 0.5 ? ("player1" as any) : ("player2" as any))
    )

    // Cleanup a la fin de la game pour que plus rien ne bouge
    return () => {
      engine.dispose()
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("keydown", onGlobalKeyDown)
      // Les objets Sound sont libérés par scene.dispose()
    }
  }, [paddle1Color, paddle2Color]) // On recrée la scène si les couleurs changent

  return (
    <div className="relative">
      {/* Score */}
      <div className="flex justify-center mb-4 text-lg font-bold text-foreground">
        <span>
          {score.player1} - {score.player2}
        </span>
      </div>

      {/* Affichage des touches (visuel) */}
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

      {/* Bouton pause / label Échap */}
      <div className="absolute top-2 right-2 z-20 flex items-center space-x-2">
        {/* Encadré "Échap" pour indiquer que la touche Escape met en pause */}
        <div className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
          Échap
        </div>

        {/* Bouton pause / reprendre */}
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

      {/* Canvas Babylon */}
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
