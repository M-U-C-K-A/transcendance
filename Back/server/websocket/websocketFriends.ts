import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { setFriendConnection, removeFriendConnection } from '@/server/websocket/notifications';
import { PrismaClient } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

interface FriendQuery {
  token?: string;
}

interface JwtPayload {
  id: number;
  [key: string]: any;
}

const Prisma = new PrismaClient()

export async function friendsWebSocketHandler(connection: WebSocket, request: FastifyRequest) {
try {
	const token = request.cookies.token;

	if (!token) {
		throw new Error('Token manquant dans les cookies');
	}

	const decoded = request.server.jwt.verify<JwtPayload>(token);

	const userId = decoded.id;

	setFriendConnection(userId, connection);

	await changeOnlineStatus(userId, true);

	connection.on('close', () => {
	(async () => {
		try {
			const user = await Prisma.user.findFirst({
				where: {
					id: userId
				},
			});

			if (!user) {
				return;
			}

			removeFriendConnection(userId, connection);
			await changeOnlineStatus(userId, false);
		} catch (err) {
			console.error('Erreur lors du close du WS:', err);
		}
	})();
});

	} catch (error) {
		connection.close(1008, 'Authentification échouée');
	}
}
