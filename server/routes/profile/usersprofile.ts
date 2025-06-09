import { FastifyInstance, FastifyRequest } from 'fastify'
import getUserInfo from '../../request/profile/usersProfile'
import authMiddleware from '@/server/authMiddleware'

export default async function profileRoute(server: FastifyInstance) {
  server.get('/profile/:id', { preHandler: authMiddleware }, async function (request: AuthenticatedRequest, reply) {
	const id = parseInt(request.params.id, 10)
	const userId = request.user

	console.log(id)
	console.log(userId)
	if (!id || !userId) {
	  request.log.warn('Tentative d\'accès au profil avec un ID invalide')
	  return reply.code(400).send({ error: 'Valid user ID is required' })
	}

	try {
	  const result = await getUserInfo(id, userId.id)
	  return reply.code(200).send(result)
	} catch (err: any) {
	  request.log.error(err, 'Erreur lors de la récupération du profil')
	  if (err.message === "Failed to get profile data") {
		return reply.code(404).send({ error: 'User not found' })
	  }
	  return reply.code(500).send({ error: "Internal server error" })
	}
  })
}
