"use client"

import { Header } from "@/components/dashboard/Header"
import { useParams } from "next/navigation"
import { PongGame } from "@/components/PongGame"

export default function Game() {
  const params = useParams()
  const locale = params.locale ?? "fr" // Par défaut français si pas défini

  return (
    <>
      <Header locale={locale} />
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="mb-12 max-w-4xl rounded-lg border border-border bg-background p-10">
          <PongGame locale={locale} />
        </div>
      </main>
    </>
  )
}
