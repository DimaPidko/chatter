import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin } from './chatPageAdminSlice.ts';

interface ChatPageAdminProps {
	chatInfo: {
		id: number;
		created_byName: string;
	};
}

const ChatPageAdmin: React.FC<ChatPageAdminProps> = ({ chatInfo }) => {
	const { isAdmin } = useSelector((state: any) => state.admin);
	const { userName } = useSelector((state: any) => state.login);
	const dispatch = useDispatch();
	
	useEffect(() => {
		if (userName === chatInfo.created_byName) {
			dispatch(setAdmin(true));
		} else {
			dispatch(setAdmin(false));
		}
	}, [userName, chatInfo.created_byName, dispatch]);
	
	const onDeleteChat = async () => {
		try {
			const response = await fetch('http://localhost:3307/deleteChat', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ chatId: chatInfo.id })
			});
			
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
		} catch (error) {
			console.error('Failed to delete chat:', error);
		}
	};
	
	return (
		<section className="mt-4">
			{isAdmin && (
				<div className="flex justify-end">
					<button
						onClick={onDeleteChat}
						className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
					>
						Delete Chat
					</button>
				</div>
			)}
		</section>
	);
}

export default ChatPageAdmin;
