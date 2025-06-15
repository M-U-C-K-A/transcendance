import { PrismaClient } from '@prisma/client';
import Hashids from 'hashids';

const Prisma = new PrismaClient();
const hashids = new Hashids("CACA BOUDIN", 8);

function decodeMatchId(hashedId: string): number {
	const decoded = hashids.decode(hashedId);
	if (!decoded.length) {
		throw new Error(`Impossible de décoder l'ID du match: ${hashedId}`);
	}
	return Number(decoded[0]);
}

export default async function joinMatchFromInvite(userId: number, inviteUrl: string) {
	console.log("🌅🌅🌅🌅🌅🌅🌅🌅🌅");
	console.log("URL DE LINVIT", inviteUrl);
	console.log(userId);
	console.log("🌅🌅🌅🌅🌅🌅🌅🌅🌅");

	const matchId = decodeMatchId(inviteUrl);

	const userInfo = await Prisma.user.findUnique({
		where: { id: userId },
		select: { username: true, elo: true }
	});

	if (!userInfo) {
		throw new Error('User does not exist');
	}

	const findMatch = await Prisma.match.findMany({
		where: {
			OR: [
				{ p1Id: userId },
				{ p2Id: userId }
			],
			winnerId: { not: null }
		}
	});

	const updatedMatch = await Prisma.match.update({
		where: { id: matchId },
		data: {
			p2Id: userId,
			p2Elo: userInfo.elo,
		}
	});

	console.log("Match rejoint avec succès :", updatedMatch.id);
	return updatedMatch;
}
