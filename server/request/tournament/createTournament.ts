import { PrismaClient }           from '@prisma/client'
import { userData }               from '@/server/utils/interface'
import { TournamentData }         from '@/server/utils/interface'
import { getAvatar }              from '@/server/utils/getAvatar'

const prisma = new PrismaClient()

export async function createTournament(hostUsername: string, slotCount = 4
): Promise<{ tournament: TournamentData; avatar: Buffer | null }> {

  const [h] = await prisma.$queryRaw<userData[]>`
    SELECT id, avatar
    FROM "User"
    WHERE username = ${hostUsername}
    LIMIT 1
  `
  if (!h) throw new Error('USER NOT FOUND')


  const [t] = await prisma.$queryRaw<TournamentData[]>`
    INSERT INTO "Tournament" ("hostId","slot")
    VALUES (${h.id}, ${slotCount})
    RETURNING id, "hostId", "slot", "TDate" AS "tDate"
  `
  if (!t) throw new Error('TOURNAMENT CREATION FAILED')

  return { tournament: t, avatar: getAvatar(h) }
}
