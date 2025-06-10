import { googleConnexion } from '@/server/request/auth/google';
import { FastifyInstance } from 'fastify';

export async function googleLogin(server: FastifyInstance) {
	server.get('/auth/google/callback', async (request, reply) => {
		const { code } = request.query as { code: string };

		if (!code) {
			return reply.redirect('/login?error=missing_code');
		}

		try {
			const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					code,
					client_id: process.env.GOOGLE_CLIENT_ID || "",
					client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
					redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
					grant_type: 'authorization_code',
				}),
			});

			const tokenData = await tokenRes.json();

			if (!tokenRes.ok) {
				console.error('OAuth Token Error:', tokenData);
				return reply.redirect('http://localhost:3000/en/auth?error=google_login_failed');
			}


			const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					Authorization: `Bearer ${tokenData.access_token}`,
				},
			});

			const user = await userInfoRes.json();
			console.log(user);

			if (!user.email) {
				return reply.redirect('/login?error=user_info_failed');
			}

			const result = await googleConnexion(user.email, user.name, user.id, user.picture)

			const token = server.jwt.sign({
				id: result.id,
				email: result.email,
				username: result.username,
				bio: result.bio,
			})

			return reply.redirect(`http://localhost:3000/en/auth?token=${token}`);
		} catch (err: any) {
			if (err.message == "User not found after insertion") {
				return reply.code(500).send({ error: "Failed to create user account"})
			} else {
				return reply.code(500).send({ error: "Internal server error"})
			}
		}
	});
}
