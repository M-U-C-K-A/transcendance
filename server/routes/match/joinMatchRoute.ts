import { FastifyInstance } from "fastify";
import authMiddleware from '../../authMiddleware';
import joinMatch from "@/server/request/match/joinMatch";

export default async function joinMatchRoute(server: FastifyInstance) {
	server.post('/game/join', { preHandler: authMiddleware }, async function (request, reply) {
		const user = request.user as { id: number }
		const { matchId } = request.body as { matchId: string}

		console.log('POST /game/join called by user:', user?.id, 'with matchId:', matchId);

		if (!user) {
			console.log('User not found in request');
			return reply.code(400).send({ error: 'parameter is required' })
		}

		try {
			const result = await joinMatch(user.id, matchId)
			console.log('joinMatch result:', result);
			return (reply.code(200).send(result))
		} catch (err: any) {
			console.error('Error in joinMatch:', err);
			if (err.message === 'User not found') {
				return reply.code(404).send({ error: 'User not found' })
			} else if (err.message === 'Not valid invitation') {
				return reply.code(404).send({ error: 'Not valid invitation' })
			}
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
