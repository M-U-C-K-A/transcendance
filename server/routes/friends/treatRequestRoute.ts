import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from '../../authMiddleware'
import treatRequest from "@/server/request/friends/treatRequest";

export default async function acceptRequestRoute(server: FastifyInstance) {
	server.post('/friends/accept', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number, username: string }
	const param = request.body as { username: string, asAccepted: boolean }

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await treatRequest(user.id, param.username, param.asAccepted, user.username)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'Friend Id not found') {
			return reply.code(404).send({ error: 'Friend Id not found' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
