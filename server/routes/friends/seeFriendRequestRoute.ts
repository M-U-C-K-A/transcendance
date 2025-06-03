import { FastifyInstance } from "fastify";
import authMiddleware from '../../authMiddleware'
import seeFriendRequest from "@/server/request/friends/seeFriendRequest";

export default async function seeFriendRequestRoute(server: FastifyInstance) {
	server.get('/friends/pending', { preHandler: authMiddleware }, async function (request, reply) {
	const user = request.user as { id: number }

	if (!user)
	{
		console.log('No parameter passed in friendListRoute route')
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await seeFriendRequest(user.id)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'No invitation in pending') {
			return reply.code(404).send({ error: 'No invitation in pending' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
