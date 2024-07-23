import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUserName, setUserId } from './FormToLoginSlice.ts';
import { useDispatch } from 'react-redux';

const FormToLogin: React.FC = () => {
	const [userName, setUserNamee] = useState<string>('');
	const [userPassword, setPassword] = useState<string>('');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	useEffect(() => {
		login();
	}, []);
	
	const login = async () => {
		if (!localStorage.getItem('token')) {
			return;
		} else {
			const response = await fetch('http://localhost:3307/auto-login', {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: localStorage.getItem('token') })
			})
			
			if (response.status === 200) {
				const user = await response.json();
				dispatch(setUserName(user.userName));
				dispatch(setUserId(user.userId))
				navigate('/chats');
			}
		}
	}
	
	const onLogin = async (e) => {
		e.preventDefault()
		
		const response = await fetch('http://localhost:3307/login', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userName, userPassword })
		});
		
		if (response.status === 200) {
			const user = await response.json();
			dispatch(setUserName(user.userName))
			dispatch(setUserId(+user.userId))
			setUserNamee("");
			setPassword("");
			localStorage.setItem("token", user.token);
			navigate('/chats');
		} else {
			alert('Login failed');
		}
	}
	
	return (
		<div className="bg-gray-100 flex items-center justify-center h-screen">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-500 hover:scale-105">
				<h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
				<form onSubmit={(e) => onLogin(e)} className="flex flex-col space-y-4">
					<input
						placeholder="Enter user name..."
						onChange={(e) => setUserNamee(e.target.value)}
						className="text-xl p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<input
						placeholder="Enter password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						className="text-xl p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
					>
						LOGIN
					</button>
				</form>
				<div className="text-center mt-4">
					<Link to="/register" className="text-blue-500 hover:underline">Register</Link>
				</div>
			</div>
		</div>
	);
}

export default FormToLogin;
