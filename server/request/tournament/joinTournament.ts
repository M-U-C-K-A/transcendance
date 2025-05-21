import { PrismaClient } from '@prisma/client'
import { userData }     from '@/server/utils/interface'

const prisma = new PrismaClient()

export async function joinTournament(
  username: string,
  tournamentId: number
): Promise<void> {
  const [u] = await prisma.$queryRaw<userData[]>`
    SELECT id
    FROM "User"
    WHERE username = ${username}
    LIMIT 1
  `
  if (!u) throw new Error('USER NOT FOUND')

  const [info] = await prisma.$queryRaw<{ slot: number; count: number }[]>`
    SELECT t.slot,
      (SELECT COUNT(*) FROM "TournamentHistory" WHERE "tournamentId" = ${tournamentId}) AS count
    FROM "Tournament" AS t
    WHERE t.id = ${tournamentId}
    LIMIT 1
  `
  if (!info)          throw new Error('TOURNAMENT NOT FOUND')
  if (info.count >= info.slot) throw new Error('TOURNAMENT FULL')

  await prisma.$executeRaw`
    INSERT INTO "TournamentHistory" ("userId","tournamentId")
    VALUES (${u.id}, ${tournamentId})
  `
}
