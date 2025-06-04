import { FastifyInstance } from "fastify";
import authMiddleware from '../../authMiddleware';
import joinMatch from "@/server/request/match/joinMatch";

export default async function joinMatchRoute(server: FastifyInstance) {
	server.post('/match/join', { preHandler: authMiddleware }, async function (request, reply) {
	const user = request.user as { id: number }
	const { matchId } = request.body as { matchId: number}

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await joinMatch(user.id, matchId)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'User not found') {
			return reply.code(404).send({ error: 'User not found' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
