import { FastifyInstance } from "fastify";
import authMiddleware from '../../authMiddleware';
import createMatch from "@/server/request/match/createMatch";

export default async function createMatchRoute(server: FastifyInstance) {
	server.post('/match/create', { preHandler: authMiddleware }, async function (request, reply) {
	const user = request.user as { id: number }
	const { matchName } = request.body as { matchName: string}

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await createMatch(user.id, matchName)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'User not found') {
			return reply.code(404).send({ error: 'User not found' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
