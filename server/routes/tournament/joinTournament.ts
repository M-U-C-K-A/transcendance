import authMiddleware from "@/server/authMiddleware";
import joinTournament from "@/server/request/tournament/joinTournament";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function tournamentJoinRoute(server: FastifyInstance) {
	server.post('/tournament/join', {preHandler: authMiddleware}, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.body as { username: string, tournamentId: string }

	const id = Number(user.tournamentId)
		try {
			const result = await joinTournament( user.username, id );
			return reply.code(200).send(result);
		} catch (err: any) {
			if (err.message == 'User not found') {
				return reply.code(404).send({ error: 'User not found' });
			} else if (err.message == 'Tournament not found') {
				return reply.code(404).send({ error: 'Tournament not found' });
			} else if (err.message == 'Tournament already full') {
				return reply.code(520).send({ error: 'Tournament already full' });
			} else if (err.message == 'User already in the tournament') {
				return reply.code(403).send({ error: 'User already in the tournament' });
			} else if (err.message == 'User already in a tournament') {
				return reply.code(403).send({ error: 'User already in a tournament' });
			} return reply.code(500).send({ error: 'Internal server error' });
		}
	});
}
