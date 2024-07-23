import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName } from '../../shared/formToLogin/FormToLoginSlice.ts';

const Chats: React.FC = () => {
	const [chatName, setChatName] = useState<string>("");
	const [themeChat, setThemeChat] = useState<string>("");
	const [privateChat, setPrivateChat] = useState<boolean>(false);
	const [chats, setChats] = useState<Array<any>>([]);
	const { userName } = useSelector((state) => state.login)
	const navigate = useNavigate();
	const dispatch= useDispatch();
	
	useEffect(() => {
		fetchChats();
		login();
	}, []);
	
	const fetchChats = async () => {
		try {
			const response = await fetch('http://localhost:3307/showChat', {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});
			const data = await response.json();
			setChats(data);
		} catch (error) {
			console.error(`Error: ${error.message}`);
		}
	};
	
	const login = async () => {
		if (!localStorage.getItem('token')) {
			return;
		} else {
			const response = await fetch('http://localhost:3307/auto-login', {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: localStorage.getItem('token') })
			})
			
			if (response.status === 200) {
				const user = await response.json();
				dispatch(setUserName(user.userName));
				navigate('/chats');
			}
		}
	}
	
	function onEnterChat(e) {
		e.preventDefault();
		navigate(`/chat/${e.target.id}`);
	}
	
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
			
			const data = await response.json();
			setChats((prevChats) => [...prevChats, data]);
		} catch (error) {
			console.error(`Error: ${error.message}`);
		}
	};
	
	return (
		<div className="bg-gray-100 min-h-screen p-4 flex flex-col items-center">
			<h1 className="text-3xl font-bold mb-6">Hello {userName}</h1>
			<form onSubmit={onCreateChat} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transform transition-transform duration-500 hover:scale-105">
				<h2 className="text-2xl font-semibold mb-4">Form to create chat</h2>
				<div className="mb-4">
					<input
						placeholder="Enter chat name..."
						value={chatName}
						onChange={(e) => setChatName(e.target.value)}
						className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<input
						placeholder="What theme of chat?"
						value={themeChat}
						onChange={(e) => setThemeChat(e.target.value)}
						className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4 flex items-center">
					<h3 className="text-lg mr-4">Is private?</h3>
					<input
						type="checkbox"
						checked={privateChat}
						onChange={() => setPrivateChat(!privateChat)}
						className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button type="submit" className="bg-blue-500 text-white py-3 rounded-lg w-full text-xl font-semibold hover:bg-blue-600 transition-colors duration-300">
					Create chat
				</button>
			</form>
			<hr className="my-6 w-full max-w-lg" />
			<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
				{chats.length > 0 ? (
					<ul>
						{chats.map((chat) => (
							<li
								id={chat.id}
								key={chat.id}
								onClick={(e) => onEnterChat(e)}
								className="cursor-pointer p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-300"
							>
								{chat.chat_name}
							</li>
						))}
					</ul>
				) : (
					<p className="text-center">No chats available</p>
				)}
			</div>
		</div>
	);
};

export default Chats;
