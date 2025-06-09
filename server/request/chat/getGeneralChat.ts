import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function getGeneralChat() {
	const chat = await Prisma.message.findMany({
		where: {
			isGeneral: true,
		},
		orderBy: {
			id: 'desc',
		},
		take: 100,
		select: {
			id: true,
			content: true,
			sendAt: true,
			sender: {
				select: {
					id: true,
					username: true,
				}
			}
		},
	});

	return (chat.reverse());
}
