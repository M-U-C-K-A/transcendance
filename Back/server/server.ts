import fs from 'fs';
import path from 'path';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import fastifyWebSocket from '@fastify/websocket';
import profileRoute from './routes/profile/usersprofile';
import health from './routes/health';
import loginRoute from './routes/auth/login/login';
import sendMessageRoute from './routes/chat/sendMessage';
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
import joinMatchRoute from './routes/match/joinMatchRoute';
import matchResultRoute from './routes/match/matchResultRoute';
import blockUserRoute from './routes/chat/blockUserRoute';
import privateChatRoute from './routes/chat/privateChatRoute';
import { googleLogin } from './routes/auth/google/google';
import gameCreationRoute from './routes/match/gameCreation';
import register2FARoute from './routes/auth/register/2FAregisterRoute';
import Check2FARoute from './routes/auth/register/2FACheckRoute';
import Check2FALoginRoute from './routes/auth/login/2FALoginCheck';
import viewDataRoute from './routes/gdpr/viewDataRoute';
import editDataRoute from './routes/gdpr/editDataRoute';
import deleteDataRoute from './routes/gdpr/deleteDataRoute';
import getDataRoute from './routes/gdpr/getDataRoute';
import enable2FARoute from './routes/user/activate2FARoute';
import get2FAStateRoute from './routes/user/get2FAState';
import fastifyCookie from '@fastify/cookie';
import { friendsWebSocketHandler } from './websocket/websocketFriends';
import joinTournamentRoute from './routes/tournament/joinTournamentRoute';
import { chatWebSocketHandler } from './websocket/websocketChat';
import deleteInactive from './request/gdpr/deleteInactive';
import startMatchRoute from './routes/match/startMatchRoute';

dotenv.config();

const app = Fastify({
	logger: loggerConfig,
	bodyLimit: 20 * 1024 * 1024,
	https: {
		key: fs.readFileSync(path.join('Shared/certs/key.pem')),
		cert: fs.readFileSync(path.join('Shared/certs/cert.pem')),
	},
});

app.register(fastifyWebSocket);

app.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
	exposedHeaders: ['Authorization'],
});

app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET || 'test',
});

app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'a_secret_key',
});

async function main() {
	const port = 3001;

	await app.register(profileRoute);
	await app.register(health);
	await app.register(loginRoute);
	await app.register(privateChatRoute);
	await app.register(editProfileRoute);
	await app.register(sendMessageRoute);
	await app.register(friendListRoute);
	await app.register(leaderboardRoute);
	await app.register(friendRequestRoute);
	await app.register(meProfile);
	await app.register(acceptRequestRoute);
	await app.register(seeFriendRequestRoute);
	await app.register(removeFriendRoute);
	await app.register(newMessageRoute);
	await app.register(joinMatchRoute);
	await app.register(matchResultRoute);
	await app.register(blockUserRoute);
	await app.register(googleLogin);
	await app.register(gameCreationRoute)
	await app.register(register2FARoute)
	await app.register(Check2FARoute)
	await app.register(Check2FALoginRoute)
	await app.register(viewDataRoute)
	await app.register(editDataRoute)
	await app.register(deleteDataRoute)
	await app.register(getDataRoute)
	await app.register(get2FAStateRoute)
	await app.register(enable2FARoute)
	await app.register(joinTournamentRoute)
	await app.register(startMatchRoute)

	await deleteInactive()
	app.register(async (fastify) => {
		fastify.get('/wss/chat', { websocket: true }, chatWebSocketHandler);
	});

	app.register(async (fastify) => {
		fastify.get('/wss/friends', { websocket: true }, friendsWebSocketHandler);
	});

	app.listen({ port, host: '0.0.0.0' }, (err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
	});
}

main();
