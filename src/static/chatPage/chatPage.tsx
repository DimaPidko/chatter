import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Message {
	id: number;
	message_from: string;
	message_text: string;
	date_message: string;
}

interface ChatInfo {
	chat_name: string;
	chat_theme: string;
	created_byName: string;
}

const ChatPage: React.FC = () => {
	const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const { id } = useParams();
	const ws = React.useRef<WebSocket | null>(null);
	
	useEffect(() => {
		getChatInfo();
		connectWebSocket();
		
		// Cleanup WebSocket on component unmount
		return () => {
			if (ws.current) {
				ws.current.close();
			}
		};
	}, [id]);
	
	const getChatInfo = async () => {
		try {
			const response = await fetch(`http://localhost:3307/chat/${id}`, {
				method: 'GET',
				headers: { "Content-Type": "application/json" },
			});
			
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			
			const data = await response.json();
			setChatInfo(data);
		} catch (error) {
			console.error(error.message);
		}
	};
	
	const connectWebSocket = () => {
		ws.current = new WebSocket(`ws://localhost:5000`);
		
		ws.current.onopen = () => {
			ws.current?.send(JSON.stringify({ event: 'join', chat_id: id }));
		};
		
		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.event) {
				case 'history':
					setMessages(data.messages);
					break;
				case 'message':
					setMessages((prevMessages) => [...prevMessages, data]);
					break;
				default:
					break;
			}
		};
	};
	
	const handleSendMessage = () => {
		if (newMessage.trim() === '') return;
		
		const message = {
			event: 'message',
			chat_id: id,
			message_from: localStorage.getItem('userName'),
			message_text: newMessage,
			date_message: new Date().toISOString(),
		};
		
		ws.current?.send(JSON.stringify(message));
		setNewMessage('');
	};
	
	return (
		<section>
			{chatInfo ? (
				<div>
					<h1>{chatInfo.chat_name}</h1>
					<p>{`Theme: ${chatInfo.chat_theme}`}</p>
					<p>{`Created by: ${chatInfo.created_byName}`}</p>
					
					<div>
						{messages.map((msg) => (
							<div key={msg.id}>
								<strong>{msg.message_from}</strong>: {msg.message_text} <em>{msg.date_message}</em>
							</div>
						))}
					</div>
					
					<div>
						<input
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
						/>
						<button onClick={handleSendMessage}>Send</button>
					</div>
				</div>
			) : (
				<p>Loading chat info...</p>
			)}
		</section>
	);
};

export default ChatPage;
