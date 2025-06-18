import { z } from "zod";

//	the path of where the schema are used is specified above it

//	/chat/create
export const onlyUsername = z.object({
	username: z.string()
	.min(3, { message: 'Username too short'})
	.max(20, { message: 'Username too long'})
	.regex(/^[a-zA-Z0-9_]+$/, { message: 'Invalid character in username'}),
});

//	/chat/send
export const sendMessageData = z.object({
	recipient: z.number(),
	content: z.string()
	.min(1, { message: "Message can't be empty" })
	.max(300, { message: 'Message max limit is 300 character'})
	.regex(/^(?!.*<.*?>).*$/, { message: "HTML tags are not allowed" }),
	messageType: z.string()
	.max(30)
});
