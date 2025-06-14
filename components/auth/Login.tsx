'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '../ui/alert-dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// Schemas de validation
const loginSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(6, { message: 'Mot de passe trop court (min. 6 caractères)' }),
});

const otpSchema = z.string().length(6, { message: 'Le code doit contenir 6 chiffres' });

export function Login({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined' || token === 'null') return;

      try {
        const res = await fetch('/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          router.push('/en/dashboard');
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        localStorage.removeItem('token');
      }
    };

    checkAuth();

    const errorFromUrl = searchParams.get('error');
    if (errorFromUrl === 'google_login_failed') {
      setError("Échec de la connexion avec Google");
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Champs invalides');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pass: password }),
      });

      if (response.ok) {
        // Si la réponse est OK, on ouvre directement la modale OTP
        localStorage.setItem('temp_2fa_email', email);
        setShow2FAModal(true);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la connexion');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async () => {
    const result = otpSchema.safeParse(otpCode);
    if (!result.success) {
      setOtpError(result.error.issues[0]?.message || 'Code invalide');
      return;
    }

    setOtpError('');
    setIsSubmitting(true);

    try {
      const email = localStorage.getItem('temp_2fa_email');
      if (!email) throw new Error('Session expirée, veuillez vous reconnecter');

      const response = await fetch('/api/auth/login/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Code 2FA incorrect');
      }

      localStorage.setItem('token', data.token);
      localStorage.removeItem('temp_2fa_email');
      router.push('/en/dashboard');
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Erreur lors de la vérification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
    const redirectUri = encodeURIComponent(`https://${hostname}:3001/auth/google/callback`);
    const scope = encodeURIComponent('email profile');

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  };

  return (
    <>
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
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Ou continuer avec
            </span>
          </div>

          <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
            <svg className="mr-2 h-4 w-4" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                fill="currentColor"
              />
            </svg>
            Continuer avec Google
          </Button>
        </div>
      </form>

      {/* Modal 2FA */}
      <AlertDialog open={show2FAModal} onOpenChange={(open) => {
        if (!open) {
          setOtpCode('');
          setOtpError('');
        }
        setShow2FAModal(open);
      }}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Vérification en 2 étapes</AlertDialogTitle>
            <AlertDialogDescription>
              Entrez le code à 6 chiffres envoyé à {email}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4">
            {otpError && (
              <div className="p-2 text-sm text-red-500 bg-red-50 rounded">
                {otpError}
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={(value) => {
                  setOtpCode(value);
                  setOtpError('');
                }}
                onComplete={handle2FASubmit}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-sm text-muted-foreground">
                Code à 6 chiffres
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShow2FAModal(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handle2FASubmit}
                disabled={isSubmitting || otpCode.length !== 6}
              >
                {isSubmitting ? 'Vérification...' : 'Vérifier'}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
	      </>
  );
}
