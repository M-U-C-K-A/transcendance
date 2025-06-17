import { FastifyInstance } from 'fastify'
import checkLogin2FA from '@/server/request/auth/login/2FACheckLogin'
import getLoginData from '@/server/request/auth/login/getLoginInfo'

export default async function Check2FALoginRoute(server: FastifyInstance) {
	server.post('/auth/login/2fa/verify', async (request, reply) => {
		const data = request.body as {email: string, code: string}

		try {
			await checkLogin2FA(data.email, data.code)
			const result = await getLoginData(data.email)
			if (result) {
				const token = server.jwt.sign({
					id: result.id,
					email: result.email,
					username: result.username,
					bio: result.bio,
				})
				return reply.code(200).send({ token })
			}
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
