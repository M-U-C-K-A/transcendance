import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import newMessage from "@/server/request/chat/newMessage";
import { onlyUsername } from "@/types/chat";

export default async function newMessageRoute(server: FastifyInstance) {
	server.post('/chat/create', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const data = onlyUsername.safeParse(request.body)
	const userId = request.user as { id: number }

	if (!userId) {
		return reply.code(400).send({ error: 'username parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { username } = data.data

		try {
			const result = await newMessage(username, userId.id);
			return reply.code(200).send(result)
		} catch (err: any) {
			if (err.message == 'Internal server error')
				return reply.code(500).send({ error: err.message })
			else if (err.message == "You can't send message to yourself") {
				return reply.code(403).send({ error : err.message })
			} else {
				return reply.code(409).send({ error: err.message })
			}
		}
	});
}
