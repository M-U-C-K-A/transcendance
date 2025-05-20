'use client';

import { GalleryVerticalEnd } from "lucide-react"
import { Login } from "@/components/auth/Login"
import { Register } from "@/components/auth/Register"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PongGame from "@/components/landing/PongGame";

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription')
      }

      // Rediriger vers la page de connexion après inscription réussie
      setIsLogin(true)
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Transcendance
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLogin ? (
              <Login />
            ) : (
              <Register />
            )}
            {isLogin && (
              <div className="mt-4 text-center text-sm">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="underline underline-offset-4"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
       <PongGame />
      </div>
    </div>
  )
}
