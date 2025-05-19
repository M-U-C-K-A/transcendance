import Fastify from 'fastify';
import getUserInfo from './request/userProfile/getUserInfo'

const app = Fastify();

// Définir le port
const port = 3001;

// Définir un type pour les paramètres de la route
interface ProfileParams {
  username: string;
}

// Route d'accueil
app.get('/', async (req, res) => {
	return 'Hello World!';
});

// Route pour obtenir le profil utilisateur
app.get('/profile/:username', async function (request, reply) {
	const { username } = request.params as { username: string }

	// Vérifier que le paramètre username est fourni
	if (!username) {
		console.log('No username passed as parameter in profile route')
		return reply.code(400).send({ error: 'Username is required' })
	}

	try {
		// Appeler la fonction getUserInfo pour récupérer les infos de l'utilisateur
		const result = await getUserInfo(username)
		return reply.send(result)  // Renvoie la réponse avec les données de l'utilisateur
	} catch (err) {
		console.log('No user found in profileRoute', err)
		reply.code(404).send({ error: 'User not found' })  // Si l'utilisateur n'est pas trouvé, renvoie une erreur 404
	}
})

// Démarrer le serveur avec un objet de configuration
app.listen({ port, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		console.log(err);
		process.exit(1);  // Quitter le processus en cas d'erreur
	}
	console.log(`Server running at ${address}`);
});
