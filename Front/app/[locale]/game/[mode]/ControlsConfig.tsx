import React, { useState, useEffect } from 'react';
import { useI18n } from "@/i18n-client";
import { useControls } from './ControlsContext';  // LE CONTEXT DES TOUCHES


// hugo imports 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";




//  mes props avec type.
interface ControlsConfigProps {
  isOpen: boolean;
  onClose: () => void;
  enableAI: boolean;
  is2v2Mode: boolean;
}


// transfo touche en emoji sinon sort de case + reduit sie trop longue 
// if multi branche
// default si aucun case 
export function displayKey(key: string) {
  if (!key) return '?';
  
  switch (key) {
    case 'ArrowUp': return '🡅';
    case 'ArrowDown': return '🡇';
    case 'ArrowLeft': return '🡄';
    case 'ArrowRight': return '🡆';
    default: return key.length > 3 ? key.substring(0, 3) : key;
  }
}




export const ControlsConfig: React.FC<ControlsConfigProps> = ({
  isOpen,
  onClose,
  enableAI,
  is2v2Mode,
}) => {


  // Obj. control = le conxte,  et son setter.
  const { controls, updateControls } = useControls();  //  IMPORT LE CONTEXT controls = Control  de ControlContext.tsx  . changement dans toute l appli (car utilise le context react dans  ControlContext.tsx)


  const [localControls, setLocalControls] = useState(controls); // local control = same mais copie temporaire pdt la modif dans l interface.  va voir les changement dans l interface.
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  // copie tempo pdt modif avant enreristrement du context actuel
  // pas modif pour rien si annule
  // si control change ou si is open on verif  et add la copie
  useEffect(() => {
    setLocalControls(controls);
  }, [controls, isOpen]); 


  // evenement de touche  + nom touche
  const handleKeyPress = (e: React.KeyboardEvent, key: string) => {

    // empeche fonctionnement de base de la touche 
    // nouvelle touche.
    e.preventDefault();
    let newKey = e.key;



    // Upper case pour uniformiser si MAJ oui pas.
    // les autre ont deja maj au debut
    if (newKey.length === 1) 
      newKey = newKey.toUpperCase();




    // entries = paire clef valeur
    // some = boucle sur chaque entree.
    // si la clef que je change ( up) est dif de la clef ( on compar avec down etc )  ET que y a deja ma value = touche deja prise
    const isKeyAlreadyAssigned = Object.entries(localControls).some(
      ([existingKey, existingValue]) => 
        existingKey !== key && existingValue === newKey
    );





    // message custom erreur selon touche si deja prise. 
    if (isKeyAlreadyAssigned) 
    {
      setErrorMessage(`Key "${displayKey(newKey)}" is already assigned to another command.`);
      return;
    }





    setErrorMessage(null); // vide le message d erreur (si etait present)

    // save en local la nouvelle touche, 
    setLocalControls((prev) => ({
      ...prev,
      [key]: newKey,
    }));

    setEditingKey(null);
  };







  // si save
  const handleSave = () => {
    updateControls(localControls);
    onClose(); // Appel onClose pour fermer + save
  };



  // si annule
  const handleCancel = () => {
    onClose(); // Appel  onClose pour fermer sans sauve
  };



  const t = useI18n();


  return (
    
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>

      {/* importe des truc de hugo */}
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px]">
        
        
        
        <DialogHeader>
          <DialogTitle>{t('game.controls.title')}</DialogTitle>
        </DialogHeader>



        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}




        <div className="grid grid-cols-2 gap-6">
          {/* Joueur 1 */}
          <Card>


            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-center">{t('game.controls.player1')}</CardTitle>
            </CardHeader>


            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="player1Up">{t('game.controls.up')}</Label>


                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player1Up')}
                  onKeyDown={(e) => editingKey === 'player1Up' && handleKeyPress(e, 'player1Up')}
                  tabIndex={0}
                >
                  {editingKey === 'player1Up' ? 'Appuyez sur une touche...' : displayKey(localControls.player1Up)}
                </Button>
              </div>


              <div className="space-y-2">
                <Label htmlFor="player1Down">{t('game.controls.down')}</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player1Down')}
                  onKeyDown={(e) => editingKey === 'player1Down' && handleKeyPress(e, 'player1Down')}
                  tabIndex={0}
                >
                  {editingKey === 'player1Down' ? 'Appuyez sur une touche...' : displayKey(localControls.player1Down)}
                </Button>
              </div>



              <div className="space-y-2">
                <Label htmlFor="player1Special">{t('game.controls.special')}</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player1Special')}
                  onKeyDown={(e) => editingKey === 'player1Special' && handleKeyPress(e, 'player1Special')}
                  tabIndex={0}
                >
                  {editingKey === 'player1Special' ? 'Appuyez sur une touche...' : displayKey(localControls.player1Special)}
                </Button>
              </div>



            </CardContent>



          </Card>






          {/* Joueur 2 */}
          <Card className={enableAI ? "opacity-50 pointer-events-none" : ""}>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-center">{t('game.controls.player2')} {enableAI ? "(IA)" : ""}</CardTitle>
            </CardHeader>


            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="player2Up">{t('game.controls.up')}</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player2Up')}
                  onKeyDown={(e) => editingKey === 'player2Up' && handleKeyPress(e, 'player2Up')}
                  tabIndex={0}
                  disabled={enableAI}
                >
                  {editingKey === 'player2Up' ? 'Appuyez sur une touche...' : displayKey(localControls.player2Up)}
                </Button>
              </div>




              <div className="space-y-2">
                <Label htmlFor="player2Down">{t('game.controls.down')}</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player2Down')}
                  onKeyDown={(e) => editingKey === 'player2Down' && handleKeyPress(e, 'player2Down')}
                  tabIndex={0}
                  disabled={enableAI}
                >
                  {editingKey === 'player2Down' ? 'Appuyez sur une touche...' : displayKey(localControls.player2Down)}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="player2Special">{t('game.controls.special')}</Label>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-mono"
                  onClick={() => setEditingKey('player2Special')}
                  onKeyDown={(e) => editingKey === 'player2Special' && handleKeyPress(e, 'player2Special')}
                  tabIndex={0}
                  disabled={enableAI}
                >
                  {editingKey === 'player2Special' ? 'Appuyez sur une touche...' : displayKey(localControls.player2Special)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {is2v2Mode && (
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Joueur 3 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-center">{t('game.controls.player3')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="player3Up">{t('game.controls.up')}</Label>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg font-mono"
                    onClick={() => setEditingKey('player3Up')}
                    onKeyDown={(e) => editingKey === 'player3Up' && handleKeyPress(e, 'player3Up')}
                    tabIndex={0}
                  >
                    {editingKey === 'player3Up' ? 'Appuyez sur une touche...' : displayKey(localControls.player3Up)}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player3Down">{t('game.controls.down')}</Label>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg font-mono"
                    onClick={() => setEditingKey('player3Down')}
                    onKeyDown={(e) => editingKey === 'player3Down' && handleKeyPress(e, 'player3Down')}
                    tabIndex={0}
                  >
                    {editingKey === 'player3Down' ? 'Appuyez sur une touche...' : displayKey(localControls.player3Down)}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player3Special">{t('game.controls.special')}</Label>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg font-mono"
                    onClick={() => setEditingKey('player3Special')}
                    onKeyDown={(e) => editingKey === 'player3Special' && handleKeyPress(e, 'player3Special')}
                    tabIndex={0}
                  >
                    {editingKey === 'player3Special' ? 'Appuyez sur une touche...' : displayKey(localControls.player3Special)}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Joueur 4 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-center">{t('game.controls.player4')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="player4Up">{t('game.controls.up')}</Label>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg font-mono"
                    onClick={() => setEditingKey('player4Up')}
                    onKeyDown={(e) => editingKey === 'player4Up' && handleKeyPress(e, 'player4Up')}
                    tabIndex={0}
                  >
                    {editingKey === 'player4Up' ? 'Appuyez sur une touche...' : displayKey(localControls.player4Up)}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player4Down">{t('game.controls.down')}</Label>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg font-mono"
                    onClick={() => setEditingKey('player4Down')}
                    onKeyDown={(e) => editingKey === 'player4Down' && handleKeyPress(e, 'player4Down')}
                    tabIndex={0}
                  >
                    {editingKey === 'player4Down' ? 'Appuyez sur une touche...' : displayKey(localControls.player4Down)}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player4Special">{t('game.controls.special')}</Label>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-lg font-mono"
                    onClick={() => setEditingKey('player4Special')}
                    onKeyDown={(e) => editingKey === 'player4Special' && handleKeyPress(e, 'player4Special')}
                    tabIndex={0}
                  >
                    {editingKey === 'player4Special' ? 'Appuyez sur une touche...' : displayKey(localControls.player4Special)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6">
          <Button variant="ghost" onClick={handleCancel}>
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
