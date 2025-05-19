"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, RefreshCw } from 'lucide-react'

// Composant pour les bulles colorées avec durée prolongée
const ColorBubble = ({ delay = 0 }) => {
  const colors = [
    "rgba(255, 87, 87, 0.5)", // Rouge
    "rgba(87, 87, 255, 0.5)", // Bleu
    "rgba(87, 255, 87, 0.5)", // Vert
    "rgba(255, 255, 87, 0.5)", // Jaune
    "rgba(255, 87, 255, 0.5)", // Rose
    "rgba(87, 255, 255, 0.5)", // Cyan
  ]

  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const size = Math.random() * 150 + 80
  const initialX = Math.random() * 100
  const initialY = Math.random() * 100

  return (
    <motion.div
      className="absolute rounded-full mix-blend-screen filter blur-xl pointer-events-none"
      style={{
        background: `radial-gradient(circle at center, ${randomColor} 0%, rgba(0,0,0,0) 70%)`,
        width: size,
        height: size,
        left: `${initialX}vw`,
        top: `${initialY}vh`,
        opacity: 0,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        scale: [0, 1, 1.2, 1.5],
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50],
      }}
      transition={{
        duration: Math.random() * 15 + 20, // Durée beaucoup plus longue
        delay: delay,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      }}
    />
  )
}

// Composant pour les particules de traînée
const TrailParticle = ({ x, y }) => {
  const colors = ["#ff5757", "#5757ff", "#57ff57", "#ffff57", "#ff57ff", "#57ffff"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const size = Math.random() * 6 + 2

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        backgroundColor: randomColor,
        width: size,
        height: size,
        left: x,
        top: y,
        opacity: 0.8,
      }}
      initial={{ opacity: 0.8, scale: 1 }}
      animate={{
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
    />
  )
}

// Composant pour les étincelles
const Sparkle = ({ delay = 0 }) => {
  const size = Math.random() * 4 + 1
  const x = Math.random() * 100
  const y = Math.random() * 100
  
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        left: `${x}vw`,
        top: `${y}vh`,
        boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.8)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: Math.random() * 1 + 0.5,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 5 + 1,
      }}
    />
  )
}

// Composant pour les étoiles scintillantes
const Star = ({ x, y, size = 2, delay = 0 }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0.2 }}
      animate={{
        opacity: [0.2, 1, 0.2],
        boxShadow: [
          "0 0 2px 0 rgba(255,255,255,0.3)",
          "0 0 8px 2px rgba(255,255,255,0.8)",
          "0 0 2px 0 rgba(255,255,255,0.3)",
        ],
      }}
      transition={{
        duration: Math.random() * 2 + 1,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      <div className="w-full h-full bg-white rounded-full" />
    </motion.div>
  )
}

// Composant pour les lignes du quadrillage
const GridLine = ({ isVertical = false, index = 0 }) => {
  const pulseDelay = index * 0.1
  
  return (
    <motion.div
      className={`${isVertical ? "border-r" : "border-b"} border-white h-full w-full`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.1, 0.2, 0.1],
        boxShadow: [
          isVertical 
            ? "1px 0 2px rgba(255,255,255,0.1)" 
            : "0 1px 2px rgba(255,255,255,0.1)",
          isVertical 
            ? "1px 0 5px rgba(255,255,255,0.3)" 
            : "0 1px 5px rgba(255,255,255,0.3)",
          isVertical 
            ? "1px 0 2px rgba(255,255,255,0.1)" 
            : "0 1px 2px rgba(255,255,255,0.1)",
        ],
      }}
      transition={{
        duration: 4,
        delay: pulseDelay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  )
}

export default function NotFound() {
  const router = useRouter()
  const ballControls = useAnimation()
  const [windowWidth, setWindowWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 })
  const [trails, setTrails] = useState([])
  const trailTimeoutRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [stars, setStars] = useState([])

  // Générer des bulles colorées avec durée prolongée
  const bubbles = Array.from({ length: 20 }).map((_, i) => <ColorBubble key={i} delay={i * 1.5} />)
  
  // Générer des étincelles
  const sparkles = Array.from({ length: 30 }).map((_, i) => <Sparkle key={i} delay={i * 0.2} />)

  useEffect(() => {
    // Set window dimensions for responsive animations
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)

    // Generate stars
    const newStars = []
    for (let i = 0; i < 50; i++) {
      newStars.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
      })
    }
    setStars(newStars)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Start the infinite ball animation
    const animateBall = async () => {
      while (true) {
        // Random vertical position for each cycle
        const randomY = Math.random() * 60 - 30

        // Animate from left to right
        await ballControls.start({
          x: "calc(100vw - 100px)",
          y: randomY,
          transition: {
            duration: 2.5,
            ease: "easeInOut",
          },
        })

        // Update ball position for trail effect
        const ballElement = document.querySelector(".ball")
        if (ballElement) {
          const rect = ballElement.getBoundingClientRect()
          setBallPosition({ x: rect.left, y: rect.top })
        }

        // Animate from right to left
        await ballControls.start({
          x: "0px",
          y: -randomY,
          transition: {
            duration: 2.5,
            ease: "easeInOut",
          },
        })

        // Update ball position again
        if (ballElement) {
          const rect = ballElement.getBoundingClientRect()
          setBallPosition({ x: rect.left, y: rect.top })
        }
      }
    }

    animateBall()

    // Trail effect
    const createTrail = () => {
      const ballElement = document.querySelector(".ball")
      if (ballElement) {
        const rect = ballElement.getBoundingClientRect()
        const newTrail = {
          id: Date.now(),
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        }

        setTrails((prev) => [...prev.slice(-20), newTrail]) // Keep only last 20 particles
      }

      trailTimeoutRef.current = setTimeout(createTrail, 100)
    }

    createTrail()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (trailTimeoutRef.current) {
        clearTimeout(trailTimeoutRef.current)
      }
    }
  }, [ballControls])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Colored bubbles background with longer duration */}
      {bubbles}
      
      {/* Sparkles effect */}
      {sparkles}
      
      {/* Stars */}
      {stars.map((star) => (
        <Star 
          key={star.id} 
          x={star.x} 
          y={star.y} 
          size={star.size} 
          delay={star.delay} 
        />
      ))}

      {/* Enhanced background grid lines */}
      <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <GridLine key={i} isVertical={true} index={i} />
        ))}
      </div>
      <div className="absolute inset-0 grid grid-rows-12 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <GridLine key={i} isVertical={false} index={i} />
        ))}
      </div>

      {/* Center divider line with enhanced animation */}
      <div className="absolute h-full w-0.5 left-1/2 transform -translate-x-1/2 flex flex-col justify-between">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-4 bg-white"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              boxShadow: [
                "0 0 2px rgba(255,255,255,0.3)",
                "0 0 8px rgba(255,255,255,0.8)",
                "0 0 2px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      {/* Left paddle with enhanced glow effect */}
      <motion.div
        className="absolute left-10 w-5 h-40 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm shadow-glow-blue"
        initial={{ y: -160 }}
        animate={{
          y: [-160, 160, -160],
          boxShadow: [
            "0 0 10px 2px rgba(59, 130, 246, 0.5)",
            "0 0 20px 5px rgba(59, 130, 246, 0.7)",
            "0 0 10px 2px rgba(59, 130, 246, 0.5)",
          ],
        }}
        transition={{
          y: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 5,
            ease: "easeInOut",
          },
          boxShadow: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          },
        }}
      />

      {/* Right paddle with enhanced glow effect */}
      <motion.div
        className="absolute right-10 w-5 h-40 bg-gradient-to-r from-pink-500 to-red-500 rounded-sm shadow-glow-pink"
        initial={{ y: 160 }}
        animate={{
          y: [160, -160, 160],
          boxShadow: [
            "0 0 10px 2px rgba(236, 72, 153, 0.5)",
            "0 0 20px 5px rgba(236, 72, 153, 0.7)",
            "0 0 10px 2px rgba(236, 72, 153, 0.5)",
          ],
        }}
        transition={{
          y: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 5,
            ease: "easeInOut",
          },
          boxShadow: {
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
            delay: 1,
          },
        }}
      />

      {/* Trail particles */}
      <AnimatePresence>
        {trails.map((trail) => (
          <TrailParticle key={trail.id} x={trail.x} y={trail.y} />
        ))}
      </AnimatePresence>

      {/* Animated ball with enhanced glow */}
      <motion.div
        className="absolute left-10 top-1/2 w-4 h-4 bg-white rounded-full ball"
        style={{
          background: "radial-gradient(circle at 30% 30%, #ffffff, #f0f0f0)",
          boxShadow: "0 0 20px 8px rgba(255, 255, 255, 0.8)",
        }}
        animate={ballControls}
        whileHover={{ scale: 1.5 }}
      />

      {/* 404 Text with enhanced animations */}
      <div className="z-10 text-center px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative"
        >
          <h1 className="text-[120px] md:text-[200px] font-bold leading-none tracking-tighter relative z-10">
            <motion.span
              className="inline-block"
              animate={{
                color: ["#ffffff", "#ff5757", "#ffffff"],
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(255,87,87,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
              }}
            >
              4
            </motion.span>
            <motion.span
              className="inline-block"
              animate={{
                rotate: [0, 5, 0, -5, 0],
                color: ["#ffffff", "#5757ff", "#ffffff"],
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(87,87,255,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{
                rotate: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                },
                color: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  delay: 1,
                },
                textShadow: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  delay: 1,
                },
              }}
            >
              0
            </motion.span>
            <motion.span
              className="inline-block"
              animate={{
                color: ["#ffffff", "#57ff57", "#ffffff"],
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(87,255,87,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                delay: 2,
              }}
            >
              4
            </motion.span>
          </h1>

          {/* Enhanced circular glow behind 404 */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl z-0"
            style={{
              width: "400px",
              height: "400px",
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 70%)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          
          {/* Sparkle effects around 404 */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const radius = 150
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            
            return (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                style={{
                  x: x,
                  y: y,
                  boxShadow: "0 0 10px 2px rgba(255,255,255,0.8)",
                }}
                animate={{
                  scale: [1, 1.5, 0],
                  opacity: [0.8, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.25,
                  repeatDelay: 1,
                }}
              />
            )
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl md:text-2xl mb-8 font-light"
        >
          <motion.span
            animate={{
              color: ["#ffffff", "#ffff57", "#ffffff"],
              textShadow: [
                "0 0 5px rgba(255,255,255,0.3)",
                "0 0 15px rgba(255,255,87,0.7)",
                "0 0 5px rgba(255,255,255,0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            GAME OVER
          </motion.span>{" "}
          - Cette page est hors limites
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="group px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
              animate={{ opacity: isHovering ? 0.2 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <Home size={18} className="group-hover:scale-110 transition-transform relative z-10" />
            <span className="relative z-10">Accueil</span>
            
            {/* Button sparkle effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              animate={{ 
                background: [
                  "radial-gradient(circle at 50% -20%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 60%)",
                  "radial-gradient(circle at 50% 120%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 60%)",
                ]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse"
              }}
            />
          </Link>

          <button
            onClick={() => router.back()}
            className="group px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 opacity-0"
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
            <ArrowLeft size={18} className="group-hover:translate-x-[-3px] transition-transform relative z-10" />
            <span className="relative z-10">Retour</span>
            
            {/* Button sparkle effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              animate={{ 
                background: [
                  "radial-gradient(circle at 30% -20%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 60%)",
                  "radial-gradient(circle at 70% 120%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 60%)",
                ]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 0.5
              }}
            />
          </button>

          <button
            onClick={() => window.location.reload()}
            className="group px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 opacity-0"
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="relative z-10"
            >
              <RefreshCw size={18} />
            </motion.div>
            <span className="relative z-10">Rejouer</span>
            
            {/* Button sparkle effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              animate={{ 
                background: [
                  "radial-gradient(circle at 70% -20%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 60%)",
                  "radial-gradient(circle at 30% 120%, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0) 60%)",
                ]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1
              }}
            />
          </button>
        </motion.div>
      </div>

      {/* Score display with enhanced animation */}
      <div className="absolute top-8 left-0 right-0 flex justify-center gap-20 text-2xl md:text-4xl font-mono">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            color: ["#ff5757", "#ffffff", "#ff5757"],
            textShadow: [
              "0 0 5px rgba(255,87,87,0.5)", 
              "0 0 15px rgba(255,87,87,0.8)", 
              "0 0 5px rgba(255,87,87,0.5)"
            ],
          }}
          transition={{
            opacity: { delay: 0.9, duration: 0.5 },
            color: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
            textShadow: { repeat: Number.POSITIVE_INFINITY, duration: 3 },
          }}
        >
          4
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            color: ["#5757ff", "#ffffff", "#5757ff"],
            textShadow: [
              "0 0 5px rgba(87,87,255,0.5)", 
              "0 0 15px rgba(87,87,255,0.8)", 
              "0 0 5px rgba(87,87,255,0.5)"
            ],
          }}
          transition={{
            opacity: { delay: 0.9, duration: 1.2 },
            color: { repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 1 },
            textShadow: { repeat: Number.POSITIVE_INFINITY, duration: 3, delay: 1 },
          }}
        >
          0
        </motion.div>
      </div>

      {/* Enhanced floating particles with glowing effect */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            boxShadow: "0 0 5px 1px rgba(255,255,255,0.5)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.7, 0.3, 0.7],
            boxShadow: [
              "0 0 3px 1px rgba(255,255,255,0.3)",
              "0 0 8px 2px rgba(255,255,255,0.7)",
              "0 0 3px 1px rgba(255,255,255,0.3)",
            ],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Retro scanlines effect with animation */}
      <motion.div 
        className="absolute inset-0 pointer-events-none bg-scanlines"
        animate={{
          opacity: [0.03, 0.06, 0.03]
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse"
        }}
      />
    </div>
  )
}
