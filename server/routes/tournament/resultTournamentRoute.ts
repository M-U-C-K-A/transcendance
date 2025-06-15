import authMiddleware from "@/server/authMiddleware";
import resultTournament from "@/server/request/tournament/resultTournament";
import { FastifyInstance } from "fastify";

export default async function resultTournamentRoute(server: FastifyInstance) {
	server.post('/tournament/result', {preHandler: authMiddleware}, async function (request, reply) {
	const user = request.body as { username: string, tournamentId: string }

	const id = Number(user.tournamentId)
		try {
			const result = await resultTournament( user.username, id );
			return reply.code(200).send(result);
		} catch (err: any) {
			if (err.message == 'User not found') {
				return reply.code(404).send({ error: 'User not found' });
			} else if (err.message == 'Tournament not found') {
				return reply.code(404).send({ error: 'Tournament not found' });
			}
			return reply.code(500).send({ error: 'Internal server error' });
		}
	});
}
