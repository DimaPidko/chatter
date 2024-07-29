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
	
	const onEnterChat = (e: React.MouseEvent<HTMLLIElement>) => {
		e.preventDefault();
		navigate(`/chat/${e.currentTarget.id}`);
	};
	
	const filteredChats = chats.length > 0 && chats[0]
		? chats[0].filter((chat: any) => chat.chat_theme === filterChat)
		: [];
	
	return (
		<div className="bg-gray-100 min-h-screen p-4 flex flex-col items-center">
			<h1 className="text-3xl font-bold mb-6">Hello, {userName}</h1>
			<FormToCreateChat />
			<hr className="my-6 w-full max-w-lg border-gray-300" />
			<div className="w-full max-w-lg mb-6">
				<label htmlFor={'filter-chat'} className="block text-lg mb-2">Filter by:</label>
				<select
					id={'filter-chat'}
					onChange={(e) => dispatch(setFilterChat(e.target.value))}
					value={filterChat}
					className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value={'anime'}>Anime</option>
					<option value={'games'}>Games</option>
					<option value={'chatting'}>Just Chatting</option>
					<option value={'movies'}>Movies</option>
					<option value={'policy'}>Policy</option>
				</select>
			</div>
			<div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-lg'>
				{chats.length > 0 ? (
					<ul>
						{filteredChats.map((chat) => (
							<li
								id={chat.id}
								key={chat.id}
								onClick={(e) => onEnterChat(e)}
								className='cursor-pointer p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-300'
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
