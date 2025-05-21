import { FastifyInstance } from 'fastify';

export default async function healthRoute(server: FastifyInstance) {
	server.get('/health', async (req, reply) => {
		req.log.info('Vérification de l\'état du serveur')
		return reply.code(200).send({ status: 'ok' });
	});
}

