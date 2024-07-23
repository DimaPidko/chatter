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
	const [newMessage, setNewMessage] = useState<string>('');
	const { id } = useParams();
	const ws = React.useRef<WebSocket | null>(null);
	
	useEffect(() => {
		getChatInfo();
		connectWebSocket();
		
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
		<section className="bg-gray-100 min-h-screen p-4 flex flex-col items-center">
			{chatInfo ? (
				<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
					<h1 className="text-3xl font-bold mb-4">{chatInfo.chat_name}</h1>
					<p className="text-xl mb-2">{`Theme: ${chatInfo.chat_theme}`}</p>
					<p className="text-lg mb-4">{`Created by: ${chatInfo.created_byName}`}</p>
					
					<div className="bg-gray-200 p-4 rounded-lg mb-4 max-h-96 overflow-y-auto">
						{messages.map((msg) => (
							<div key={msg.id} className="mb-2">
								<strong className="text-blue-600">{msg.message_from}</strong>: {msg.message_text} <em className="text-gray-500">{new Date(msg.date_message).toLocaleString()}</em>
							</div>
						))}
					</div>
					
					<div className="flex items-center space-x-4">
						<input
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							onClick={handleSendMessage}
							className="bg-blue-500 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
						>
							Send
						</button>
					</div>
				</div>
			) : (
				<p className="text-xl">Loading chat info...</p>
			)}
		</section>
	);
};

export default ChatPage;
