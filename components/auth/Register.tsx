'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

// Zod schema – stricte et claire
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const formData = { email, username, password };
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const errors: { [key: string]: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) errors[err.path[0]] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    try {

      const response = await fetch('/api/auth/zregister', {
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

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const data = isJson ? await response.json() : { message: await response.text() };

      if (!response.ok) {
        throw new Error(data.message || 'Erreur inconnue');
      }

      // ✅ Success
      window.location.href = '/auth';

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
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
        {/* Email */}
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

        {/* Username */}
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

        {/* Password */}
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

        <Button type="submit" className="w-full">
          S&apos;inscrire
        </Button>
      </div>
    </form>
  );
}

