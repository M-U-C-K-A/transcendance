import { PrismaClient } from '@prisma/client'
import { userData }     from '@/server/utils/interface'

const prisma = new PrismaClient()

export async function joinTournament(username: string, tournamentName: string):
Promise<void> {

	const [u] = await prisma.$queryRaw<userData[]>`
		SELECT id
		FROM "User"
		WHERE username = ${username}
	`
	if (!u)
	{
		console.log('User not found');
		throw new Error('User not found');
	}



	const [tournament] = await prisma.$queryRaw<{ id: number; slot: number }[]>`
		SELECT id, slot
		FROM "Tournament"
		WHERE "tournamentName" = ${tournamentName}
	`
	if (!tournament){
		console.log('Tournament not found in joinTournament');
		throw new Error('Tournament not found in joinTournament');
	}



	const [info] = await prisma.$queryRaw<{ count: number }[]>`
		SELECT COUNT (*) AS count
		FROM "TournamentParticipants"
		WHERE "tournamentId" = ${tournament.id}
	`
	if (info.count >= tournament.slot)
	{
		console.log('Tournament room already full');
		throw new Error('Tournament room already full');
	}



	await prisma.$executeRaw`
		INSERT INTO "TournamentParticipants" ("userId", "tournamentId")
		VALUES (${u.id}, ${tournament.id})
	`
}
