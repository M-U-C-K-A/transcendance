import { FastifyInstance } from "fastify";
import  editProfile  from "../../request/user/editProfile"
import { editProfileInfo } from "../../request/user/interface";

export default async function editProfileRoute(server: FastifyInstance) {
	server.get('/editprofile/:username', async function (request, reply) {
	const { newInfo } = request.params as { newInfo: editProfileInfo }

	if (!newInfo)
	{
		console.log('No parameter passed in editProfileRoute route')
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await editProfile(newInfo)
		return (reply.code(200).send(result))
	} catch (err) {
		console.log('No user found in editProfileRoute')
		reply.code(404).send({ error: 'User not found' })
	}
})
}
