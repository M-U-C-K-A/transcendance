import React, { useState, useEffect } from 'react';
import { useControls } from './ControlsContext';

interface ControlsConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsConfig: React.FC<ControlsConfigProps> = ({
  isOpen,
  onClose,
}) => {
  const { controls, updateControls } = useControls();
  const [localControls, setLocalControls] = useState(controls);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    setLocalControls(controls);
  }, [controls]);

  const handleKeyPress = (e: React.KeyboardEvent, key: string) => {
    e.preventDefault();
    const newKey = e.key.toUpperCase();
    setLocalControls((prev) => ({
      ...prev,
      [key]: newKey,
    }));
    setEditingKey(null);
  };

  const handleSave = () => {
    updateControls(localControls);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-foreground">Configuration des contrôles</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Joueur 1</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-foreground">Haut</label>
                  <button
                    className="w-full p-2 border rounded bg-card text-foreground"
                    onClick={() => setEditingKey('player1Up')}
                    onKeyDown={(e) => editingKey === 'player1Up' && handleKeyPress(e, 'player1Up')}
                    tabIndex={0}
                  >
                    {editingKey === 'player1Up' ? 'Appuyez sur une touche...' : localControls.player1Up}
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-foreground">Bas</label>
                  <button
                    className="w-full p-2 border rounded bg-card text-foreground"
                    onClick={() => setEditingKey('player1Down')}
                    onKeyDown={(e) => editingKey === 'player1Down' && handleKeyPress(e, 'player1Down')}
                    tabIndex={0}
                  >
                    {editingKey === 'player1Down' ? 'Appuyez sur une touche...' : localControls.player1Down}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Joueur 2</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-foreground">Haut</label>
                  <button
                    className="w-full p-2 border rounded bg-card text-foreground"
                    onClick={() => setEditingKey('player2Up')}
                    onKeyDown={(e) => editingKey === 'player2Up' && handleKeyPress(e, 'player2Up')}
                    tabIndex={0}
                  >
                    {editingKey === 'player2Up' ? 'Appuyez sur une touche...' : localControls.player2Up}
                  </button>
                </div>
                <div>
                  <label className="block text-sm text-foreground">Bas</label>
                  <button
                    className="w-full p-2 border rounded bg-card text-foreground"
                    onClick={() => setEditingKey('player2Down')}
                    onKeyDown={(e) => editingKey === 'player2Down' && handleKeyPress(e, 'player2Down')}
                    tabIndex={0}
                  >
                    {editingKey === 'player2Down' ? 'Appuyez sur une touche...' : localControls.player2Down}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}; 