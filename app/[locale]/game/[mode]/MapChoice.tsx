import { Dispatch, SetStateAction } from "react";

interface MapChoiceProps {
  MapStyle: "classic" | "red" | "neon" | null;
  setMapStyle: Dispatch<SetStateAction<"classic" | "red" | "neon" | null>>;
}

export default function MapChoice({ MapStyle, setMapStyle }: MapChoiceProps) {
  return (
    <div className="text-foreground">
      {/* Choix du style du sol (“Map”) */}
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
    </div>
  );
}
