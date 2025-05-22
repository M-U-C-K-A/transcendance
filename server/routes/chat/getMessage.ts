// server/routes/chat/getMessageRoute.ts
import { FastifyInstance } from "fastify";
import getMessage from "@/server/request/chat/getMessage";

export default async function getMessageRoute(server: FastifyInstance) {
  server.get('/getmessage/:username', async function (request, reply) {
    const { username } = request.params as { username: string }

    if (!username) {
      console.log('No parameter passed in getMessageRoute route')
      return reply.code(400).send({ error: 'Username parameter is required' })
    }

    try {
      const messages = await getMessage(username)
      return reply.code(200).send(messages)
    } catch (err: any) {
      if (err.message === 'Could not retrieve messages') {
        return reply.code(404).send({ error: 'Could not find messages for this user' })
      }
      console.error('Error in getMessageRoute:', err)
      return reply.code(500).send({ error: 'Internal server error' })
    }
  })
}
