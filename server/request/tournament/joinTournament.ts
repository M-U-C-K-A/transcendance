import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function joinTournament(username: string, tournamentId: number) {
	const user = await Prisma.user.findUnique({
		where: {
				username
		},
		select: {
				id: true
		},
	});

	if (!user) {
		throw new Error('User not found');
	}
	const tournament = await Prisma.tournament.findUnique({
		where: {
			id: tournamentId
		},
		select: {
			slot: true
		},
	});

	if (!tournament) {
		throw new Error('Tournament not found');
	}

	const userTournaments = await Prisma.tournamentParticipants.findMany({
		where: {
			userId: user.id
		},
		select: {
			tournamentId: true
		},
	});

	const userTournamentIds = userTournaments.map(t => t.tournamentId);

	if (userTournamentIds.length > 0) {
		const activeTournaments = await Prisma.tournament.findMany({
			where: {
				id: { in: userTournamentIds },
				winnerId: null,
			},
			select: {
				id: true
			},
		});
		if (activeTournaments.length > 0) {
			throw new Error('User already in a tournament');
		}
	}

	const alreadyInTournament = await Prisma.tournamentParticipants.findFirst({
		where: {
			tournamentId,
			userId: user.id,
		},
	});

	if (alreadyInTournament) {
		throw new Error('User already in the tournament');
	}

	const participantCount = await Prisma.tournamentParticipants.count({
		where: {
			tournamentId
		},
	});

	if (participantCount >= tournament.slot) {
		throw new Error('Tournament already full');
	}

	await Prisma.tournamentParticipants.create({
		data: {
			userId: user.id,
			tournamentId,
		},
	});

	const info = await Prisma.user.findUnique({
		where: {
			id: user.id
		},
		select: {
			id: true,
			username: true,
			win: true,
			lose: true,
		},
	});

	return (info);
}
