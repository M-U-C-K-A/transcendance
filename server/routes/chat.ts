import { FastifyInstance } from 'fastify'
import getMessage from '../request/chat/getMessage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function chat(server: FastifyInstance) {
  server.get('/chat/:username', async function (request, reply) {
    console.log('GET /chat/:username - Request received for username:', request.params)
    const { username } = request.params as { username: string }

    if (!username) {
      console.log('No username passed as parameter in profile route')
      return reply.code(400).send({ error: 'Username is required' })
    }

    try {
      console.log('Fetching messages for user:', username)
      const result = await getMessage(username)
      console.log('Messages retrieved successfully:', result)
      return (reply.send(result))
    } catch (err) {
      console.log('No user found in profileRoute')
      reply.code(404).send({ error: 'User not found' })
    }
  })

  // Nouvelle route pour envoyer un message
  server.post('/chat/send', async function (request, reply) {
    console.log('POST /chat/send - Request received:', request.body)
    const { sender, recipient, content, isGeneral } = request.body as {
      sender: string
      recipient: string | null
      content: string
      isGeneral: boolean
    }

    try {
      // Trouver l'ID de l'expéditeur
      console.log('Looking up sender:', sender)
      const senderUser = await prisma.user.findUnique({
        where: { username: sender }
      })

      if (!senderUser) {
        console.log('Sender not found:', sender)
        return reply.code(404).send({ error: 'Sender not found' })
      }

      let recipientId = null
      if (recipient) {
        console.log('Looking up recipient:', recipient)
        const recipientUser = await prisma.user.findUnique({
          where: { username: recipient }
        })
        if (recipientUser) {
          recipientId = recipientUser.id
          console.log('Recipient found with ID:', recipientId)
        } else {
          console.log('Recipient not found:', recipient)
        }
      }

      // Créer le message
      console.log('Creating new message:', { sender, recipient, content, isGeneral })
      const message = await prisma.message.create({
        data: {
          senderId: senderUser.id,
          recipientId: recipientId ?? null,
          content,
          isGeneral,
          readStatus: false,
          messageType: isGeneral ? 'Public' : 'Private'
        }
      })

      console.log('Message created successfully:', message)
      return reply.send(message)
    } catch (error) {
      console.error('Error sending message:', error)
      return reply.code(500).send({ error: 'Failed to send message' })
    }
  })

  // Nouvelle route pour marquer les messages comme lus
  server.post('/chat/mark-as-read', async function (request, reply) {
    console.log('POST /chat/mark-as-read - Request received:', request.body)
    const { currentUser, sender } = request.body as {
      currentUser: string
      sender: string
    }

    try {
      // Trouver l'ID de l'utilisateur actuel et de l'expéditeur
      console.log('Looking up users:', { currentUser, sender })
      const [currentUserData, senderData] = await Promise.all([
        prisma.user.findUnique({ where: { username: currentUser } }),
        prisma.user.findUnique({ where: { username: sender } })
      ])

      if (!currentUserData || !senderData) {
        console.log('One or both users not found:', { currentUser, sender })
        return reply.code(404).send({ error: 'User not found' })
      }

      // Mettre à jour les messages non lus
      console.log('Marking messages as read between users:', { currentUser, sender })
      await prisma.message.updateMany({
        where: {
          senderId: senderData.id,
          recipientId: currentUserData.id,
          readStatus: false
        },
        data: {
          readStatus: true
        }
      })

      console.log('Messages marked as read successfully')
      return reply.send({ success: true })
    } catch (error) {
      console.error('Error marking messages as read:', error)
      return reply.code(500).send({ error: 'Failed to mark messages as read' })
    }
  })
}
