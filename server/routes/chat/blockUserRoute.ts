import { FastifyInstance } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import blockUser from "@/server/request/chat/blockUser";

export default async function blockUserRoute(server: FastifyInstance) {
	server.post('/chat/block', {preHandler: authMiddleware}, async function (request, reply) {
	const blockedUser  = request.body as { id: number}
	const userId = request.user as { id: number }

	console.log("id", blockedUser.id)
	console.log("userId", userId)
	if (!blockedUser || !userId) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		console.log("test")
		const result = await blockUser(userId.id, blockedUser.id)
		return reply.code(200).send(result)
	} catch (err: any) {
		return reply.code(500).send({ error: 'Internal server error' })
	}
  })
}
