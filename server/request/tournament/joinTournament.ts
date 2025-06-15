import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function joinTournament(username: string, tournamentId: number) {

	const userData = await Prisma.user.findUnique ({
		where: {
			username: username,
		},
		select: {
			id: true,
		}
	});

	if (!userData) {
		throw new Error ('User not found')
	}

	const participantNumber = await Prisma.tournamentParticipants.count({
		where: {
			tournamentId: tournamentId,
		},
	})

	const tournamentSlot = await Prisma.tournament.findFirst({
		where: {
			id: tournamentId,
		},
		select: {
			slot: true,
		},
	});

	if (!tournamentSlot) {
		throw new Error('Tournament not found')
	}

	if (participantNumber >= tournamentSlot?.slot) {
		throw new Error ('Tournament already full')
	}

	await Prisma.tournamentParticipants.create({
		data: {
			userId: userData.id,
			tournamentId: tournamentId,
		},
	});

	const info = await Prisma.user.findFirst({
		where: {
			id: userData.id,
		},
		select: {
			id: true,
			username: true,
			win: true,
			lose: true,
		}
	});

	console.log('Tournament joined succesfully')
	return (info)
}
