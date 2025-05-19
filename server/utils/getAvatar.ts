import {userData} from 'server/utils/interface';

export async function getAvatar(user: userData) {
	if (!user.avatar)
		return(`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.username}`);
	else
		return(`data:image/png;base64,${Buffer.from(user.avatar).toString('base64')}`);
}
