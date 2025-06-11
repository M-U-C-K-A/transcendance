import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

const connections = new Map<number, Set<WebSocket>>();

interface ChatQuery {
  token?: string;
}

interface JwtPayload {
  id: number;
  [key: string]: any;
}

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

	console.log(`WebSocket connecté pour l'utilisateur ID ${userId}`);

	if (!connections.has(userId)) {
		connections.set(userId, new Set());
	}
	connections.get(userId)!.add(connection);

	await changeOnlineStatus(userId, true)

		connection.on('close', () => {
		const userConnections = connections.get(userId);
		userConnections?.delete(connection);
		if (userConnections?.size === 0) {
			connections.delete(userId);
		}
		changeOnlineStatus(userId, false)
		console.log(`Déconnexion WebSocket pour l'utilisateur ${userId}`);
	});

  } catch (error) {
	console.error('Échec d\'authentification WebSocket :', error);
	connection.close(403, 'Authentification échouée');
  }
}

export function broadcastMessage(userId: number, message: any) {

	const userConnections = connections.get(userId);
	if (userConnections) {
	const messageString = JSON.stringify(message);
	userConnections.forEach(ws => {
		if (ws.readyState === ws.OPEN) {
			ws.send(messageString);
		}
	});
	console.log(`Message envoyé à l'utilisateur ${userId}`);
	}
}

export function broadcastToAll(message: any) {
	const messageString = JSON.stringify(message);
	connections.forEach((userConnections, userId) => {
	userConnections.forEach(ws => {
		if (ws.readyState === ws.OPEN) {
			ws.send(messageString);
		}
	});
});
	console.log(`Message diffusé à tous les utilisateurs connectés`);
}
