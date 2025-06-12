import { FastifyRequest, FastifyReply } from 'fastify'

export default async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
	const token = request.cookies.token

	if (!token) {
		return reply.code(401).send({ error: 'Missing Token' })
	}

	try {
		const decoded = request.server.jwt.verify(token)
		request.user = decoded
	} catch (err) {
		return reply.code(401).send({ error: 'Invalid Token' })
	}
}
