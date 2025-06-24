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
import { useI18n } from "@/i18n-client";

export function Login({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const t = useI18n();
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

  // Schemas for validation
  const loginSchema = z.object({
    email: z.string().email({ message: t('auth.login.invalidEmail') }),
    password: z.string().min(6, { message: t('auth.login.passwordTooShort') }),
  });
  const otpSchema = z.string().length(6, { message: t('auth.2fa.invalidCode') });

  useEffect(() => {
    // 1) Handle Google OAuth token
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      localStorage.setItem('token', tokenParam);
      window.history.replaceState(null, '', window.location.pathname);
      router.replace('/en/dashboard');
      return;
    }

    // 2) Check existing session
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token || token === 'undefined' || token === 'null') return;
      try {
        const res = await fetch('/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) router.replace('/en/dashboard');
        else localStorage.removeItem('token');
      } catch {
        localStorage.removeItem('token');
      }
    };
    checkAuth();

    // 3) Handle OAuth errors
    const errorParam = searchParams.get('error');
    if (errorParam === 'google_login_failed') {
      setError(t('auth.errors.googleLoginFailed'));
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [router, searchParams, t]);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Vérifie si la réponse contient as2FA et si c'est true
        if (data.as2FA === true) {
          localStorage.setItem('temp_2fa_email', email);
          setShow2FAModal(true);
        } else {
          // Si pas de 2FA, redirige directement
          router.replace('/en/dashboard');
        }
      } else {
        throw new Error(data.message || t('auth.errors.loginFailed'));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async () => {
    const result = otpSchema.safeParse(otpCode);
    if (!result.success) {
      setOtpError(result.error.issues[0].message);
      return;
    }
    setOtpError('');
    setIsSubmitting(true);
    try {
      const emailTemp = localStorage.getItem('temp_2fa_email');
      if (!emailTemp) throw new Error(t('auth.errors.sessionExpired'));
      const res = await fetch('/api/auth/login/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTemp, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t('auth.2fa.incorrectCode'));
      localStorage.removeItem('temp_2fa_email');
      router.replace('/en/dashboard');
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
    const redirectUri = encodeURIComponent(
      `https://${hostname}:3001/auth/google/callback`
    );
    const scope = encodeURIComponent('email profile');
    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent`;
  };

  return (
    <>
      <form className={cn('flex flex-col gap-6', className)} onSubmit={handleSubmit} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('auth.login.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('auth.login.subtitle')}
          </p>
        </div>

        {error && (
          <div className="p-2 text-sm text-red-500 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('auth.login.emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.login.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{t('auth.login.passwordLabel')}</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="•••••••••••••"
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
            {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              {t('auth.login.orContinueWith')}
            </span>
          </div>

          <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                fill="currentColor"
              />
            </svg>
            {t('auth.login.continueWithGoogle')}
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
            <AlertDialogTitle>{t('auth.2fa.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('auth.2fa.description', { email })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4">
            {otpError && (
              <div className="p-2 text-sm text-red-500 bg-red-50 rounded">{otpError}</div>
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
              <p className="text-sm text-muted-foreground">{t('auth.2fa.codeHint')}</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShow2FAModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="button" onClick={handle2FASubmit} disabled={isSubmitting || otpCode.length !== 6}>
                {isSubmitting ? t('auth.2fa.verifying') : t('common.verify')}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
