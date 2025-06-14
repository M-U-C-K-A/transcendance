import { PrismaClient } from '@prisma/client';
import Hashids from 'hashids';

const Prisma = new PrismaClient();
const hashids = new Hashids("CACA BOUDIN", 8);

function extractHashedId(inviteUrl: string): string | null {
	const regex = /\(https?:\/\/[^\/\)]+\/en\/game\/custom\/(\w+)\)/;
	const match = inviteUrl.match(regex);
	return match ? match[1] : null;
}

function decodeMatchId(hashedId: string): number {
	const decoded = hashids.decode(hashedId);
	if (!decoded.length) {
		throw new Error(`Impossible de décoder l'ID du match: ${hashedId}`);
	}
	return Number(decoded[0]);
}

export default async function joinMatchFromInvite(userId: number, inviteUrl: string) {

	console.log("🌅🌅🌅🌅🌅🌅🌅🌅🌅")
	console.log("URL DE LINVIT", inviteUrl)
	console.log(userId);
	console.log("🌅🌅🌅🌅🌅🌅🌅🌅🌅")

	const hashedId = extractHashedId(inviteUrl);

	if (!hashedId) {
		throw new Error('Not valid invitation');
	}

	const matchId = decodeMatchId(hashedId);

	const userInfo = await Prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			username: true,
			elo: true
		}
	});

	if (!userInfo) {
		throw new Error('User does not exist');
	}

	const updatedMatch = await Prisma.match.update({
		where: {
			id: matchId
		},
		data: {
			p2Id: userId,
			p2Elo: userInfo.elo,
		}
	});

	console.log("Match rejoint avec succès :", updatedMatch.id);
	return updatedMatch;
}
