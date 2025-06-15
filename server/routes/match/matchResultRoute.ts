import authMiddleware from "@/server/authMiddleware";
import { decodeMatchId } from "@/server/request/match/joinMatch";
import matchResult from "@/server/request/match/matchResult";
import { FastifyInstance } from "fastify";

export default async function matchResultRoute(server: FastifyInstance) {
server.post("/game/result", { preHandler: authMiddleware }, async function (request, reply) {
	const body = request.body as { player1Score: number; player2Score: number; gameId: string};
	const user = request.user as { id: number };

	const gameId = Number(body.gameId);
	const p1Score = body.player1Score;
	const p2Score = body.player2Score;

	const decodedID = decodeMatchId(gameId.toString())

	try {
		const result = await matchResult( p1Score, p2Score, decodedID, user.id );
		return reply.code(200).send(result);
		} catch (err: any) {
			return reply.code(500).send({ error: "Internal server error" });
	  }
	}
  );
}
