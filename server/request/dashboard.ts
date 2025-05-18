import {PrismaClient} from '@prisma/client'
import {userData, friendTab, friendList} from '../utils/interface';
import {getAvatar} from '../utils/getAvatar';

const Prisma = new PrismaClient()

export async function dashboard(username:string) {
	const userInfo = await Prisma.$queryRaw<userData[]>`SELECT * FROM USER WHERE username == ${username}`
	
	if(!userInfo) {throw Error ('User not found')}

	const user = userInfo[0]

	const friends = await Prisma.$queryRaw<friendTab[]>`SELECT * FROM FRIENDS WHERE ID1 == ${user.Id} OR ID2 == ${user.Id}`

	const friendIds : number[] = [];

	for (const f of friends){
		if (f.Id1 == user.Id)
			friendIds.push(f.Id1)
		else
			friendIds.push(f.Id2)
	}

	const avatar = getAvatar(user);
	if (friendIds.length == 0)
		return {
			profileData: {
				username: user.username,
				avatar: user.avatar,
				win: user.win,
				lose: user.lose,
				tournament: user.tournamentWon
			}
	}

	const friendList = await Prisma.$queryRaw<friendList[]>`SELECT ID, ONLINESTATUS, AVATAR FROM USER WHERE ID == friendIds`

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
