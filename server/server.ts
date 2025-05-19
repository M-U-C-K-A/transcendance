import Fastify from 'fastify';
import getUserInfo from './request/userProfile/getUserInfo'

const app = Fastify();

const port = 3001;

interface ProfileParams {
  username: string;
}

app.get('/', async (req, res) => {
	return 'Hello World!';
});

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
