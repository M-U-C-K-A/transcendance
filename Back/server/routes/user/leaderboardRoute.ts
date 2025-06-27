import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import leaderboard from "@/server/request/user/leaderboard";
import authMiddleware from "@/server/authMiddleware";

export default async function leaderboardRoute(server: FastifyInstance) {
	server.get('/leaderboard', {preHandler: authMiddleware}, async function (request: FastifyRequest, reply: FastifyReply) {
	try {
		const ranking = await leaderboard();
		return reply.code(200).send(ranking);
	} catch (err: any) {
	if (err.message === 'Failed to get leaderboard') {
		return reply.code(404).send({ error: 'Failed to get leaderboard' });
	}
		return reply.code(500).send({ error: 'Internal server error' });
	}
});
}
