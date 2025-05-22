import cors from '@fastify/cors';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt'

import profileRoute from './routes/profile/profile';
import health from './routes/health';
import chat from './routes/chat';
import loginRoute from './routes/auth/login';
import registerRoute from './routes/auth/register';
import path from 'path';
import fs from 'fs';
import getMessageRoute from './routes/chat/getMessage';
import sendMessageRoute from './routes/chat/sendMessage';
import tournamentRoutes from './routes/tournament';
import { loggerConfig } from './config/logger';

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
=============================================

`;
// On écrit le header SANS écraser le fichier (append: true), puis on laisse pino/file écrire la suite
fs.writeFileSync(currentLogFile, header, { flag: 'w' });

const app = Fastify({ logger: loggerConfig });

app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    exposedHeaders: ['Authorization'],
});

app.register(fastifyJwt, {
	secret: process.env.JWT_SECRET || 'test',
})

async function main() {
    const port = 3001;

    await app.register(profileRoute);
    await app.register(health);
    await app.register(registerRoute);
    await app.register(loginRoute);
    await app.register(chat);
    await app.register(getMessageRoute)
    await app.register(sendMessageRoute)
    await app.register(tournamentRoutes);

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
