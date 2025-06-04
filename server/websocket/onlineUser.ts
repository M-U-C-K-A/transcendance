import { Server as IOServer } from 'socket.io';
import { FastifyJWT } from '@fastify/jwt';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const onlineUsers = new Map<string, boolean>();

export function initSocket(server: any, jwt: FastifyJWT) {
	const io = new IOServer(server, {
		cors: { origin: "*" }
	});

	io.use(async (socket, next) => {
		const token = socket.handshake.auth.token;
		if (!token) return next(new Error("Pas de token"));
		try {
			const decoded = await (jwt as any).verify(token);
			socket.data.userId = decoded.id;
			next();
		} catch (err) {
			next(new Error("Token invalide"));
		}
	});

	io.on('connection', (socket) => {
		const userId = socket.data.userId;
		console.log(`Utilisateur connecté: ${userId}`);
		onlineUsers.set(userId, true);

		socket.on('disconnect', () => {
			console.log(`Utilisateur déconnecté: ${userId}`);
			onlineUsers.delete(userId);
		});
	});
}


export default async function getOnlineUsers(server: FastifyInstance) {
  server.get('/online', async (_request: FastifyRequest, reply: FastifyReply) => {
	return Array.from(onlineUsers.keys());
  });
}
