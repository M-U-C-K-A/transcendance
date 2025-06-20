import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import joinTournament from "@/server/request/tournament/joinTournament";

export default async function joinTournamentRoute(server: FastifyInstance) {
	server.post('/tournament/join', {preHandler: authMiddleware}, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number }
	const { username } = request.body as { username: string }

	if (!user || !username) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await joinTournament(username);

		return reply.code(200).send( result );
	} catch (err: any) {
		if (err.message === 'User not found') {
			return reply.code(404).send({ error: err.message });
		} return reply.code(500).send({ error: 'Internal server error' });
	}
});
}
