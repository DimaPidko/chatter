import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin } from './chatPageAdminSlice.ts';
import { onDeleteChat } from '../../core/ features/onDeleteChat.ts'

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
	
	return (
		<section className="mt-4">
			{isAdmin && (
				<div className="flex justify-end">
					<button
						onClick={() => onDeleteChat(chatInfo)}
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
