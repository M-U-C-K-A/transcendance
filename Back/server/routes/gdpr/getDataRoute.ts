import authMiddleware from "@/server/authMiddleware";
import getData from "@/server/request/gdpr/getData";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function getDataRoute(server: FastifyInstance) {
	server.get('/gdpr/getdata', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number }

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await getData(user.id)
		return (reply.code(200).send({result}))
	} catch (err: any) {
		if (err.message === 'User not found') {
			return reply.code(404).send({ error: 'User not found' })
		} return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
