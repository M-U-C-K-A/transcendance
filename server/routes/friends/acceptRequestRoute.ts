import { FastifyInstance } from "fastify";
import authMiddleware from '../../authMiddleware'
import acceptRequest from "@/server/request/friends/acceptRequest";

export default async function acceptRequestRoute(server: FastifyInstance) {
	server.post('/friends/accept', { preHandler: authMiddleware }, async function (request, reply) {
	const user = request.user as { id: number }
	const param = request.body as { username: string, asAccepted: boolean }

	if (!user)
	{
		console.log('No parameter passed in friendListRoute route')
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await acceptRequest(user.id, param.username, param.asAccepted)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'Friend Id not found') {
			return reply.code(404).send({ error: 'Friend Id not found' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
