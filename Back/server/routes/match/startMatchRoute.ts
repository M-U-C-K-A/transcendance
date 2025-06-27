import authMiddleware from "@/server/authMiddleware";
import { decodeMatchId } from "@/server/request/match/joinMatch";
import startMatch from "@/server/request/match/startMatch";
import { matchIdOnly } from "@/types/match";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function startMatchRoute(server: FastifyInstance) {
server.post("/game/start", { preHandler: authMiddleware }, async function (request: FastifyRequest, reply: FastifyReply) {

	const data = matchIdOnly.safeParse(request.body)
	const user = request.user as { id: number };

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { matchId } = data.data

	try {
		const decodedID = decodeMatchId(matchId);
		const result = await startMatch(decodedID)
		return reply.code(200).send(result);
		} catch (err: any) {
			if (err.message == 'Match not full') {
				return reply.code(403).send({ error: err.message });
			} else if (err.message == 'Not valid Match') {
				return reply.code(404).send({ error: err.message });
			}
			return reply.code(500).send({ error: "Internal server error" });
			}
		}
	);
}
