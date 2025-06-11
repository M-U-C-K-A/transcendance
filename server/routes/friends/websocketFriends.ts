import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

const friendConnections = new Map<number, Set<WebSocket>>();

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

	if (!friendConnections.has(userId)) {
	  friendConnections.set(userId, new Set());
	}
	friendConnections.get(userId)!.add(connection);

	connection.on('close', () => {
	  const userConns = friendConnections.get(userId);
	  userConns?.delete(connection);
	  if (userConns?.size === 0) {
		friendConnections.delete(userId);
	  }
	});

  } catch (error) {
	connection.close(403, 'Authentification échouée');
  }
}

export function notifyFriend(userId: number, payload: any) {
	const conns = friendConnections.get(userId);
	if (!conns) {
		return
	};
	console.log("🎅🎅🎅🎅🎅🎅🎅", payload)
	const msg = JSON.stringify(payload);
	conns.forEach(ws => {
	try {
		if (ws.readyState === ws.OPEN) {
		ws.send(msg);
	}
	} catch (err) {
			console.error("WebSocket send error for user", userId, err);
		}
	});
}

export function notifyFriends(userIds: number[], payload: any) {
	console.log("🌯🌯🌯🌯🌯🌯🌯🌯", payload)
	userIds.forEach(userId => {
		const isConnected = friendConnections.has(userId);
		console.log(`🧪 Is user ${userId} connected?`, isConnected);
		notifyFriend(userId, payload);
	});
}
