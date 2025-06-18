import { z } from "zod";

//	the path of where the schema are used is specified above it

// /friends/accept
export const acceptFriend = z.object({
	username: z.string()
	.min(3, { message: 'Username too short'})
	.max(20, { message: 'Username too long'})
	.regex(/^[a-zA-Z0-9_]+$/, { message: 'Invalid character in username'}),
	asAccepted: z.boolean(),
});
