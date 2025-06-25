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

	const token = request.cookies.token;

	if (!token) {
	  throw new Error('Token manquant dans les cookies');
	}

	const decoded = request.server.jwt.verify<JwtPayload>(token);

	const userId = decoded.id;

	setChatConnection(userId, connection);

	await changeOnlineStatus(userId, true);

	connection.on('close', () => {
	  removeChatConnection(userId);
	  changeOnlineStatus(userId, false);
	});

  } catch (error) {
	console.error("🔴 [Erreur WebSocket CHAT]", error);
  }
}
