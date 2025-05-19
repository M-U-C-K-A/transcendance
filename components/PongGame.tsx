"use client"

import { useEffect, useRef, useState } from "react"

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

type PongGameProps = {
  locale: string
}

export function PongGame({ locale }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameOver, setGameOver] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(true)

  const [gameState, setGameState] = useState<GameState>({
    player1: { y: 0, height: 100 },
    player2: { y: 0, height: 100 },
    ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 10 },
    score: { player1: 0, player2: 0 },
    gameWidth: 800,
    gameHeight: 500,
    paddleWidth: 15,
    paddleSpeed: 8,
    ballSpeed: 5,
    isRunning: false,
    winner: null,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const gameWidth = canvas.width
    const gameHeight = canvas.height

    setGameState((prev) => ({
      ...prev,
      player1: { ...prev.player1, y: gameHeight / 2 - prev.player1.height / 2 },
      player2: { ...prev.player2, y: gameHeight / 2 - prev.player2.height / 2 },
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

    return () => clearInterval(countdownInterval)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isRunning) return

      setGameState((prev) => {
        const newState = { ...prev }
        if (e.key === "w" || e.key === "W") {
          newState.player1.y = Math.max(0, newState.player1.y - newState.paddleSpeed)
        } else if (e.key === "s" || e.key === "S") {
          newState.player1.y = Math.min(
            newState.gameHeight - newState.player1.height,
            newState.player1.y + newState.paddleSpeed,
          )
        }

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
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState.isRunning])

  useEffect(() => {
    if (!gameState.isRunning) return

    const gameLoop = setInterval(() => {
      setGameState((prev) => {
        const newState = { ...prev }

        newState.ball.x += newState.ball.dx
        newState.ball.y += newState.ball.dy

        if (newState.ball.y - newState.ball.radius <= 0 || newState.ball.y + newState.ball.radius >= newState.gameHeight) {
          newState.ball.dy = -newState.ball.dy
        }

        if (
          newState.ball.x - newState.ball.radius <= newState.paddleWidth &&
          newState.ball.y >= newState.player1.y &&
          newState.ball.y <= newState.player1.y + newState.player1.height
        ) {
          newState.ball.dx = Math.abs(newState.ball.dx)
          const hitPosition = (newState.ball.y - newState.player1.y) / newState.player1.height
          newState.ball.dy = newState.ballSpeed * (hitPosition - 0.5) * 2
        }

        if (
          newState.ball.x + newState.ball.radius >= newState.gameWidth - newState.paddleWidth &&
          newState.ball.y >= newState.player2.y &&
          newState.ball.y <= newState.player2.y + newState.player2.height
        ) {
          newState.ball.dx = -Math.abs(newState.ball.dx)
          const hitPosition = (newState.ball.y - newState.player2.y) / newState.player2.height
          newState.ball.dy = newState.ballSpeed * (hitPosition - 0.5) * 2
        }

        if (newState.ball.x - newState.ball.radius <= 0) {
          newState.score.player2 += 1
          resetBall(newState)
        } else if (newState.ball.x + newState.ball.radius >= newState.gameWidth) {
          newState.score.player1 += 1
          resetBall(newState)
        }

        if (newState.score.player1 >= 5) {
          newState.isRunning = false
          newState.winner = locale === "fr" ? "Joueur 1" : "Player 1"
          setGameOver(true)
        } else if (newState.score.player2 >= 5) {
          newState.isRunning = false
          newState.winner = locale === "fr" ? "Joueur 2" : "Player 2"
          setGameOver(true)
        }

        return newState
      })
    }, 1000 / 60)

    return () => clearInterval(gameLoop)
  }, [gameState.isRunning, locale])

  const resetBall = (state: GameState) => {
    state.ball.x = state.gameWidth / 2
    state.ball.y = state.gameHeight / 2
    state.ball.dx = state.ballSpeed * (Math.random() > 0.5 ? 1 : -1)
    state.ball.dy = state.ballSpeed * (Math.random() > 0.5 ? 1 : -1)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--background") || "#fff"
    context.fillRect(0, 0, gameState.gameWidth, gameState.gameHeight)

    context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--border") || "#e5e7eb"
    context.setLineDash([10, 10])
    context.beginPath()
    context.moveTo(gameState.gameWidth / 2, 0)
    context.lineTo(gameState.gameWidth / 2, gameState.gameHeight)
    context.stroke()
    context.setLineDash([])

    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--foreground") || "#000"
    context.fillRect(0, gameState.player1.y, gameState.paddleWidth, gameState.player1.height)
    context.fillRect(
      gameState.gameWidth - gameState.paddleWidth,
      gameState.player2.y,
      gameState.paddleWidth,
      gameState.player2.height,
    )

    context.beginPath()
    context.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2)
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary") || "#3b82f6"
    context.fill()
    context.closePath()

    context.font = "32px Arial"
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--foreground") || "#000"
    context.textAlign = "center"
    context.fillText(`${gameState.score.player1} - ${gameState.score.player2}`, gameState.gameWidth / 2, 50)

    if (showCountdown) {
      context.fillStyle = "rgba(0, 0, 0, 0.7)"
      context.fillRect(0, 0, gameState.gameWidth, gameState.gameHeight)
      context.font = "64px Arial"
      context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary") || "#3b82f6"
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillText(countdown.toString(), gameState.gameWidth / 2, gameState.gameHeight / 2)
    }

    if (gameOver) {
      context.fillStyle = "rgba(0, 0, 0, 0.8)"
      context.fillRect(0, 0, gameState.gameWidth, gameState.gameHeight)
      context.font = "48px Arial"
      context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary") || "#3b82f6"
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillText(`${gameState.winner} ${locale === "fr" ? "a gagné !" : "won!"}`, gameState.gameWidth / 2, gameState.gameHeight / 2 - 50)
      context.font = "24px Arial"
      context.fillText(
        `${locale === "fr" ? "Score final" : "Final score"}: ${gameState.score.player1} - ${gameState.score.player2}`,
        gameState.gameWidth / 2,
        gameState.gameHeight / 2 + 20,
      )
    }
  }, [gameState, showCountdown, countdown, gameOver, locale])

  const restartGame = () => {
    setGameOver(false)
    setShowCountdown(true)
    setCountdown(3)
    setGameState((prev) => ({
      ...prev,
      player1: { ...prev.player1, y: prev.gameHeight / 2 - prev.player1.height / 2 },
      player2: { ...prev.player2, y: prev.gameHeight / 2 - prev.player2.height / 2 },
      ball: {
        x: prev.gameWidth / 2,
        y: prev.gameHeight / 2,
        dx: prev.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        dy: prev.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        radius: 10,
      },
      score: { player1: 0, player2: 0 },
      isRunning: false,
      winner: null,
    }))
  }

  return (
    <>
      <div className="flex justify-center mb-4">
        <canvas ref={canvasRef} width={800} height={500} className="border border-border rounded-lg"></canvas>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{locale === "fr" ? "Contrôles Joueur 1:" : "Player 1 Controls:"}</p>
          <p className="text-xs text-muted-foreground">{locale === "fr" ? "W (haut) / S (bas)" : "W (up) / S (down)"}</p>
        </div>
        {gameOver && <button onClick={restartGame} className="btn-primary">{locale === "fr" ? "Rejouer" : "Restart"}</button>}
        <div className="text-right">
          <p className="text-sm text-muted-foreground mb-1">{locale === "fr" ? "Contrôles Joueur 2:" : "Player 2 Controls:"}</p>
<p className="text-xs text-muted-foreground">↑ / ↓</p>
</div>
</div>
</>
)
}
