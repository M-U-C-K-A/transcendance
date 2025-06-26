import { PrismaClient } from "@prisma/client";
import deleteData from "./deleteData";
const prisma = new PrismaClient();

export default async function deleteInactive() {

	const limit = new Date();
	limit.setDate(limit.getDate() - 90);

	const userToDelete = await prisma.user.findMany({
		where: {
			lastLogin: {
				lt: limit,
			},
		},
		select: {
			id: true,
			username: true,
		},
	});

	for (const user of userToDelete) {
		await deleteData(user.id, user.username);
	}

	return (true);
}
