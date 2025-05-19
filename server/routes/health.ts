import { FastifyInstance } from 'fastify';

export default async function healthRoute(server: FastifyInstance) {
	server.get('/health', async (req, reply) => {
		return reply.code(200).send({ status: 'ok' });
	});
}

