import { FastifyRequest, FastifyReply } from 'fastify'

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
	try {
	  await request.jwtVerify()
	  console.log("testtesttes")
	  console.log('Auth middleware: JWT verified', request.user)
	} catch (err) {
	  console.log('Auth middleware: JWT verification failed')
	  return reply.code(401).send({ error: 'Unauthorized' })
	}
  }

