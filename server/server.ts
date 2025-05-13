import fastify from 'fastify'
import { profileRoutes } from './routes'
import { PrismaClient } from '@prisma/client'

// Créer une instance du client Prisma
const prisma = new PrismaClient()
// Créer une instance du serveur Fastify
const server = fastify({ logger: true })

// Enregistrer le plugin CORS
server.register(require('@fastify/cors'), {
  origin: '*', // Permet à tous les domaines d'accéder à l'API, vous pouvez restreindre cela à des domaines spécifiques
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Vous pouvez ajouter d'autres méthodes selon les besoins
  allowedHeaders: ['Content-Type', 'Authorization'], // Liste des headers autorisés
})

// Enregistrer les routes
server.register(profileRoutes)

// Démarrer le serveur
const start = async () => {
  try {
    await server.listen({ port: 3001 })
    console.log(`Server running on http://localhost:3001`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
