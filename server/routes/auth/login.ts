import { FastifyInstance } from 'fastify'
import { login } from '../../request/auth/login'
import { connectionSchema } from '../../utils/interface'
import { connectionData } from '../../utils/interface'

export default async function loginRoute(server: FastifyInstance) {
	server.post('/auth/login', async (request, reply) => {
	const { data } = request.query as { data: connectionData }

	try {
		connectionSchema.parse(data)
	} catch (err) {
		console.log(data.email, data.username, data.password)
		console.log('Data not conform in loginRoute')
		return reply.code(400).send({ error: 'Invalid data' })
	}

	try {
		await login(data)
		return reply.code(202).send({ message: 'User logged successfully' })
	} catch (err) {
		console.log('Could not register the user')
		return reply.code(500).send({ error: 'Could not log the user' })
	}
})
}
