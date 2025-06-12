import { PrismaClient } from '@prisma/client'
import friendsList from '../friends/friendsList'
import { notifyFriend } from '@/server/routes/friends/websocketFriends';

const Prisma = new PrismaClient()

export default async function changeOnlineStatus(id: number, status: boolean) {

	await Prisma.user.update ({
		where: {
			id: id,
		},
		data: {
			onlineStatus: status,
		}
	})

	const friendList = await friendsList(id);
	const friendIds = friendList.map(friend => friend.id);
	console.log("🍂🍂🍂🍂🍂CHANGEMENT DE STATUS EN LIGNE🍂🍂🍂🍂")
	for(const f of friendIds) {
		notifyFriend(f, {
			type: "FRIEND_ONLINE_STATUS",
			from: {
				id: id,
			},
		});
	}

	return (true)
}
