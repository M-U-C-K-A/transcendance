import {fastify} from 'fastify'
import {dashboard} from '../request/dashboard'

const server = fastify()

server.get('/dashboard', async (request, reply) => {
    const { username } = request.query as { username: string }
  
    if (!username)
    {
        console.log('No username passed as parameter in dashboardRoute')
        return reply.code(400).send({ error: 'Username is required' })
    }
  
    try {
        const result = await dashboard(username)
        return (reply.send(result))
    } catch (err) {
        console.log('No user found in dashboardRoute')
        reply.code(404).send({ error: 'User not found' })
    }
})
