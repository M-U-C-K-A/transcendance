import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6)
})

const registerSchema = z.object({
	username: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(6)
})

export default async function (app: FastifyInstance) {
	// Login
	app.post('/login', {
		schema: {
			body: loginSchema
		}
	}, async (req, reply) => {
		const { email, password } = req.body as z.infer<typeof loginSchema>

		const user = await app.db.user.findUnique({ where: { email } })
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return reply.code(401).send({ error: 'Invalid credentials' })
		}

		const token = app.jwt.sign({ id: user.id })
		return { token }
	})

	// Register
	app.post('/register', {
		schema: {
			body: registerSchema
		}
	}, async (req, reply) => {
		const { email, password, username } = req.body as z.infer<typeof registerSchema>

		const existingEmail = await app.db.user.findUnique({ where: { email } })
		if (existingEmail) {
			return reply.code(400).send({ error: 'Email already in use' })
		}

		const existingUser = await app.db.user.findUnique({ where: { username } })
		if (existingUser) {
			return reply.code(400).send({ error: 'Username already in use' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const user = await app.db.user.create({
			data: {
				email,
				username,
				password: hashedPassword
			}
		})

		const token = app.jwt.sign({ id: user.id })
		return { token }
	})
}
