import { FastifyInstance, FastifyRequest } from 'fastify'
import getUserInfo from '../../request/profile/usersProfile'
import authMiddleware from '@/server/authMiddleware'

export default async function profileRoute(server: FastifyInstance) {
  server.get('/profile/:id', { preHandler: authMiddleware }, async function (request: any, reply) {
	const id = parseInt(request.params.id, 10)
	const userId = request.user

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
