import {fastify} from 'fastify'
import { register } from '../request/connection'
import { login } from '../request/connection'
import { connectionSchema } from '../utils/interface'
import { connectionData } from '../utils/interface'

const server = fastify()

server.get('/register', async (request, reply) => {
    const { data } = request.query as { data: connectionData }
  
    try {
      connectionSchema.parse(data)
    } catch (err) {
      console.log('Data not conform in registerRoute')
      return reply.code(400).send({ error: 'Invalid data' })
    }
  
    try {
      await register(data)
      return reply.code(201).send({ message: 'User registered successfully' })
    } catch (err) {
      console.log('Could not register the user')
      return reply.code(500).send({ error: 'Could not register the user' })
    }
})

server.get('/login', async (request, reply) => {
    const { data } = request.query as { data: connectionData }
  
    try {
      connectionSchema.parse(data)
    } catch (err) {
      console.log('Data not conform in loginRoute')
      return reply.code(400).send({ error: 'Invalid data' })
    }
  
    try {
      await login(data)
      return reply.code(202).send({ message: 'User logged successfully' })
    } catch (err) {
      console.log('Could not register the user')
      return reply.code(500).send({ error: 'Could not log the user' })
    }
})
  