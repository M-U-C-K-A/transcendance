'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useI18n } from "@/i18n-client";

export function Register({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const t = useI18n();
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

  // Schéma de validation avec traductions
  const registerSchema = z.object({
    email: z.string().email({ message: t('auth.register.invalidEmail') }),
    username: z.string()
      .min(3, { message: t('auth.register.usernameTooShort') })
      .max(20, { message: t('auth.register.usernameTooLong') })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: t('auth.register.invalidChars')
      }),
    password: z.string().min(6, { message: t('auth.register.passwordTooShort') }),
  });

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
        throw new Error(data.message || t('auth.errors.registrationFailed'));
      }

      localStorage.setItem('temp_2fa_email', result.data.email);
      setShow2FAModal(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.errors.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async () => {
    if (otpCode.length !== 6) {
      setOtpError(t('auth.2fa.incompleteCode'));
      return;
    }

    setOtpError('');
    setIsSubmitting(true);

    try {
      const email = localStorage.getItem('temp_2fa_email');
      if (!email) {
        throw new Error(t('auth.errors.sessionExpired'));
      }

      const response = await fetch('/api/auth/register/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otpCode }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        localStorage.removeItem('temp_2fa_email');
        router.push('/dashboard');
      } else {
        const data = await response.json();
        throw new Error(data.message || t('auth.2fa.incorrectCode'));
      }
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : t('auth.2fa.verificationError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={cn("flex flex-col gap-6", className)} onSubmit={handleRegisterSubmit} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t('auth.register.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('auth.register.subtitle')}
          </p>
        </div>

        {error && (
          <div className="p-2 text-sm text-red-500 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('auth.register.emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.register.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">{t('auth.register.usernameLabel')}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t('auth.register.usernamePlaceholder')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {fieldErrors.username && <p className="text-sm text-red-500">{fieldErrors.username}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">{t('auth.register.passwordLabel')}</Label>
            <Input
              id="password"
              type="password"
			  placeholder="•••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && <p className="text-sm text-red-500">{fieldErrors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
          </Button>
        </div>
      </form>

      {/* Popup 2FA avec InputOTP */}
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
                {t('auth.2fa.codeHint')}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShow2FAModal(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                onClick={handle2FASubmit}
                disabled={isSubmitting || otpCode.length !== 6}
              >
                {isSubmitting ? t('auth.2fa.verifying') : t('common.verify')}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
