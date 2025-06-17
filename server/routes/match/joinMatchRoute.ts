import { FastifyInstance } from "fastify";
import authMiddleware from '../../authMiddleware';
import { joinMatchFromInvite } from "@/server/request/match/joinMatch";

export default async function joinMatchRoute(server: FastifyInstance) {
	server.post('/game/travel', { preHandler: authMiddleware }, async function (request, reply) {
		const user = request.user as { id: number }
		const { code } = request.body as { code: string }

		if (!user) {
			console.log('User not found in request');
			return reply.code(400).send({ error: 'parameter is required' })
		}

		try {
			const result = await joinMatchFromInvite(user.id, code)
			console.log(result)
			return (reply.code(200).send({ result }))
		} catch (err: any) {
			console.error('Error in joinMatch:', err);
			if (err.message === 'User not found') {
				return reply.code(404).send({ error: 'User not found' })
			} else if (err.message === 'Not valid invitation') {
				return reply.code(404).send({ error: 'Not valid invitation' })
			} else if (err.message == 'Match already finished') {
				return reply.code(401).send({ error: 'Match already finished' })
			}
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
