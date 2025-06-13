import authMiddleware from "@/server/authMiddleware";
import matchCreate from "@/server/request/match/matchCreate";
import { FastifyInstance } from "fastify";
import Hashids from 'hashids';

export default async function gameCreationRoute(server: FastifyInstance) {
	server.post('/game/typecreation', { preHandler: authMiddleware }, async function (request, reply) {
	const matchInfo = request.body as {name: string, playerCount: number, }
	const user = request.user as {id: number}

	if (!matchInfo) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		console.log("👺👺👺👺👺👺👺👺")
		console.log(matchInfo)
		console.log(user)
		console.log("👺👺👺👺👺👺👺👺")
		if (!matchInfo.playerCount || matchInfo.playerCount <= 2) {
			const result = await matchCreate(matchInfo.name, user.id)
			const hashids = new Hashids("CACA BOUDIN", 8)
			const hashedCode = hashids.encode(result.id)
			const name = matchInfo.name
			return (reply.code(200).send({ hashedCode, name }))
		}
	} catch (err: any) {
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
