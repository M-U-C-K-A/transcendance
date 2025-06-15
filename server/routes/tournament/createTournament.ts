import authMiddleware from "@/server/authMiddleware";
import tournamentCreate from "@/server/request/tournament/createTournament";
import { FastifyInstance } from "fastify";

export default async function tournamentCreateRoute(server: FastifyInstance) {
	server.post('/tournament/create', {preHandler: authMiddleware}, async function (request, reply) {
	const user = request.user as { id: number }
	const tournament = request.body as { name: string, slot: number}

		try {
			console.log(tournament)
			const result = await tournamentCreate(user.id, tournament.name, tournament.slot);
			return reply.code(200).send(result);
		} catch (err: any) {
			return reply.code(500).send({ error: 'Internal server error' });
		}
	});
}
