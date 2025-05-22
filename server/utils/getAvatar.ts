export function getAvatar(username: string, avatar: string) {
	if (!avatar)
		return(`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`);
	else
		return(avatar);
}
