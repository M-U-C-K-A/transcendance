import { FastifyInstance } from 'fastify'
import login from '../../request/auth/login'
import { loginData } from '../../utils/interface'

export default async function loginRoute(server: FastifyInstance) {
	server.post('/auth/login', async (request, reply) => {
		const data = request.body as loginData
		request.log.info({ email: data.email }, 'Tentative de connexion')

		try {
			const user = await login(data)
			request.log.info({ email: data.email }, 'Connexion réussie')
			return reply.code(202).send({ message: 'User logged successfully' })
		} catch (err: any) {
			if (err.message === 'This account does not exist') {
				request.log.warn({ email: data.email }, 'Tentative de connexion avec un compte inexistant')
				return reply.code(400).send({ error: 'This account does not exist' })
			} else if (err.message === 'Wrong password') {
				request.log.warn({ email: data.email }, 'Tentative de connexion avec un mot de passe incorrect')
				return reply.code(400).send({ error: 'Wrong password' })
			}

			request.log.error({ email: data.email, error: err }, 'Erreur lors de la connexion')
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
