import { FastifyInstance } from 'fastify'
import register from '../../request/auth/register'
import { connectionData } from '../../utils/interface'

export default async function registerRoute(server: FastifyInstance) {
	server.post('/auth/register', async (request, reply) => {
		const data = request.body as connectionData
		request.log.info({ username: data.username, email: data.email }, 'Tentative d\'inscription')

		try {
			await register(data)
			request.log.info({ username: data.username }, 'Inscription réussie')
			return reply.code(201).send({ message: 'User registered successfully' })
		} catch (err: any) {
			if (err.message === 'Username already taken') {
				request.log.warn({ username: data.username }, 'Tentative d\'inscription avec un nom d\'utilisateur déjà pris')
				return reply.code(400).send({ error: 'Username already taken' })
			} else if (err.message === 'Email already taken') {
				request.log.warn({ email: data.email }, 'Tentative d\'inscription avec un email déjà utilisé')
				return reply.code(400).send({ error: 'Email already taken' })
			}

			request.log.error({ username: data.username, email: data.email, error: err }, 'Erreur lors de l\'inscription')
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
