import { FastifyInstance } from "fastify";
import authMiddleware from '../../authMiddleware';
import matchList from "@/server/request/match/matchList";

export default async function matchListRoute(server: FastifyInstance) {
	server.get('/match/list', { preHandler: authMiddleware }, async function (request, reply) {
		console.log("route")
	try {
		const result = await matchList()
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'User not found') {
			return reply.code(404).send({ error: 'User not found' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
