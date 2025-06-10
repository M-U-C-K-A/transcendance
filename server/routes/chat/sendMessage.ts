import { FastifyInstance } from "fastify";
import sendMessage from "@/server/request/chat/sendMessage";
import { sendMessageData } from '@/server/request/chat/interface';
import authMiddleware from "@/server/authMiddleware";
import { broadcastMessage, broadcastToAll } from './websocketHandler';

export default async function sendMessageRoute(server: FastifyInstance) {
	server.post('/chat/send', { preHandler: authMiddleware }, async function (request, reply) {
		const data = request.body as sendMessageData;
		const sender = request.user as { id: number, username: string };

		if (!data) {
			console.log('No parameter passed in sendMessageRoute route');
			return reply.code(400).send({ error: 'parameter is required' });
		}

		try {
			const sentMessage = await sendMessage(sender.id, data);

			const wsMessage = {
				sender: {
					id: sender.id,
					username: sender.username,
				},
				content: data.content,
				sendAt: new Date().toISOString(),
				messageType: data.messageType
			};

			if (!data.recipient) {
				broadcastToAll({
					type: 'NEW_PUBLIC_MESSAGE',
					message: wsMessage
			});

			} else if (data.recipient) {
				broadcastMessage(data.recipient, {
					type: 'NEW_PRIVATE_MESSAGE',
					message: wsMessage
				})

				// Envoi aussi à l'expéditeur pour synchronisation
				broadcastMessage(sender.id, {
					type: 'NEW_PRIVATE_MESSAGE',
					message: wsMessage
				});
			}

			return reply.code(200).send({
				message: "Message sent successfully",
				data: sentMessage
			});

		} catch (err: any) {
			if (err.message === 'User not found , Could not send message') {
				return reply.code(404).send({ error: 'User not found , Could not send message' });
			} else if (err.message === "You blocked this user") {
				return reply.code(403).send({ error: "You blocked this user" });
			} else if (err.message === "This user blocked you") {
				return reply.code(403).send({ error: "This user blocked you" });
			}
			return reply.code(500).send({ error: 'Internal server error' });
		}
	});
}
