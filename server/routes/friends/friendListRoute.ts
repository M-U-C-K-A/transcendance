import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import  friendsList  from "../../request/friends/friendsList";
import authMiddleware from '../../authMiddleware';

export default async function friendListRoute(server: FastifyInstance) {
	server.get('/friends', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number }

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await friendsList(user.id)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'User not found') {
			return reply.code(404).send({ error: 'User not found' })
		} else if (err.message === 'No friends registered') {
			return reply.code(404).send({ error: 'No friends registered' })
		}

		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
