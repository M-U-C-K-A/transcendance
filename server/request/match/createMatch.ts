import { PrismaClient } from '@prisma/client'
import { userAgent } from 'next/server'

const Prisma = new PrismaClient()

export default async function createMatch(hostId: number, matchName: string) {
	const hostData = await Prisma.user.findUnique ({
		where: {
			id: hostId,
		},
		select: {
			elo: true,
			username: true,
		}
	});

	if (!hostData) {
		throw new Error ("User not found")
	}

	let name: string;
	if (matchName) {
		name = matchName
	} else {
		name = hostData.username + '\'s game'
	}

	const matchInfo = await Prisma.match.create ({
		data: {
			name: name,
			p1Id: hostId,
			p1Elo: hostData.elo
		}
	});

	return (matchInfo)
}
