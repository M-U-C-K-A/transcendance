import { FastifyInstance } from 'fastify'
import { getProfileData } from '../profile.service'

export default async function profileRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: { username: string } }>(
    '/profile/:username',
    async (request, reply) => {
      try {
        fastify.log.info(`Profile requested for username: ${request.params.username}`)
        const data = await getProfileData(request.params.username)
        return reply.send(data)
      } catch (error) {
        fastify.log.error(`Profile not found for username: ${request.params.username}`)
        return reply.status(404).send({ error: 'Profile not found' })
      }
    }
  )
} 
