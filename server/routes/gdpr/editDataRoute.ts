import authMiddleware from "@/server/authMiddleware";
import editData from "@/server/request/gdpr/editData";
import { FastifyInstance } from "fastify";

export default async function editDataRoute(server: FastifyInstance) {
	server.post('/gdpr/send', { preHandler: authMiddleware }, async function (request, reply) {
	const user = request.user as { id: number }
	const data = request.body as { username: string, email: string, password: string, removeAvatar: boolean }

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}
	console.log("🌯🌯🌯🌯🌯DATA EDIT PROFILE RGPD🌯🌯🌯🌯", user.id, data)
	try {
		const result = await editData(user.id, data.username, data.email, data.password, data.removeAvatar)
		if (result) {
			const token = server.jwt.sign({
				id: result.id,
				email: result.email,
				username: result.username,
				bio: result.bio,
			})
			return (reply.code(200).send({ token}))
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
			}
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}
