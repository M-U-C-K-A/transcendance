import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import getUserInfo from '../../request/profile/usersProfile'
import authMiddleware from '@/server/authMiddleware'

export default async function profileRoute(server: FastifyInstance) {
	server.get('/profile/:username', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {

	const id = parseInt(request.params.username, 10)
	const userId = request.user as { id: number }

	if (!id || !userId) {
		return reply.code(400).send({ error: 'Valid user ID is required' })
	}

	try {
		const result = await getUserInfo(id, userId.id)
		return reply.code(200).send(result)
	} catch (err: any) {
	if (err.message === "Failed to get profile data") {
		return reply.code(404).send({ error: 'User not found' })
	}
		return reply.code(500).send({ error: "Internal server error" })
	}
  })
}
