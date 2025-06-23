import changeOnlineStatus from '@/server/request/profile/changeOnlineStatus';
import { setFriendConnection, removeFriendConnection } from '@/server/websocket/notifications';
import { FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

interface FriendQuery {
  token?: string;
}

interface JwtPayload {
  id: number;
  [key: string]: any;
}

export async function friendsWebSocketHandler(
  connection: WebSocket,
  request: FastifyRequest
) {
  try {
	console.log("🟡 [1] Tentative de connexion WebSocket FRIENDS");

	const token = request.cookies.token;
	console.log("🟡 [2] Token récupéré depuis les cookies:", token);

	if (!token) {
	  console.log("🔴 [3] Token introuvable dans les cookies");
	  throw new Error('Token manquant dans les cookies');
	}

	const decoded = request.server.jwt.verify<JwtPayload>(token);
	console.log("🟢 [4] Token JWT vérifié avec succès:", decoded);

	const userId = decoded.id;
	console.log("🟢 [5] ID utilisateur extrait:", userId);

	setFriendConnection(userId, connection);
	console.log("🟢 [6] Connexion WebSocket enregistrée pour l'utilisateur", userId);

	await changeOnlineStatus(userId, true);
	console.log("🟢 [7] Statut de l'utilisateur mis à jour : en ligne");

	connection.on('close', () => {
	  console.log("🟠 [8] Fermeture de la connexion WebSocket pour l'utilisateur", userId);
	  removeFriendConnection(userId, connection);
	  changeOnlineStatus(userId, false);
	  console.log("🟠 [9] Utilisateur", userId, "mis hors ligne et connexion supprimée");
	});

  } catch (error) {
	console.error("🔴 [Erreur WebSocket FRIENDS]", error);
	connection.close(1008, 'Authentification échouée');
  }
}
