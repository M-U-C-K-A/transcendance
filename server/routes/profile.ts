import { FastifyInstance } from 'fastify'
import { Interface } from 'readline';

interface	Info {
	Username: string,
	Avatar: string,
	Bio: string,
	OnlineStatus: boolean,
	Elo: number,
	Win: number,
	Lose: number,
	TournamentWon: number,
	PointScored: number,
	PointConcede: number,
	CreationDate: Date
};

export default async function (app: FastifyInstance) {
	app.get('/profile/:username', async (req, reply) => {
		const UserName  = r

		const Request : string = 'SELECT * FROM UserInfo WHERE username = $1';
		const User = await app.db.user ({ where : { Request }})


		return (Info);
	});
}
