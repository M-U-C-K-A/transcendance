"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue } from "framer-motion"

export default function PongGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [score, setScore] = useState({ left: 0, right: 0 })
  const [gameActive, setGameActive] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const gameInitialized = useRef(false)

  // Paddle positions
  const leftPaddleY = useMotionValue(0)
  const rightPaddleY = useMotionValue(0)

  // Ball position
  const ballX = useMotionValue(0)
  const ballY = useMotionValue(0)

  // Ball velocity - much slower now
  const [ballVelocity, setBallVelocity] = useState({ x: 1.5, y: 0.8 })

  // Constants
  const PADDLE_HEIGHT = 120 // Increased from 80 to 120
  const PADDLE_WIDTH = 15
  const BALL_SIZE = 20
  const PADDLE_OFFSET = 20
  const LEFT_PADDLE_SPEED = 0.03 // Left paddle speed
  const RIGHT_PADDLE_SPEED = 0.02 // Right paddle speed (slower)

  // Initialize game dimensions and start game
  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setContainerSize({ width, height })

        // Reset positions
        const centerY = height / 2 - PADDLE_HEIGHT / 2
        leftPaddleY.set(centerY)
        rightPaddleY.set(centerY)
        ballX.set(width / 2 - BALL_SIZE / 2)
        ballY.set(height / 2 - BALL_SIZE / 2)

        // Start game if not already started
        if (!gameInitialized.current) {
          gameInitialized.current = true
          // Start with a short delay to ensure everything is rendered
          setTimeout(() => {
            setGameActive(true)
            setBallVelocity({ x: 1.5, y: 0.8 }) // Initial direction
          }, 500)
        }
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    return () => window.removeEventListener("resize", updateSize)
  }, [leftPaddleY, rightPaddleY, ballX, ballY])

  // Reset ball to center with a given direction
  const resetBall = (direction: number) => {
    // Cancel any existing animation frame
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
      gameLoopRef.current = null
    }

    // Pause the game briefly
    setGameActive(false)

    // Reset to center
    ballX.set(containerSize.width / 2 - BALL_SIZE / 2)
    ballY.set(containerSize.height / 2 - BALL_SIZE / 2)

    // Set a consistent, predictable starting velocity with slight randomness
    setBallVelocity({
      x: 1.5 * direction,
      y: Math.random() * 1.7 - 0.8, // More random vertical movement
    })

    // Resume after a delay
    setTimeout(() => {
      setGameActive(true)
    }, 1000)
  }

  // Game loop
  useEffect(() => {
    if (!containerRef.current || !gameActive) return

    const updateGame = () => {
      // Get current positions
      const x = ballX.get()
      const y = ballY.get()
      const leftY = leftPaddleY.get()
      const rightY = rightPaddleY.get()

      // Update ball position
      const newX = x + ballVelocity.x
      const newY = y + ballVelocity.y

      // AI for left paddle - follows ball with some prediction
      const leftTargetY = y + ballVelocity.y * 8 - PADDLE_HEIGHT / 2 + BALL_SIZE / 2
      const leftDiff = leftTargetY - leftY
      // Add small random movement to make it less perfect
      const leftRandomness = Math.sin(Date.now() / 1000) * 5
      const newLeftY = leftY + leftDiff * LEFT_PADDLE_SPEED + leftRandomness * 0.01
      leftPaddleY.set(Math.max(0, Math.min(containerSize.height - PADDLE_HEIGHT, newLeftY)))

      // AI for right paddle - simpler following with delay and different behavior
      // Right paddle aims for where the ball will be, but with less prediction
      const rightTargetY = y + ballVelocity.y * 4 - PADDLE_HEIGHT / 2 + BALL_SIZE / 2
      const rightDiff = rightTargetY - rightY
      // Add different random movement pattern
      const rightRandomness = Math.cos(Date.now() / 1200) * 3
      const newRightY = rightY + rightDiff * RIGHT_PADDLE_SPEED + rightRandomness * 0.01
      rightPaddleY.set(Math.max(0, Math.min(containerSize.height - PADDLE_HEIGHT, newRightY)))

      // Wall collisions (top and bottom) - simple reflection
      if (newY <= 0) {
        // Hit top wall
        ballY.set(0)
        setBallVelocity((prev) => ({ ...prev, y: Math.abs(prev.y) }))
      } else if (newY + BALL_SIZE >= containerSize.height) {
        // Hit bottom wall
        ballY.set(containerSize.height - BALL_SIZE)
        setBallVelocity((prev) => ({ ...prev, y: -Math.abs(prev.y) }))
      } else {
        // No wall collision, update Y position
        ballY.set(newY)
      }

      // Check for scoring (ball out of bounds on x-axis)
      if (newX < 0) {
        // Right player scores
        setScore((prev) => ({ ...prev, right: prev.right + 1 }))
        resetBall(1)
        return // Exit the game loop, will restart after reset
      } else if (newX + BALL_SIZE > containerSize.width) {
        // Left player scores
        setScore((prev) => ({ ...prev, left: prev.left + 1 }))
        resetBall(-1)
        return // Exit the game loop, will restart after reset
      }

      // Check for paddle collisions
      let paddleHit = false

      // Left paddle collision
      if (
        ballVelocity.x < 0 && // Only check when ball is moving left
        newX <= PADDLE_OFFSET + PADDLE_WIDTH &&
        newX >= PADDLE_OFFSET - BALL_SIZE &&
        y + BALL_SIZE > leftY &&
        y < leftY + PADDLE_HEIGHT
      ) {
        // Calculate bounce angle based on where the ball hits the paddle
        const hitPosition = (y + BALL_SIZE / 2 - leftY) / PADDLE_HEIGHT
        const bounceAngle = (hitPosition - 0.5) * 1.5 // Angle factor

        setBallVelocity({
          x: Math.abs(ballVelocity.x), // Always move right after hitting left paddle
          y: bounceAngle * 2, // Scaled bounce effect
        })

        // Set ball position to right edge of paddle to prevent sticking
        ballX.set(PADDLE_OFFSET + PADDLE_WIDTH)
        paddleHit = true
      }
      // Right paddle collision
      else if (
        ballVelocity.x > 0 && // Only check when ball is moving right
        newX + BALL_SIZE >= containerSize.width - PADDLE_OFFSET - PADDLE_WIDTH &&
        newX + BALL_SIZE <= containerSize.width - PADDLE_OFFSET + BALL_SIZE &&
        y + BALL_SIZE > rightY &&
        y < rightY + PADDLE_HEIGHT
      ) {
        // Calculate bounce angle based on where the ball hits the paddle
        const hitPosition = (y + BALL_SIZE / 2 - rightY) / PADDLE_HEIGHT
        const bounceAngle = (hitPosition - 0.5) * 1.5 // Angle factor

        setBallVelocity({
          x: -Math.abs(ballVelocity.x), // Always move left after hitting right paddle
          y: bounceAngle * 2, // Scaled bounce effect
        })

        // Set ball position to left edge of paddle to prevent sticking
        ballX.set(containerSize.width - PADDLE_OFFSET - PADDLE_WIDTH - BALL_SIZE)
        paddleHit = true
      }

      // If no paddle hit, update X position
      if (!paddleHit) {
        ballX.set(newX)
      }

      // Continue game loop
      gameLoopRef.current = requestAnimationFrame(updateGame)
    }

    // Start the game loop
    gameLoopRef.current = requestAnimationFrame(updateGame)

    // Cleanup
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [ballX, ballY, leftPaddleY, rightPaddleY, ballVelocity, containerSize, gameActive])

  return (
    <div ref={containerRef} className="relative w-full h-full bg-foreground/10 rounded-lg shadow-xl overflow-hidden">
      {/* Score display */}
      <div className="absolute top-4 left-0 right-0 flex justify-center text-white text-2xl font-sans">
        <span className="mx-2">{score.left.toString().padStart(2, "0")}</span>
        <span className="mx-2 opacity-50">|</span>
        <span className="mx-2">{score.right.toString().padStart(2, "0")}</span>
      </div>

      {/* Center line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l border-dashed border-pink-500/30 -translate-x-1/2"></div>

      {/* Hello and dribbble text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-white text-3xl font-bold mb-4">Hello!</h2>
        <motion.div
          className="text-pink-500 text-4xl font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          Budy
        </motion.div>
      </div>

      {/* Left paddle */}
      <motion.div
        className="absolute left-[20px] w-[15px] bg-pink-500 rounded"
        style={{
          y: leftPaddleY,
          height: PADDLE_HEIGHT,
        }}
      />

      {/* Right paddle */}
      <motion.div
        className="absolute right-[20px] w-[15px] bg-pink-500 rounded"
        style={{
          y: rightPaddleY,
          height: PADDLE_HEIGHT,
        }}
      />

      {/* Ball */}
      <motion.div
        className="absolute bg-pink-500 rounded-full"
        style={{
          x: ballX,
          y: ballY,
          width: BALL_SIZE,
          height: BALL_SIZE,
        }}
      />
    </div>
  )
}
