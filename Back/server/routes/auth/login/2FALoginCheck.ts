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
			username: result.username,
		})

		reply.setCookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
		})

		return reply.code(200).send({ message: 'Login successful' })
	}

	} catch (err: any) {
	if (err.message === 'Wrong Code') {
		return reply.code(403).send({ error: 'Wrong Code' })
	} else if (err.message == 'User not found') {
		return reply.code(404).send({ error: err.message })
	}
	else {
		return reply.code(500).send({ error: 'Internal server error' })
	}
	}
  })
}
