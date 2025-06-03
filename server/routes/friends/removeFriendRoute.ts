import { FastifyInstance } from "fastify";
import authMiddleware from '../../authMiddleware'
import removeFriend from "@/server/request/friends/removeFriend";

export default async function removeFriendRoute(server: FastifyInstance) {
	server.post('/friends/remove', { preHandler: authMiddleware }, async function (request, reply) {
	const user = request.user as { id: number }
	const friendId = request.body as { id: number}

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	console.log(friendId)
	try {
		console.log(user.id)
		console.log(friendId.id)
		const result = await removeFriend(user.id, friendId.id)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'Could not find friend Id') {
			return reply.code(404).send({ error: 'Could not find friend Id' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
