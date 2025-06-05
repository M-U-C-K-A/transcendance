import cors from '@fastify/cors';
import Fastify, { fastify } from 'fastify';
import fastifyJwt from '@fastify/jwt'
import profileRoute from './routes/profile/usersprofile';
import health from './routes/health';
import loginRoute from './routes/auth/login';
import registerRoute from './routes/auth/register';
import path from 'path';
import fs from 'fs';
import getMessageRoute from './routes/chat/getMessage';
import sendMessageRoute from './routes/chat/sendMessage';
import tournamentRoutes from './routes/tournament';
import friendListRoute from './routes/friends/friendListRoute';
import leaderboardRoute from './routes/user/leaderboardRoute';
import friendRequestRoute from './routes/friends/friendRequestRoute';
import meProfile from './routes/profile/meProfile';
import editProfileRoute from './routes/profile/editProfile';
import acceptRequestRoute from './routes/friends/treatRequestRoute';
import seeFriendRequestRoute from './routes/friends/seeFriendRequestRoute';
import removeFriendRoute from './routes/friends/removeFriendRoute';
import newMessageRoute from './routes/chat/newMessageRoute';
import createMatchRoute from './routes/match/createMatchRoute';
import joinMatchRoute from './routes/match/joinMatchRoute';
import matchResultRoute from './routes/match/matchResultRoute';
import matchListRoute from './routes/match/matchListRoute';
import fastifyWebsocket from '@fastify/websocket';


// Génère un nom de fichier de log avec timestamp
const getLogFileName = () => {
	const now = new Date();
	const dateStr = now.toISOString()
		.replace(/T/, '_')
		.replace(/\..+/, '')
		.replace(/:/g, '-');
	return `server_${dateStr}.log`;
};

// Crée le répertoire de logs s'il n'existe pas
const logsDir = path.join('server', 'logs');
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

// Crée le fichier de log et écrit le header
const currentLogFile = path.join(logsDir, getLogFileName());
const header = `=============================================
Server Log - ${new Date().toISOString()}
Version: 1.0.0
Node: ${process.version}
Platform: ${process.platform}
=============================================`;

// On écrit le header SANS écraser le fichier (append: true), puis on laisse pino/file écrire la suite
fs.writeFileSync(currentLogFile, header, { flag: 'w' });

const app = fastify();

app.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
	exposedHeaders: ['Authorization'],
});

app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET || 'test',
})

app.register(fastifyWebsocket);


async function main() {
	const port = 3001;
	await app.register(profileRoute);
	await app.register(health);
	await app.register(registerRoute);
	await app.register(loginRoute);
	await app.register(getMessageRoute);
	await app.register(editProfileRoute)
	await app.register(sendMessageRoute);
	await app.register(tournamentRoutes);
	await app.register(friendListRoute)
	await app.register(leaderboardRoute)
	await app.register(friendRequestRoute)
	await app.register(meProfile)
	await app.register(acceptRequestRoute)
	await app.register(seeFriendRequestRoute)
	await app.register(removeFriendRoute)
	await app.register(newMessageRoute)
	await app.register(createMatchRoute)
	await app.register(joinMatchRoute)
	await app.register(matchResultRoute)
	await app.register(matchListRoute)

	app.listen({ port, host: '0.0.0.0' }, (err, address) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		console.log(`Serveur démarré sur ${address}`);
		app.log.info(`Serveur démarré - Fichier log : ${currentLogFile}`);
	});
}

main();
