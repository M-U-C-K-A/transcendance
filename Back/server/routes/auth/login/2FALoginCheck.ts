import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import checkLogin2FA from '@/server/request/auth/login/2FACheckLogin'
import getLoginData from '@/server/request/auth/login/getLoginInfo'
import { login2FA } from '@/types/auth'

export default async function Check2FALoginRoute(server: FastifyInstance) {
	server.post('/auth/login/2fa/verify', async (request: FastifyRequest, reply: FastifyReply) => {
		const data = login2FA.safeParse(request.body)

		if (!data.success) {
			return reply.status(400).send({
				errors: data.error.flatten().fieldErrors,
			})
		}
		const { email, code } = data.data

		try {
			await checkLogin2FA(email, code)
			const result = await getLoginData(email)
			if (result) {
				const token = server.jwt.sign({
					id: result.id,
					email: result.email,
					username: result.username,
					bio: result.bio,
				})
				return reply.code(200).send({ token })
			}
		} catch (err: any) {
			if (err.message === 'Wrong Code') {
				return reply.code(403).send({ error: 'Wrong Code' })
			}
			else {
				return reply.code(500).send({ error: 'Internal server error' })
			}
		}
	})
}
