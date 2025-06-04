import { Server as SocketIOServer } from 'socket.io';
import { FastifyInstance } from 'fastify';
import http from 'http';

export const onlineUsers = new Map<string, string>();

export function setupWebSocket(server: http.Server, fastify: FastifyInstance) {
	const io = new SocketIOServer(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST']
		}
	});

	io.on('connection', (socket) => {
	console.log('Socket connecté', socket.id);

	const token = socket.handshake.auth.token;
	if (!token) {
		socket.disconnect();
		return;
	}

	try {
		const decoded = fastify.jwt.verify(token) as { id: string };
		const userId = decoded.id;

		onlineUsers.set(userId, socket.id);
		console.log(`Utilisateur ${userId} connecté`);

		socket.on('disconnect', () => {
			onlineUsers.delete(userId);
			console.log(`Utilisateur ${userId} déconnecté`);
		});
	} catch (err) {
		console.log('Token invalide');
		socket.disconnect();
	}
});

	return {
		io,
		isUserOnline: (userId: string) => onlineUsers.has(userId),
	};
}
