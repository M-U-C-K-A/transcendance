import {PrismaClient} from '@prisma/client'
import {userData, matchHistory} from '../utils/interface';
import {getAvatar} from '../utils/getAvatar';

const prisma = new PrismaClient()

export async function getProfileData(username: string) {
	const userInfo = await prisma.$queryRaw<userData[]>`SELECT * FROM USER WHERE username == ${username}`;
	if (!userInfo) {throw Error('User not found')}

	const user = userInfo[0];

	const achievements = await prisma.$queryRaw<any[]>`SELECT * FROM ACHIEVEMENT WHERE Id == user.Id`

	const history = await prisma.$queryRaw<matchHistory[]>`SELECT * FROM MATCHHISTORY WHERE UserId == user.Id`

	const gameNb = user.win + user.lose

	let winRate: number;
	if(gameNb == 0)
		winRate = 0;
	else
		winRate = (1.0 * user.win) / gameNb;

	const avatar = getAvatar(user);

	return {
		profileData: {
			username: user.username,
			elo: user.elo,
			avatar,
			bio: user.bio,
			wins: user.win,
			losses: user.lose,
			tournaments: user.tournamentWon,
			tournamentWon: user.tournamentWon,
			pointsScored: user.pointScored,
			pointsConcede: user.pointConcede,
			winRate,
			gameNb,
		},
		achievements,
		history
	}
}
