import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from '../../authMiddleware'
import treatRequest from "@/server/request/friends/treatRequest";
import { acceptFriend } from "@/types/friends";

export default async function acceptRequestRoute(server: FastifyInstance) {
	server.post('/friends/accept', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	console.log(request.body)
	const user = request.user as { id: number, username: string }
	const data = acceptFriend.safeParse(request.body)

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { username, asAccepted } = data.data

	try {
		const result = await treatRequest(user.id, username, asAccepted, user.username)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'Friend Id not found') {
			return reply.code(404).send({ error: 'Friend Id not found' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
