import { z } from "zod";

//	the path of where the schema are used is specified above it

// /gdpr/send
export const editDataGdpr = z.object({
	username: z.string()
	.min(3, { message: 'Username too short'})
	.max(20, { message: 'Username too long'})
	.regex(/^[a-zA-Z0-9_]+$/, { message: 'Invalid character in username'}),
	email: z.string().email()
	.min(5, { message: 'Email too short'})
	.max(100, { message: 'Email too long'}),
	password: z.string()
	.min(6, { message: 'Password too short'})
	.max(30, { message: 'Password too long'})
	.regex(/[a-z]/, { message: 'The password need to have at least 1 lowercase character' })
	.regex(/[A-Z]/, { message: 'The password need to have at least 1 uppercase character' })
	.regex(/\d/, { message: 'The password need to have at least 1 digit' })
	.regex(/[^A-Za-z0-9]/, { message: 'The password need to have at least 1 special character' }),
	removeAvatar: z.boolean(),
});

export const passwordCheck = z.object({
	password: z.string()
	.min(6, { message: 'Password too short'})
	.max(30, { message: 'Password too long'})
	.regex(/[a-z]/, { message: 'The password need to have at least 1 lowercase character' })
	.regex(/[A-Z]/, { message: 'The password need to have at least 1 uppercase character' })
	.regex(/\d/, { message: 'The password need to have at least 1 digit' })
	.regex(/[^A-Za-z0-9]/, { message: 'The password need to have at least 1 special character' }),
})
