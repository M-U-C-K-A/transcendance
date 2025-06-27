import { z } from "zod";

//	the path of where the schema are used is specified above it

//	/editprofile
export const editProfileData = z.object({
	newAvatar: z.string()
	.min(1, { message: "Avatar can't be empty"})
	.max(300000, { message: 'Avatar too large'}),
	newUsername: z.string()
	.min(3, { message: 'Username too short'})
	.max(20, { message: 'Username too long'})
	.regex(/^[a-zA-Z0-9_]+$/, { message: 'Invalid character in username'}),
	newBio: z.string()
	.max(300, { message: 'Bio max limit is 300 character'})
})
