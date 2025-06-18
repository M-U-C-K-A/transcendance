import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import login from '../../../request/auth/login/login'
import { loginData } from '../interface'

export default async function loginRoute(server: FastifyInstance) {
	server.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
		const data = loginData.safeParse(request.body)
		
		try {
			const result = await login(data)
			return reply.code(200).send({ result })
		} catch (err: any) {
			if (err.message === 'This account does not exist') {
				return reply.code(400).send({ error: 'This account does not exist' })
			} else if (err.message === 'Wrong password') {
				return reply.code(400).send({ error: 'Wrong password' })
			} else if (err.message === 'User not found') {
				return reply.code(404).send({ error: 'User not found' })
			}
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}

