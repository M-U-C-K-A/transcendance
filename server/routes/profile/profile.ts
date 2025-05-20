import { FastifyInstance } from 'fastify'
import getUserInfo from '../../request/user/getUserInfo'

export default async function profileRoute(server: FastifyInstance) {
	server.get('/profile/:username', async function (request, reply) {
	const { username } = request.params as { username: string }

	if (!username)
	{
		console.log('No username passed as parameter in profile route')
		return reply.code(400).send({ error: 'Username is required' })
	}

	try {
		const result = await getUserInfo(username)
		return (reply.code(200).send(result))
	} catch (err) {
		console.log('No user found in profileRoute')
		reply.code(404).send({ error: 'User not found' })
	}
})
}
