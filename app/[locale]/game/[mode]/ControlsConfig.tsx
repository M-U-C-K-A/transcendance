import React, { useState, useEffect } from 'react';
import { useControls } from './ControlsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  }, [controls, isOpen]); // Ajout de isOpen comme dépendance pour réinitialiser à l'ouverture

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Configuration des contrôles</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Joueur 1 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Joueur 1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="player1Up">Haut</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player1Up')}
                  onKeyDown={(e) => editingKey === 'player1Up' && handleKeyPress(e, 'player1Up')}
                  tabIndex={0}
                >
                  {editingKey === 'player1Up' ? 'Appuyez sur une touche...' : localControls.player1Up}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="player1Down">Bas</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player1Down')}
                  onKeyDown={(e) => editingKey === 'player1Down' && handleKeyPress(e, 'player1Down')}
                  tabIndex={0}
                >
                  {editingKey === 'player1Down' ? 'Appuyez sur une touche...' : localControls.player1Down}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="player1Special">Coup spécial</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player1Special')}
                  onKeyDown={(e) => editingKey === 'player1Special' && handleKeyPress(e, 'player1Special')}
                  tabIndex={0}
                >
                  {editingKey === 'player1Special' ? 'Appuyez sur une touche...' : localControls.player1Special}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Joueur 2 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Joueur 2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="player2Up">Haut</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player2Up')}
                  onKeyDown={(e) => editingKey === 'player2Up' && handleKeyPress(e, 'player2Up')}
                  tabIndex={0}
                >
                  {editingKey === 'player2Up' ? 'Appuyez sur une touche...' : localControls.player2Up}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="player2Down">Bas</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player2Down')}
                  onKeyDown={(e) => editingKey === 'player2Down' && handleKeyPress(e, 'player2Down')}
                  tabIndex={0}
                >
                  {editingKey === 'player2Down' ? 'Appuyez sur une touche...' : localControls.player2Down}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="player2Special">Coup spécial</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player2Special')}
                  onKeyDown={(e) => editingKey === 'player2Special' && handleKeyPress(e, 'player2Special')}
                  tabIndex={0}
                >
                  {editingKey === 'player2Special' ? 'Appuyez sur une touche...' : localControls.player2Special}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
