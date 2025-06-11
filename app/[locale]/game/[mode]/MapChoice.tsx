import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import Image from "next/image";

interface MapChoiceProps {
  MapStyle: "classic" | "red" | "neon" | null;
  setMapStyle: Dispatch<SetStateAction<"classic" | "red" | "neon" | null>>;
  enableMaluses: boolean;
  setEnableMaluses: Dispatch<SetStateAction<boolean>>;
  enableSpecial: boolean;
  setEnableSpecial: Dispatch<SetStateAction<boolean>>;
}

type MapKey = "classic" | "red" | "neon";

interface Map {
  key: MapKey;
  label: string;
  img: string;
  buttonVariant: string;
}

const maps: Map[] = [
  {
    key: "classic",
    label: "Classic",
    img: "/game/classic.png",
    buttonVariant: "classic",
  },
  {
    key: "red",
    label: "Enfer",
    img: "/game/hell.png",
    buttonVariant: "hell",
  },
  {
    key: "neon",
    label: "Neon",
    img: "/game/neon.png",
    buttonVariant: "neon",
  },
];

export default function MapChoice({
  MapStyle,
  setMapStyle,
  enableMaluses,
  setEnableMaluses,
  enableSpecial,
  setEnableSpecial
}: MapChoiceProps) {
  return (
    <div className="text-foreground">
      {/* Choix du style du sol ("Map") */}
      <div className="mb-2 text-center font-medium">Choisissez la map :</div>
      <div className="flex justify-center items-end space-x-8 mt-4">
        {maps.map((map) => (
          <div key={map.key} className="flex flex-col items-center">
            <Image
              width={200}
              height={200}
              src={map.img}
              alt={map.label}
              className={`w-30 h-18 object-cover rounded-lg border-4 mb-2
                ${
                  MapStyle === map.key
                    ? map.key === 'neon'
                      ? 'border-pink-500 dark:border-pink-400 scale-105 animate-pulse-slow'
                      : map.key === 'red'
                        ? 'border-red-600 dark:border-red-400'
                        : 'border-gray-800 dark:border-white/80 scale-105 animate-pulse-slow'
                    : 'border-gray-300 dark:border-zinc-700'
                }`}
            />
            <Button
              variant={map.buttonVariant as "classic" | "hell" | "neon" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined}
              onClick={() => setMapStyle(map.key)}
              className={`mt-1 w-32 text-center ${MapStyle === map.key ? "scale-105 shadow-lg" : "opacity-80"}`}
            >
              {map.label}
            </Button>
          </div>
        ))}
      </div>

      {/* Boutons pour activer les Malus et le coup spécial avec Tooltip */}
      <div className="mt-8 flex justify-between items-center space-x-4">
        {/* Option Malus */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full border rounded-md">
                <Toggle
                  pressed={enableMaluses}
                  onPressedChange={() => setEnableMaluses(!enableMaluses)}
                  className={`w-full data-[state=on]:bg-red-600 data-[state=on]:text-white data-[state=on]:dark:bg-red-500 data-[state=on]:dark:border-red-400 data-[state=on]:dark:text-white dark:border dark:border-zinc-500 ${enableMaluses ? "animate-pulse" : ""}`}
                >
                  {enableMaluses ? "Malus Activés" : "Activer les Malus"}
                </Toggle>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[250px] p-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Système de Malus</h4>
                <p className="text-sm text-muted-foreground">
                  Un Malus &quot;🟥&quot; apparaît toutes les 15 secondes sur la map.<br />
                  Le toucher retire 1 point à l&apos;adversaire !
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
                  className={`w-full data-[state=on]:bg-cyan-500 data-[state=on]:text-white data-[state=on]:dark:bg-cyan-400 data-[state=on]:dark:border-cyan-300 data-[state=on]:dark:text-white dark:border dark:border-zinc-500 ${enableSpecial ? "animate-pulse" : ""}`}
                >
                  {enableSpecial ? "Coup spécial Activé" : "Activer le Coup spécial"}
                </Toggle>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[250px] p-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Coup Spécial</h4>
                <p className="text-sm text-muted-foreground">
                  Chaque joueur remplit une barre en touchant la balle.<br />
                  Après 10 frappes, vous pouvez activer un &quot;coup spécial&quot; :<br />
                  votre pad grossit et renvoie la balle plus vite. L&apos;effet dure 5 secondes.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
