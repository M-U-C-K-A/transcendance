import authMiddleware from "@/server/authMiddleware";
import deleteData from "@/server/request/gdpr/deleteData";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function deleteDataRoute(server: FastifyInstance) {
	server.delete('/gdpr/delete', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number, username: string }

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await deleteData(user.id, user.username)
		return (reply.code(200).send(result))
	} catch (err: any) {
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
