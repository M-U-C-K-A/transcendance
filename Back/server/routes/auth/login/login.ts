import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import login from '../../../request/auth/login/login'
import { loginData } from '@/types/auth'

export default async function loginRoute(server: FastifyInstance) {
	server.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
		const data = loginData.safeParse(request.body)

		if (!data.success) {
			return reply.status(400).send({
				errors: data.error.flatten().fieldErrors,
			})
		}

		const { email, password } = data.data

		try {
			const result = await login(email, password)
			console.log(result)
			if (result?.as2FA == false) {
				const token = server.jwt.sign({
					id: result.id,
					username: result.username,
				})

				reply.setCookie('token', token, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/',
					maxAge: 60 * 60 * 24 * 7,
				})

				return reply.code(200).send({ as2FA: false })
			} else {
				return reply.code(200).send({ as2FA: true })
			}
		} catch (err: any) {
			if (err.message === 'This account does not exist') {
				return reply.code(400).send({ error: 'This account does not exist' })
			} else if (err.message === 'Wrong password') {
				return reply.code(400).send({ error: 'Wrong password' })
			} else if (err.message === 'User not found') {
				return reply.code(404).send({ error: 'User not found' })
			}
			return reply.code(500).send({ error: 'Internal server error' })
		}
	})
}

