import { FastifyInstance } from 'fastify'
import { connectionData } from './interface'
import register2FA from '@/server/request/auth/2FAregister'

export default async function register2FARoute(server: FastifyInstance) {
	server.post('/auth/register', async (request, reply) => {
		const data = request.body as connectionData

		try {
			console.log("2FAAAAAAAAAAAAAAA")
			const result = await register2FA(data)
			console.log(result)
			return reply.code(201).send({ result })
		} catch (err: any) {
			if (err.message === 'Username already taken') {
				return reply.code(403).send({ error: 'Username already taken' })
			} else if (err.message === 'Email already taken') {
				return reply.code(403).send({ error: 'Email already taken' })
			}
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
