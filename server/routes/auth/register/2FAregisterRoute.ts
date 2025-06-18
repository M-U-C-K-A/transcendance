import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import register2FA from '@/server/request/auth/register/2FAregister'
import { registerData } from '@/types/auth'

export default async function register2FARoute(server: FastifyInstance) {
	server.post('/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
		const data = registerData.safeParse(request.body)


		if (!data.success) {
			return reply.status(400).send({
				errors: data.error.flatten().fieldErrors,
			})
		}

		const { username, pass, email } = data.data

		try {
			const result = await register2FA(username, email, pass)
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
