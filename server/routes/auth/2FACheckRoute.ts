import { FastifyInstance } from 'fastify'
import check2FA from '@/server/request/auth/2FACheck'
import register from '@/server/request/auth/register'

export default async function Check2FARoute(server: FastifyInstance) {
	server.post('/auth/register/2fa/verify', async (request, reply) => {
		const data = request.body as {email: string, code: string}

		try {
			await check2FA(data.email, data.code)
			const result = await register(data.email)
			const token = server.jwt.sign({
				id: result.id,
				email: result.email,
				username: result.username,
				bio: result.bio,
			})
			console.log(result)
			return reply.code(200).send({ result })
		} catch (err: any) {
			if (err.message === 'Wrong Code') {
				return reply.code(403).send({ error: 'Wrong Code' })
			}
			else {
				return reply.code(500).send({ error: 'Internal server error' })
			}
		}
	})
}
