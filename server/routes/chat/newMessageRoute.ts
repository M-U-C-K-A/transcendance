import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import newMessage from "@/server/request/chat/newMessage";

export default async function newMessageRoute(server: FastifyInstance) {
	server.post('/chat/create', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const { username } = request.body as { username: string };
	const  userId = request.user as { id: number }

	if (!username || !userId) {
		return reply.code(400).send({ error: 'username parameter is required' });
	}

		try {
			const result = await newMessage(username, userId.id);
			return reply.code(200).send(result);
		} catch (err: any) {
			if (err.message === 'No User found') {
				return reply.code(409).send({ error: 'No User found' });
			} else if (err.message == "You blocked this user") {
				return reply.code(409).send({ error: "You blocked this user"})
			} else if (err.message == "This user blocked you") {
				return reply.code(409).send({ error: "This user blocked you"})
			} else {
				return reply.code(500).send({ error: 'Internal server error' });
			}
		}
	});
}
