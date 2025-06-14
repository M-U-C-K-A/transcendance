import { PrismaClient }           from '@prisma/client'
import { userData }               from '@/server/utils/interface'
import { TournamentData }         from '@/server/utils/interface'
import { getAvatar }              from '@/server/utils/getAvatar'

const prisma = new PrismaClient()

export async function createTournament(hostUsername: string, tournamentName: string, slotCount = 4):
Promise<{ tournament: TournamentData}> {

	const [y] = await prisma.$queryRaw<TournamentData[]>`
		SELECT tournamentName
		FROM tournament
		WHERE tournamentName = ${tournamentName}
		`
	if (y)
	{
		console.log('Tournament name already taken');
		throw new Error ('Tournament name already taken')
	}

	const [h] = await prisma.$queryRaw<userData[]>`
		SELECT id, avatar
		FROM "User"
		WHERE username = ${hostUsername}
	`
	if (!h)
	{
		console.log('User not found');
		throw new Error('User not found');
	}



	const [t] = await prisma.$queryRaw<TournamentData[]>`
		INSERT INTO "Tournament" ("hostId","tournamentName","slot")
		VALUES (${h.id}, ${tournamentName}, ${slotCount})
		RETURNING id, "hostId", "tournamentName", "slot", "TDate"
	`
	if (!t)
	{
		console.log('Tournament creation failed');
		throw new Error('Tournament creation failed');
	}



	return { tournament: t }
}
