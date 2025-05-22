import { FastifyInstance } from "fastify";
import  sendFriendRequest  from "../../request/friends/sendFriendRequest";
import { friendRequest } from "../../request/friends/interface";

export default async function friendRequestRoute(server: FastifyInstance) {
	server.post('/friends/request', async function (request, reply) {
	const param = request.body as friendRequest

	if (!param)
	{
		console.log('No parameter passed in friendListRoute route')
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await sendFriendRequest(param)
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
