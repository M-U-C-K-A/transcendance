import { FastifyInstance } from 'fastify'
import  login from '../../request/auth/login'
import { loginData } from '../../utils/interface'

export default async function loginRoute(server: FastifyInstance) {
	server.post('/auth/login', async (request, reply) => {
	const data = request.body as loginData

	try {
		await login(data)
		return reply.code(202).send({ message: 'User logged successfully' })
	} catch (err: any) {
		if (err.message === 'This account does not exist') {
			return reply.code(400).send({ error: 'This account does not exist' })
		} else if (err.message === 'Wrong password') {
			return reply.code(400).send({ error: 'Wrong password' })
		}

		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
