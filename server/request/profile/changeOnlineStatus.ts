import { broadcastToAll } from '@/server/routes/chat/websocketChat'
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function changeOnlineStatus(id: number, status: boolean) {

	await Prisma.user.update ({
		where: {
			id: id,
		},
		data: {
			onlineStatus: status,
		}
	})

	return (true)
}
