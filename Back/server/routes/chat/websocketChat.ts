import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { setChatConnection, removeChatConnection } from '@/server/websocket/notifications';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

interface ChatQuery { token?: string; }
interface JwtPayload { id: number; [key: string]: any; }

export async function chatWebSocketHandler(
	connection: WebSocket,
	request: FastifyRequest<{ Querystring: ChatQuery }>
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

		setChatConnection(userId, connection);

		changeOnlineStatus(userId, true)

		connection.on('close', () => {
			changeOnlineStatus(userId, false)
			removeChatConnection(userId);
		});

	} catch (error) {
		console.error('WebSocket auth failed:', error);
		connection.close(403, 'Authentification échouée');
	}
}
