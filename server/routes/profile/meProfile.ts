import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import meProfileInfo from '../../request/profile/meProfile'
import authMiddleware from '../../authMiddleware'

export default async function meProfile(server: FastifyInstance) {
	server.get('/profile/me', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
		const user = request.user as { id: number }

		if (!user) {
			return reply.code(400).send({ error: 'User information not found in token' })
		}

		try {
			const result = await meProfileInfo(user.id)
			return reply.code(200).send(result)
		} catch (err: any) {
			if (err.message == `Failed to get user's info`)
				return reply.code(404).send({ error: `Failed to get user's info`})
			return reply.code(500).send({ error: 'internal server error' })
		}
	})
}
