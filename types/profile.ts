import { string, z } from "zod";

//	the path of where the schema are used is specified above it

export const editProfileData = z.object({
	newAvatar: z.string()
	.min(1, { message: "Avatar can't be empty"})
	.max(100000, { message: 'Avatar too large'}),
	newUsername: z.string()
	.min(6, { message: 'Password too short'})
	.max(30, { message: 'Password too long'})
	.regex(/[a-z]/, { message: 'The password need to have at least 1 lowercase character' })
	.regex(/[A-Z]/, { message: 'The password need to have at least 1 uppercase character' })
	.regex(/\d/, { message: 'The password need to have at least 1 digit' })
	.regex(/[^A-Za-z0-9]/, { message: 'The password need to have at least 1 special character' }),
	newBio: z.string()
	.max(300, { message: 'Bio max limit is 300 character'})
})
