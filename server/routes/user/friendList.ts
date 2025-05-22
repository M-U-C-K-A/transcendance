import { FastifyInstance } from "fastify";
import  friendsList  from "../../request/user/friendsList";

export default async function friendListRoute(server: FastifyInstance) {
	server.get('/friendlist/:username', async function (request, reply) {
	const { username } = request.params as { username: string }

	if (!username)
	{
		console.log('No parameter passed in friendListRoute route')
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await friendsList(username)
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
