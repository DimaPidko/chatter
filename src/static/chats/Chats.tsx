import React, { useState, useEffect } from 'react';

const Chats: React.FC = () => {
	const [chatName, setChatName] = useState<string>("");
	const [themeChat, setThemeChat] = useState<string>("");
	const [privateChat, setPrivateChat] = useState<boolean>(false);
	const [chats, setChats] = useState([]);
	
	const user = {
		name: localStorage.getItem("userName") || "Guest",
		id: localStorage.getItem("userId") || "0"
	};
	
	useEffect(() => {
		const fetchChats = async () => {
			try {
				const response = await fetch('http://localhost:3307/showChat', {
					method: "GET",
					headers: { "Content-Type": "application/json" }
				});
				const data = await response.json();
				setChats(data);
				console.log(chats)
			} catch (error) {
				console.error(`Error: ${error.message}`);
			}
		};
		
		fetchChats();
	}, []);
	
	const onCreateChat = async (e) => {
		e.preventDefault();
		
		try {
			const newChat = {
				chatName,
				themeChat,
				privateChat,
				createdById: user.id,
				createdByName: user.name
			};
			
			const response = await fetch('http://localhost:3307/createChat', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newChat)
			});
			
			if (!response.ok) {
				throw new Error('Failed to create chat');
			}
			
			// Refresh chats after creating a new one
			const data = await response.json();
			setChats((prevChats) => [...prevChats, data]);
		} catch (error) {
			console.error(`Error: ${error.message}`);
		}
	};
	
	return (
		<section>
			Hello {user.name}
			<form onSubmit={onCreateChat}>
				<h2>Form to create chat</h2>
				<input
					placeholder="Enter chat name..."
					value={chatName}
					onChange={(e) => setChatName(e.target.value)}
				/>
				<input
					placeholder="What theme of chat?"
					value={themeChat}
					onChange={(e) => setThemeChat(e.target.value)}
				/>
				<div>
					<h3>Is private?</h3>
					<input
						type="checkbox"
						checked={privateChat}
						onChange={() => setPrivateChat(!privateChat)}
					/>
				</div>
				<button type="submit">Create chat</button>
			</form>
			<hr />
			<div>
				{chats.length > 0 ? (
					<ul>
						{chats.map((chat) => (
							<li key={chat.id}>{chat.chat_name} - {chat.chat_theme}</li>
						))}
					</ul>
				) : (
					<p>No chats available</p>
				)}
			</div>
		</section>
	);
};

export default Chats;
