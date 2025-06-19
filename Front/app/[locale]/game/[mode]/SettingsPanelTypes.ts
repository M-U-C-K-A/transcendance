import { Dispatch, SetStateAction } from "react";
import { BracketMatch } from "@/types/BracketMatch";

export interface Player {
  id: string;
  name: string;
  ready?: boolean;
}

export interface Match {
  team1: string;
  team2: string;
  time: string;
  status?: "pending" | "ongoing" | "completed";
}

export interface GameInfo {
  id: string;
  name: string;
  players: Player[];
  upcomingMatches?: Match[];
  status?: "waiting" | "starting" | "ongoing";
}

export interface SettingsPanelProps {
  COLORS: string[];
  currentPlayer: 1 | 2;
  setCurrentPlayer: Dispatch<SetStateAction<1 | 2>>;
  colorP1: string | null;
  setColorP1: Dispatch<SetStateAction<string | null>>;
  colorP2: string | null;
  setColorP2: Dispatch<SetStateAction<string | null>>;
  gamemode: string;
  MapStyle: "classic" | "red" | "neon";
  setMapStyle: Dispatch<SetStateAction<"classic" | "red" | "neon">>;
  onStart: () => void;
  enableMaluses: boolean;
  setEnableMaluses: Dispatch<SetStateAction<boolean>>;
  enableSpecial: boolean;
  setEnableSpecial: Dispatch<SetStateAction<boolean>>;
  baseSpeed: number;
  setBaseSpeed: Dispatch<SetStateAction<number>>;
  canStart: boolean;
  bracket: BracketMatch[];
  setBracket: Dispatch<SetStateAction<BracketMatch[]>>;
  currentMatch: BracketMatch | null;
  setCurrentMatch: Dispatch<SetStateAction<BracketMatch | null>>;
  currentMatchIndex: number;
  setCurrentMatchIndex: Dispatch<SetStateAction<number>>;
  tournamentStarted: boolean;
  setTournamentStarted: Dispatch<SetStateAction<boolean>>;
  updateBracketAfterMatch: (matchId: string, winner: string) => void;
  locale: string;
}
