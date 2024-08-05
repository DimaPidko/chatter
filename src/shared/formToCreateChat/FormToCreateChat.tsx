import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setChatName, setThemeChat, setPrivateChat, setChats } from './FormToCreateChatSlice.ts';

const FormToCreateChat: React.FC = () => {
	const { chatName, themeChat, privateChat } = useSelector((state: any) => state.form);
	const { userName } = useSelector((state: any) => state.login);
	const { theme } = useSelector((state: any) => state.theme);
	const inputRef = useRef<HTMLInputElement>(null);
	const dispatch = useDispatch();
	
	const onCreateChat = async (e: React.FormEvent) => {
		e.preventDefault();
		
		try {
			const newChat = {
				chatName,
				themeChat: themeChat === 'Custom' ? inputRef.current?.value : themeChat,
				privateChat,
				createdByName: userName,
			};
			
			const response = await fetch('http://localhost:3307/createChat', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newChat)
			});
			
			if (!response.ok) {
				throw new Error('Failed to create chat');
			}
			
			dispatch(setChats(newChat));
		} catch (error) {
			console.error(`Error: ${error.message}`);
		}
	};
	
	return (
		<form onSubmit={onCreateChat} className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-10 rounded-lg shadow-xl max-w-md mx-auto`}>
			<h2 className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} text-4xl font-bold mb-8`}>Create a New Chat</h2>
			<div className="mb-6">
				<input
					placeholder="Enter chat name..."
					value={chatName}
					onChange={(e) => dispatch(setChatName(e.target.value))}
					className={`${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-700 text-gray-200 border-gray-600'} w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
				/>
			</div>
			<div className="mb-6">
				<label htmlFor="theme-chat" className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} block text-lg font-medium mb-3`}>Choose theme:</label>
				<select
					id="theme-chat"
					onChange={(e) => dispatch(setThemeChat(e.target.value))}
					value={themeChat}
					className={`${theme === 'light' ? 'bg-gray-50 border-gray-300' : 'bg-gray-700 border-gray-600'} block w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
				>
					<option value="Anime">Anime</option>
					<option value="Games">Games</option>
					<option value="Chatting">Just Chatting</option>
					<option value="Movies">Movies</option>
					<option value="Policy">Policy</option>
					<option value="Custom">Custom Theme</option>
				</select>
			</div>
			{themeChat === 'Custom' && (
				<div className="mb-6">
					<input
						placeholder="Enter custom theme..."
						className={`${theme === 'light' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-700 text-gray-200 border-gray-600'} w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
						ref={inputRef}
					/>
				</div>
			)}
			<div className="mb-6 flex items-center">
				<input
					type="checkbox"
					checked={privateChat}
					onChange={() => dispatch(setPrivateChat(!privateChat))}
					className={`${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'} w-5 h-5 rounded focus:ring-2 focus:ring-indigo-500`}
				/>
				<label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} ml-3 text-lg`}>Private Chat</label>
			</div>
			<button
				type="submit"
				className={`${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-700'} w-full py-4 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300`}
			>
				Create Chat
			</button>
		</form>
	);
};

export default FormToCreateChat;
