import { FastifyInstance } from "fastify";
import sendMessage from "@/server/request/chat/sendMessage";
import { sendMessageData } from '@/server/request/chat/interface';
import authMiddleware from "@/server/authMiddleware";

export default async function sendMessageRoute(server: FastifyInstance) {
	server.post('/message/send', {preHandler: authMiddleware}, async function (request, reply) {
	const data = request.body as sendMessageData
	const senderId = request.user as {id: number}

	if (!data)
	{
		console.log('No parameter passed in sendMessageRoute route')
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await sendMessage(senderId.id, data)
		return (reply.code(200).send({ message: "Message send succesfully"}))
	} catch (err: any) {
		if (err.message === 'User not found in sendMessage') {
			return reply.code(404).send({ error: 'User not found in sendMessage' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
	})
}

