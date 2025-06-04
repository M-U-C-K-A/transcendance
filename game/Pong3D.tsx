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
  GlowLayer,
} from "@babylonjs/core"

type Pong3DProps = {
  paddle1Color: string
  paddle2Color: string
  mopStyle: "classic" | "red" | "neon"
}

export default function Pong3D({ paddle1Color, paddle2Color, mopStyle }: Pong3DProps) {
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

    // GlowLayer pour Neon, intensité 0.6
    if (mopStyle === "neon") {
      const glow = new GlowLayer("glow", scene)
      glow.intensity = 0.6
    }

    // Sons “pong”
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

    // Caméra
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

    // Lumières
    const dir = new DirectionalLight("dir", new Vector3(-1, -2, -1), scene)
    dir.intensity = 1.2
    const hemi = new HemisphericLight("hemi", Vector3.Up(), scene)
    hemi.intensity = 0.3

    // Matériaux
    const p1Mat = new StandardMaterial("p1Mat", scene)
    p1Mat.diffuseColor = Color3.FromHexString(paddle1Color)

    const p2Mat = new StandardMaterial("p2Mat", scene)
    p2Mat.diffuseColor = Color3.FromHexString(paddle2Color)

    const ballMat = new StandardMaterial("ballMat", scene)
    if (mopStyle === "neon") {
      ballMat.diffuseColor = Color3.Black()
      ballMat.emissiveColor = Color3.Black()
      ballMat.specularPower = 64
    } else {
      ballMat.diffuseColor = Color3.White()
    }

    const whiteMat = new StandardMaterial("whiteMat", scene)
    whiteMat.diffuseColor = Color3.White()

    // Table de jeu
    if (mopStyle !== "neon") {
      const groundMat = new StandardMaterial("groundMat", scene)
      if (mopStyle === "classic") {
        groundMat.diffuseColor = new Color3(0.05, 0.05, 0.05)
      } else {
        groundMat.diffuseColor = Color3.FromHexString("#800020")
      }
      const ground = MeshBuilder.CreateGround(
        "ground",
        { width: 20, height: 40 },
        scene
      )
      ground.material = groundMat
      ground.position.y = -0.25
    } else {
      const stripeColors = [
        new Color3(1, 0, 0).scale(0.6),
        new Color3(0, 1, 1).scale(0.6),
        new Color3(1, 1, 0).scale(0.6),
        new Color3(1, 0, 1).scale(0.6),
        new Color3(0, 1, 0).scale(0.6),
      ]
      const stripeHeight = 40 / stripeColors.length
      stripeColors.forEach((col, idx) => {
        const mat = new StandardMaterial(`stripeMat${idx}`, scene)
        mat.diffuseColor = new Color3(0, 0, 0)
        mat.emissiveColor = col
        mat.specularColor = col
        mat.specularPower = 32

        const stripe = MeshBuilder.CreateGround(
          `stripe${idx}`,
          { width: 20, height: stripeHeight },
          scene
        )
        stripe.material = mat
        stripe.position.y = -0.25
        stripe.position.z = -20 + stripeHeight / 2 + idx * stripeHeight
      })
    }

    // Paddles
    const paddleOpts = { width: 6, height: 0.5, depth: 0.5 }
    const paddle1 = MeshBuilder.CreateBox("p1", paddleOpts, scene)
    paddle1.material = p1Mat
    paddle1.position.z = -19
    if (mopStyle === "neon") {
      p1Mat.emissiveColor = new Color3(1, 0.5, 0)
      p1Mat.specularPower = 32
    }

    const paddle2 = paddle1.clone("p2")
    paddle2.material = p2Mat
    paddle2.position.z = 19
    if (mopStyle === "neon") {
      p2Mat.emissiveColor = new Color3(1, 1, 1)
      p2Mat.specularPower = 32
    }

    // Mini–paddle
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

    // Balle
    const ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, scene)
    ball.material = ballMat
    ball.position = Vector3.Zero()

    // Logique de la balle
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
        Math.cos(angle) * currentSpeed * (loserSide === "player1" ? -1 : 1)
      ballV = new Vector3(vx, 0, vz)
    }

    const startCountdown = (duration: number, callback: () => void) => {
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
      const dirZ = loser === "player1" ? -1 : 1
      startCountdown(3, () => serve(dirZ as any))
    }

    // Gestion des touches
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

    // Pause / reprise avec Échap
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPaused((prev) => !prev)
      }
    }
    window.addEventListener("keydown", onGlobalKeyDown)

    // Boucle principale de rendu
    scene.onBeforeRenderObservable.add(() => {
      if (winnerRef.current || isPausedRef.current) return

      // Déplacement paddles
      if (keys.has("w"))
        paddle1.position.x = Math.max(-9, paddle1.position.x - 0.3)
      if (keys.has("s"))
        paddle1.position.x = Math.min(9, paddle1.position.x + 0.3)
      if (keys.has("ArrowUp"))
        paddle2.position.x = Math.max(-9, paddle2.position.x - 0.3)
      if (keys.has("ArrowDown"))
        paddle2.position.x = Math.min(9, paddle2.position.x + 0.3)

      // Mouvement mini-paddle
      miniPaddle.position.x += MINI_SPEED * miniDir
      if (miniPaddle.position.x > MINI_BOUND_X) {
        miniPaddle.position.x = MINI_BOUND_X
        miniDir = -1
      } else if (miniPaddle.position.x < -MINI_BOUND_X) {
        miniPaddle.position.x = -MINI_BOUND_X
        miniDir = 1
      }

      // Déplacement balle
      ball.position.addInPlace(ballV)

      // Rebond murs latéraux
      if (ball.position.x > 10 || ball.position.x < -10) {
        const dirAfter = new Vector3(-ballV.x, 0, ballV.z).normalize()
        currentSpeed *= SPEED_INCREMENT
        ballV = dirAfter.scale(currentSpeed)
        const randomIndex = Math.floor(Math.random() * allHitSounds.length)
        allHitSounds[randomIndex].play()
      }

      // Rebonds avec paddles
      const PADDLE_HALF_WIDTH = 3
      const MAX_BOUNCE_ANGLE = Math.PI / 3

      // Collision paddle1
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

        if (mopStyle !== "neon") {
          ballMat.diffuseColor = p1Mat.diffuseColor.clone()
        }

        const idx1 = Math.floor(Math.random() * allHitSounds.length)
        allHitSounds[idx1].play()
      }

      // Collision paddle2
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

        if (mopStyle !== "neon") {
          ballMat.diffuseColor = p2Mat.diffuseColor.clone()
        }

        const idx2 = Math.floor(Math.random() * allHitSounds.length)
        allHitSounds[idx2].play()
      }

      // Collision mini-paddle
      {
        const PADDLE_HALF_W = miniPaddleOpts.width / 2
        const PADDLE_HALF_D = miniPaddleOpts.depth / 2
        if (
          Math.abs(ball.position.z - miniPaddle.position.z) < PADDLE_HALF_D &&
          Math.abs(ball.position.x - miniPaddle.position.x) < PADDLE_HALF_W
        ) {
          const relativeX =
            (ball.position.x - miniPaddle.position.x) / PADDLE_HALF_W
          const bounceAngle = relativeX * (Math.PI / 4)
          const dirX = Math.sin(bounceAngle)
          const dirZ =
            ballV.z > 0 ? -Math.cos(bounceAngle) : Math.cos(bounceAngle)
          const dirAfter = new Vector3(dirX, 0, dirZ).normalize()
          currentSpeed *= SPEED_INCREMENT
          ballV = dirAfter.scale(currentSpeed)

          const idxMini = Math.floor(Math.random() * allHitSounds.length)
          allHitSounds[idxMini].play()
        }
      }

      // Scores
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

    return () => {
      engine.dispose()
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("keydown", onGlobalKeyDown)
    }
  }, [paddle1Color, paddle2Color, mopStyle])

  return (
    <div className="relative">
      {/* Score */}
      <div className="flex justify-center mb-4 text-lg font-bold text-foreground">
        {score.player1} - {score.player2}
      </div>

      {/* Touches visuelles */}
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

      {/* Gagnant */}
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

      {/* Décompte avant service */}
      {countdown !== null && (
        <div className="absolute inset-0 bg-gray-400/40 flex items-center justify-center z-10">
          <span className="text-foreground text-2xl font-bold">
            {countdown}
          </span>
        </div>
      )}

      {/* Pause */}
      <div className="absolute top-2 right-2 z-20 flex items-center space-x-2">
        <div className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
          Échap
        </div>
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

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}