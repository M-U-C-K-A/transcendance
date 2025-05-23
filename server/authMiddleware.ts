import { FastifyRequest, FastifyReply } from 'fastify'

export default async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify()
	} catch (err) {
		return reply.code(401).send({ error: 'Unauthorized' })
	}
}

