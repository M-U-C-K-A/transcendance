import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

const connections = new Map<number, WebSocket>();

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

		const prevSocket = connections.get(userId);
		if (prevSocket && prevSocket.readyState === WebSocket.OPEN) {
			prevSocket.close(1000, 'New connection');
		}

		connections.set(userId, connection);

		changeOnlineStatus(userId, true)

		connection.on('close', () => {
			changeOnlineStatus(userId, false)
			connections.delete(userId);
		});

	} catch (error) {
		console.error('WebSocket auth failed:', error);
		connection.close(403, 'Authentification échouée');
	}
}

export function broadcastMessage(userId: number, message: any) {
	const ws = connections.get(userId);
	if (ws && ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(message));
	}
}
