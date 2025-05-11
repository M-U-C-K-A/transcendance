import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import path from 'path'

export default fp(async (app) => {
  // Chemin absolu pour SQLite
  const dbPath = path.join(__dirname, '../../../data/test.sqlite')
  process.env.DATABASE_URL = `file:${dbPath}`

  const prisma = new PrismaClient()

  // Création de la DB si elle n'existe pas
  await prisma.$executeRaw`PRAGMA journal_mode = WAL`
  await prisma.$executeRaw`PRAGMA foreign_keys = ON`

  await prisma.$connect()

  app.decorate('db', prisma)

  app.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
})
