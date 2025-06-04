import { FastifyInstance } from "fastify";
import getMessage from "@/server/request/chat/getMessage";
import authMiddleware from "@/server/authMiddleware";

export default async function getMessageRoute(server: FastifyInstance) {
	server.get('/chat/receive', {preHandler: authMiddleware}, async function (request, reply) {
	const user = request.user as { id: number; username: string}

	if (!user) {
		console.log('No parameter passed in getMessageRoute route')
		return reply.code(400).send({ error: 'Username parameter is required' })
	}

	try {
		console.log("test get message")
		const messages = await getMessage(user.username)
		return reply.code(200).send(messages)
	} catch (err: any) {
		console.error('Error in getMessageRoute:', err)
		return reply.code(500).send({ error: 'Internal server error' })
	}
  })
}
