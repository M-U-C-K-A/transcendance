import { Dispatch, SetStateAction } from "react";

interface MapChoiceProps {
  MapStyle: "classic" | "red" | "neon" | null;
  setMapStyle: Dispatch<SetStateAction<"classic" | "red" | "neon" | null>>;
  enableMaluses: boolean;
  setEnableMaluses: Dispatch<SetStateAction<boolean>>;
  enableSpecial: boolean;
  setEnableSpecial: Dispatch<SetStateAction<boolean>>;
}

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
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setMapStyle("classic")}
          className={`px-4 py-2 rounded-lg font-semibold border ${
            MapStyle === "classic"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
          }`}
        >
          Classic
        </button>
        <button
          onClick={() => setMapStyle("red")}
          className={`px-4 py-2 rounded-lg font-semibold border ${
            MapStyle === "red"
              ? "bg-red-600 text-white border-red-600"
              : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
          }`}
        >
          Enfer
        </button>
        <button
          onClick={() => setMapStyle("neon")}
          className={`px-4 py-2 rounded-lg font-semibold border ${
            MapStyle === "neon"
              ? "bg-purple-500 text-white border-purple-500"
              : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
          }`}
        >
          Neon
        </button>
      </div>

      {/* Boutons pour activer les Malus et le coup spécial */}
      <div className="mt-4 text-center flex justify-center space-x-4">
        {/* Bouton Malus */}
        <div className="relative inline-block group">
          <button
            onClick={() => setEnableMaluses(!enableMaluses)}
            className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 ${
              enableMaluses
                ? "bg-red-600 text-white border-red-600 animate-pulse"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-red-100 hover:text-red-700"
            }`}
          >
            {enableMaluses ? "Malus Activés" : "Activer les Malus"}
          </button>
          {/* Infobulle au survol */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Un Malus "🟥" apparaît toutes les 15 secondes sur la map.<br />
            Le toucher retire 1 point à l'adversaire ! ⚠️ Arriver à -5 signifie que vous avez perdu !
          </div>
        </div>
        {/* Bouton Coup spécial */}
        <div className="relative inline-block group">
          <button
            onClick={() => setEnableSpecial(!enableSpecial)}
            className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-200 ${
              enableSpecial
                ? "bg-cyan-500 text-white border-cyan-500 animate-pulse"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-cyan-100 hover:text-cyan-700"
            }`}
          >
            {enableSpecial ? "Coup spécial Activé" : "Activer le Coup spécial"}
          </button>
          {/* Infobulle au survol */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Quand l'option est activée, chaque joueur remplit une barre en touchant la balle.<br />
            Une fois pleine (10 frappes), il peut activer un "coup spécial" (touche personnalisable) : son pad grossit et renvoie la balle plus vite pendant 5 secondes.
          </div>
        </div>
      </div>
    </div>
  );
}
