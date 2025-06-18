import authMiddleware from "@/server/authMiddleware";
import viewData from "@/server/request/gdpr/viewData";
import { passwordCheck } from "@/types/gdpr";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function viewDataRoute(server: FastifyInstance) {
	server.post('/gdpr/verify', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number }
	const data = passwordCheck.safeParse(request.body)

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { password } = data.data

	try {
		const result = await viewData(user.id, password)
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
