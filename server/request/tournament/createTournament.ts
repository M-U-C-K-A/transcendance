import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function tournamentCreate(hostId: number, tournamentName: string, slot: number) {
	const tournament = await Prisma.tournament.create({
		data: {
			hostId: hostId,
			tournamentName: tournamentName,
			slot: slot,
		},
		select: {
			id: true
		}
	});

	await Prisma.tournamentParticipants.create({
		data: {
			userId: hostId,
			tournamentId: tournament.id
		}
	})

	const host = await Prisma.user.findUnique({
		where: {
			id: hostId,
		},
		select: {
			username: true,
			elo: true,
			win: true,
			lose: true,
		}
	});

	if (!host) {
		throw new Error('User not found')
	}

	console.log(`Tournament created with the name ${tournamentName} and slot ${slot}`)

	return {hostId: hostId, username: host.username, elo: host.elo, win: host.win, lose: host.lose, tournamentId: tournament.id, tournamentSlot: slot}
}
