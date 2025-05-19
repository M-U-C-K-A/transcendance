// server/server.ts
import Fastify from 'fastify';
import getUserInfo from './request/userProfile/getUserInfo'
import cors from '@fastify/cors';

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
	origin: true, // Autorise toutes les origines (à restreindre en production)
	methods: ['GET', 'POST', 'PUT', 'DELETE'] // Autorise ces méthodes
  });

const port = 3001;

app.get('/profile/:username', async function (request, reply) {
	const { username } = request.params as { username: string }

	if (!username)
	{
		console.log('No username passed as parameter in profile route')
		return reply.code(400).send({ error: 'Username is required' })
	}

	try {
		const result = await getUserInfo(username)
		return (reply.send(result))
	} catch (err) {
		console.log('No user found in profileRoute')
		reply.code(404).send({ error: 'User not found' })
	}
})

app.get('/health', async (req, reply) => {
	return reply.code(200).send({ status: 'ok' });
});

app.listen({ port, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		console.log(err);
		process.exit(1);  // Quitter le processus en cas d'erreur
	}
	console.log(`Server running at ${address}`);
});
