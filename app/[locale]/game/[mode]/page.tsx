"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Pong3D from "@/components/game/Pong3D"
import { Header } from "@/components/dashboard/Header"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2 } from "lucide-react"
import { VolumeX } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Page({ locale }: { locale: string }) {
  // Gestion des états pour le volume et le changement de piste
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [volume, setVolume] = useState(0.2)
  const [showTrackMenu, setShowTrackMenu] = useState(false)
  const TRACKS = [
    { label: "Force", src: "/sounds/AGST - Force (Royalty Free Music).mp3" },
    { label: "Envy", src: "/sounds/AGST - Envy (Royalty Free Music).mp3" },
    { label: "Arcadewave", src: "/sounds/Lupus Nocte - Arcadewave (Royalty Free Music).mp3" },
  ]
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  // ──────────────────────────────────────────────────────────────────
  //  Musique d'ambiance : ne démarre qu'au lancement du jeu (gameStarted).
  // ──────────────────────────────────────────────────────────────────
  const [gameStarted, setGameStarted] = useState(false)
  useEffect(() => {
    if (!gameStarted) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    audioRef.current = new Audio(TRACKS[currentTrackIndex].src)
    audioRef.current.loop = true
    audioRef.current.volume = volume
    audioRef.current
      .play()
      .catch(() => {
        const resumeOnFirstInteraction = () => {
          audioRef.current?.play().catch(() => {})
          window.removeEventListener("click", resumeOnFirstInteraction)
        }
        window.addEventListener("click", resumeOnFirstInteraction)
      })
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [currentTrackIndex, gameStarted])

  // Mettre à jour le volume en temps réel
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

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

  // États React pour les couleurs joueurs et sélection en cours
  const [colorP1, setColorP1] = useState<string | null>(null)
  const [colorP2, setColorP2] = useState<string | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)

  // Nouvel état pour le choix de "mop" (style du sol)
  type MopStyle = "classic" | "red" | "neon"
  const [mopStyle, setMopStyle] = useState<MopStyle | null>(null)

  // Quand mopStyle change, on sélectionne automatiquement la piste par défaut
  useEffect(() => {
    if (mopStyle === "classic") setCurrentTrackIndex(0)
    else if (mopStyle === "red") setCurrentTrackIndex(1)
    else if (mopStyle === "neon") setCurrentTrackIndex(2)
  }, [mopStyle])

  // Bouton "Démarrer" activé uniquement si :
  // - P1 et P2 ont choisi couleurs distinctes
  // - ET qu'un "mop" a été sélectionné
  const bothChosenAndDistinct =
    colorP1 !== null && colorP2 !== null && colorP1 !== colorP2
  const canStart = bothChosenAndDistinct && mopStyle !== null

  return (
    <>
    <Header locale={locale} />
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center px-4">
      {/* TITRE */}
      <h1 className="text-2xl font-bold mb-4 text-foreground">
        PongMaster – Duel
      </h1>

      {!gameStarted ? (
        <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-6">
          {/* Choix du style du sol ("mop") */}
          <div className="text-foreground">
            <div className="mb-2 text-center font-medium">
              Choisissez le style du sol :
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                variant={mopStyle === "classic" ? "default" : "outline"}
                onClick={() => setMopStyle("classic")}
              >
                Classic
              </Button>
              <Button
                variant={mopStyle === "red" ? "hell" : "outline"}
                onClick={() => setMopStyle("red")}
              >
                Enfer
              </Button>
              <Button
                variant={mopStyle === "neon" ? "neon" : "outline"}
                onClick={() => setMopStyle("neon")}
              >
                Neon
              </Button>
              <Button
                variant={mopStyle === "cyber" ? "cyber" : "outline"}
                onClick={() => setMopStyle("cyber")}
              >
                Cyber
              </Button>
              <Button
                variant={mopStyle === "matrix" ? "matrix" : "outline"}
                onClick={() => setMopStyle("matrix")}
              >
                Matrix
              </Button>
              <Button
                variant={mopStyle === "arcade" ? "arcade" : "outline"}
                onClick={() => setMopStyle("arcade")}
              >
                Arcade
              </Button>
            </div>
          </div>

          {/* Choix des couleurs Joueurs */}
          <div className="mb-4 flex justify-center space-x-4">
            <Button
              variant={currentPlayer === 1 ? "default" : "outline"}
              onClick={() => setCurrentPlayer(1)}
            >
              🎖️ Joueur 1
            </Button>
            <Button
              variant={currentPlayer === 2 ? "default" : "outline"}
              onClick={() => setCurrentPlayer(2)}
            >
              🎖️ Joueur 2
            </Button>
          </div>

          <div className="text-center mb-4 text-lg font-medium text-foreground">
            Sélectionnez la couleur pour{" "}
            <span className="font-bold">
              {currentPlayer === 1 ? "Joueur 1" : "Joueur 2"}
            </span>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-3 mx-auto">
              {COLORS.map((hex) => {
                const takenByP1 = colorP1 === hex
                const takenByP2 = colorP2 === hex
                const isDisabled =
                  (currentPlayer === 1 && takenByP2) ||
                  (currentPlayer === 2 && takenByP1)

                let borderStyle = "2px solid transparent"
                if (takenByP1) borderStyle = "3px solid white"
                if (takenByP2) borderStyle = "3px solid black"

                return (
                  <button
                    key={hex}
                    onClick={() => {
                      if (isDisabled) return
                      if (currentPlayer === 1) setColorP1(hex)
                      else setColorP2(hex)
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
                    {(takenByP1 || takenByP2) && (
                      <span
                        className="
                          absolute -top-1 -left-1
                          bg-foreground text-background
                          text-xs font-bold
                          w-5 h-5 rounded-full
                          flex items-center justify-center
                        "
                      >
                        {takenByP1 ? "1" : "2"}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={() => setGameStarted(true)}
              disabled={!canStart}
              className={!canStart ? "opacity-50 cursor-not-allowed" : ""}
            >
              Démarrer la partie
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-[80vw] h-[80vh] relative bg-background rounded-lg border border-border">
          <div className="absolute top-2 left-2 z-30 flex space-x-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVolumeSlider((prev) => !prev)}
              aria-label="Volume"
            >
              {volume > 0 ? <Volume2 /> : <VolumeX />}
            </Button>
            {showVolumeSlider && (
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                className="w-24"
              />
            )}
            <Select value={TRACKS[currentTrackIndex].label} onValueChange={(value) => {
              const index = TRACKS.findIndex(track => track.label === value);
              if (index !== -1) setCurrentTrackIndex(index);
            }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRACKS.map((track) => (
                  <SelectItem key={track.label} value={track.label}>
                    {track.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause()
                  audioRef.current = null
                }
                setGameStarted(false)
              }}
              aria-label="Recommencer"
            >
              ↺
            </Button>
          </div>

          <Pong3D
            paddle1Color={colorP1!}
            paddle2Color={colorP2!}
            mopStyle={mopStyle!}
          />
        </div>
      )}
    </div>
    </>
  )
}
