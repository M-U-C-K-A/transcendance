import fastify from 'fastify'
import { registerRoutes } from './routes'
import { PrismaClient } from '@prisma/client'

// Créer une instance du client Prisma
const prisma = new PrismaClient()

// Créer une instance du serveur Fastify avec une configuration de log améliorée
const server = fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
        messageFormat: '{msg}',
        levelFirst: true
      }
    }
  }
})

// Enregistrer le plugin CORS
server.register(require('@fastify/cors'), {
  origin: '*', // Permet à tous les domaines d'accéder à l'API, vous pouvez restreindre cela à des domaines spécifiques
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Vous pouvez ajouter d'autres méthodes selon les besoins
  allowedHeaders: ['Content-Type', 'Authorization'], // Liste des headers autorisés
})

// Enregistrer les routes
server.register(registerRoutes)

// Démarrer le serveur
const start = async () => {
  try {
    await server.listen({ port: 3001 })
    server.log.info({ port: 3001 }, 'Server running on http://localhost:3001')
  } catch (err) {
    server.log.error({ err }, 'Error starting server')
    process.exit(1)
  }
}

start()
