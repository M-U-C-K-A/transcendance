import { FastifyInstance } from "fastify";
import  editProfile  from "../../request/profile/editProfile"
import authMiddleware from "@/server/authMiddleware";
import meProfileInfo from "@/server/request/profile/meProfile";

export default async function editProfileRoute(server: FastifyInstance) {
	server.post('/editprofile', {preHandler: authMiddleware}, async function (request, reply) {
	const userId = request.user as { id: number; username: string}
	const newInfo = request.body as { newAvatar: string, newUsername: string, newBio: string}

	if (!userId || !newInfo)
	{
		console.log('wrong parameter in editProfileRoute route')
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		await editProfile(userId.id, userId.username, newInfo.newAvatar, newInfo.newBio, newInfo.newUsername)
		const result = await meProfileInfo(userId.username)
		const token = server.jwt.sign({
			id: result.id,
			email: result.email,
			username: result.username,
			bio: result.bio,
			avatar: result.avatar,
		})
		return (reply.code(200).send(result))
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
