import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient()

export default async function message(senderUsername: string, recipientUsername: string, messageContent: string) {
    const senderResult = await Prisma.$queryRaw<number[]>` SELECT id FROM USER WHERE username = ${senderUsername}`

    if (!senderResult){
        console.log('Couldnt find sender in message');
        throw new Error('Sender not found')
    }

    const senderId = senderResult[0]

    const recipientResult = await Prisma.$queryRaw<number[]>`SELECT id FROM USER WHERE username = ${recipientUsername}`

    if (!recipientResult) {
        console.log('Couldnt find recipient in message')
        throw new Error('Recipient not found')
    }

    const recipientId = recipientResult[0]
    await Prisma.$executeRaw`INSERT INTO MESSAGE (senderId, recipientId, content, readStatus, status, messageType)
    VALUES (${senderId}, ${recipientId}, ${messageContent}, false, true, 0)`

    return (true)
}
