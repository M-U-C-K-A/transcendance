import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { updateControls } from '../../../../components/game/Physic/customControls';

interface Controls {
  player1Up: string;
  player1Down: string;
  player2Up: string;
  player2Down: string;
}

interface ControlsContextType {
  controls: Controls;
  updateControls: (newControls: Controls) => void;
}

const defaultControls: Controls = {
  player1Up: 'W',
  player1Down: 'S',
  player2Up: 'ArrowUp',
  player2Down: 'ArrowDown',
};

const ControlsContext = createContext<ControlsContextType | undefined>(undefined);

export const ControlsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [controls, setControls] = useState<Controls>(() => {
    // Essayer de charger les contrôles depuis le localStorage
    if (typeof window !== 'undefined') {
      const savedControls = localStorage.getItem('gameControls');
      if (savedControls) {
        return JSON.parse(savedControls);
      }
    }
    return defaultControls;
  });

  const handleUpdateControls = (newControls: Controls) => {
    setControls(newControls);
    // Sauvegarder dans le localStorage pour persistance
    localStorage.setItem('gameControls', JSON.stringify(newControls));
    // Mettre à jour les contrôles du jeu
    updateControls(newControls);
  };

  // Mettre à jour les contrôles du jeu au chargement initial
  useEffect(() => {
    updateControls(controls);
  }, []);

  return (
    <ControlsContext.Provider value={{ controls, updateControls: handleUpdateControls }}>
      {children}
    </ControlsContext.Provider>
  );
};

export const useControls = () => {
  const context = useContext(ControlsContext);
  if (context === undefined) {
    throw new Error('useControls must be used within a ControlsProvider');
  }
  return context;
}; 