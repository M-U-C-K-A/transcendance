'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Eye, EyeOff } from 'lucide-react'; // Import des icônes d'œil

const loginSchema = z.object({
	email: z.string().email({ message: 'Email invalide' }),
	password: z.string().min(6, { message: 'Mot de passe trop court (min. 6 caractères)' }),
});

export function Login({
	className,
	...props
}: React.ComponentPropsWithoutRef<'form'>) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false); // État pour afficher/cacher le mot de passe
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		const result = loginSchema.safeParse({ email, password });
		if (!result.success) {
			const firstError = result.error.issues[0]?.message || 'Champs invalides';
			setError(firstError);
			return;
		}

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, pass:password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Erreur lors de la connexion');
			}

			localStorage.setItem('token', data.token);
			router.push(`/en/dashboard`);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Une erreur est survenue');
		}
	};

	const handleGoogleLogin = async () => {
		try {
			const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
				process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
			}&redirect_uri=${encodeURIComponent(
				process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback'
			)}&response_type=code&scope=${encodeURIComponent('email profile')}`;

			window.location.href = googleAuthUrl;
		} catch (err) {
			setError('Erreur lors de la connexion avec Google');
		}
	};

	return (
		<form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Connectez-vous à votre compte</h1>
				<p className="text-sm text-muted-foreground">
					Entrez votre email pour vous connecter à votre compte
				</p>
			</div>
			{error && (
				<div className="p-2 text-sm text-red-500 bg-red-50 rounded">
					{error}
				</div>
			)}
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="grid gap-2">
					<div className="flex items-center">
						<Label htmlFor="password">Mot de passe</Label>
						<a
							href="#"
							className="ml-auto text-sm underline-offset-4 hover:underline"
						>
							Mot de passe oublié ?
						</a>
					</div>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button
							type="button"
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</div>
				<Button type="submit" className="w-full">
					Se connecter
				</Button>
				<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
					<span className="relative z-10 bg-background px-2 text-muted-foreground">
						Ou continuer avec
					</span>
				</div>
				<Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
					<svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
							fill="currentColor"
						/>
					</svg>
					Continuer avec Google
				</Button>
			</div>
		</form>
	);
}
