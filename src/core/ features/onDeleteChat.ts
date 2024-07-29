export const onDeleteChat = async (chatInfo) => {
	try {
		const response = await fetch('http://localhost:3307/deleteChat', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ chatId: chatInfo.id })
		});
		
		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}
	} catch (error) {
		console.error('Failed to delete chat:', error);
	}
};