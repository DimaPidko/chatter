import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface ChatInfo {
	chat_name: string;
	chat_theme: string;
	created_byName: string;
}

const ChatPage: React.FC = () => {
	const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null)
	const { id } = useParams()
	
	useEffect(() => {
		getChatInfo()
	}, [id])
	
	const getChatInfo = async () => {
		try {
			const response = await fetch(`http://localhost:3307/chat/${id}`, {
				method: 'GET',
				headers: { "Content-Type": "application/json" },
			})
			
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			
			const data = await response.json();
			setChatInfo(data);
		} catch (error) {
			console.error(error.message);
		}
	}
	
	return (
		<section>
			{chatInfo ? (
				<div>
					<h1>{chatInfo.chat_name}</h1>
					<p>{`Theme: ${chatInfo.chat_theme}`}</p>
					<p>{`Created by: ${chatInfo.created_byName}`}</p>
				</div>
			) : (
				<p>Loading chat info...</p>
			)}
		</section>
	)
}

export default ChatPage
