import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FormToCreateChat from '../../shared/formToCreateChat/FormToCreateChat.tsx'
import { setUserName } from '../../shared/formToLogin/FormToLoginSlice.ts';

const Chats: React.FC = () => {
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
	
	return (
		<div className="bg-gray-100 min-h-screen p-4 flex flex-col items-center">
			<h1 className="text-3xl font-bold mb-6">Hello {userName}</h1>
			<FormToCreateChat />
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
