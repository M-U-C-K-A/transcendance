'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const code = searchParams.get('code');

		if (!code) {
			router.push('/en/auth?error=google_login_failed');
			return;
		}

		const exchangeCodeForToken = async () => {
			try {
				const response = await fetch('/auth/google/callback', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ code }),
				});

				if (!response.ok) {
					throw new Error('Erreur lors de la récupération du token');
				}

				const data = await response.json();

				if (data.token) {
					localStorage.setItem('token', data.token);
					router.push('/en/dashboard');
				} else {
					throw new Error('Token manquant');
				}
			} catch (err) {
				console.error(err);
				router.push('/en/auth?error=google_login_failed');
			}
		};

		exchangeCodeForToken();
	}, [searchParams, router]);

	return <p>Connexion avec Google en cours...</p>;
}
