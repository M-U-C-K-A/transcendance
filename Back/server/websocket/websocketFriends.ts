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

export async function friendsWebSocketHandler(
  connection: WebSocket,
  request: FastifyRequest<{ Querystring: FriendQuery }>
) {
  try {

	const authHeader = request.headers['authorization'] as string | undefined;
	const tokenFromQuery = request.query.token;
	const wsProtocolToken = request.headers['sec-websocket-protocol'] as string | undefined;

	if (!authHeader && !tokenFromQuery && wsProtocolToken) {
	  request.headers['authorization'] = `Bearer ${wsProtocolToken}`;
	}

	if (!request.headers['authorization'] && !tokenFromQuery) {
	  throw new Error('Token manquant');
	}

	const decoded = await request.jwtVerify<JwtPayload>();
	const userId = decoded.id;

	setFriendConnection(userId, connection);

	await changeOnlineStatus(userId, true)

	connection.on('close', () => {
		removeFriendConnection(userId, connection);
		changeOnlineStatus(userId, false)
	});

	} catch (error) {
		connection.close(403, 'Authentification échouée');
	}
}
