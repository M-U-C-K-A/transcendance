import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function matchList() {
	const matchInfo = await Prisma.match.findMany ({
		where: {
			p2Id: null,
			winnerId: null,
		},
	});

	return (matchInfo)
}
