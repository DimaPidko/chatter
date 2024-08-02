import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FormToCreateChat from '../../shared/formToCreateChat/FormToCreateChat.tsx';
import { setUserId, setUserName } from '../../shared/formToLogin/FormToLoginSlice.ts';
import { setChats, clearChats, setFilterChat } from '../../shared/formToCreateChat/FormToCreateChatSlice.ts';

const Chats: React.FC = () => {
	const { userName } = useSelector((state: any) => state.login);
	const { chats, filterChat } = useSelector((state: any) => state.form);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	useEffect(() => {
		fetchChats();
		autoLogin();
		
		return () => {
			dispatch(clearChats());
		};
	}, [dispatch]);
	
	const fetchChats = async () => {
		try {
			const response = await fetch('http://localhost:3307/showChat', {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});
			const data = await response.json();
			dispatch(setChats(data));
		} catch (error) {
			console.error(`Error: ${error.message}`);
		}
	};
	
	const autoLogin = async () => {
		const token = localStorage.getItem('token');
		if (!token) navigate('/register');
		
		try {
			const response = await fetch('http://localhost:3307/auto-login', {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token })
			});
			
			if (response.status === 200) {
				const user = await response.json();
				dispatch(setUserName(user.userName));
				dispatch(setUserId(user.userId));
				navigate('/chats');
			}
		} catch (error) {
			console.error(`Error during auto-login: ${error.message}`);
		}
	};
	
	const onEnterChat = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		navigate(`/chat/${e.currentTarget.id}`);
	};
	
	const filteredChats = chats.length > 0 && chats[0]
		? chats[0].filter((chat: any) => chat.chat_theme === filterChat)
		: [];
	
	return (
		<section className="min-h-screen p-8 bg-gradient-to-br from-indigo-100 via-white to-indigo-300">
			<div className="container mx-auto max-w-7xl">
				<h1 className="text-6xl font-bold text-center text-gray-800 mb-12">
					Hello, {userName}!
				</h1>
				
				<div className="bg-white p-8 rounded-lg shadow-lg mb-12">
					<FormToCreateChat />
				</div>
				
				<div className="bg-white p-8 rounded-lg shadow-lg mb-12">
					<label htmlFor="filter-chat" className="block text-xl font-semibold mb-4 text-gray-800">
						Filter by:
					</label>
					<select
						id="filter-chat"
						onChange={(e) => dispatch(setFilterChat(e.target.value))}
						value={filterChat}
						className="block w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						<option value="Anime">Anime</option>
						<option value="Games">Games</option>
						<option value="Chatting">Just Chatting</option>
						<option value="Movies">Movies</option>
						<option value="Policy">Policy</option>
					</select>
				</div>
				
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredChats.length > 0 ? (
						filteredChats.map((chat) => (
							<div
								id={chat.id}
								key={chat.id}
								onClick={(e) => onEnterChat(e)}
								className="p-8 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 cursor-pointer"
							>
								<h2 className="text-3xl font-semibold text-gray-800">{chat.chat_name}</h2>
								<p className="text-gray-600 mt-3">{chat.chat_theme}</p>
							</div>
						))
					) : (
						<p className="text-center col-span-full text-xl text-gray-700">No chats available</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default Chats;
