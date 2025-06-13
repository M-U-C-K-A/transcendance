import { FastifyInstance } from 'fastify'
import check2FA from '@/server/request/auth/2FACheck'
import register from '@/server/request/auth/register'

export default async function Check2FARoute(server: FastifyInstance) {
	server.post('/auth/register/2fa/verify', async (request, reply) => {
		const data = request.body as {email: string, code: string}

		try {
			const result = await check2FA(data.email, data.code)
			await register(data.email)
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
