import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin } from './chatPageAdminSlice.ts';

interface ChatPageAdminProps {
	chatInfo: {
		id: number
		created_byName: string;
	};
}

const ChatPageAdmin: React.FC<ChatPageAdminProps> = ({ chatInfo }) => {
	const { isAdmin } = useSelector((state: any) => state.admin);
	const { userName } = useSelector((state: any) => state.login);
	const dispatch = useDispatch();
	
	
	useEffect(() => {
		if (userName === chatInfo.created_byName) {
			dispatch(setAdmin(true))
		}else {
			dispatch((setAdmin(false)))
		}
		
	}, [userName, chatInfo.created_byName, dispatch])
	
	const onDeleteChat = async () => {
		const response = await fetch('http://localhost:3307/deleteChat', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({chatId : chatInfo.id})
		})
	};
	
	return (
		<section>
			{isAdmin ?
				<section>
					<button onClick={onDeleteChat}>Delete Chat</button>
				</section>
				: ''}
		</section>
	);
}

export default ChatPageAdmin;
