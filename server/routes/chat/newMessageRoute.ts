import { FastifyInstance } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import newMessage from "@/server/request/chat/newMessage";

export default async function newMessageRoute(server: FastifyInstance) {
	server.get('/chat/:username', { preHandler: authMiddleware }, async function (request, reply) {
		const { username } = request.params as { username: string };

		if (!username) {
			return reply.code(400).send({ error: 'username parameter is required' });
		}

		try {
			const result = await newMessage(username);
			console.log(result)
			return reply.code(200).send({ message: "User Exist" });
		} catch (err: any) {
			if (err.message === 'No User found') {
				return reply.code(409).send({ error: 'No User found' });
			}
			return reply.code(500).send({ error: 'Internal server error' });
		}
	});
}
