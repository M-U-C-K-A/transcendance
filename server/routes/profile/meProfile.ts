import { FastifyInstance } from 'fastify'
import getUserInfo from '../../request/user/getUserInfo'
import { authMiddleware } from '../../authMiddleware'

export default async function meProfile(server: FastifyInstance) {
	server.get('/profile/me', { preHandler: authMiddleware }, async function (request, reply) {
		const user = request.user as { id: number; username: string; email: string }

		if (!user.username) {
			return reply.code(400).send({ error: 'User information not found in token' })
		}

		try {
			const result = await getUserInfo(user.username)
			return reply.code(200).send(result)
		} catch (err) {
			return reply.code(404).send({ error: 'User not found' })
		}
	})
}
