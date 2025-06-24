import { useEffect, useRef, useState } from "react";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Engine, Scene, Color3, Vector3, Color4, StandardMaterial } from "@babylonjs/core";
import { setupGame } from "./Setup/setupGame";
import { initgamePhysic } from "./Physic/gamePhysic";
import { GameUI } from "../../app/[locale]/game/[mode]/GameUI";
import type { Pong3DProps, GameState, GameRefs, GameObjects, TouchHistory } from "./gameTypes";
import { MalusSystem } from "./Physic/MalusSystem";
import { useControls } from "../../app/[locale]/game/[mode]/ControlsContext";

export default function Pong3D({
	paddle1Color,
	paddle2Color,
	paddle3Color,
	paddle4Color,
	MapStyle,
	resetCamFlag,
	enableSpecial = false,
	enableMaluses = false,
	volume = 0.2,
	baseSpeed = 16,
	gamemode,
	enableAI = false,
	is2v2Mode = false,
	onMatchEnd,
}: Pong3DProps & {
	enableSpecial?: boolean,
	enableMaluses?: boolean,
	volume?: number,
	baseSpeed?: number,
	gamemode?: string,
	enableAI?: boolean,
	is2v2Mode?: boolean,
	onMatchEnd?: (winner: string, score: { player1: number; player2: number }) => void
}) {


	// ─── References = non rerender par react mais par babylon / WebGL : garde acces a ces donnes  ─────────────────────────────────────────────
	// c est quand on need pas de re render soit car deja fait ou pas besoin quand qq chose change

	const canvasRef = useRef<HTMLCanvasElement>(null); // Cree ces boite vide ou dit le type a remplir.
	const engineRef = useRef<Engine | null>(null);
	const sceneRef = useRef<Scene | null>(null);
	const gameObjectsRef = useRef<GameObjects | null>(null);
	const cameraRef = useRef<ArcRotateCamera | null>(null);
	const MalusSystemRef = useRef<MalusSystem | null>(null);
	const { controls } = useControls();
	const controlsRef = useRef(controls);

	// ─── etats React : changer valeur dans UI ─────────────────────────────────────────────
	const [score, setScore] = useState<GameState["score"]>({ player1: 0, player2: 0 });
	const [winner, setWinner] = useState<GameState["winner"]>(null);
	const [countdown, setCountdown] = useState<GameState["countdown"]>(0);
	const [isPaused, setIsPaused] = useState<GameState["isPaused"]>(false);
	const [MalusBarKey, setMalusBarKey] = useState(0);
	const [stamina, setStamina] = useState({ player1: 0, player2: 0, player3: 0, player4: 0 });
	const [superPad, setSuperPad] = useState({ player1: false, player2: false, player3: false, player4: false });
	const touchHistory = useRef<TouchHistory[]>([]);
	const [showGoal, setShowGoal] = useState(false);
	const [lastScoreType, setLastScoreType] = useState<'goal' | 'malus'>('goal');
	const prevScore = useRef(score);

	// ─── References pour synchroniser l'etat : accedes au valeurs dans la logique  ────────────────────
	const scoreRef = useRef(score);
	const winnerRef = useRef(winner);
	const countdownRef = useRef(countdown);
	const isPausedRef = useRef(isPaused);
	const superPadRef = useRef(superPad);
	const staminaRef = useRef(stamina);
	const lastHitterRef = useRef<number | null>(null);
	const volumeRef = useRef(volume);
	const enableAIRef = useRef(enableAI);
	const triggerSuperPadRef = useRef<(player: 1 | 2 | 3 | 4) => void>(() => {});



	 // ─── References pour synchroniser l'etat : accedes au valeurs dans la logique  ────────────────────

	useEffect(() => { scoreRef.current = score; }, [score]);
	useEffect(() => { winnerRef.current = winner; }, [winner]);
	useEffect(() => { countdownRef.current = countdown; }, [countdown]);
	useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
	useEffect(() => { superPadRef.current = superPad; }, [superPad]);
	useEffect(() => { staminaRef.current = stamina; }, [stamina]);
	useEffect(() => { volumeRef.current = volume; }, [volume]);
	useEffect(() => { enableAIRef.current = enableAI; }, [enableAI]);



	useEffect(() => {
		if (!canvasRef.current) return; // si plus de convas on sort.
		const engine = new Engine(canvasRef.current, true);  // declare l engine, true pour activer le rendu WebGL
		engineRef.current = engine;
		const scene = new Scene(engine);
		scene.clearColor = new Color4(0, 0, 0, 0);
		sceneRef.current = scene;
		const objs = setupGame(scene, MapStyle, paddle1Color, paddle2Color, paddle3Color, paddle4Color, is2v2Mode);
		cameraRef.current = objs.camera;
		gameObjectsRef.current = objs;
		// objet qui stock les ref et fera le lien avec les donnes
		const gameRefs: GameRefs = {
			score: scoreRef,
			winner: winnerRef,
			countdown: countdownRef,
			isPaused: isPausedRef,
			setScore,
			setWinner,
			setCountdown,
			setIsPaused,
			controls: controlsRef,
			touchHistory: touchHistory.current,
			superPad: superPadRef,
			stamina: staminaRef,
			lastHitter: lastHitterRef,
			triggerSuperPad: triggerSuperPadRef,
		}; // DEUXIEME FT EXTERNE APPELE POUR LANCER LA LOGIC DU JEU

		const cleanupPhysic = initgamePhysic(
			scene,
			objs,
			gameRefs,
			setStamina,
			setSuperPad,
			baseSpeed,
			volumeRef,
			enableSpecial,
			superPadRef,
			enableAIRef,
			is2v2Mode,
		);
		// 3EME FT EXTERNE APPELE POUR LANCER LA LOGIC DES MALUS ( 2 argument la scene et ensemble de valeur brut au debut (photo des valeur),  les game refs. pour suivre les valeur (si valeur ) . securite plus modulable a l avenir)
		if (enableMaluses) {
			MalusSystemRef.current = new MalusSystem(
				scene,
				gameRefs,
				() => setMalusBarKey((k) => k + 1),
				setScore,
				setWinner
			);
			MalusSystemRef.current.startMalusSystem();
		}


		engine.runRenderLoop(() => scene.render()); // redessine la scene a chaque fois que la scene est modif
		window.addEventListener("resize", () => engine.resize()); // ajuste rendu selon taille fenetre
		// a la fin on clean tout.
		return () => {
			cleanupPhysic();
			if (MalusSystemRef.current) {
				MalusSystemRef.current.stopMalusSystem();
			}
			engine.dispose();
		};
	}, [paddle1Color, paddle2Color, paddle3Color, paddle4Color, MapStyle, enableMaluses, enableSpecial, baseSpeed, enableAI, is2v2Mode]);





	// Detecte changement du score
	useEffect(() => {
		if (
			score.player1 !== prevScore.current.player1 ||
			score.player2 !== prevScore.current.player2
		) {
			// Detection du type de score
			const diff1 = score.player1 - prevScore.current.player1;
			const diff2 = score.player2 - prevScore.current.player2;
			if ((diff1 > 0 && diff2 === 0) || (diff2 > 0 && diff1 === 0)) {
				setLastScoreType('goal');
			} else if ((diff1 < 0 && diff2 === 0) || (diff2 < 0 && diff1 === 0)) {
				setLastScoreType('malus');
			}
			setShowGoal(true);
			setTimeout(() => setShowGoal(false), 700);
			prevScore.current = { ...score };
		}
	}, [score]);




	// met a jour ref clavier
	useEffect(() => {
		controlsRef.current = controls;
	}, [controls]);



	// servira pour pause apres dans L UI
	const handleSetIsPaused = (paused: boolean) => {
		setIsPaused(paused);
	};




	// remet cam orrigne on clique
	useEffect(() => {
		if (cameraRef.current) {
			cameraRef.current.setPosition(new Vector3(35, 35, 0));
			cameraRef.current.setTarget(Vector3.Zero());
		}
	}, [resetCamFlag]);



	// couleur paddle in game maj
	useEffect(() => {
		if (gameObjectsRef.current) {
			const { p1Mat, p2Mat } = gameObjectsRef.current;
			p1Mat.diffuseColor = Color3.FromHexString(paddle1Color);
			p2Mat.diffuseColor = Color3.FromHexString(paddle2Color);
		}
	}, [paddle1Color, paddle2Color]);

	// couleur paddle 3 et 4 in game maj (mode 2v2)
	useEffect(() => {
		if (gameObjectsRef.current && is2v2Mode) {
			const { paddle3, paddle4, p3Mat, p4Mat } = gameObjectsRef.current;

			if (paddle3 && paddle4 && p3Mat && p4Mat) {
				// Utiliser les matériaux déjà créés dans setupGameObjects
				paddle3.material = p3Mat;
				paddle4.material = p4Mat;

				// Appliquer aussi aux mini-pads si ils existent
				if (gameObjectsRef.current.miniPaddle3) {
					gameObjectsRef.current.miniPaddle3.material = p3Mat;
				}
				if (gameObjectsRef.current.miniPaddle4) {
					gameObjectsRef.current.miniPaddle4.material = p4Mat;
				}
			}
		}
	}, [is2v2Mode]);













	useEffect(() =>
		{
			if (winner)
			{
				if (gamemode == "custom" && !!localStorage.getItem("currentGameId"))
				{
					const sendScore = async () =>
					{

						try
						{
							const response = await fetch('/api/game/result', {
								method: 'POST',
								headers:
								{
									'Content-Type': 'application/json',
								},
								credentials: 'include',
								body: JSON.stringify({
									player1Score: score.player1,
									player2Score: score.player2,
									gameId: localStorage.getItem("currentGameId"),
								})
							});

						}

						catch (error)
						{
							console.error('Erreur, winneur non envoye :', error);
						}


					};

				sendScore();
				}
				else if (gamemode === "tournament" && onMatchEnd)
				{
					console.log(`Match terminé en mode tournoi - Gagnant: ${winner}, Score: ${score.player1}-${score.player2}`);
					onMatchEnd(winner, score);
				}
			}
		}, [winner, score, gamemode, onMatchEnd]);




	// RENDU UI CASE SUR LA PARTIE DU JEU (case des touche et barre stamina / chargement malus)
	return (
		<div className="relative w-full h-full">
			{/* Canvas = conteneur graphique : la ou j affiche tout, un peu espace car padding dans main de page + le bandeau. */}
			<canvas ref={canvasRef} className="w-full h-full" />
			<GameUI
				score={score}
				winner={winner}
				countdown={countdown}
				isPaused={isPaused}
				setIsPaused={handleSetIsPaused}
				enableMaluses={enableMaluses}
				MalusBarKey={MalusBarKey}
				stamina={stamina}
				superPad={superPad}
				enableSpecial={enableSpecial}
				showGoal={showGoal}
				lastScoreType={lastScoreType}
				malusSystem={MalusSystemRef.current}
				gamemode={gamemode}
				onMatchEnd={onMatchEnd}
				enableAI={enableAI}
				is2v2Mode={is2v2Mode}
			/>
		</div>
	);
}
