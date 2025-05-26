import { FastifyInstance } from 'fastify'
import meProfileInfo from '../../request/profile/meProfile'
import authMiddleware from '../../authMiddleware'

export default async function meProfile(server: FastifyInstance) {
	server.get('/profile/me', { preHandler: authMiddleware }, async function (request, reply) {
		const user = request.user as { id: number; username: string; email: string }

		if (!user) {
			return reply.code(400).send({ error: 'User information not found in token' })
		}

		try {
			console.log("/profile/me request")
			const result = await meProfileInfo(user.username)
			console.log(result)
			return reply.code(200).send(result)
		} catch (err: any) {
			if (err.message == 'Failed to get user info')
				return reply.code(404).send({ error: 'User not found' })
			return reply.code(500).send({ error: 'internal server error' })
		}
	})
}
