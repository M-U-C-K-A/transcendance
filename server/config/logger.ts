import path from 'path';
import fs from 'fs';
import pino from 'pino';

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

// Fonction pour nettoyer les anciens logs
const cleanOldLogs = () => {
    const files = fs.readdirSync(logsDir)
        .filter(file => file.startsWith('server_') && file.endsWith('.log'))
        .map(file => ({
            name: file,
            path: path.join(logsDir, file),
            time: fs.statSync(path.join(logsDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

    // Garde les 7 fichiers les plus récents
    if (files.length > 7) {
        files.slice(7).forEach(file => {
            fs.unlinkSync(file.path);
        });
    }
};

// Nettoie les anciens logs avant de créer un nouveau
cleanOldLogs();

// Crée le fichier de log et écrit le header
const currentLogFile = path.join(logsDir, getLogFileName());
const header = `=============================================
Server Log - ${new Date().toISOString()}
Version: 1.0.0
Node: ${process.version}
Platform: ${process.platform}
=============================================

`;
fs.writeFileSync(currentLogFile, header, { flag: 'w' });

export const loggerConfig = {
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    levelFirst: true,
                    translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                    ignore: 'pid,hostname',
                    messageFormat: '{msg}',
                    customColors: {
                        info: 'blue',
                        warn: 'yellow',
                        error: 'red',
                        debug: 'green'
                    }
                }
            },
            {
                target: 'pino-pretty',
                options: {
                    colorize: false,
                    levelFirst: true,
                    translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                    ignore: 'pid,hostname',
                    messageFormat: '{msg}',
                    destination: currentLogFile,
                    mkdir: true,
                    append: true
                }
            }
        ]
    },
    level: 'info',
    serializers: {
        req: (req: any) => ({
            method: req.method,
            url: req.url,
            ip: req.ip,
            headers: req.headers
        }),
        res: (res: any) => ({
            statusCode: res.statusCode,
            responseTime: res.responseTime
        }),
        err: pino.stdSerializers.err
    }
};
