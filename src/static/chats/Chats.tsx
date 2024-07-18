import React from 'react'
import { useState } from 'react'

const Chats : React.FC = () => {
	const [chatName, setChatName] = useState<string>("")
	const [themeChat, setThemeChat] = useState<string>("")
	const [privateChat, setPrivateChat] = useState<boolean>(false)
	
	const user = {
		name: localStorage.getItem("userName"),
		id: localStorage.getItem("userId")
	}
	
	async function onCreateChat(e) {
		e.preventDefault()
		
		const newChat = {
			chatName,
			themeChat,
			privateChat,
			createdById: user.id,
			createdByName: user.name
		}
		
		const response = await fetch('http://localhost:3307/createChat', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newChat)
		})
	}
	
	return (
		<section>
			Hello {`${user.name}`}
			<form onSubmit={(e) => onCreateChat(e)}>
				<h2>Form to create chat</h2>
				<input placeholder={"Enter chat name..."} value={chatName} onChange={(e) => setChatName(e.target.value)}/>
				<input placeholder={"What theme of chat?"} value={themeChat} onChange={(e) => setThemeChat(e.target.value)}/>
				<div>
					<h3>Is private?</h3>
					<input type={'checkbox'} checked={privateChat} onChange={() => setPrivateChat(!privateChat)}/>
				</div>
				<button>Create chat</button>
			</form>
		</section>
	)
}

export default Chats