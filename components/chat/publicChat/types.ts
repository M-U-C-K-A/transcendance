export interface generalMessage {
	id: number;
	sender: {
		id: number;
		username: string;
		avatar?: string;
		win?: number;
		lose?: number;
		elo?: number;
	};
	content: string;
	sendAt: string;
}

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
  text: string;
  timestamp: Date;
  isPrivate: boolean;
  isRead: boolean;
};
