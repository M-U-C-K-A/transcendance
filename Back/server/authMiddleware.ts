import { FastifyRequest, FastifyReply } from 'fastify'
import { JWTPayload } from '@/types/jwt'

export default async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
	try {
		const token = request.cookies.token

		if (!token) {
			return reply.status(401).send({ error: 'Authentication token missing' })
		}

		const decoded = request.server.jwt.verify<JWTPayload>(token)

		request.user = decoded
	} catch (err) {
		return reply.status(401).send({ error: 'Invalid or expired token' })
	}
}
