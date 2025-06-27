import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { setChatConnection, removeChatConnection } from '@/server/websocket/notifications';
import { PrismaClient } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

interface ChatQuery { token?: string; }
interface JwtPayload { id: number; [key: string]: any; }

const Prisma = new PrismaClient()
export async function chatWebSocketHandler(
  connection: WebSocket,
  request: FastifyRequest
) {
  try {

	const token = request.cookies.token;

	if (!token) {
	  throw new Error('Token manquant dans les cookies');
	}

	const decoded = request.server.jwt.verify<JwtPayload>(token);

	const userId = decoded.id;

	setChatConnection(userId, connection);

	await changeOnlineStatus(userId, true);

	connection.on('close', () => {
	(async () => {
		const user = await Prisma.user.findFirst({
			where: {
				id: userId,
			},
		});

		if (!user) {
			return;
		}
			removeChatConnection(userId);
			await changeOnlineStatus(userId, false);
		})().catch(err => {
			console.error('Erreur dans le close:', err);
		});
	});

} catch (error) {
	console.error("🔴 [Erreur WebSocket CHAT]", error);
  }
}
