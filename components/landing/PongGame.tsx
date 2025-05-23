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

  const leftPaddleY = useMotionValue(0)
  const rightPaddleY = useMotionValue(0)

  const ballX = useMotionValue(0)
  const ballY = useMotionValue(0)

  const [ballVelocity, setBallVelocity] = useState({ x: 1.5, y: 0.8 })

  const PADDLE_HEIGHT = 120
  const PADDLE_WIDTH = 15
  const BALL_SIZE = 20
  const PADDLE_OFFSET = 20
  const LEFT_PADDLE_SPEED = 0.03
  const RIGHT_PADDLE_SPEED = 0.02

  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setContainerSize({ width, height })

        const centerY = height / 2 - PADDLE_HEIGHT / 2
        leftPaddleY.set(centerY)
        rightPaddleY.set(centerY)
        ballX.set(width / 2 - BALL_SIZE / 2)
        ballY.set(height / 2 - BALL_SIZE / 2)

        if (!gameInitialized.current) {
          gameInitialized.current = true
          setTimeout(() => {
            setGameActive(true)
            setBallVelocity({ x: 1.5, y: 0.8 })
          }, 500)
        }
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    return () => window.removeEventListener("resize", updateSize)
  }, [leftPaddleY, rightPaddleY, ballX, ballY])

  const resetBall = (direction: number) => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
      gameLoopRef.current = null
    }

    setGameActive(false)

    ballX.set(containerSize.width / 2 - BALL_SIZE / 2)
    ballY.set(containerSize.height / 2 - BALL_SIZE / 2)

    setBallVelocity({
      x: 1.5 * direction,
      y: Math.random() * 1.7 - 0.8,
    })

    setTimeout(() => {
      setGameActive(true)
    }, 1000)
  }

  useEffect(() => {
    if (!containerRef.current || !gameActive) return

    const updateGame = () => {
      const x = ballX.get()
      const y = ballY.get()
      const leftY = leftPaddleY.get()
      const rightY = rightPaddleY.get()

      const newX = x + ballVelocity.x
      const newY = y + ballVelocity.y

      const leftTargetY = y + ballVelocity.y * 8 - PADDLE_HEIGHT / 2 + BALL_SIZE / 2
      const leftDiff = leftTargetY - leftY
      const leftRandomness = Math.sin(Date.now() / 1000) * 5
      const newLeftY = leftY + leftDiff * LEFT_PADDLE_SPEED + leftRandomness * 0.01
      leftPaddleY.set(Math.max(0, Math.min(containerSize.height - PADDLE_HEIGHT, newLeftY)))

      const rightTargetY = y + ballVelocity.y * 4 - PADDLE_HEIGHT / 2 + BALL_SIZE / 2
      const rightDiff = rightTargetY - rightY
      const rightRandomness = Math.cos(Date.now() / 1200) * 3
      const newRightY = rightY + rightDiff * RIGHT_PADDLE_SPEED + rightRandomness * 0.01
      rightPaddleY.set(Math.max(0, Math.min(containerSize.height - PADDLE_HEIGHT, newRightY)))

      if (newY <= 0) {
        ballY.set(0)
        setBallVelocity((prev) => ({ ...prev, y: Math.abs(prev.y) }))
      } else if (newY + BALL_SIZE >= containerSize.height) {
        ballY.set(containerSize.height - BALL_SIZE)
        setBallVelocity((prev) => ({ ...prev, y: -Math.abs(prev.y) }))
      } else {
        ballY.set(newY)
      }

      if (newX < 0) {
        setScore((prev) => ({ ...prev, right: prev.right + 1 }))
        resetBall(1)
        return
      } else if (newX + BALL_SIZE > containerSize.width) {
        setScore((prev) => ({ ...prev, left: prev.left + 1 }))
        resetBall(-1)
        return
      }

      let paddleHit = false

      if (
        ballVelocity.x < 0 &&
        newX <= PADDLE_OFFSET + PADDLE_WIDTH &&
        newX >= PADDLE_OFFSET - BALL_SIZE &&
        y + BALL_SIZE > leftY &&
        y < leftY + PADDLE_HEIGHT
      ) {
        const hitPosition = (y + BALL_SIZE / 2 - leftY) / PADDLE_HEIGHT
        const bounceAngle = (hitPosition - 0.5) * 1.5

        setBallVelocity({
          x: Math.abs(ballVelocity.x)
          y: bounceAngle * 2
        })
        ballX.set(PADDLE_OFFSET + PADDLE_WIDTH)
        paddleHit = true
      }
      else if (
        ballVelocity.x > 0 &&
        newX + BALL_SIZE >= containerSize.width - PADDLE_OFFSET - PADDLE_WIDTH &&
        newX + BALL_SIZE <= containerSize.width - PADDLE_OFFSET + BALL_SIZE &&
        y + BALL_SIZE > rightY &&
        y < rightY + PADDLE_HEIGHT
      ) {
        const hitPosition = (y + BALL_SIZE / 2 - rightY) / PADDLE_HEIGHT
        const bounceAngle = (hitPosition - 0.5) * 1.5

        setBallVelocity({
          x: -Math.abs(ballVelocity.x)
          y: bounceAngle * 2
        })

        ballX.set(containerSize.width - PADDLE_OFFSET - PADDLE_WIDTH - BALL_SIZE)
        paddleHit = true
      }

      if (!paddleHit) {
        ballX.set(newX)
      }

      gameLoopRef.current = requestAnimationFrame(updateGame)
    }

    gameLoopRef.current = requestAnimationFrame(updateGame)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
    }
  }, [ballX, ballY, leftPaddleY, rightPaddleY, ballVelocity, containerSize, gameActive])

  return (
    <div ref={containerRef} className="relative w-full h-full bg-background/60 rounded-lg shadow-xl overflow-hidden z-20">
      <div className="absolute top-4 left-0 right-0 flex justify-center text-white text-2xl font-sans">
        <span className="mx-2">{score.left.toString().padStart(2, "0")}</span>
        <span className="mx-2 opacity-50">|</span>
        <span className="mx-2">{score.right.toString().padStart(2, "0")}</span>
      </div>

      {/* Center line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l border-dashed border-pink-500/30 -translate-x-1/2"></div>

      {/* Hello and dribbble text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-white text-3xl font-bold mb-4 z-50">Hello!</h2>
        <motion.div
          className="text-pink-500 text-4xl font-bold z-50"
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
