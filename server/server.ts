import cors from '@fastify/cors';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt'
import profileRoute from './routes/profile/usersprofile';
import health from './routes/health';
import loginRoute from './routes/auth/login';
import registerRoute from './routes/auth/register';
import getMessageRoute from './routes/chat/getMessage';
import sendMessageRoute from './routes/chat/sendMessage';
import tournamentRoutes from './routes/tournament';
import { loggerConfig } from './config/logger';
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
import getOnlineUsers, { initSocket } from './websocket/onlineUser';
import { setupWebSocket } from './websocket/websocket';
import { createServer } from 'http';

const app = Fastify({ logger: loggerConfig,
  bodyLimit: 20 * 1024 * 1024 });
const httpServer = createServer(app.server);

app.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
	exposedHeaders: ['Authorization'],
});

app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET || 'test',
})

const onlineUsers = new Map<number, WebSocket>();


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
	await app.register(getOnlineUsers)

	initSocket(httpServer, app.jwt)

	app.listen({ port, host: '0.0.0.0' }, (err, address) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		console.log(`Serveur démarré sur ${address}`);
	});
	setupWebSocket(app.server, app);
}

main();
