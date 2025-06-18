import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import  editProfile  from "../../request/profile/editProfile"
import authMiddleware from "@/server/authMiddleware";
import meProfileInfo from "@/server/request/profile/meProfile";
import { editProfileData } from "@/types/profile";

export default async function editProfileRoute(server: FastifyInstance) {
	server.post('/editprofile', {preHandler: authMiddleware}, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number; username: string; bio: string}
	const data = editProfileData.safeParse(request.body)

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const {newAvatar, newBio, newUsername} = data.data

	try {
		await editProfile(user.id, user.username, newAvatar, newBio, newUsername)
		const result = await meProfileInfo(user.id)
		const token = server.jwt.sign({
			id: result.id,
			email: result.email,
			username: result.username,
			bio: result.bio,
		})
		return (reply.code(200).send({user: result, token}))
	} catch (err: any) {
		if (err.message == 'Username already taken' ) {
			reply.code(403).send({ error: 'Username already taken' })
		}
		if (err.message == 'Failed to get user info') {
			return reply.code(404).send({ error: 'User not found' })
		}
		reply.code(500).send({ error: 'Internal server error' })
	}
})
}
