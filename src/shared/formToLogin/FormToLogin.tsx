import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const FormToLogin : React.FC = () => {
	const [userName, setUserName] = useState<string>('')
	const [userPassword, setPassword] = useState<string>('')
	
	async function onSubmitLogin(e) {
		e.preventDefault()
		
		const response = await fetch('http://localhost:3307/login', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({userName, userPassword})
		})
		
		const data = response
		
		if (response.status === 200) {
			alert('success')
			console.log(data)
		} else {
			alert('login fail')
		}
		
	}
	
	return (
		<>
			<form onSubmit={(e) => onSubmitLogin(e)}>
				<input placeholder={"Enter user name..."} onChange={(e) => setUserName(e.target.value)}/>
				<input placeholder={"Enter password"} type={"password"} onChange={(e) => setPassword(e.target.value)}/>
				<button>Create user</button>
			</form>
			<div>
				<Link to={"/register"}>Register</Link>
			</div>
		</>
	
	);
}

export default FormToLogin