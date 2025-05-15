import { FastifyInstance } from 'fastify'
import { getProfileData } from './profile.service'
import statsRoutes from './routes/stats'

export async function profileRoutes(fastify: FastifyInstance) {
  // Route health check
  fastify.get('/health', async () => ({ status: 'OK' }))

  // Route profile
  fastify.get<{ Params: { username: string } }>(
    '/profile/:username',
    async (request, reply) => {
      try {
        const data = await getProfileData(request.params.username)
        return reply.send(data)
      } catch (error) {
        return reply.status(404).send({ error: 'Profile not found' })
      }
    }
  )

  // Enregistrer les routes de statistiques
  await fastify.register(statsRoutes)
}
