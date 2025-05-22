import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DefaultPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden opacity-80">
      {/* Dégradé de fond */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#f8f4e8] to-[#00404c] z-0" />

      {/* Barres verticales - générées dynamiquement */}
      <div className="absolute inset-0 flex justify-between z-10">
        {Array.from({ length: 140 }).map((_, i) => (
          <div
            key={i}
            className="w-[2px] h-full bg-gray-50 opacity-20"
          />
        ))}
      </div>

      {/* Titre centré */}
	  <div className="z-20 relative flex flex-col items-center pt-80 justify-center h-screen">
	<p className="text-8xl">.</p>
	<Badge variant="default" className="opacity-70 text-white bg-[#00505c90]">1.335 People are on waitlist</Badge>
      <h1 className=" text-5xl font-bold text-center text-white">
        Clarity in <span className="font-extrabold font-serif ml-2">Complexity</span>
      </h1>
	  <p className="mt-4 text-center text-sm">We help you decode the noise, One insight at a time. <br />
	  Transform chaos into clarity with intelligent solutions built for scale.</p>
	  <Button className="rounded-full px-6 py-2 mt-4">Get started</Button>
	  </div>
    </div>
  )
}
