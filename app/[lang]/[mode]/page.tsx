"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatComponent } from "@/components/chat"
import { ArrowLeft, Trophy, Activity } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Types pour le jeu Pong
type PaddleState = {
  y: number
  height: number
}

type BallState = {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

type GameState = {
  player1: PaddleState
  player2: PaddleState
  ball: BallState
  score: {
    player1: number
    player2: number
  }
  gameWidth: number
  gameHeight: number
  paddleWidth: number
  paddleSpeed: number
  ballSpeed: number
  isRunning: boolean
  winner: string | null
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const mode = params.mode as string
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(true)

  // État initial du jeu
  const [gameState, setGameState] = useState<GameState>({
    player1: {
      y: 0,
      height: 100,
    },
    player2: {
      y: 0,
      height: 100,
    },
    ball: {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      radius: 10,
    },
    score: {
      player1: 0,
      player2: 0,
    },
    gameWidth: 800,
    gameHeight: 500,
    paddleWidth: 15,
    paddleSpeed: 8,
    ballSpeed: 5,
    isRunning: false,
    winner: null,
  })

  // Initialisation du jeu
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const gameWidth = canvas.width
    const gameHeight = canvas.height

    // Initialiser l'état du jeu
    setGameState((prev) => ({
      ...prev,
      player1: {
        ...prev.player1,
        y: gameHeight / 2 - prev.player1.height / 2,
      },
      player2: {
        ...prev.player2,
        y: gameHeight / 2 - prev.player2.height / 2,
      },
      ball: {
        x: gameWidth / 2,
        y: gameHeight / 2,
        dx: prev.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        dy: prev.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        radius: 10,
      },
      gameWidth,
      gameHeight,
    }))

    // Compte à rebours avant de commencer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          setShowCountdown(false)
          setGameState((prev) => ({ ...prev, isRunning: true }))
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdownInterval)
    }
  }, [])

  // Contrôles du joueur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isRunning) return

      setGameState((prev) => {
        const newState = { ...prev }

        // Contrôles joueur 1 (W/S)
        if (e.key === "w" || e.key === "W") {
          newState.player1.y = Math.max(0, newState.player1.y - newState.paddleSpeed)
        } else if (e.key === "s" || e.key === "S") {
          newState.player1.y = Math.min(
            newState.gameHeight - newState.player1.height,
            newState.player1.y + newState.paddleSpeed,
          )
        }

        // Contrôles joueur 2 (flèches haut/bas)
        if (e.key === "ArrowUp") {
          newState.player2.y = Math.max(0, newState.player2.y - newState.paddleSpeed)
        } else if (e.key === "ArrowDown") {
          newState.player2.y = Math.min(
            newState.gameHeight - newState.player2.height,
            newState.player2.y + newState.paddleSpeed,
          )
        }

        return newState
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gameState.isRunning])

  // Boucle de jeu principale
  useEffect(() => {
    if (!gameState.isRunning) return

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        const newState = { ...prev }

        // Mise à jour de la position de la balle
        newState.ball.x += newState.ball.dx
        newState.ball.y += newState.ball.dy

        // Collision avec les murs (haut/bas)
        if (
          newState.ball.y - newState.ball.radius <= 0 ||
          newState.ball.y + newState.ball.radius >= newState.gameHeight
        ) {
          newState.ball.dy = -newState.ball.dy
        }

        // Collision avec les raquettes
        // Raquette gauche (joueur 1)
        if (
          newState.ball.x - newState.ball.radius <= newState.paddleWidth &&
          newState.ball.y >= newState.player1.y &&
          newState.ball.y <= newState.player1.y + newState.player1.height
        ) {
          newState.ball.dx = Math.abs(newState.ball.dx)
          // Ajuster l'angle en fonction de l'endroit où la balle frappe la raquette
          const hitPosition = (newState.ball.y - newState.player1.y) / newState.player1.height
          newState.ball.dy = newState.ballSpeed * (hitPosition - 0.5) * 2
        }

        // Raquette droite (joueur 2)
        if (
          newState.ball.x + newState.ball.radius >= newState.gameWidth - newState.paddleWidth &&
          newState.ball.y >= newState.player2.y &&
          newState.ball.y <= newState.player2.y + newState.player2.height
        ) {
          newState.ball.dx = -Math.abs(newState.ball.dx)
          // Ajuster l'angle en fonction de l'endroit où la balle frappe la raquette
          const hitPosition = (newState.ball.y - newState.player2.y) / newState.player2.height
          newState.ball.dy = newState.ballSpeed * (hitPosition - 0.5) * 2
        }

        // Marquer des points
        if (newState.ball.x - newState.ball.radius <= 0) {
          // Joueur 2 marque
          newState.score.player2 += 1
          resetBall(newState)
        } else if (newState.ball.x + newState.ball.radius >= newState.gameWidth) {
          // Joueur 1 marque
          newState.score.player1 += 1
          resetBall(newState)
        }

        // Vérifier si la partie est terminée
        if (newState.score.player1 >= 5) {
          newState.isRunning = false
          newState.winner = "Joueur 1"
          setGameOver(true)
        } else if (newState.score.player2 >= 5) {
          newState.isRunning = false
          newState.winner = "Joueur 2"
          setGameOver(true)
        }

        return newState
      })
    }, 1000 / 60) // 60 FPS

    return () => {
      clearInterval(gameLoop)
    }
  }, [gameState.isRunning])

  // Fonction pour réinitialiser la balle après un point
  const resetBall = (state: GameState) => {
    state.ball.x = state.gameWidth / 2
    state.ball.y = state.gameHeight / 2
    state.ball.dx = state.ballSpeed * (Math.random() > 0.5 ? 1 : -1)
    state.ball.dy = state.ballSpeed * (Math.random() > 0.5 ? 1 : -1)
  }

  // Rendu du jeu
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Effacer le canvas
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--background") || "#fff"
    context.fillRect(0, 0, gameState.gameWidth, gameState.gameHeight)

    // Dessiner la ligne centrale
    context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--border") || "#e5e7eb"
    context.setLineDash([10, 10])
    context.beginPath()
    context.moveTo(gameState.gameWidth / 2, 0)
    context.lineTo(gameState.gameWidth / 2, gameState.gameHeight)
    context.stroke()
    context.setLineDash([])

    // Dessiner les raquettes
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--foreground") || "#000"
    // Raquette gauche (joueur 1)
    context.fillRect(0, gameState.player1.y, gameState.paddleWidth, gameState.player1.height)
    // Raquette droite (joueur 2)
    context.fillRect(
      gameState.gameWidth - gameState.paddleWidth,
      gameState.player2.y,
      gameState.paddleWidth,
      gameState.player2.height,
    )

    // Dessiner la balle
    context.beginPath()
    context.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2)
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary") || "#3b82f6"
    context.fill()
    context.closePath()

    // Afficher le score
    context.font = "32px Arial"
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--foreground") || "#000"
    context.textAlign = "center"
    context.fillText(`${gameState.score.player1} - ${gameState.score.player2}`, gameState.gameWidth / 2, 50)

    // Afficher le compte à rebours
    if (showCountdown) {
      context.fillStyle = "rgba(0, 0, 0, 0.7)"
      context.fillRect(0, 0, gameState.gameWidth, gameState.gameHeight)
      context.font = "64px Arial"
      context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary") || "#3b82f6"
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillText(countdown.toString(), gameState.gameWidth / 2, gameState.gameHeight / 2)
    }

    // Afficher l'écran de fin de partie
    if (gameOver) {
      context.fillStyle = "rgba(0, 0, 0, 0.8)"
      context.fillRect(0, 0, gameState.gameWidth, gameState.gameHeight)
      context.font = "48px Arial"
      context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary") || "#3b82f6"
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillText(`${gameState.winner} a gagné !`, gameState.gameWidth / 2, gameState.gameHeight / 2 - 50)
      context.font = "24px Arial"
      context.fillText(
        `Score final: ${gameState.score.player1} - ${gameState.score.player2}`,
        gameState.gameWidth / 2,
        gameState.gameHeight / 2 + 20,
      )
    }
  }, [gameState, showCountdown, countdown, gameOver])

  // Fonction pour recommencer la partie
  const restartGame = () => {
    setGameOver(false)
    setShowCountdown(true)
    setCountdown(3)
    setGameState((prev) => ({
      ...prev,
      player1: {
        ...prev.player1,
        y: prev.gameHeight / 2 - prev.player1.height / 2,
      },
      player2: {
        ...prev.player2,
        y: prev.gameHeight / 2 - prev.player2.height / 2,
      },
      ball: {
        x: prev.gameWidth / 2,
        y: prev.gameHeight / 2,
        dx: prev.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        dy: prev.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        radius: 10,
      },
      score: {
        player1: 0,
        player2: 0,
      },
      isRunning: false,
      winner: null,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">PongMaster</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {mode === "quickmatch" ? "Partie Rapide" : mode === "custom" ? "Partie Personnalisée" : "Tournoi"}
            </h1>
            {mode === "tournament" && <Trophy className="h-5 w-5 text-yellow-400" />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <Card className="bg-card border shadow-sm p-4">
              <div className="flex justify-center mb-4">
                <canvas ref={canvasRef} width={800} height={500} className="border border-border rounded-lg"></canvas>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contrôles Joueur 1:</p>
                  <p className="text-xs text-muted-foreground">W (haut) / S (bas)</p>
                </div>
                {gameOver && <Button onClick={restartGame}>Rejouer</Button>}
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Contrôles Joueur 2:</p>
                  <p className="text-xs text-muted-foreground">↑ (haut) / ↓ (bas)</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-card border shadow-sm mb-6">
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mode de jeu</p>
                    <p className="font-medium">
                      {mode === "quickmatch" ? "Partie Rapide" : mode === "custom" ? "Partie Personnalisée" : "Tournoi"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Règles</p>
                    <p className="text-sm">Premier à 5 points</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Joueurs</p>
                    <div className="flex justify-between mt-2">
                      <div className="text-center">
                        <div className="bg-blue-500 w-4 h-4 rounded-full mx-auto mb-1"></div>
                        <p className="text-sm font-medium">Joueur 1</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-red-500 w-4 h-4 rounded-full mx-auto mb-1"></div>
                        <p className="text-sm font-medium">Joueur 2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-sm h-[400px]">
              <CardHeader>
                <CardTitle>Chat de partie</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                <ChatComponent />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
