import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import authMiddleware from "@/server/authMiddleware";
import enable2FA from "@/server/request/user/activate2FA";

export default async function enable2FARoute(server: FastifyInstance) {
	server.post('/gdpr/twofa', {preHandler: authMiddleware}, async function (request: FastifyRequest, reply: FastifyReply) {
	const user = request.user as { id: number }

	if (!user) {
		return reply.code(400).send({ error: 'parameter is required' })
	}

	try {
		const result = await enable2FA(user.id);
		return reply.code(200).send({ result });
	} catch (err: any) {
		 if (err.message === 'User not found') {
			return reply.code(404).send({ error: err.message });
		} return reply.code(500).send({ error: 'Internal server error' });
	}
});
}
