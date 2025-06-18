import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import getPrivateChat from "@/server/request/chat/getPrivateChat";

export default async function privateChatRoute(server: FastifyInstance) {
	server.get('/chat/receive/private', {preHandler: authMiddleware}, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number}

	if (!user) {
		throw new Error ("No parameter")
	}

	try {
		const messages = await getPrivateChat(user.id)
		return reply.code(200).send(messages)
	} catch (err: any) {
		return reply.code(500).send({ error: 'Internal server error' })
	}
  })
}
