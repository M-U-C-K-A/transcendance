// websocket.ts
import { Server as SocketIOServer } from 'socket.io';
import { FastifyInstance } from 'fastify';
import http from 'http';

const onlineUsers = new Map<string, string>(); // userId -> socketId

export function setupWebSocket(server: http.Server, fastify: FastifyInstance) {
	const io = new SocketIOServer(server, {
		cors: {
			origin: '*', // à adapter
			methods: ['GET', 'POST']
		}
	});

	io.on('connection', (socket) => {
	console.log('Socket connecté', socket.id);

		// Exemple de handshake avec token JWT
		const token = socket.handshake.auth.token;
		if (!token) {
			socket.disconnect();
			return;
		}

		try {
			const decoded = fastify.jwt.verify(token);
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
