import { z } from "zod";

//	the path of where the schema are used is specified above it

//	/auth/login
export const loginData = z.object({
	password: z.string()
	.min(6, { message: 'Password too short'})
	.max(30, { message: 'Password too long'})
	.regex(/[a-z]/, { message: 'The password need to have at least 1 lowercase character' })
	.regex(/[A-Z]/, { message: 'The password need to have at least 1 uppercase character' })
	.regex(/\d/, { message: 'The password need to have at least 1 digit' })
	.regex(/[^A-Za-z0-9]/, { message: 'The password need to have at least 1 special character' }),
	email: z.string().email()
	.min(5, { message: 'Email too short'})
	.max(100, { message: 'Email too long'}),
});

//	/auth/login/2fa/verify
//	/auth/register/2fa/verify
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
	password: z.string()
	.min(6, { message: 'Password too short'})
	.max(30, { message: 'Password too long'})
	.regex(/[a-z]/, { message: 'The password need to have at least 1 lowercase character' })
	.regex(/[A-Z]/, { message: 'The password need to have at least 1 uppercase character' })
	.regex(/\d/, { message: 'The password need to have at least 1 digit' })
	.regex(/[^A-Za-z0-9]/, { message: 'The password need to have at least 1 special character' }),
	email: z.string().email()
	.min(5, { message: 'Email too short'})
	.max(100, { message: 'Email too long'}),
})
