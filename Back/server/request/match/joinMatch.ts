import { PrismaClient } from '@prisma/client';
import Hashids from 'hashids';

const Prisma = new PrismaClient();
const hashids = new Hashids("CLE MATCH", 8);

export function decodeMatchId(hashedId: string): number {
	if (hashedId == "-1") {
		return -1
	}

	const decoded = hashids.decode(hashedId);

	if (!decoded.length) {
		throw new Error('Not valid Match');
	}
	return Number(decoded[0]);
}

export async function joinMatchFromInvite(userId: number, matchId: number) {

	const userInfo = await Prisma.user.findUnique({
		where: { id: userId },
		select: { username: true, elo: true }
	});

	if (!userInfo) {
		throw new Error('User does not exist');
	}

	const matchState = await Prisma.match.findFirst({
		where: {
			id: matchId,
		},
		select: {
			id: true,
			p2Id: true,
		},
	});

	if (!matchState?.id) {
		throw new Error('Match Does not exist')
	}
	else if (matchState?.p2Id) {
		throw new Error('Match already finished')
	}

	const updatedMatch = await Prisma.match.update({
		where: { id: matchId },
		data: {
			p2Id: userId,
			p2Elo: userInfo.elo,
		},
		select: {
			p1Id: true,
			player1: {
				select: {
					avatar: true,
					username: true,
				}
			}
		},
	});

	const username = await Prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			username: true,
		},
	});

	return {matchId: matchId,
		p2Id: userId,
		p2Username: userInfo.username,
		hostId: updatedMatch.p1Id,
		avatar: updatedMatch.player1.avatar,
		hostName: updatedMatch.player1.username};
}
