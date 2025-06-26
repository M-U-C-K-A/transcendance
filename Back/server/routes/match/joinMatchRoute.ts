import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from '@/server/authMiddleware';
import { decodeMatchId, joinMatchFromInvite } from "@/server/request/match/joinMatch";
import { matchCode } from "@/types/match";

export default async function joinMatchRoute(server: FastifyInstance) {
	server.post('/game/travel', { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {

	const user = request.user as { id: number }
	const data = matchCode.safeParse(request.body)

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { code } = data.data


	try {
		const matchId = decodeMatchId(code)
		const result = await joinMatchFromInvite(user.id, matchId)
		return (reply.code(200).send({ result }))
	} catch (err: any) {
		console.error('Error in joinMatch:', err);
		if (err.message == 'Match already finished') {
			return reply.code(401).send({ error: 'Match already finished' })
		} else if (err.message == 'Not valid Match' ||
			err.message == 'Match Does not exist' ||
			err.message == 'User does not exist') {
			return reply.code(404).send({ error: err.message })
		} return reply.code(500).send({ error: 'Internal server error' })
	}
})
}
