import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient()

export default async function deleteData(userId: number) {
	console.log("🎅🎅🎅🎅🎅🎅AVANT DELETED USER🎅🎅🎅🎅", userId)
	await Prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			email: "",
			username: "",
			pass: "",
		}
	});
	console.log("👺👺👺👺DELETED USER👺👺👺👺")
	return (true)
}
