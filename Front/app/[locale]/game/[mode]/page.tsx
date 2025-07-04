"use client";

import { Header } from "@/components/dashboard/Header";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import SettingsPanel from "./SettingsPanel";
import Buttons from "@/app/[locale]/game/[mode]/Buttons";
import { ControlsProvider } from "./ControlsContext";
import { BracketMatch } from "@/Shared/types/BracketMatch";



// j etend le fenetrer navi avec un game audio qui peut etre nul + mis sur pause. : pour tout mon projet
declare global {
	interface Window {
		Game_Audio?: { pause?: () => void };
	}
}



interface Track {
	label: string;
	src: string;
}

export default function Page() {
	const params = useParams();
	const gamemode = typeof params?.mode === 'string' ? params.mode : "quickmatch";
	const locale = typeof params?.locale === 'string' ? params.locale : "fr";




	// ──────────────────────────────────────────────────────────────────
	// Gestion audio et musique d'ambiance
	// ──────────────────────────────────────────────────────────────────


	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [showVolumeSlider, setShowVolumeSlider] = useState(false);
	const [volume, setVolume] = useState(0.2);
	const [showTrackMenu, setShowTrackMenu] = useState(false);


	const TRACKS = useMemo<Track[]>(() => [
		{ label: "Force", src: "/sounds/AGST - Force (Royalty Free Music).mp3" },
		{ label: "Envy", src: "/sounds/AGST - Envy (Royalty Free Music).mp3" },
		{ label: "Arcadewave", src: "/sounds/Lupus Nocte - Arcadewave (Royalty Free Music).mp3" },
	], []);



	const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

	const [gameStarted, setGameStarted] = useState(false);
	const [bracket, setBracket] = useState<BracketMatch[]>([]);
	const [currentMatch, setCurrentMatch] = useState<BracketMatch | null>(null);
	const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
	const [tournamentStarted, setTournamentStarted] = useState(false);
	const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);
	const [showWinnerDialog, setShowWinnerDialog] = useState(false);
	const [score, setScore] = useState<{ player1: number; player2: number }>({ player1: 0, player2: 0 });
	const [winner, setWinner] = useState<string | null>(null);


	// activer le son dynamique si volume change
	useEffect(() => {
		if (gameStarted && !audioRef.current) {
			audioRef.current = new Audio(TRACKS[currentTrackIndex].src);
			audioRef.current.loop = true;
			audioRef.current.volume = volume;
			audioRef.current.play().catch(console.error);
			window.Game_Audio = audioRef.current;
		}
		if (audioRef.current) {
			audioRef.current.volume = volume;
		}
	}, [gameStarted, currentTrackIndex, volume, TRACKS]);



	// changer le track si change l index
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
	}, [currentTrackIndex, TRACKS]);







	// ──────────────────────────────────────────────────────────────────
	// Choix des couleurs et de la map
	// ──────────────────────────────────────────────────────────────────



	const COLORS = [
		"#f43f5e",
		"#0ea5e9",
		"#84cc16",
		"#eab308",
		"#a855f7",
		"#14b8a6",
	];



	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [colorP1, setColorP1] = useState<string | null>(null);
	const [colorP2, setColorP2] = useState<string | null>(null);
	const [colorP3, setColorP3] = useState<string | null>(null);
	const [colorP4, setColorP4] = useState<string | null>(null);
	const [MapStyle, setMapStyle] = useState<"classic" | "red" | "neon">("classic");
	const [enableMaluses, setEnableMaluses] = useState(false);
	const [enableSpecial, setEnableSpecial] = useState(false);
	const [is2v2Mode, setIs2v2Mode] = useState(false);
	const [enableAI, setEnableAI] = useState(false);
	const [baseSpeed, setBaseSpeed] = useState(24);






	useEffect(() => {
		if (MapStyle === "classic") {
			setCurrentTrackIndex(0);
		} else if (MapStyle === "red") {
			setCurrentTrackIndex(1);
		} else if (MapStyle === "neon") {
			setCurrentTrackIndex(2);
		}
	}, [MapStyle]);

	// Désactive l'IA si le mode 2v2 est activé.
	useEffect(() => {
		if (is2v2Mode) {
			setEnableAI(false);
		}
	}, [is2v2Mode]);

	// Réinitialise les couleurs des joueurs 3 et 4 si le mode 2v2 est désactivé
	useEffect(() => {
		if (!is2v2Mode) {
			setColorP3(null);
			setColorP4(null);
		}
	}, [is2v2Mode]);





	const bothChosenAndDistinct =
		colorP1 !== null && colorP2 !== null && colorP1 !== colorP2;

	const allFourChosenAndDistinct = is2v2Mode
		? colorP1 !== null && colorP2 !== null && colorP3 !== null && colorP4 !== null &&
		  colorP1 !== colorP2 && colorP1 !== colorP3 && colorP1 !== colorP4 &&
		  colorP2 !== colorP3 && colorP2 !== colorP4 && colorP3 !== colorP4
		: bothChosenAndDistinct;

	const canStart = allFourChosenAndDistinct && MapStyle !== null;



	// tout reset a chaque partie.
	const restartGame = () => {
		setGameStarted(false);
		setColorP1(null);
		setColorP2(null);
		setColorP3(null);
		setColorP4(null);
		setMapStyle("classic");
		setEnableMaluses(false);
		setEnableSpecial(false);
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



	// ... = {}    prop le param de ft et la var envoye ici.


			{/* le <> === fragment vide pour tout renvoyer d un coup */}
	// Fonction pour mettre à jour le bracket après un match
	const updateBracketAfterMatch = (matchId: string, winner: string) => {
		if (gamemode !== "tournament") return;

		setBracket(prevBracket => {
			const newBracket = [...prevBracket];
			const currentMatch = newBracket.find(m => m.id === matchId);

			if (!currentMatch) {
				return prevBracket;
			}

			// Vérifier si le match n'est pas déjà terminé
			if (currentMatch.status === "completed") {
				return prevBracket;
			}

			// Mettre à jour le statut du match actuel
			currentMatch.status = "completed";
			currentMatch.winner = winner;

			// Trouver le match suivant dans le bracket
			const nextRound = currentMatch.round + 1;
			const nextMatchNumber = Math.ceil(currentMatch.matchNumber / 2);

			const nextMatch = newBracket.find(m => m.round === nextRound && m.matchNumber === nextMatchNumber);

			if (nextMatch) {

				// Déterminer si le gagnant doit être player1 ou player2 dans le match suivant
				// Pour le premier match du tour suivant, le gagnant du match 1 devient player1, le gagnant du match 2 devient player2
				const isFirstPlayer = currentMatch.matchNumber % 2 === 1;

				// Trouver le joueur gagnant dans le match actuel
				let winnerPlayer = null;
				if (currentMatch.player1 && currentMatch.player1.username === winner) {
					winnerPlayer = currentMatch.player1;
				} else if (currentMatch.player2 && currentMatch.player2.username === winner) {
					winnerPlayer = currentMatch.player2;
				}

				if (winnerPlayer) {
					// Mettre à jour le match suivant avec le gagnant
					if (isFirstPlayer) {
						nextMatch.player1 = winnerPlayer;
					} else {
						nextMatch.player2 = winnerPlayer;
					}

					// Si les deux joueurs sont maintenant définis, marquer le match comme prêt
					if (nextMatch.player1 && nextMatch.player2) {
						nextMatch.status = "pending";
					}
				}
			} else {
				// C'est la finale, le tournoi est terminé
				setTournamentWinner(winner);
				// Ne pas déclencher la popup, juste marquer le tournoi comme terminé
				// setShowWinnerDialog(true);
			}

			// Sauvegarder le bracket mis à jour dans le localStorage
			localStorage.setItem("tournamentBracket", JSON.stringify(newBracket));

			return newBracket;
		});
	};

	return (
		<>
			<ControlsProvider>
				{/* HEADER */}
				<Header locale={locale as string} />

				{!gameStarted ? (
					<SettingsPanel
						COLORS={COLORS}
						gamemode={gamemode}
						currentPlayer={currentPlayer}
						setCurrentPlayer={setCurrentPlayer}
						colorP1={colorP1}
						setColorP1={setColorP1}
						colorP2={colorP2}
						setColorP2={setColorP2}
						colorP3={colorP3}
						setColorP3={setColorP3}
						colorP4={colorP4}
						setColorP4={setColorP4}
						MapStyle={MapStyle}
						setMapStyle={setMapStyle}
						canStart={canStart}
						onStart={() => setGameStarted(true)}
						enableMaluses={enableMaluses}
						setEnableMaluses={setEnableMaluses}
						enableSpecial={enableSpecial}
						setEnableSpecial={setEnableSpecial}
						baseSpeed={baseSpeed}
						setBaseSpeed={setBaseSpeed}
						bracket={bracket}
						setBracket={setBracket}
						currentMatch={currentMatch}
						setCurrentMatch={setCurrentMatch}
						currentMatchIndex={currentMatchIndex}
						setCurrentMatchIndex={setCurrentMatchIndex}
						tournamentStarted={tournamentStarted}
						setTournamentStarted={setTournamentStarted}
						updateBracketAfterMatch={updateBracketAfterMatch}
						enableAI={enableAI}
						setEnableAI={setEnableAI}
						tournamentWinner={tournamentWinner}
						setTournamentWinner={setTournamentWinner}
						showWinnerDialog={showWinnerDialog}
						setShowWinnerDialog={setShowWinnerDialog}
						is2v2Mode={is2v2Mode}
						setIs2v2Mode={setIs2v2Mode}
					/>
				) : (
					<Buttons
						showVolumeSlider={showVolumeSlider}
						setShowVolumeSlider={setShowVolumeSlider}
						volume={volume}
						setVolume={setVolume}
						showTrackMenu={showTrackMenu}
						setShowTrackMenu={setShowTrackMenu}
						TRACKS={TRACKS.map(track => track.label)}
						currentTrackIndex={currentTrackIndex}
						setCurrentTrackIndex={setCurrentTrackIndex}
						restartGame={restartGame}
						cameraKey={cameraKey}
						setCameraKey={setCameraKey}
						paddle1Color={colorP1 || "#FF0000"}
						paddle2Color={colorP2 || "#0000FF"}
						colorP3={colorP3 || "#FF6B6B"}
						colorP4={colorP4 || "#4ECDC4"}
						MapStyle={MapStyle}
						enableMaluses={enableMaluses}
						enableSpecial={enableSpecial}
						baseSpeed={baseSpeed}
						gamemode={gamemode}
						currentMatch={currentMatch}
						updateBracketAfterMatch={updateBracketAfterMatch}
						score={score}
						setScore={setScore}
						winner={winner}
						setWinner={setWinner}
						enableAI={enableAI}
						setGameStarted={setGameStarted}
						is2v2Mode={is2v2Mode}
					/>
				)}
			</ControlsProvider>
		</>
	);
}
