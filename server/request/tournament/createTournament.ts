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

	console.log(`Tournament created with the name ${tournamentName} and slot ${slot}`)

	return {tournamentId: tournament.id, tournamentSlot: slot}
}
