app.get('/online-users', async (req, res) => {
	return Array.from(onlineUsers.keys()); // retourne tous les userId en ligne
});
