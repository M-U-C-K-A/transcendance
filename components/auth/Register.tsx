'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '../ui/alert-dialog';

const registerSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  username: z.string()
    .min(3, { message: 'Nom trop court (min 3 caractères)' })
    .max(20, { message: 'Nom trop long (max 20 caractères)' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Seulement lettres, chiffres et underscore autorisés'
    }),
  password: z.string().min(6, { message: 'Mot de passe trop court (min 6 caractères)' }),
});

export function Register({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const router = useRouter();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsSubmitting(true);

    const formData = { email, username, password };
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) errors[err.path[0]] = err.message;
      });
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: result.data.email,
          username: result.data.username,
          pass: result.data.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      // Stocker l'email temporairement
      localStorage.setItem('temp_2fa_email', result.data.email);
      // Afficher la popup 2FA
      setShow2FAModal(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async () => {
    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      setOtpError('Le code doit contenir exactement 6 chiffres');
      return;
    }

    setOtpError('');
    setIsSubmitting(true);

    try {
      const email = localStorage.getItem('temp_2fa_email');
      if (!email) {
        throw new Error('Session expirée, veuillez recommencer l\'inscription');
      }

      const response = await fetch('/api/auth/register/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otpCode }),
      });

      if (response.ok) {
        // Nettoyer le stockage et rediriger
        localStorage.removeItem('temp_2fa_email');
        router.push('/dashboard');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Code 2FA incorrect');
      }
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Erreur lors de la vérification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleRegisterSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="text-sm text-muted-foreground">
          Entrez vos informations pour créer votre compte
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
          />
          {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Nom d&apos;utilisateur</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {fieldErrors.username && <p className="text-sm text-red-500">{fieldErrors.username}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && <p className="text-sm text-red-500">{fieldErrors.password}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Inscription en cours...' : 'S&apos;inscrire'}
        </Button>
      </div>
    </form>

      {/* Popup 2FA */}
      <AlertDialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vérification en 2 étapes</AlertDialogTitle>
            <AlertDialogDescription>
              Un code à 6 chiffres a été envoyé à {email}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4">
            {otpError && (
              <div className="p-2 text-sm text-red-500 bg-red-50 rounded">
                {otpError}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="otp">Code de vérification</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                pattern="\d{6}"
                inputMode="numeric"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                className="w-full"
                onClick={handle2FASubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Vérification...' : 'Vérifier'}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
