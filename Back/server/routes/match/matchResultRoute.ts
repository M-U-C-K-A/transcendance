import authMiddleware from "@/server/authMiddleware";
import { decodeMatchId } from "@/server/request/match/joinMatch";
import matchResult from "@/server/request/match/matchResult";
import { matchResultData } from "@/types/match";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function matchResultRoute(server: FastifyInstance) {
server.post("/game/result", { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {
	const data = matchResultData.safeParse(request.body)
	const user = request.user as { id: number };

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { player1Score, player2Score, gameId} = data.data


	try {
		const decodedID = decodeMatchId(gameId);
		const result = await matchResult( player1Score, player2Score, decodedID, user.id );
		return reply.code(200).send(result);
		} catch (err: any) {
			if (err.message == 'Player not found') {
				return reply.code(404).send({ error: err.message });
			} else if (err.message == 'Not valid Match') {
				return reply.code(404).send({ error: err.message });
			}
			return reply.code(500).send({ error: "Internal server error" });
	  }
	}
  );
}
