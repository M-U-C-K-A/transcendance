import { FastifyInstance } from "fastify";
import sendMessage from "@/server/request/chat/sendMessage";
import { sendMessageData } from '@/server/request/chat/interface';
import authMiddleware from "@/server/authMiddleware";
import { broadcastMessage } from './websocketChat';
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient()

export default async function sendMessageRoute(server: FastifyInstance) {
	server.post('/chat/send', { preHandler: authMiddleware }, async function (request, reply) {
		const data = request.body as sendMessageData;
		const sender = request.user as { id: number, username: string };

		if (!data) {
			return reply.code(400).send({ error: 'parameter is required' });
		}

		try {
			const wsMessage = await sendMessage(sender.id, data);
			if (data.recipient) {

				const privateMessage = {
					id: wsMessage.id,
					content: wsMessage.content,
					sendAt: wsMessage.sendAt,
					messageType: wsMessage.messageType,
					user: {
						id: sender.id,
						username: sender.username,
					},
					recipient: {
						id: sender.id,
						username: sender.username,
					},
					sender: {
						id: sender.id,
						username: sender.username,
					},
				};
				broadcastMessage(data.recipient, {
					type: 'NEW_PRIVATE_MESSAGE',
					message: privateMessage
				})

				broadcastMessage(sender.id, {
					type: 'NEW_PRIVATE_MESSAGE',
					message: privateMessage
				});
			}

			return reply.code(200).send({
				message: "Message sent successfully",
				data: wsMessage
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
