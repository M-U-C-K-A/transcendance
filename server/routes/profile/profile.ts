import { FastifyInstance } from 'fastify'
import getUserInfo from '../../request/profile/getUserInfo'

export default async function profileRoute(server: FastifyInstance) {
	server.get('/profile/:username', async function (request, reply) {
		const { username } = request.params as { username: string }
		request.log.info({ username }, 'Tentative d\'accès au profil')

		if (!username) {
			request.log.warn('Tentative d\'accès au profil sans nom d\'utilisateur')
			return reply.code(400).send({ error: 'Username is required' })
		}

		try {
			const result = await getUserInfo(username)
			request.log.info({ username }, 'Profil récupéré avec succès')
			return (reply.code(200).send(result))
		} catch (err) {
			request.log.error({ username, error: err }, 'Erreur lors de la récupération du profil')
			reply.code(404).send({ error: 'User not found' })
		}
	})
}
