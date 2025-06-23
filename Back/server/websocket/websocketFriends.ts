import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { setFriendConnection, removeFriendConnection } from '@/server/websocket/notifications';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

interface FriendQuery {
  token?: string;
}

interface JwtPayload {
  id: number;
  [key: string]: any;
}

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
		removeFriendConnection(userId, connection);
		changeOnlineStatus(userId, false);
	});

	} catch (error) {
		connection.close(1008, 'Authentification échouée');
	}
}
