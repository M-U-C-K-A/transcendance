import { FastifyInstance } from 'fastify'
import getUserInfo from '../../request/profile/usersProfile'
import authMiddleware from '@/server/authMiddleware'

export default async function profileRoute(server: FastifyInstance) {
	server.get('/profile/:username', { preHandler: authMiddleware }, async function (request, reply) {
		const { username } = request.params as { username: string }
		const userId = request.user as {id: number}
		request.log.info({ username }, 'Tentative d\'accès au profil')

		if (!username) {
			request.log.warn('Tentative d\'accès au profil sans nom d\'utilisateur')
			return reply.code(400).send({ error: 'Username is required' })
		}

		try {
			const result = await getUserInfo(username, userId.id)
			request.log.info({ username }, 'Profil récupéré avec succès')
			return (reply.code(200).send(result))
		} catch (err) {
			request.log.error({ username, error: err }, 'Erreur lors de la récupération du profil')
			reply.code(404).send({ error: 'User not found' })
		}
	})
}
