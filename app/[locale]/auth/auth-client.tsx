'use client';

import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from 'next-themes';
import Image from "next/image";

export function LoginPage() {
  const { theme } = useTheme();

  const [isLogin, setIsLogin] = useState(true);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Rediriger vers la page de connexion après inscription réussie
      setIsLogin(true);
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            ft_transcendence
          </Link><ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLogin ? <Login /> : <Register />}
            <div className="mt-4 text-center text-sm">
              {isLogin ? (
                <>
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="underline underline-offset-4"
                  >
                    S'inscrire
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="underline underline-offset-4"
                  >
                    Se connecter
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          width={661}
          height={882}
          src="https://cdn.intra.42.fr/users/817d138365bfd981b4037301445eccfd/throbert.jpg"
          alt="DuckFace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* <PongGame /> */}
      </div>
    </div>
  );
}

