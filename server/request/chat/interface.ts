export interface messageInfo{
	id:				number
	senderId:		number
	recipientId:	number
	content:		String
	sendAt:			number
	readStatus:		Boolean
	isGeneral:		Boolean
	messageType:	string
	sender:			messageUser
	recipient:		messageUser
}

export interface messageUser{
	username: string
	alias: string
	avatar: string
	win: number
	lose: number
	winrate: number
	elo: number
}

export interface id{
	id: number
}

export interface sendMessageData{
	recipient: string
	content: string
	messageType: string
}

export interface returnData {
	id: number | null
	username: string | null
}
