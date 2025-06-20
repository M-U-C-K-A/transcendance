import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import meProfileInfo from '@/server/request/profile/meProfile'
import authMiddleware from '@/server/authMiddleware'
import { JWTPayload } from '@/types/jwt'

export default async function meProfile(server: FastifyInstance) {
	server.get('/profile/me', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
		console.log("TESSSSSSSSSSSSSSSSST")
		const user = request.user as JWTPayload
		console.log(user, "TESSSSSSSSSSSSSSST")
		if (!user) {
			return reply.code(400).send({ error:"'User information not found in token" })
		}

		try {
			const result = await meProfileInfo(user.id)
			return reply.code(200).send(result)
		} catch (err: any) {
			if (err.message == "Failed to get user's info") {
				return reply.code(404).send({ error: "Failed to get user's info"})
			} return reply.code(500).send({ error: 'internal server error' })
		}
	})
}
