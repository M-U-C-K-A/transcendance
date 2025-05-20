import {PrismaClient} from '@prisma/client'
import {userData, friendTab, friendList, Message} from '../../utils/interface';
import {getAvatar} from '../../utils/getAvatar';

const Prisma = new PrismaClient()

async function getGeneralChat() {
	const allChat = await Prisma.$queryRaw<Message[]>`SELECT * from "Message" WHERE status == true`

	if(!allChat[0]) {console.log('No messsage found for All Chat')}

	return (allChat)
}

async function getFriendsId(user:userData) {
	const friends = await Prisma.$queryRaw<friendTab[]>`SELECT * FROM "Friends" WHERE ID1 == ${user.id} OR ID2 == ${user.id}`

	const friendIds : number[] = [];

	for (const f of friends){
		if (f.Id1 == user.id)
			friendIds.push(f.Id1)
		else
			friendIds.push(f.Id2)
	}
	return (friendIds)
}

export default async function dashboard(username:string) {
	const userInfo = await Prisma.$queryRaw<userData[]>`SELECT * FROM "User" WHERE username == ${username}`

	if(!userInfo) {throw Error ('User not found')}

	const user = userInfo[0]

	const friendIds = getFriendsId(user)
	const avatar = getAvatar(user);
	const allChat = getGeneralChat()
	if (!friendIds)
		return {
			profileData: {
				username: user.username,
				avatar: user.avatar,
				win: user.win,
				lose: user.lose,
				tournament: user.tournamentWon
			}
	}

	const friendList = await Prisma.$queryRaw<friendList[]>`SELECT ID, ONLINESTATUS, AVATAR FROM "User" WHERE ID == friendIds`

	return {
		profileData: {
			username: user.username,
			avatar: user.avatar,
			win: user.win,
			lose: user.lose,
			tournament: user.tournamentWon,
		},
		friendList
	}
}
