import { PrismaClient } from '@prisma/client'
import { userData } from '../user/interface';
import { matchInfo } from './interface';

const Prisma = new PrismaClient()

export default async function getMatchHistory(username: string) {
	const MatchData = await Prisma.$queryRaw<matchInfo[]>`
	SELECT * FROM "Match"
	WHERE
	p1Id = (SELECT id FROM "User" WHERE username = ${username})
	OR
	p2Id = (SELECT id FROM "User" WHERE username = ${username});`;

	const usersInfo = await Prisma.$queryRaw<userData[]>`
	SELECT * FROM "User"
	WHERE id = MatchData[0].p1Id
	OR
	id = MatchData[0].p2Id`

	return {MatchData, usersInfo}
}
