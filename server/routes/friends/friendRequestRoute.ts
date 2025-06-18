import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import  sendFriendRequest  from "../../request/friends/sendFriendRequest";
import authMiddleware from '../../authMiddleware'
import { onlyUsername } from "@/types/chat";

export default async function friendRequestRoute(server: FastifyInstance) {
	server.post('/friends/request', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number }
	const data = onlyUsername.safeParse(request.body)

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { username } = data.data

	try {
		const result = await sendFriendRequest(user.id, username)
		return (reply.code(200).send(result))
	} catch (err: any) {
		if (err.message === 'This user does not exist') {
			return reply.code(404).send({ error: 'This user does not exist' })
		} else if (err.message === 'This user is already a friend') {
			return reply.code(409).send({ error: 'This user is already a friend' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
