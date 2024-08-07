import React from 'react';
import { useSelector } from 'react-redux';

const FormAboutUser : React.FC = ({ props }) => {
	const { userName, userId } = useSelector((state) => state.login);
	
	return (
		<section>
			<h1>User Name: {userName}</h1>
			<h2>User ID: {userId}</h2>
		</section>
	)
};

export default FormAboutUser;