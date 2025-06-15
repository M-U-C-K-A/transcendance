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


// esaoce memoir react partageable.
// stock les maj de control provider
// les donne par usecontext a Use control
const ControlsContext = createContext<ControlsContextType | undefined>(undefined);





// la ft qui fournit le contexte à toute l'application
  // ReactNode = tout ce que react peut afficher ( en gros de type react)


  // children = seront les composant dedans, le :{} ca le destructure pour precsier
  // il est constamment appele et maj pour creer le context (dans le return) CONTROL CONTEXT ( au dessus . qui est lu en bas et use dans control config. par local storage)
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







  return (
    <ControlsContext.Provider value={{ controls, updateControls: handleUpdateControls }}>
      {children}
    </ControlsContext.Provider>
  );
}






// lit le contexte avec Usecontext
// le stock et le renvoit
function useControls() {
  const context = useContext(ControlsContext);
  if (context === undefined) {
    throw new Error('useControls must be used within a ControlsProvider');
  }
  return context;
}




// le prop qui va etre encadrant. 

export { ControlsProvider, useControls };
