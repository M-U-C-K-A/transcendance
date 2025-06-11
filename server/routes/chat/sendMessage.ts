import { FastifyInstance } from "fastify";
import sendMessage from "@/server/request/chat/sendMessage";
import { sendMessageData } from '@/server/request/chat/interface';
import authMiddleware from "@/server/authMiddleware";
import { broadcastMessage, broadcastToAll } from './websocketChat';
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient()

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

			if (!data.recipient) {
				const wsMessage = {
				id: sentMessage.id,
				content: sentMessage.content,
				sendAt: sentMessage,
					sender: {
						id: sender.id,
						username: sender.username,
					},
			};
				broadcastToAll({
					type: 'NEW_PUBLIC_MESSAGE',
					message: wsMessage
			});

			} else if (data.recipient) {
				const collegueName = await Prisma.user.findFirst({
					where: {
						id: sentMessage.recipientId || 999999,
					},
					select: {
						username: true,
					},
				});

				const wsMessage = {
					id: sentMessage.id,
					content: sentMessage.content,
					sendAt: sentMessage,
					user: {
						id: sender.id,
						username: sender.username,
					},
					collegue: {
						id: data.recipient,
						username: collegueName?.username,
					},
					sender: {
						id: sender.id,
						username: sender.username,
					},
				}

				broadcastMessage(data.recipient, {
					type: 'NEW_PRIVATE_MESSAGE',
					message: wsMessage
				})

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
