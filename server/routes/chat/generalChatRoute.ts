import { FastifyInstance } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import getGeneralChat from "@/server/request/chat/getGeneralChat";

export default async function generalChatRoute(server: FastifyInstance) {
	server.get('/chat/receive/general', {preHandler: authMiddleware}, async function (request, reply) {

	try {
		const messages = await getGeneralChat()
		return reply.code(200).send(messages)
	} catch (err: any) {
		return reply.code(500).send({ error: 'Internal server error' })
	}
  })
}
