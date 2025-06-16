import { Dispatch, SetStateAction } from "react";
import { Card } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import Image from "next/image";
import { useTheme } from "next-themes";

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
  imgLight: string;
  imgDark: string;
  color: string;
}

export default function MapChoice({
  MapStyle,
  setMapStyle,
  enableMaluses,
  setEnableMaluses,
  enableSpecial,
  setEnableSpecial
}: MapChoiceProps) {
  const { theme } = useTheme();

  const maps: Map[] = [
    {
      key: "classic",
      imgLight: "/game/classic-light.png",
      imgDark: "/game/classic-dark.png",
      color: "border-gray-400 dark:border-gray-300"
    },
    {
      key: "red",
      imgLight: "/game/hell-light.png",
      imgDark: "/game/hell-dark.png",
      color: "border-red-500 dark:border-red-400"
    },
    {
      key: "neon",
      imgLight: "/game/neon-light.png",
      imgDark: "/game/neon-dark.png",
      color: "border-pink-500 dark:border-pink-400"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {maps.map((map) => (
          <Card
            key={map.key}
            onClick={() => setMapStyle(map.key)}
            className={`
              cursor-pointer transition-all hover:shadow-md p-0
              ${MapStyle === map.key ?
                `${map.color} border-2 scale-[1.02] shadow-lg rounded-md` :
                'border border-muted-foreground/30 hover:border-muted-foreground/50 rounded-md'
              }
            `}
          >
            <div className="relative aspect-video w-full h-full">
              <Image
                src={theme === "dark" ? map.imgDark : map.imgLight}
                alt={map.key}
                fill
                className="object-cover rounded-md"
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
