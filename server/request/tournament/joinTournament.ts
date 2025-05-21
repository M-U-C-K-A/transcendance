import { PrismaClient } from '@prisma/client'
import { userData }     from '@/server/utils/interface'

const prisma = new PrismaClient()

export async function joinTournament(username: string, tournamentId: number): 
Promise<void> {

  const [u] = await prisma.$queryRaw<userData[]>`
    SELECT id
    FROM "User"
    WHERE username = ${username}
  `
  if (!u) throw new Error('USER NOT FOUND')



  const [info] = await prisma.$queryRaw<{ slot: number; count: number }[]>`
    SELECT Tournament.slot,
      (SELECT COUNT(*) FROM "TournamentParticipants" WHERE "tournamentId" = ${tournamentId}) AS count
    FROM "Tournament"
    WHERE Tournament.id = ${tournamentId}
  `
  if (!info)          throw new Error('TOURNAMENT NOT FOUND')
  if (info.count >= info.slot) throw new Error('TOURNAMENT FULL')



  await prisma.$executeRaw`
    INSERT INTO "TournamentHistory" ("userId","tournamentId")
    VALUES (${u.id}, ${tournamentId})
  `
}
