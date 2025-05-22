import { FastifyInstance } from "fastify";
import sendMessage from "@/server/request/chat/sendMessage";
import { sendMessageData } from '@/server/request/chat/interface';

export default async function sendMessageRoute(server: FastifyInstance) {
	server.post('/sendmessage', async function (request, reply) {
	const data = request.body as sendMessageData

	if (!data)
	{
		console.log('No parameter passed in sendMessageRoute route')
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await sendMessage(data)
		request.log.warn({ message: `Message send successfully ${data.content}` })
		return (reply.code(200).send({ message: "Message send succesfully"}))
	} catch (err: any) {
		if (err.message === 'User not found in sendMessage') {
			return reply.code(404).send({ error: 'User not found in sendMessage' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
	})
}

