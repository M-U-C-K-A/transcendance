import cors from '@fastify/cors';
import Fastify from 'fastify';
import profileRoute from './routes/profile/profile';
import health from './routes/health';
import chat from './routes/chat';
import loginRoute from './routes/auth/login';
import registerRoute from './routes/auth/register';
import path from 'path';
import fs from 'fs';

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
const header = `
=============================================
Server Log - ${new Date().toISOString()}
Version: 1.0.0
Node: ${process.version}
Platform: ${process.platform}
=============================================

`;
fs.writeFileSync(currentLogFile, header);

const loggerConfig = {
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    levelFirst: true,
                    translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                    ignore: 'pid,hostname',
                }
            },
            {
                target: 'pino/file',
                options: {
                    destination: currentLogFile,
                    mkdir: true,
                    append: false // Ne pas ajouter aux logs existants
                }
            }
        ]
    },
    level: 'info'
};

const app = Fastify({ logger: loggerConfig });

app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    exposedHeaders: ['Authorization'],
});

async function main() {
    const port = 3001;

    await app.register(profileRoute);
    await app.register(health);
    await app.register(registerRoute);
    await app.register(loginRoute);
    await app.register(chat);

    app.listen({ port, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log(`Server running at ${address}`);
        app.log.info(`Server started - Log file: ${currentLogFile}`);
    });
}

main();
