import { FastifyInstance } from 'fastify'

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    fastify.log.info('Health check requested')
    return { status: 'OK' }
  })
} 
