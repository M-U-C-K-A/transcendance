'use client';

import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export function LoginPage() {

	const [isLogin, setIsLogin] = useState(true);

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
										S&apos;inscrire
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
					src={""}
					alt="DuckFace"
					className="absolute inset-0 w-full h-full object-cover opacity-50"
				/>
			</div>
		</div>
	);
}

