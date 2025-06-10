import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

// Stockage des connexions
const connections = new Map<number, Set<WebSocket>>();

// Interface pour typer la query string
interface ChatQuery {
  token?: string;
}

// Interface pour le payload JWT attendu
interface JwtPayload {
  id: number;
  [key: string]: any;
}

// Handler pour les WebSockets
export async function chatWebSocketHandler(
  connection: WebSocket,
  request: FastifyRequest<{ Querystring: ChatQuery }>
) {
  try {
	console.log('🔌 Nouvelle tentative de connexion WebSocket');

	const authHeader = request.headers['authorization'] as string | undefined;
	const tokenFromQuery = request.query.token;
	const wsProtocolToken = request.headers['sec-websocket-protocol'] as string | undefined;

	// Si token présent uniquement dans sec-websocket-protocol
	if (!authHeader && !tokenFromQuery && wsProtocolToken) {
	  request.headers['authorization'] = `Bearer ${wsProtocolToken}`;
	  console.log('ℹ️ Token récupéré depuis sec-websocket-protocol');
	}

	// Aucune source de token
	if (!request.headers['authorization'] && !tokenFromQuery) {
	  console.warn('⚠️ Token manquant dans la requête WebSocket');
	  throw new Error('Token manquant');
	}

	// Vérification du token depuis l'en-tête Authorization
	const decoded = await request.jwtVerify<JwtPayload>();
	const userId = decoded.id;

	console.log(`✅ WebSocket connecté pour l'utilisateur ID ${userId}`);

	// Stocker la connexion
	if (!connections.has(userId)) {
	  connections.set(userId, new Set());
	}
	connections.get(userId)!.add(connection);

	console.log(`📡 Total de connexions pour l'utilisateur ${userId}: ${connections.get(userId)?.size}`);

	// Nettoyage à la déconnexion
	connection.on('close', () => {
	  const userConnections = connections.get(userId);
	  userConnections?.delete(connection);
	  if (userConnections?.size === 0) {
		connections.delete(userId);
	  }
	  console.log(`❌ Déconnexion WebSocket pour l'utilisateur ${userId}`);
	});

  } catch (error) {
	console.error('❌ Échec d\'authentification WebSocket :', error);
	connection.close(1008, 'Authentification échouée');
  }
}

// Fonction pour envoyer un message à un utilisateur
export function broadcastMessage(userId: number, message: any) {
  const userConnections = connections.get(userId);
  if (userConnections) {
	const messageString = JSON.stringify(message);
	userConnections.forEach(ws => {
	  if (ws.readyState === ws.OPEN) {
		ws.send(messageString);
	  }
	});
	console.log(`📤 Message envoyé à l'utilisateur ${userId}`);
  }
}

// Fonction pour diffuser un message à tout le monde
export function broadcastToAll(message: any) {
  const messageString = JSON.stringify(message);
  connections.forEach((userConnections, userId) => {
	userConnections.forEach(ws => {
	  if (ws.readyState === ws.OPEN) {
		ws.send(messageString);
	  }
	});
  });
  console.log(`📢 Message diffusé à tous les utilisateurs connectés`);
}
