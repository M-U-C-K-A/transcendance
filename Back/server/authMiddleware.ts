import { FastifyRequest, FastifyReply } from 'fastify'
import { JWTPayload } from '@/types/jwt'

export default async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
	try {
		console.log("ALL COOKIES:", request.cookies)
		const token = request.cookies.token
		console.log("Token extracted from cookies:", token)

		if (!token) {
			console.log("No token found in cookies!")
			return reply.status(401).send({ error: 'Authentication token missing' })
		}

		const decoded = request.server.jwt.verify<JWTPayload>(token)

		console.log("JWT decoded payload:", decoded)

		request.user = decoded
	} catch (err) {
		console.log("Error during jwt verify:", err)
		return reply.status(401).send({ error: 'Invalid or expired token' })
	}
}
