import { resultData } from "@/server/request/match/interface";
import matchResult from "@/server/request/match/matchResult";
import { FastifyInstance } from "fastify";

export default async function matchResultRoute(server: FastifyInstance) {
	server.post('/game/result',  async function (request, reply) {
	const matchInfo = request.body as resultData

	if (!matchInfo) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await matchResult(matchInfo)
		return (reply.code(200).send(result))
	} catch (err: any) {
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
