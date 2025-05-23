import { FastifyInstance } from 'fastify'
import getUserInfo from '../../request/user/getUserInfo'
import { authMiddleware } from '../../authMiddleware'
import { userData } from '@/server/request/user/interface'

export default async function meProfile(server: FastifyInstance) {
	server.get('/profile/me', { preHandler: authMiddleware }, async function (request, reply) {
		const user = request.user as { id: number; username: string; email: string }

		if (!user) {
			return reply.code(400).send({ error: 'User information not found in token' })
		}

		try {
			console.log("/profile/me request")
			const result2 = await getUserInfo(user.username)
			console.log(result2)
			return reply.code(200).send(result2)
		} catch (err: any) {
			if (err.message == 'Failed to get user info')
				return reply.code(404).send({ error: 'User not found' })
			return reply.code(500).send({ error: 'internal server error' })
		}
	})
}
