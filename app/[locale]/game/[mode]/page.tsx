"use client"

import { Header } from "@/components/dashboard/Header"
import { useParams } from "next/navigation"
import PongGame from "@/components/PongGame"

export default function Game() {
  const params = useParams()
  const locale = params.locale ?? "fr"

  return (
    <>
      <Header locale={locale} />
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-blue-500">
        <div className="mb-12 max-w-4xl rounded-lg border border-border bg-red-500 p-10">
          <PongGame locale={locale} />
        </div>
      </main>
    </>
  )
}
