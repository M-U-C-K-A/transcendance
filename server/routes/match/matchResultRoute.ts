import authMiddleware from "@/server/authMiddleware";
import matchResult from "@/server/request/match/matchResult";
import { FastifyInstance } from "fastify";

export default async function matchResultRoute(server: FastifyInstance) {
	server.post('/game/result', { preHandler: authMiddleware }, async function (request, reply) {
	const matchInfo = request.body as { player1Score: number, player2Score: number, gameId: number}
	const user = request.user as { id: number }

	if (!matchInfo) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await matchResult(matchInfo.player1Score, matchInfo.player2Score, matchInfo.gameId, user.id)
		return (reply.code(200).send(result))
	} catch (err: any) {
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
