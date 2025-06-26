import authMiddleware from "@/server/authMiddleware";
import editData from "@/server/request/gdpr/editData";
import { editDataGdpr } from "@/types/gdpr";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function editDataRoute(server: FastifyInstance) {
	server.post('/gdpr/send', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number }
	const data = editDataGdpr.safeParse(request.body)

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		console.log(data.error.flatten().fieldErrors)
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { username, email, password, removeAvatar } = data.data

	try {
		const result = await editData(user.id, username, email, password, removeAvatar)
		if (result) {
			const token = server.jwt.sign({
				id: result.id,
				username: result.username,
			})

			reply.setCookie('token', token, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/',
					maxAge: 60 * 60 * 24 * 7,
			})

			return (reply.code(200).send(true))
		} else {
			throw new Error("Internal server error")
		}
	} catch (err: any) {
			if (err.message === 'This user does not exist') {
				return reply.code(404).send({ error: 'This user does not exist' })
			} else if (err.message == 'Wrong password') {
				return reply.code(403).send({ error: 'This user does not exist' })
			} else if (err.message == "Google account can't edit their data") {
				return reply.code(403).send({ error: "Google account can't edit their data" })
			} else if (err.message == 'New email or username already taken') {
				return reply.code(403).send({ error: "New email or username already taken" })
			} return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
