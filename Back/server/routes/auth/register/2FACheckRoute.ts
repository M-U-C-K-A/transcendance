import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import check2FA from '@/server/request/auth/register/2FACheck'
import { register } from '@/server/request/auth/register/register'
import { login2FA } from '@/types/auth'

export default async function Check2FARoute(server: FastifyInstance) {
  server.post('/auth/register/2fa/verify', async (request: FastifyRequest, reply: FastifyReply) => {
	const data = login2FA.safeParse(request.body)

	if (!data.success) {
		return reply.status(400).send({
			errors: data.error.flatten().fieldErrors,
		})
	}

	const { email, code } = data.data

	try {
		await check2FA(email, code)
		const result = await register(email)

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

	return reply.code(200).send({ message: 'Authentication successful' })

	} catch (err: any) {
	if (err.message === 'Wrong Code') {
		return reply.code(403).send({ error: 'Wrong Code' })
	} else {
		return reply.code(500).send({ error: 'Internal server error' })
	}
	}
})
}
