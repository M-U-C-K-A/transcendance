import { PrismaClient } from '@prisma/client'
import { userData } from '@/server/utils/interface'
import  { matchInfo } from './interface'
import { getAvatar } from '@/server/utils/getAvatar';

const Prisma = new PrismaClient()

export default async function joinMatch(user: string, matchName: string) {
	const matchId = await Prisma.$queryRaw<number[]>`SELECT id FROM "Match" WHERE name = ${matchName}`;

	if(!matchId[0]) {
		console.log('Match not found in joinMatch');
		throw new Error('Match not found in joinMatch');
	}

	if (matchId.length > 2) {
		console.log('Match room already full');
		throw new Error('Match room already full');
	}

	const userElo = await Prisma.$queryRaw<number[]>`SELECT elo FROM "User" WHERE username = ${user}`;


	return (userElo[0])
}
