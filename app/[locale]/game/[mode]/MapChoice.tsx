import { Dispatch, SetStateAction } from "react";
import { Card } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import Image from "next/image";

interface MapChoiceProps {
  MapStyle: "classic" | "red" | "neon";
  setMapStyle: Dispatch<SetStateAction<"classic" | "red" | "neon">>;
  enableMaluses: boolean;
  setEnableMaluses: Dispatch<SetStateAction<boolean>>;
  enableSpecial: boolean;
  setEnableSpecial: Dispatch<SetStateAction<boolean>>;
}

type MapKey = "classic" | "red" | "neon";

interface Map {
  key: MapKey;
  img: string;
  color: string;
}

const maps: Map[] = [
  {
    key: "classic",
    img: "/game/classic.png",
    color: "border-gray-400 dark:border-gray-300"
  },
  {
    key: "red",
    img: "/game/hell.png",
    color: "border-red-500 dark:border-red-400"
  },
  {
    key: "neon",
    img: "/game/neon.png",
    color: "border-pink-500 dark:border-pink-400"
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
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {maps.map((map) => (
          <Card
            key={map.key}
            onClick={() => setMapStyle(map.key)}
            className={`
              cursor-pointer transition-all hover:shadow-md
              ${MapStyle === map.key ?
                `${map.color} border-2 scale-[1.02] shadow-lg` :
                'border border-muted-foreground/30 hover:border-muted-foreground/50'
              }
            `}
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={map.img}
                alt={map.key}
                fill
                className="object-cover"
                quality={100}
              />
              {MapStyle === map.key && (
                <div className="absolute inset-0 bg-black/20 dark:bg-white/10 flex items-center justify-center">
                  <div className="bg-white dark:bg-black rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Toggle
                  pressed={enableMaluses}
                  onPressedChange={() => setEnableMaluses(!enableMaluses)}
                  className="w-full h-12 data-[state=on]:bg-red-600 data-[state=on]:text-white data-[state=on]:dark:bg-red-500 animate-pulse"
                >
                  <span className="font-medium">
                    {enableMaluses ? "Malus ON" : "Malus OFF"}
                  </span>
                </Toggle>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[250px] p-4">
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

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Toggle
                  pressed={enableSpecial}
                  onPressedChange={() => setEnableSpecial(!enableSpecial)}
                  className="w-full h-12 data-[state=on]:bg-cyan-600 data-[state=on]:text-white data-[state=on]:dark:bg-cyan-500 animate-pulse"
                >
                  <span className="font-medium">
                    {enableSpecial ? "Spécial ON" : "Spécial OFF"}
                  </span>
                </Toggle>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[250px] p-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Coup Spécial</h4>
                <p className="text-sm text-muted-foreground">
                  Chaque joueur remplit une barre en touchant la balle.
                  Après 10 frappes, vous pouvez activer un "coup spécial" :
                  votre pad grossit et renvoie la balle plus vite. L'effet dure 5 secondes.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
