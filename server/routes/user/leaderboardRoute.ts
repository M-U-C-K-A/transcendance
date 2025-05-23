import { FastifyInstance } from "fastify";
import leaderboard from "@/server/request/profile/leaderboard";

export default async function leaderboardRoute(server: FastifyInstance) {
	server.get('/leaderboard', async function (request, reply) {
	try {
		const ranking = await leaderboard();
		return reply.code(200).send(ranking);
	} catch (err: any) {
	 if (err.message === 'Failed to get leaderboard') {
		return reply.code(500).send({ error: 'Failed to get leaderboard' });
	}
		return reply.code(500).send({ error: 'Internal server error' });
	}
});
}
