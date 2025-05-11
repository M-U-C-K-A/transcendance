import { env } from './config/env'
import { createServer } from './config/fastify'
import authRoutes from './routes/auth'

const app = createServer()

// Enregistrement des plugins
async function main() {
  // Plugins de base
  await app.register(import('./plugins/db'))
  await app.register(import('./plugins/jwt'))
  await app.register(import('./plugins/swagger'))

  // Routes
  await app.register(authRoutes, { prefix: '/api/auth' })

  // Health check
  app.get('/health', async () => ({ status: 'ok' }))

  try {
    await app.listen({
      port: env.PORT,
      host: env.HOST
    })
    app.log.info(`Server running at http://${env.HOST}:${env.PORT}`)
    app.log.info(`Docs available at http://${env.HOST}:${env.PORT}/docs`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
