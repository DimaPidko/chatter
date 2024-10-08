import React, { useEffect, useState, useRef } from 'react';
import ChatPageAdmin from '../../shared/chatPageAdmin/ChatPageAdmin';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const { id } = useParams<{ id: string }>();
	const ws = useRef<WebSocket | null>(null);
	const { userName } = useSelector((state: any) => state.login);
	const { theme } = useSelector((state: any) => state.theme);
	const inputRef = useRef<HTMLInputElement>(null);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const navigate = useNavigate();
	
	useEffect(() => {
		getChatInfo();
		connectWebSocket();
		
		return () => {
			if (ws.current) {
				ws.current.close();
			}
		};
	}, [id]);
	
	useEffect(() => {
		scrollToBottom();
	}, [messages]);
	
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
			console.error('Failed to fetch chat info:', error);
		}
	};
	
	const connectWebSocket = () => {
		ws.current = new WebSocket(`ws://localhost:5000`);
		
		ws.current.onopen = () => {
			ws.current?.send(JSON.stringify({ event: 'join', chat_id: id, username: userName }));
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
				case 'users':
					setOnlineUsers(data.users);
					break;
				default:
					break;
			}
		};
		
		ws.current.onerror = (error) => {
			console.error('WebSocket error:', error);
		};
		
		ws.current.onclose = (event) => {
			if (!event.wasClean) {
				console.error('WebSocket closed unexpectedly');
			}
		};
	};
	
	const handleSendMessage = () => {
		if (newMessage.trim() === '') return;
		
		const message = {
			event: 'message',
			chat_id: id,
			message_from: userName,
			message_text: newMessage,
			date_message: new Date().toISOString(),
		};
		
		ws.current?.send(JSON.stringify(message));
		setNewMessage('');
		scrollToBottom();
	};
	
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSendMessage();
		}
	};
	
	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};
	
	return (
		<section className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} min-h-screen p-8 flex flex-col items-center`}>
			<button
				onClick={() => navigate('/')}
				className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-full mb-8 shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-300"
			>
				Back to Chats
			</button>
			{chatInfo ? (
				<div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-10 rounded-2xl shadow-xl w-full max-w-5xl`}>
					<h1 className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} text-5xl font-bold mb-8 text-center`}>{chatInfo.chat_name}</h1>
					<div className="flex justify-around mb-8">
						<div className={`${theme === 'light' ? 'bg-blue-50' : 'bg-gray-700'} p-5 rounded-lg shadow-md text-center flex-1 mx-2`}>
							<p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} text-lg font-medium`}>Theme</p>
							<p className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-300'} text-xl`}>{chatInfo.chat_theme}</p>
						</div>
						<div className={`${theme === 'light' ? 'bg-blue-50' : 'bg-gray-700'} p-5 rounded-lg shadow-md text-center flex-1 mx-2`}>
							<p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} text-lg font-medium`}>Created by</p>
							<p className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-300'} text-xl`}>{chatInfo.created_byName}</p>
						</div>
					</div>
					<div className={`${theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gray-700'} p-6 rounded-2xl mb-8 shadow-inner`}>
						<p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} text-lg font-medium mb-4`}>Online Users:</p>
						<div className="flex flex-wrap justify-center">
							{onlineUsers.map((user, index) => (
								<span key={index} className={`${theme === 'light' ? 'bg-indigo-200 text-indigo-800' : 'bg-indigo-500 text-indigo-200'} px-3 py-1 rounded-full text-sm mr-2 mb-2 shadow`}>
                  {user}
                </span>
							))}
						</div>
					</div>
					<div className={`${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} p-6 rounded-2xl mb-8 max-h-96 overflow-y-auto shadow-inner`} style={{ maxHeight: '400px', overflowY: 'auto' }}>
						{messages.map((msg) => (
							<div key={msg.id} className={`mb-4 ${msg.message_from === chatInfo.created_byName ? 'text-orange-600' : 'text-blue-600'}`}>
								<strong>{msg.message_from}</strong>: {msg.message_text}
								<em className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} ml-2`}>{new Date(msg.date_message).toLocaleString()}</em>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
					
					<div className="flex items-center space-x-4">
						<input
							type="text"
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							onKeyDown={handleKeyDown}
							className={`${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-600 text-gray-200'} flex-1 p-4 border ${theme === 'light' ? 'border-gray-300' : 'border-gray-500'} rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner`}
							ref={inputRef}
						/>
						<button
							onClick={handleSendMessage}
							className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-300"
						>
							Send
						</button>
					</div>
					<div className="mt-8">
						<ChatPageAdmin chatInfo={chatInfo} />
					</div>
				</div>
			) : (
				<p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} text-xl`}>Loading chat info...</p>
			)}
		</section>
	);
};

export default ChatPage;
