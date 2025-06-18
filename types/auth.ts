import { z } from "zod";

// The path of where the schema are used is specified above the

//	/auth/login
export const loginData = z.object({
	pass: z.string()
	.min(6, { message: 'Password too short'})
	.max(30, { message: 'Password too long'}),
	email: z.string().email()
	.min(5, { message: 'Email too short'})
	.max(100, { message: 'Email too long'}),
});

//	/auth/login/2fa/verify
export const login2FA = z.object({
	email: z.string().email()
	.min(5, { message: 'Email too short'})
	.max(100, { message: 'Email too long'}),
	code: z.string()
	.min(6, { message: 'Code must be 6 character long'})
	.max(6, { message: 'Code must be 6 character long'}),
})

//	/auth/register
export const registerData = z.object({
	username: z.string()
	.min(3, { message: 'Username too short'})
	.max(20, { message: 'Username too long'})
	.regex(/^[a-zA-Z0-9_]+$/, { message: 'Invalid character in username'}),
	pass: z.string()
	.min(6, { message: 'Password too short'})
	.max(30, { message: 'Password too long'})
	,
	email: z.string().email()
	.min(5, { message: 'Email too short'})
	.max(100, { message: 'Email too long'}),
})
