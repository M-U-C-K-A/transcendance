import fs from 'fs';
import path from 'path';
import cors from '@fastify/cors';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import fastifyWebSocket from '@fastify/websocket';
import profileRoute from './routes/profile/usersprofile';
import health from './routes/health';
import loginRoute from './routes/auth/login';
import registerRoute from './routes/auth/register';
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
import joinMatchRoute from './routes/match/joinMatchRoute';
import matchResultRoute from './routes/match/matchResultRoute';
import blockUserRoute from './routes/chat/blockUserRoute';
import generalChatRoute from './routes/chat/generalChatRoute';
import privateChatRoute from './routes/chat/privateChatRoute';
import matchListRoute from './routes/match/matchListRoute';
import { googleLogin } from './routes/auth/google';
import { chatWebSocketHandler } from '@/server/routes/chat/websocketChat';
import { friendsWebSocketHandler } from './routes/friends/websocketFriends';
import fastifyCookie from '@fastify/cookie';
import gameCreationRoute from './routes/match/gameCreation';

dotenv.config();

const ws = process.env.NEXT_PUBLIC_WEBSOCKET_FOR_CHAT || ""
console.log(ws)

const app = Fastify({
	logger: loggerConfig,
	bodyLimit: 20 * 1024 * 1024,
	https: {
		key: fs.readFileSync(path.join('ssl/key.pem')),
		cert: fs.readFileSync(path.join('ssl/cert.pem')),
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
	await app.register(registerRoute);
	await app.register(loginRoute);
	await app.register(generalChatRoute);
	await app.register(privateChatRoute);
	await app.register(editProfileRoute);
	await app.register(sendMessageRoute);
	await app.register(tournamentRoutes);
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
	await app.register(matchListRoute);
	await app.register(googleLogin);
	await app.register(gameCreationRoute)

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
		console.log(`✅ Serveur HTTPS lancé sur ${address}`);
	});
}

main();
