import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FormToCreateChat from '../../shared/formToCreateChat/FormToCreateChat';
import { setUserId, setUserName } from '../../shared/formToLogin/FormToLoginSlice';
import { setChats, clearChats, setFilterChat } from '../../shared/formToCreateChat/FormToCreateChatSlice';
import SwitchTheme from '../../shared/switchTheme/SwitchTheme';

const Chats: React.FC = () => {
	const { userName } = useSelector((state: any) => state.login);
	const { chats, filterChat } = useSelector((state: any) => state.form);
	const { theme } = useSelector((state: any) => state.theme);
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
		<section className={`min-h-screen p-8 ${theme === 'light' ? 'bg-gradient-to-br from-indigo-100 via-white to-indigo-300' : 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900'}`}>
			<div className="container mx-auto max-w-7xl">
				<h1 className={`text-6xl font-bold text-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'} mb-12`}>
					Hello, {userName}!
				</h1>
				
				<SwitchTheme />
				
				<div className={`p-8 rounded-lg shadow-lg mb-12 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
					<FormToCreateChat />
				</div>
				
				<div className={`p-8 rounded-lg shadow-lg mb-12 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
					<label htmlFor="filter-chat" className={`block text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
						Filter by:
					</label>
					<select
						id="filter-chat"
						onChange={(e) => dispatch(setFilterChat(e.target.value))}
						value={filterChat}
						className={`block w-full p-4 border ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-gray-900' : 'border-gray-600 bg-gray-700 text-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
								className={`p-8 rounded-lg shadow-lg transition-shadow duration-300 transform hover:scale-105 cursor-pointer ${theme === 'light' ? 'bg-white hover:shadow-2xl' : 'bg-gray-800 hover:shadow-lg'}`}
							>
								<h2 className={`text-3xl font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{chat.chat_name}</h2>
								<p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-3`}>{chat.chat_theme}</p>
							</div>
						))
					) : (
						<p className={`text-center col-span-full text-xl ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>No chats available</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default Chats;
