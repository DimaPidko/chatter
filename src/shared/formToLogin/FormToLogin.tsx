import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const FormToLogin : React.FC = () => {
	const [userName, setUserName] = useState<string>('')
	const [userPassword, setPassword] = useState<string>('')
	const navigate = useNavigate()
	
	async function onSubmitLogin(e) {
		e.preventDefault()
		
		const response = await fetch('http://localhost:3307/login', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userName, userPassword })
		})
		
		if (response.status === 200) {
			const user = await response.json()
			localStorage.setItem("userId", user.id)
			localStorage.setItem("userName", user.user_name)
			navigate('/chats')
		} else {
			alert('login fail')
		}
		
	}
	
	return (
		<>
			<form onSubmit={(e) => onSubmitLogin(e)}>
				<input placeholder={"Enter user name..."} onChange={(e) => setUserName(e.target.value)}/>
				<input placeholder={"Enter password"} type={"password"} onChange={(e) => setPassword(e.target.value)}/>
				<button>LOGIN</button>
			</form>
			<div>
				<Link to={"/register"}>Register</Link>
			</div>
		</>
	
	);
}

export default FormToLogin