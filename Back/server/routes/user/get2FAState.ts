import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import get2FAState from "@/server/request/user/get2FAState";

export default async function get2FAStateRoute(server: FastifyInstance) {
	server.get('/gdpr/twofa', {preHandler: authMiddleware}, async function (request: FastifyRequest, reply: FastifyReply) {
	console.log("👺👺👺GETTWOFA👺👺👺")
	const user = request.user as { id: number }

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await get2FAState(user.id);
		return reply.code(200).send(result);
	} catch (err: any) {
		 if (err.message === 'User not found') {
			return reply.code(500).send({ error: err.message });
		} return reply.code(500).send({ error: 'Internal server error' });
	}
});
}
