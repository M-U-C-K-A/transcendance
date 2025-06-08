import React, { useState, useEffect } from "react"
import { GameState } from "../../../../components/game/gameTypes"
import { ControlsConfig } from "./ControlsConfig"
import { useControls } from "./ControlsContext"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

export const GameUI: React.FC<{
  score: GameState["score"]
  winner: GameState["winner"]
  countdown: GameState["countdown"]
  isPaused: GameState["isPaused"]
  setIsPaused: (paused: boolean) => void
  enableMaluses?: boolean
  MalusBarKey?: number
  stamina: { player1: number; player2: number }
  superPad: { player1: boolean; player2: boolean }
  enableSpecial?: boolean
}> = ({ score, winner, countdown, isPaused, setIsPaused, enableMaluses, MalusBarKey, stamina, superPad, enableSpecial }) => {
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);
  const { controls } = useControls();

  // Gestion du timer pour le prochain Malus
  const Malus_INTERVAL = 15; // secondes
  const [MalusTimer, setMalusTimer] = useState(Malus_INTERVAL);
  useEffect(() => {
    setMalusTimer(Malus_INTERVAL);
    const interval = setInterval(() => {
      setMalusTimer((prev) => {
        if (prev <= 1) return Malus_INTERVAL;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [MalusBarKey]);

  // Timers pour le coup spécial
  const [specialTimer1, setSpecialTimer1] = useState(0);
  const [specialTimer2, setSpecialTimer2] = useState(0);

  useEffect(() => {
    let interval1: NodeJS.Timeout | null = null;
    if (superPad.player1) {
      setSpecialTimer1(5);
      interval1 = setInterval(() => {
        setSpecialTimer1((prev) => {
          if (prev <= 1) {
            clearInterval(interval1!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSpecialTimer1(0);
    }
    return () => { if (interval1) clearInterval(interval1); };
  }, [superPad.player1]);

  useEffect(() => {
    let interval2: NodeJS.Timeout | null = null;
    if (superPad.player2) {
      setSpecialTimer2(5);
      interval2 = setInterval(() => {
        setSpecialTimer2((prev) => {
          if (prev <= 1) {
            clearInterval(interval2!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSpecialTimer2(0);
    }
    return () => { if (interval2) clearInterval(interval2); };
  }, [superPad.player2]);

  return (
    <>
      {/* Score en haut */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center w-full pointer-events-none">
        <Card className="bg-background/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-extrabold text-center">
              {score.player1} - {score.player2}
            </CardTitle>
          </CardHeader>
        </Card>
        
        {/* Barre de chargement du Malus centrée sous le score */}
        {enableMaluses && (
          <div className="absolute left-1/2 top-28 transform -translate-x-1/2 flex flex-col items-center z-20">
            <Label className="mb-1 text-sm font-semibold text-destructive">Malus dans : {MalusTimer}s</Label>
            <Progress 
              value={((Malus_INTERVAL - MalusTimer) / Malus_INTERVAL) * 100} 
              className="w-64 h-2 bg-gray-200"
              indicatorClassName="bg-destructive"
            />
          </div>
        )}
      </div>

      {/* Touches visuelles + Stamina Joueur 1 */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-20 space-y-4">
        <div className="flex flex-col space-y-2">
          <Button variant="outline" size="lg" className="w-12 h-12">
            {controls.player1Up}
          </Button>
          <Button variant="outline" size="lg" className="w-12 h-12">
            {controls.player1Down}
          </Button>
        </div>
        
        {/* Affichage de la touche d'activation du coup spécial */}
        {enableSpecial && (
          <div className="flex flex-col items-center space-y-2">
            {superPad.player1 && (
              <Badge variant="secondary" className="text-cyan-700 font-bold">
                Coup spécial: {specialTimer1}s
              </Badge>
            )}
            <Button 
              variant={superPad.player1 ? "default" : "outline"} 
              size="lg"
              className={`w-12 h-12 ${superPad.player1 ? 'bg-cyan-600 hover:bg-cyan-700 animate-pulse' : (stamina.player1 === 10 ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-800' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700')}`}
            >
              {controls.player1Special || 'E'}
            </Button>
            
            {/* Barre de stamina joueur 1 */}
            <div className="flex flex-col items-center space-y-1">
              <Progress 
                value={(stamina.player1 / 10) * 100} 
                className="w-12 h-2 bg-gray-200"
                indicatorClassName={superPad.player1 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}
              />
              {stamina.player1 < 10 ? (
                <Badge variant="default">
                  {`${10 - stamina.player1} frappe${10 - stamina.player1 > 1 ? 's' : ''} restante${10 - stamina.player1 > 1 ? 's' : ''}`}
                </Badge>
              ) : (
                <Badge variant="secondary">Coup spécial prêt !</Badge>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Touches visuelles + Stamina Joueur 2 */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-20 space-y-4">
        <div className="flex flex-col space-y-2">
          <Button variant="outline" size="lg" className="w-12 h-12">
            {controls.player2Up}
          </Button>
          <Button variant="outline" size="lg" className="w-12 h-12">
            {controls.player2Down}
          </Button>
        </div>
        
        {/* Affichage de la touche d'activation du coup spécial */}
        {enableSpecial && (
          <div className="flex flex-col items-center space-y-2">
            {superPad.player2 && (
              <Badge variant="secondary" className="text-cyan-700 font-bold">
                Coup spécial: {specialTimer2}s
              </Badge>
            )}
            <Button 
              variant={superPad.player2 ? "default" : "outline"} 
              size="lg"
              className={`w-12 h-12 ${superPad.player2 ? 'bg-cyan-600 hover:bg-cyan-700 animate-pulse' : (stamina.player2 === 10 ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-800' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700')}`}
            >
              {controls.player2Special || 'ArrowLeft'}
            </Button>
            
            {/* Barre de stamina joueur 2 */}
            <div className="flex flex-col items-center space-y-1">
              <Progress 
                value={(stamina.player2 / 10) * 100} 
                className="w-12 h-2 bg-gray-200"
                indicatorClassName={superPad.player2 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}
              />
              {stamina.player2 < 10 ? (
                <Badge variant="default">
                  {`${10 - stamina.player2} frappe${10 - stamina.player2 > 1 ? 's' : ''} restante${10 - stamina.player2 > 1 ? 's' : ''}`}
                </Badge>
              ) : (
                <Badge variant="secondary">Coup spécial prêt !</Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gagnant */}
      {winner && (
        <Dialog open={!!winner}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center text-4xl font-extrabold text-green-600">
                  🏆 {winner} a gagné !
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center space-x-4">
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Rejouer
                </Button>
                <Button 
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      const audio = (window as any).__GAME_AUDIO__;
                      if (audio?.pause) audio.pause();
                    }
                    window.history.back();
                  }}
                  variant="destructive"
                >
                  Quitter
                </Button>
              </CardContent>
            </Card>
          </div>
        </Dialog>
      )}

      {/* Décompte */}
      {countdown !== null && (
        <div className="absolute inset-0 bg-gray-400/40 flex items-center justify-center z-10">
          <Card className="p-8">
            <CardTitle className="text-6xl font-bold">
              {countdown}
            </CardTitle>
          </Card>
        </div>
      )}

      {/* Contrôles et Pause */}
      <div className="absolute top-2 right-2 z-20 flex items-center space-x-2">
        <Button
          onClick={() => setIsControlsConfigOpen(true)}
          variant="outline"
          size="icon"
        >
          ⚙️
        </Button>
        <Badge variant="outline" className="px-2 py-1">
          Échap
        </Badge>
        {isPaused ? (
          <Button
            onClick={() => setIsPaused(false)}
            disabled={countdown !== null}
            className={countdown !== null ? "opacity-50 cursor-not-allowed" : ""}
          >
            Reprendre
          </Button>
        ) : (
          <Button
            onClick={() => setIsPaused(true)}
            disabled={countdown !== null}
            variant="secondary"
            className={countdown !== null ? "opacity-50 cursor-not-allowed" : ""}
          >
            Pause
          </Button>
        )}
      </div>

      {/* Modal de configuration des contrôles */}
      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={() => setIsControlsConfigOpen(false)}
      />
    </>
  );
};
