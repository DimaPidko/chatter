import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName, setPassword } from './FormToRegisterSlice.ts';
import { Link, useNavigate } from 'react-router-dom';

const FormToRegister: React.FC = () => {
	const { userName, userPassword } = useSelector((state) => state.register);
	const dispatch = useDispatch();
	const navigate = useNavigate()
	
	async function onSubmitRegister(e) {
		e.preventDefault();
		
		const data = {
			userName,
			userPassword,
			registrationDate: new Date().getTime(),
			lastActivity: new Date().getTime()
		};
		
		try {
			console.log(data)
			const response = await fetch('http://localhost:3307/register', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			}).then(() => navigate('/'));
			
			if (!response) {
				throw new Error(`Error: ${response}`);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}
	
	return (
		<>
			<form onSubmit={(e) => onSubmitRegister(e)}>
				<input placeholder={"Create user name..."} onChange={(e) => dispatch(setUserName(e.target.value))} />
				<input placeholder={"Create password"} type={"password"} onChange={(e) => dispatch(setPassword(e.target.value))} />
				<button>Create user</button>
			</form>
			<div>
				<Link to={"/"}>LogIn</Link>
			</div>
		</>
	
	);
}

export default FormToRegister;
