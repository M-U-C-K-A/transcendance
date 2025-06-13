import { FastifyInstance } from 'fastify'
import { connectionData } from './interface'
import register2FA from '@/server/request/auth/2FAregister'

export default async function registerRoute(server: FastifyInstance) {
	server.post('/auth/register2FA', async (request, reply) => {
		const data = request.body as connectionData

		try {
			await register2FA(data)
			return reply.code(201).send({ message: 'User registered successfully' })
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
