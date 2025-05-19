import { PrismaClient } from '@prisma/client'
import { userData } from '@/server/utils/interface'
import  { matchInfo } from './interface'
import { getAvatar } from '@/server/utils/getAvatar';

const Prisma = new PrismaClient()

export default async function createMatch(host: string, matchName: string) {
	const hostInfo = await Prisma.$queryRaw<userData[]>`SELECT id, elo FROM "User" WHERE username = ${host}`;

	if (!hostInfo[0]) {
		console.log('User not found in createMatch');
		throw new Error('User not found in createMatch');
	}

	const avatar = getAvatar(hostInfo[0])
	if (!matchName)
		matchName = `${host}'s game`;

	await Prisma.$executeRaw`INSERT INTO "Match" (p1Id, p1Elo) VALUES (${hostInfo[0].id}, ${hostInfo[0].elo})`;

	let MatchData: matchInfo = {
		matchName : matchName,
		p1Name : hostInfo[0].username,
		p1Elo : hostInfo[0].elo,
	};

	return {MatchData, avatar}
}
