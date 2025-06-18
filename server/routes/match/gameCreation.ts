import authMiddleware from "@/server/authMiddleware";
import matchCreate from "@/server/request/match/matchCreate";
import { matchName } from "@/types/match";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import Hashids from 'hashids';

export default async function gameCreationRoute(server: FastifyInstance) {
	server.post('/game/custom', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const data = matchName.safeParse( request.body )
	const user = request.user as { id: number}

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { name } = data.data

	try {
		const result = await matchCreate(name, user.id)
		const hashids = new Hashids("CLE MATCH", 8)
		const hashedCode = hashids.encode(result.id)
		return (reply.code(200).send({ hashedCode, name }))
	} catch (err: any) {
		if (err.message === "User not found") {
			return reply.code(400).send({ error: 'User not found' })
		}
		return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
