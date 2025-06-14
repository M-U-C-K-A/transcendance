import { useEffect, useRef, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Pong3D, { Pong3DProps } from './Pong3D';
import { useGameSocket } from '../../hooks/useGameSocket';
import { GameState, GameObjects } from './gameTypes';

interface OnlinePong3DProps extends Pong3DProps {
  isPlayer1: boolean;
  matchId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { matchId, player } = context.query;
  
  return {
    props: {
      matchId: matchId || null,
      isPlayer1: player === '1',
      paddle1Color: '#FF0000',
      paddle2Color: '#0000FF',
      MapStyle: 'classic',
      resetCamFlag: 0,
      enableSpecial: false,
      enableMaluses: false,
      volume: 0.2,
      baseSpeed: 16,
    },
  };
};

const OnlinePong3D: NextPage<OnlinePong3DProps> = ({
  paddle1Color,
  paddle2Color,
  MapStyle,
  resetCamFlag,
  enableSpecial = false,
  enableMaluses = false,
  volume = 0.2,
  baseSpeed = 16,
  isPlayer1,
  matchId,
}) => {
  const gameObjectsRef = useRef<GameObjects | null>(null);
  const gameStateRef = useRef<GameState>({
    score: { player1: 0, player2: 0 },
    winner: null,
    countdown: null,
    isPaused: false,
  });

  const { isConnected, joinGame, updateGame } = useGameSocket({
    onGameStart: () => {
      console.log('Game started!');
    },
    onGameSync: (data) => {
      if (gameObjectsRef.current) {
        Object.assign(gameObjectsRef.current, data.gameObjects);
      }
      gameStateRef.current = data.gameState;
    },
    onPlayerLeft: (playerId) => {
      console.log(`Player ${playerId} left the game`);
    }
  });

  useEffect(() => {
    if (isConnected && matchId) {
      joinGame();
    }
  }, [isConnected, joinGame, matchId]);

  const handleGameUpdate = (gameState: GameState, gameObjects: GameObjects) => {
    if (isPlayer1) {
      updateGame({ gameState, gameObjects });
    }
  };

  if (!isConnected) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-foreground text-2xl">
          Connexion au serveur...
        </div>
      </div>
    );
  }

  return (
    <Pong3D
      paddle1Color={paddle1Color}
      paddle2Color={paddle2Color}
      MapStyle={MapStyle}
      resetCamFlag={resetCamFlag}
      enableSpecial={enableSpecial}
      enableMaluses={enableMaluses}
      volume={volume}
      baseSpeed={baseSpeed}
      onGameUpdate={handleGameUpdate}
      isPlayer1={isPlayer1}
    />
  );
};

export default OnlinePong3D; 