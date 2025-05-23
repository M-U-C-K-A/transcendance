import { FastifyRequest, FastifyReply } from 'fastify'

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.jwtVerify()
		console.log("testtoken")
	} catch (err) {
		console.log("testtokenfailed")
		return reply.code(401).send({ error: 'Unauthorized' })
	}
  }

