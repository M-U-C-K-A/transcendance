"use client";

import { Header } from "@/components/dashboard/Header";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Pong3D from "@/components/game/Pong3D";

export default function Page() {
  const params = useParams();
  const locale = params?.locale ?? "fr";

  // ──────────────────────────────────────────────────────────────────
  // Gestion audio et musique d'ambiance
  // ──────────────────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [showTrackMenu, setShowTrackMenu] = useState(false);
  const TRACKS = [
    { label: "Force", src: "/sounds/AGST - Force (Royalty Free Music).mp3" },
    { label: "Envy", src: "/sounds/AGST - Envy (Royalty Free Music).mp3" },
    { label: "Arcadewave", src: "/sounds/Lupus Nocte - Arcadewave (Royalty Free Music).mp3" },
  ];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && !audioRef.current) {
      audioRef.current = new Audio(TRACKS[currentTrackIndex].src);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);
    }
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [gameStarted, currentTrackIndex, volume]);

  useEffect(() => {
    if (audioRef.current) {
      const currentSrc = audioRef.current.src;
      const newSrc = TRACKS[currentTrackIndex].src;
      if (currentSrc !== newSrc) {
        audioRef.current.pause();
        audioRef.current.src = newSrc;
        audioRef.current.load();
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (!gameStarted || !audioRef.current) return;
    const playAudio = () => audioRef.current?.play().catch(console.error);
    if (document.visibilityState === "visible") {
      playAudio();
    } else {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") playAudio();
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [gameStarted]);

  // ──────────────────────────────────────────────────────────────────
  // Choix des couleurs et de la map
  // ──────────────────────────────────────────────────────────────────
  const COLORS = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
  const [colorP1, setColorP1] = useState<string | null>(null);
  const [colorP2, setColorP2] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  type MopStyle = "classic" | "red" | "neon";
  const [mopStyle, setMopStyle] = useState<MopStyle | null>(null);

  useEffect(() => {
    if (mopStyle === "classic") {
      setCurrentTrackIndex(0);
    } else if (mopStyle === "red") {
      setCurrentTrackIndex(1);
    } else if (mopStyle === "neon") {
      setCurrentTrackIndex(2);
    }
  }, [mopStyle]);

  const bothChosenAndDistinct =
    colorP1 !== null && colorP2 !== null && colorP1 !== colorP2;
  const canStart = bothChosenAndDistinct && mopStyle !== null;

  const restartGame = () => {
    setGameStarted(false);
    setColorP1(null);
    setColorP2(null);
    setMopStyle(null);
    setCurrentTrackIndex(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  // ──────────────────────────────────────────────────────────────────
  // Clé pour déclencher la réinitialisation de la caméra
  // ──────────────────────────────────────────────────────────────────
  const [cameraKey, setCameraKey] = useState(0);

  return (
    <>
      {/* HEADER */}
      <Header locale={locale} />

      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center px-4">
          {/* TITRE */}
          <h1 className="text-2xl font-bold mb-4 text-foreground">PongMaster – Duel</h1>

          {!gameStarted ? (
            <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-6">
              {/* Choix du style du sol (“mop”) */}
              <div className="text-foreground">
                <div className="mb-2 text-center font-medium">Choisissez la map :</div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setMopStyle("classic")}
                    className={`px-4 py-2 rounded-lg font-semibold border ${
                      mopStyle === "classic"
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                    }`}
                  >
                    Classic
                  </button>
                  <button
                    onClick={() => setMopStyle("red")}
                    className={`px-4 py-2 rounded-lg font-semibold border ${
                      mopStyle === "red"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                    }`}
                  >
                    Enfer
                  </button>
                  <button
                    onClick={() => setMopStyle("neon")}
                    className={`px-4 py-2 rounded-lg font-semibold border ${
                      mopStyle === "neon"
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                    }`}
                  >
                    Neon
                  </button>
                </div>
              </div>

              {/* Choix des couleurs Joueurs */}
              <div className="mb-4 flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentPlayer(1)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPlayer === 1
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🎖️ Joueur 1
                </button>
                <button
                  onClick={() => setCurrentPlayer(2)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPlayer === 2
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🎖️ Joueur 2
                </button>
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
                    const takenByP1 = colorP1 === hex;
                    const takenByP2 = colorP2 === hex;
                    const isDisabled =
                      (currentPlayer === 1 && takenByP2) ||
                      (currentPlayer === 2 && takenByP1);

                    let borderStyle = "2px solid transparent";
                    if (takenByP1) borderStyle = "3px solid white";
                    if (takenByP2) borderStyle = "3px solid black";

                    return (
                      <button
                        key={hex}
                        onClick={() => {
                          if (isDisabled) return;
                          if (currentPlayer === 1) setColorP1(hex);
                          else setColorP2(hex);
                        }}
                        disabled={isDisabled}
                        aria-label={`Couleur ${hex} ${isDisabled ? "(déjà prise)" : ""}`}
                        className="relative h-12 w-12 rounded-lg focus:outline-none"
                        style={{
                          backgroundColor: hex,
                          opacity: isDisabled ? 0.4 : 1,
                          border: borderStyle,
                        }}
                      >
                        {(takenByP1 || takenByP2) && (
                          <span className="absolute -top-1 -left-1 bg-foreground text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {takenByP1 ? "1" : "2"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setGameStarted(true)}
                  disabled={!canStart}
                  className={`px-5 py-2 rounded-lg font-bold text-white ${
                    canStart ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Démarrer la partie
                </button>
              </div>
            </div>
          ) : (
            <div className="w-[80vw] h-[80vh] relative bg-background rounded-lg border border-border">
              {/* Contrôles Volume, Musique, Recommencer */}
              <div className="absolute top-4 left-2 z-30 flex space-x-2" style={{ marginTop: "-12px" }}>
                <button
                  onClick={() => setShowVolumeSlider((prev) => !prev)}
                  className="bg-card border border-border rounded p-1.5 hover:bg-card/80 text-sm"
                  aria-label="Volume"
                >
                  {volume > 0 ? "🔊" : "🔇"}
                </button>
                {showVolumeSlider && (
                  <div className="flex justify-center items-center ml-4 mt-1">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="h-2 w-20"
                    />
                  </div>
                )}
                <button
                  onClick={() => setShowTrackMenu((prev) => !prev)}
                  className="bg-card border border-border rounded p-1.5 hover:bg-card/80 text-sm"
                  aria-label="Changer musique"
                >
                  💿
                </button>
                <button
                  onClick={restartGame}
                  className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  aria-label="Recommencer"
                >
                  ↺
                </button>
                {/* Nouveau bouton : Réinitialiser la caméra */}
                <button
                  onClick={() => setCameraKey((prev) => prev + 1)}
                  className="ml-2 bg-card border border-border rounded p-1.5 hover:bg-card/80 text-sm"
                  aria-label="Réinitialiser la caméra"
                >
                  🎥
                </button>
              </div>

              {showTrackMenu && (
                <div className="absolute top-12 left-2 z-30 bg-card border border-border rounded shadow-lg p-2 space-y-1">
                  {TRACKS.map((track, idx) => (
                    <button
                      key={track.label}
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setShowTrackMenu(false);
                      }}
                      className={`block w-full text-left px-2 py-1 rounded ${
                        idx === currentTrackIndex ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                      }`}
                    >
                      {track.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Le composant Pong3D reçoit maintenant resetCamFlag au lieu de key */}
              <Pong3D
                resetCamFlag={cameraKey}
                paddle1Color={colorP1 || "#000000"}
                paddle2Color={colorP2 || "#000000"}
                mopStyle={mopStyle || "classic"}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
