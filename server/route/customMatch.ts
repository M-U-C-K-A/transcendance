import {fastify} from 'fastify'
import createMatch from '../request/match/createMatch'

const server = fastify()

server.get('/game/custom/:lobbyname', async (request, reply) => {
    const { username } = request.query as { username: string }
    const { matchName } = request.query as { matchName: string}

    if (!username)
    {
        console.log('No username passed as parameter in dashboardRoute')
        return reply.code(400).send({ error: 'Username is required' })
    }
  
    try {
        const result = await createMatch(username, matchName)
        return (reply.send(result))
    } catch (err) {
        console.log('No user found in dashboardRoute')
        reply.code(404).send({ error: 'User not found' })
    }
})