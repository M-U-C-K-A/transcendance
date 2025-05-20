import { FastifyInstance } from 'fastify'
import  register from '../../request/auth/register'
import { connectionData } from '../../utils/interface'

export default async function registerRoute(server: FastifyInstance) {
	server.post('/auth/register', async (request, reply) => {
	const data = request.body as connectionData

	try {
		await register(data)
		return reply.code(201).send({ message: 'User registered successfully' })
	} catch (err: any) {
		console.log('Could not register the user: ', err.message)
		if (err.message === 'Username already taken') {
			return reply.code(400).send({ error: 'Username already taken' })
		} else if (err.message === 'Email already taken') {
			return reply.code(400).send({ error: 'Email already taken' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
