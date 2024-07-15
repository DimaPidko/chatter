import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName, setPassword } from './FormToRegisterSlice.ts';
import { Link } from 'react-router-dom';

const FormToRegister: React.FC = () => {
	const { userName, userPassword } = useSelector((state) => state.register);
	const dispatch = useDispatch();
	
	async function onSubmitRegister(e) {
		e.preventDefault();
		
		const data = {
			userName,
			userPassword,
		};
		
		try {
			const response = await fetch('http://localhost:3307/register', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
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
