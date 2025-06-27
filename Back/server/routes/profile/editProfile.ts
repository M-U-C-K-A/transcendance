import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import editProfile from "../../request/profile/editProfile"
import authMiddleware from "@/server/authMiddleware";
import meProfileInfo from "@/server/request/profile/meProfile";
import { editProfileData } from "@/types/profile";

export default async function editProfileRoute(server: FastifyInstance) {
  server.post('/editprofile', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {

	const user = request.user as { id: number; username: string; bio: string }
	const data = editProfileData.safeParse(request.body)

	if (!user) {
	  return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
	  })
	}

	const { newAvatar, newBio, newUsername } = data.data

	try {
		await editProfile(user.id, user.username, newAvatar, newBio, newUsername)
		const result = await meProfileInfo(user.id)
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

		return reply.code(200).send({ user: result })
	} catch (err: any) {
	 if (err.message === 'Username already taken') {
		return reply.code(403).send({ error: err.message })
	} else if (err.message === 'Failed to get user info') {
		return reply.code(404).send({ error: err.message })
	}
		return reply.code(500).send({ error: err.message })
	}
  })
}
