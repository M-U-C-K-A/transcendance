import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import register2FA from '@/server/request/auth/register/2FAregister';
import { registerData } from '@/types/auth';

export default async function register2FARoute(server: FastifyInstance) {
	server.post('/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
		console.log(request.body);
		const data = registerData.safeParse(request.body);

		if (!data.success) {
			console.log(data.data);
			console.log(data.error);
			return reply.status(400).send({
				errors: data.error.flatten().fieldErrors,
			});
		};

		const { username, password, email } = data.data;

		try {
			const result = await register2FA(username, password, email);
			return reply.code(201).send({ result });
		} catch (err: any) {
			if (err.message === 'Internal server error') {
				return reply.code(500).send({ error: err.message })
			} else {
				return reply.code(403).send({ error: err.message })
			}
		}
	})
}
