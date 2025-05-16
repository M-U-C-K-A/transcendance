import { FastifyInstance } from 'fastify'
import healthRoutes from './routes/health'
import profileRoutes from './routes/profile'
import statsRoutes from './routes/stats'

export async function registerRoutes(fastify: FastifyInstance) {
  // Enregistrer toutes les routes
  await fastify.register(healthRoutes)
  await fastify.register(profileRoutes)
  await fastify.register(statsRoutes)
  
  fastify.log.info('All routes registered successfully')
}
