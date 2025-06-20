"use client";

import { useState, useEffect } from "react";
import { QuickMatchSettings } from "./QuickMatchSettings";
import CustomGameSettings from "./CustomGameSettings";
import TournamentSettings from "./TournamentSettings";
import {
	SettingsPanelProps,
	GameInfo
} from "./SettingsPanelTypes";

export default function SettingsPanel(props: SettingsPanelProps) {
	const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

	// Désactive l'IA en mode tournoi et custom.
	// Cette logique est placée ici pour s'appliquer à tous les modes de jeu.
	const isAIDisabled = props.gamemode === "tournament" || props.gamemode === "custom";

	// Logique commune à tous les modes
	const commonProps = {
		COLORS: props.COLORS,
		currentPlayer: props.currentPlayer,
		setCurrentPlayer: props.setCurrentPlayer,
		colorP1: props.colorP1,
		setColorP1: props.setColorP1,
		colorP2: props.colorP2,
		setColorP2: props.setColorP2,
		MapStyle: props.MapStyle,
		setMapStyle: props.setMapStyle,
		enableMaluses: props.enableMaluses,
		setEnableMaluses: props.setEnableMaluses,
		enableSpecial: props.enableSpecial,
		setEnableSpecial: props.setEnableSpecial,
		baseSpeed: props.baseSpeed,
		setBaseSpeed: props.setBaseSpeed,
		canStart: props.canStart,
		locale: props.locale,
		onStart: props.onStart,
		enableAI: props.enableAI,
		setEnableAI: props.setEnableAI,
		isAIDisabled, // Passe la valeur au composant enfant
	};

	// Rendu conditionnel basé sur le mode de jeu
	switch (props.gamemode) {
		case "quickmatch":
			return <QuickMatchSettings {...commonProps} gamemode={props.gamemode} />;

		case "custom":
			return <CustomGameSettings
				{...commonProps}
				gamemode={props.gamemode}
			/>;

		case "tournament":
			return <TournamentSettings
				{...commonProps}
				gamemode={props.gamemode}
				bracket={props.bracket}
				setBracket={props.setBracket}
				currentMatch={props.currentMatch}
				setCurrentMatch={props.setCurrentMatch}
				currentMatchIndex={props.currentMatchIndex}
				setCurrentMatchIndex={props.setCurrentMatchIndex}
				tournamentStarted={props.tournamentStarted}
				setTournamentStarted={props.setTournamentStarted}
				updateBracketAfterMatch={props.updateBracketAfterMatch}
			/>;

		default:
			return <QuickMatchSettings {...commonProps} gamemode={props.gamemode} />;
	}
}
