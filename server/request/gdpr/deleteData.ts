import { Select } from "@/components/ui/select";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient()

export default async function deleteData(userId: number, username: string) {

	const isNotGoogle = await Prisma.user.findFirst({
		where: {
			id: userId,
		},
		select: {
			pass: true,
		},
	});

	const random = "deleteduser_" + Math.floor(100000 + Math.random() * 900000).toString()
	await Prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			email: random,
			username: random,
			pass: random,
			alias: random,
		}
	});

	const random2 = "deleteduser_" + Math.floor(100000 + Math.random() * 900000).toString()

	if (isNotGoogle.pass) {
		await Prisma.tmpUser.update({
			where: {
				username: username,
			},
			data: {
				email: random2,
				username: random2,
				pass: random2,
			}
		});
	}


	return (true)
}
