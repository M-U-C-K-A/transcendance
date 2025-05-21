import sendMessage from "./sendMessage"

export interface messageInfo{
    id: number     
    senderId: number
    recipientId: number
    content: String
    sendAt: number 
    readStatus:  Boolean
    isGeneral:   Boolean
    messageType: string
}

export interface id{
	id: number
}

export interface sendMessageData{
    senderName: string
    recipientName: string
    content: string
}