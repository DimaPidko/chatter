import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName, setPassword, resetData } from './FormToRegisterSlice';
import { Link, useNavigate } from 'react-router-dom';

const FormToRegister: React.FC = () => {
	const { userName, userPassword } = useSelector((state) => state.register);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	async function onSubmitRegister(e) {
		e.preventDefault();
		
		const data = {
			userName,
			userPassword,
			registrationDate: new Date().getTime(),
			lastActivity: new Date().getTime()
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
			dispatch(resetData())
			navigate('/');
		} catch (error) {
			console.error('Error:', error);
		}
	}
	
	return (
		<div className="bg-gray-100 flex items-center justify-center h-screen">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-500 hover:scale-105">
				<h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
				<form onSubmit={onSubmitRegister} className="flex flex-col space-y-4">
					<input
						placeholder="Create user name..."
						onChange={(e) => dispatch(setUserName(e.target.value))}
						className="text-xl p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<input
						placeholder="Create password"
						type="password"
						onChange={(e) => dispatch(setPassword(e.target.value))}
						className="text-xl p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
					>
						Create user
					</button>
					<Link to="/" className="text-center text-blue-500 hover:underline">Log In</Link>
				</form>
			</div>
		</div>
	);
}

export default FormToRegister;
