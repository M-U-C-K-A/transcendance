import { WebSocket } from 'ws';

const chatConnections = new Map<number, WebSocket>();
const friendConnections = new Map<number, Set<WebSocket>>();

export function setChatConnection(userId: number, ws: WebSocket) {
	chatConnections.set(userId, ws);
}

export function removeChatConnection(userId: number) {
	chatConnections.delete(userId);
}

export function setFriendConnection(userId: number, ws: WebSocket) {
	if (!friendConnections.has(userId)) {
		friendConnections.set(userId, new Set());
	}
	friendConnections.get(userId)!.add(ws);
}

export function removeFriendConnection(userId: number, ws: WebSocket) {
	const conns = friendConnections.get(userId);
	if (conns) {
		conns.delete(ws);
		if (conns.size === 0) {
			friendConnections.delete(userId);
		}
	}
}

export function notifyFriend(userId: number, data: any) {
	const conns = friendConnections.get(userId);
	if (!conns) {
		return;
	}
	const msg = JSON.stringify(data);
	conns.forEach(ws => {
		try {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(msg);
			}
		} catch (err) {
			console.error("WebSocket send error for user", userId, err);
		}
	});
}

export function broadcastMessage(userId: number, data: any) {
	const ws = chatConnections.get(userId);
	if (ws && ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(data));
	}
}
