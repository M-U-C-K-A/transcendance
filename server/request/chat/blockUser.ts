import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function blockUser(userId: number, id: number) {
	const isAlreadyBlock = await Prisma.block.findFirst({
		where: {
			id1: userId,
			id2: id,
		},
	});

	if (isAlreadyBlock) {
		await Prisma.block.deleteMany({
			where: {
				id1: userId,
				id2: id,
			},
		});
	}
	else {
		await Prisma.block.create ({
			data: {
				id1: userId,
				id2: id,
			},
		});
	}

	return (true)
}
