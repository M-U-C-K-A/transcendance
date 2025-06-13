import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateControls } from "@/components/game/Physic/customControls";

interface Controls {
  player1Up: string;
  player1Down: string;
  player2Up: string;
  player2Down: string;
  player1Special: string;
  player2Special: string;
}

interface ControlsContextType { // Structure du contexte
  controls: Controls; // Les touches actuelles
  updateControls: (newControls: Controls) => void; // Fonction pour modifier les touches
}

const defaultControls: Controls = {
  player1Up: 'W',
  player1Down: 'S',
  player2Up: 'ArrowUp',
  player2Down: 'ArrowDown',
  player1Special: 'E',
  player2Special: 'ArrowLeft',
};

const ControlsContext = createContext<ControlsContextType | undefined>(undefined); // Crée le contexte React ( comme pour passer un bout d html ou js  mais la c est que pour des variables pas d affichage.)





// la ft qui fournit le contexte à toute l'application
  // ReactNode = tout ce que react peut afficher ( en gros de type react)

function ControlsProvider({ children }: { children: React.ReactNode }) {
  // On crée un état local pour stocker les touches du jeu
  const [controls, setControls] = useState<Controls>(() => {
    // Verif  qu'on est dans un navigateur (pas sur serv par ex)
    if (typeof window !== 'undefined') {
      const savedControls = localStorage.getItem('gameControls'); //  recup  controls save dans le navigateur (local storage = stockage local du navigateur), je cree la clef gameControls. pour stocker les controls.
      if (savedControls) {
        return JSON.parse(savedControls); // met en json
      }
    }
    return defaultControls; // sinon control par defaut
  });

  function handleUpdateControls(newControls: Controls) {
    setControls(newControls); // rappel la ft au dessus (new control dans interface du dessus.)
    localStorage.setItem('gameControls', JSON.stringify(newControls)); // save dans le navigateur a la clef donnee.

    // envoit les controls dans la logique du jeu ( custom controls)
    updateControls(newControls);
  }

  // on MAJ update control a chque changement de control dans l interface.
  useEffect(() => {
    updateControls(controls);
  }, [controls]); 

  //  dit que tout ce qui sera entre les balise controlsprovider aura l acces aux context des touches.  (voir page.tsx)
  return (
    <ControlsContext.Provider value={{ controls, updateControls: handleUpdateControls }}>
      {children}
    </ControlsContext.Provider>
  );
}







function useControls() {
  const context = useContext(ControlsContext);
  if (context === undefined) {
    throw new Error('useControls must be used within a ControlsProvider');
  }
  return context;
}





export { ControlsProvider, useControls };
