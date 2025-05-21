import { FastifyInstance } from "fastify";
import getMessage from "@/server/request/chat/getMessage";

export default async function getMessageRoute(server: FastifyInstance) {
    server.get('/getmessage/:username', async function (request, reply) {
    const { username } = request.params as { username: string }
    
    if (!username)
    {
        console.log('No parameter passed in getMessageRoute route')
        return reply.code(400).send({ error: 'parameter is required' })
    }

    try {
        const result = await getMessage(username)
        return (reply.code(200).send(result))
    } catch (err: any) {
        if (err.message === 'Coulndt find user in getMessage') {
            return reply.code(404).send({ error: 'Coulndt find user in getMessage' })
        }
        return reply.code(500).send({ error: 'Internal server error' })
    }
})
}
