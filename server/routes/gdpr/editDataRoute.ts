import authMiddleware from "@/server/authMiddleware";
import editData from "@/server/request/gdpr/editData";
import { FastifyInstance } from "fastify";

export default async function viewDataRoute(server: FastifyInstance) {
	server.post('/gdpr/edit', { preHandler: authMiddleware }, async function (request, reply) {
	const user = request.user as { id: number }
	const data = request.body as { email: string, pass: string }

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await editData(user.id,  data.email, data.pass)
		return (reply.code(200).send(result))
	} catch (err: any) {
			if (err.message === 'This user does not exist') {
				return reply.code(404).send({ error: 'This user does not exist' })
			} else if (err.message == 'Wrong password') {
				return reply.code(403).send({ error: 'This user does not exist' })
			} else if (err.message == "Google account can't edit their data") {
				return reply.code(403).send({ error: "Google account can't edit their data" })
			}
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
