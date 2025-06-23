import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { setChatConnection, removeChatConnection } from '@/server/websocket/notifications';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

interface ChatQuery { token?: string; }
interface JwtPayload { id: number; [key: string]: any; }

export async function chatWebSocketHandler(
connection: WebSocket,
request: FastifyRequest
) {
try {
	console.log("TEST WEBSOCKET FRIENDS👺👺👺👺👺")
	const token = request.cookies.token

	if (!token) {
		console.log("TOKEN NON TROUVEE👺👺👺👺👺👺")
		throw new Error('Token manquant dans les cookies')
	}

	const decoded = await request.jwtVerify<JwtPayload>()
	const userId = decoded.id

	setChatConnection(userId, connection);
	console.log("USER", userId, "CONNECTER AU FRIEND WEBSOCKET")
	await changeOnlineStatus(userId, true)

	connection.on('close', () => {
		removeChatConnection(userId);
		changeOnlineStatus(userId, false)
	});

	} catch (error) {
		connection.close(1008, 'Authentification échouée');
	}
}
