"use client";

import { Header } from "@/components/dashboard/Header";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SettingsPanel from "@/app/[locale]/game/[mode]/SettingsPanel";
import Buttons from "@/app/[locale]/game/[mode]/Buttons";
import { ControlsProvider } from "./ControlsContext";

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
      (window as any).__GAME_AUDIO__ = audioRef.current;
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
      return () =>
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [gameStarted]);

  // ──────────────────────────────────────────────────────────────────
  // Choix des couleurs et de la map
  // ──────────────────────────────────────────────────────────────────
  const COLORS = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];
  const [colorP1, setColorP1] = useState<string | null>(null);
  const [colorP2, setColorP2] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  type MapStyle = "classic" | "red" | "neon";
  const [MapStyle, setMapStyle] = useState<MapStyle | null>(null);

  useEffect(() => {
    if (MapStyle === "classic") {
      setCurrentTrackIndex(0);
    } else if (MapStyle === "red") {
      setCurrentTrackIndex(1);
    } else if (MapStyle === "neon") {
      setCurrentTrackIndex(2);
    }
  }, [MapStyle]);

  const bothChosenAndDistinct =
    colorP1 !== null && colorP2 !== null && colorP1 !== colorP2;
  const canStart = bothChosenAndDistinct && MapStyle !== null;

  const restartGame = () => {
    setGameStarted(false);
    setColorP1(null);
    setColorP2(null);
    setMapStyle(null);
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
    <ControlsProvider>
      {/* HEADER */}
      <Header locale={locale} />

      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center px-4">
          {/* TITRE */}
          <h1 className="text-2xl font-bold mb-4 text-foreground">
            PongMaster – Duel
          </h1>

          {!gameStarted ? (
            <SettingsPanel
              COLORS={COLORS}
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
              colorP1={colorP1}
              setColorP1={setColorP1}
              colorP2={colorP2}
              setColorP2={setColorP2}
              MapStyle={MapStyle}
              setMapStyle={setMapStyle}
              canStart={canStart}
              onStart={() => setGameStarted(true)}
            />
          ) : (
            <Buttons
              showVolumeSlider={showVolumeSlider}
              setShowVolumeSlider={setShowVolumeSlider}
              volume={volume}
              setVolume={setVolume}
              showTrackMenu={showTrackMenu}
              setShowTrackMenu={setShowTrackMenu}
              TRACKS={TRACKS}
              currentTrackIndex={currentTrackIndex}
              setCurrentTrackIndex={setCurrentTrackIndex}
              restartGame={restartGame}
              cameraKey={cameraKey}
              setCameraKey={setCameraKey}
              paddle1Color={colorP1 || "#000000"}
              paddle2Color={colorP2 || "#000000"}
              MapStyle={MapStyle || "classic"}
            />
          )}
        </div>
      </main>
    </ControlsProvider>
  );
}
