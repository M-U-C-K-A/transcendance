// server/server.ts
import cors from '@fastify/cors';
import Fastify from 'fastify';
import profileRoute from './routes/profile/profile';
import health from './routes/health';
import chat from './routes/chat';
import loginRoute from './routes/auth/login';
import registerRoute from './routes/auth/register';
import { Sevillana } from 'next/font/google';

const loggerConfig = {
	transport: {
	  target: 'pino-pretty',
	  options: {
		colorize: true,
		levelFirst: true,
		translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
		ignore: 'pid,hostname',
		}
	},
	level: 'info' // Vous pouvez changer le niveau (debug, info, warn, error)
};

const app = Fastify({ logger: loggerConfig });

app.register(cors, {
	origin: true, // Autorisez seulement votre frontend
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
	credentials: true, // Si vous utilisez des cookies/sessions
	exposedHeaders: ['Authorization'], // Headers exposés
  })

async function main() {
	const server = Fastify();
	const port = 3001;

	await server.register(profileRoute);
	await server.register(health);
	await server.register(registerRoute);
	await server.register(loginRoute);
	await server.register(chat)

	server.listen({ port, host: '0.0.0.0' }, (err, address) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		console.log(`Server running at ${address}`);
	});
}
main();

