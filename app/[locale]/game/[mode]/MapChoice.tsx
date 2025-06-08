import { Dispatch, SetStateAction, useId } from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MapChoiceProps {
  MapStyle: "classic" | "red" | "neon" | null;
  setMapStyle: Dispatch<SetStateAction<"classic" | "red" | "neon" | null>>;
  enableMaluses: boolean;
  setEnableMaluses: Dispatch<SetStateAction<boolean>>;
  enableSpecial: boolean;
  setEnableSpecial: Dispatch<SetStateAction<boolean>>;
}

// Images de prévisualisation des maps (remplacez par vos propres images)
const mapPreviews = {
  classic: "/game/classic.png",
  red: "/game/hell.png",
  neon: "/game/neon.png",
};

export default function MapChoice({ 
  MapStyle, 
  setMapStyle, 
  enableMaluses, 
  setEnableMaluses, 
  enableSpecial, 
  setEnableSpecial
}: MapChoiceProps) {
  const id = useId();
  
  const mapOptions = [
    { value: "classic", label: "Classic", preview: mapPreviews.classic },
    { value: "red", label: "Enfer", preview: mapPreviews.red },
    { value: "neon", label: "Neon", preview: mapPreviews.neon },
  ];

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <Label className="text-center text-lg font-semibold">Configuration de la partie</Label>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Choix du style de map */}
        <fieldset className="space-y-4">
          <legend className="text-foreground text-sm leading-none font-medium">
            Style de map
          </legend>
          <RadioGroup 
            value={MapStyle || ""}
            onValueChange={(value) => setMapStyle(value as "classic" | "red" | "neon")}
            className="flex gap-3"
          >
            {mapOptions.map((item) => (
              <label key={`${id}-${item.value}`} className="flex flex-col items-center">
                <RadioGroupItem
                  id={`${id}-${item.value}`}
                  value={item.value}
                  className="peer sr-only after:absolute after:inset-0"
                />
                <div className="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50">
                  <img
                    src={item.preview}
                    alt={item.label}
                    width={88}
                    height={70}
                    className="object-cover w-22 h-16"
                  />
                </div>
                <span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
                  <CheckIcon
                    size={16}
                    className="group-peer-data-[state=unchecked]:hidden text-green-500"
                    aria-hidden="true"
                  />
                  <MinusIcon
                    size={16}
                    className="group-peer-data-[state=checked]:hidden"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>

        {/* Options de jeu */}
        <div className="flex justify-between items-center space-x-4">
          {/* Option Malus */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full border rounded-md">
                  <Toggle
                    pressed={enableMaluses}
                    onPressedChange={() => setEnableMaluses(!enableMaluses)}
                    className={`w-full data-[state=on]:bg-red-600 data-[state=on]:text-white ${
                      enableMaluses ? "animate-pulse" : ""
                    }`}
                  >
                    {enableMaluses ? "Malus Activés" : "Activer les Malus"}
                  </Toggle>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[250px] p-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Système de Malus</h4>
                  <p className="text-sm text-muted-foreground">
                    Un Malus "🟥" apparaît toutes les 15 secondes sur la map.
                    Le toucher retire 1 point à l'adversaire !
                  </p>
                  <p className="text-sm text-red-400 font-medium">
                    ⚠️ Arriver à -5 points signifie que vous avez perdu !
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Option Coup spécial */}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full border rounded-md">
                  <Toggle
                    pressed={enableSpecial}
                    onPressedChange={() => setEnableSpecial(!enableSpecial)}
                    className={`w-full data-[state=on]:bg-cyan-500 data-[state=on]:text-white ${
                      enableSpecial ? "animate-pulse" : ""
                    }`}
                  >
                    {enableSpecial ? "Coup spécial Activé" : "Activer le Coup spécial"}
                  </Toggle>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[250px] p-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Coup Spécial</h4>
                  <p className="text-sm text-muted-foreground">
                    Chaque joueur remplit une barre en touchant la balle.
                    Après 10 frappes, vous pouvez activer un "coup spécial" :
                    votre pad grossit et renvoie la balle plus vite pendant 5 secondes.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
