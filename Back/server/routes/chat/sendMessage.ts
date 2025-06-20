import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import sendMessage from "@/server/request/chat/sendMessage";
import authMiddleware from "@/server/authMiddleware";
import { PrismaClient } from "@prisma/client";
import { sendMessageData } from "@/types/chat";
import { broadcastMessage } from "@/server/websocket/notifications";

const Prisma = new PrismaClient()

export default async function sendMessageRoute(server: FastifyInstance) {
	server.post('/chat/send', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
		const data = sendMessageData.safeParse(request.body);
		const sender = request.user as { id: number, username: string };

		if (!data) {
			return reply.code(400).send({ error: 'parameter is required' });
		}

		if (!data.success) {
			return reply.status(400).send({
				errors: data.error.flatten().fieldErrors,
			})
		}

		const { recipient, content, messageType } = data.data

		try {
			const wsMessage = await sendMessage(sender.id, recipient, content, messageType);

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
				broadcastMessage(recipient, {
					type: 'NEW_PRIVATE_MESSAGE',
					message: privateMessage
				})

				broadcastMessage(sender.id, {
					type: 'NEW_PRIVATE_MESSAGE',
					message: privateMessage
				});

			return reply.code(200).send({
				message: "Message sent successfully",
				data: wsMessage
			});

		} catch (err: any) {
			if (err.message === 'User not found , Could not send message') {
				return reply.code(404).send({ error: 'User not found , Could not send message' });
			} else if (err.message != 'Internal server error') {
				return reply.code(403).send({ error: err.message });
			} return reply.code(500).send({ error: 'Internal server error' });
		}
	});
}
