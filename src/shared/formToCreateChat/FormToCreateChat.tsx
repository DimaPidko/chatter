import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setChatName, setThemeChat, setPrivateChat, setChats } from './FormToCreateChatSlice.ts'

const FormToCreateChat = () => {
	const { chatName, themeChat, privateChat,} = useSelector((state) => state.form)
	const { userName, userId } = useSelector((state) => state.login)
	const dispatch = useDispatch()
	
	const onCreateChat = async (e) => {
		e.preventDefault();
		
		try {
			const newChat = {
				chatName,
				themeChat,
				privateChat,
				createdById: userId,
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
			
			dispatch(setChats(newChat))
		} catch (error) {
			console.error(`Error: ${error.message}`);
		}
	};
	
	return (
		<form onSubmit={(e) => onCreateChat(e)} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg transform transition-transform duration-500 hover:scale-105">
			<h2 className="text-2xl font-semibold mb-4">Form to create chat</h2>
			<div className="mb-4">
				<input
					placeholder="Enter chat name..."
					value={chatName}
					onChange={(e) => dispatch(setChatName(e.target.value))}
					className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<div className="mb-4">
				{/* <input */}
				{/* 	placeholder="What theme of chat?" */}
				{/* 	value={themeChat} */}
				{/* 	onChange={(e) => dispatch(setThemeChat(e.target.value))} */}
				{/* 	className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" */}
				{/* /> */}
				<label htmlFor={'theme-chat'}>Choose theme chat:</label>
				<select id={'theme-chat'} onChange={(e) => dispatch(setThemeChat(e.target.value))} value={themeChat}>
					<option value={'anime'}>Anime</option>
					<option value={'games'}>Games</option>
					<option value={'chatting'}>Just Chatting</option>
				</select>
			</div>
			<div className="mb-4 flex items-center">
				<h3 className="text-lg mr-4">Is private?</h3>
				<input
					type="checkbox"
					checked={privateChat}
					onChange={() => dispatch(setPrivateChat(!privateChat))}
					className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<button type="submit" className="bg-blue-500 text-white py-3 rounded-lg w-full text-xl font-semibold hover:bg-blue-600 transition-colors duration-300">
				Create chat
			</button>
		</form>
	)
}

export default FormToCreateChat