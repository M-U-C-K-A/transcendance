export type User = {
	id: number;
	name: string;
	avatar: string;
	win: number;
	lose: number;
	elo: number;
};

export type privateMessage = {
	id: number;
	user: {
		id: number;
		name: string;
		avatar: string;
		win: number;
		lose: number;
		elo: number;
	};
	recipient?: {
		id: number | null;
		name: string | null;
		avatar: string | null;
		win: number | null;
		lose: number | null;
		elo: number | null;
	};
	text: string;
	timestamp: Date;
	isPrivate: boolean;
	isRead: boolean;
};


export type Conversation = {
	id: number;
	userName: string;
	avatar: string;
	lastMessage?: string;
	lastMessageTime?: Date;
};

export type PrivateConversation = {
	id: number;
	userName: string;
	avatar: string;
	lastMessage?: string;
	lastMessageTime?: Date;
};

export type Message = {
	id: number;
	user: {
		id: number;
		name: string;
		avatar: string;
		win: number;
		lose: number;
		elo: number;
	};
	recipient?: {
		id: number | null;
		name: string | null;
		avatar: string | null;
		win: number | null;
		lose: number | null;
		elo: number | null;
	};
	me: {
		id: number;
		username: string;
	};
	text: string;
	timestamp: Date;
	isPrivate: boolean;
	isRead: boolean;
	typeMessage: string;
};
