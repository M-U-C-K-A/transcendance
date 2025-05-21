import { FastifyInstance } from 'fastify'
import getMessage from '../request/chat/getMessage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function chat(server: FastifyInstance) {
  server.get('/chat/:username', async function (request, reply) {
    const { username } = request.params as { username: string }
    request.log.info({ username }, 'Tentative de récupération des messages')

    if (!username) {
      request.log.warn('Tentative de récupération des messages sans nom d\'utilisateur')
      return reply.code(400).send({ error: 'Username is required' })
    }

    try {
      const result = await getMessage(username)
      request.log.info({ username, messageCount: result.length }, 'Messages récupérés avec succès')
      return (reply.send(result))
    } catch (err) {
      request.log.error({ username, error: err }, 'Erreur lors de la récupération des messages')
      reply.code(404).send({ error: 'User not found' })
    }
  })

  // Nouvelle route pour envoyer un message
  server.post('/chat/send', async function (request, reply) {
    const { sender, recipient, content, isGeneral } = request.body as {
      sender: string
      recipient: string | null
      content: string
      isGeneral: boolean
    }
    request.log.info({ sender, recipient, isGeneral }, 'Tentative d\'envoi de message')

    try {
      // Trouver l'ID de l'expéditeur
      const senderUser = await prisma.user.findUnique({
        where: { username: sender }
      })

      if (!senderUser) {
        request.log.warn({ sender }, 'Expéditeur non trouvé')
        return reply.code(404).send({ error: 'Sender not found' })
      }

      let recipientId = null
      if (recipient) {
        const recipientUser = await prisma.user.findUnique({
          where: { username: recipient }
        })
        if (recipientUser) {
          recipientId = recipientUser.id
          request.log.info({ recipient, recipientId }, 'Destinataire trouvé')
        } else {
          request.log.warn({ recipient }, 'Destinataire non trouvé')
        }
      }

      // Créer le message
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

      request.log.info({ messageId: message.id, sender, recipient, isGeneral }, 'Message envoyé avec succès')
      return reply.send(message)
    } catch (error) {
      request.log.error({ sender, recipient, error }, 'Erreur lors de l\'envoi du message')
      return reply.code(500).send({ error: 'Failed to send message' })
    }
  })

  // Nouvelle route pour marquer les messages comme lus
  server.post('/chat/mark-as-read', async function (request, reply) {
    const { currentUser, sender } = request.body as {
      currentUser: string
      sender: string
    }
    request.log.info({ currentUser, sender }, 'Tentative de marquage des messages comme lus')

    try {
      // Trouver l'ID de l'utilisateur actuel et de l'expéditeur
      const [currentUserData, senderData] = await Promise.all([
        prisma.user.findUnique({ where: { username: currentUser } }),
        prisma.user.findUnique({ where: { username: sender } })
      ])

      if (!currentUserData || !senderData) {
        request.log.warn({ currentUser, sender }, 'Un ou plusieurs utilisateurs non trouvés')
        return reply.code(404).send({ error: 'User not found' })
      }

      // Mettre à jour les messages non lus
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

      request.log.info({ currentUser, sender }, 'Messages marqués comme lus avec succès')
      return reply.send({ success: true })
    } catch (error) {
      request.log.error({ currentUser, sender, error }, 'Erreur lors du marquage des messages comme lus')
      return reply.code(500).send({ error: 'Failed to mark messages as read' })
    }
  })
}
