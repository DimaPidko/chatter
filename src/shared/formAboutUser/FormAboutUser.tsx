import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Guid from "guid";

const FormAboutUser : React.FC = ({ props }) => {
	const { userName, userId } = useSelector((state) => state.login);
	const { theme } = useSelector((state: any) => state.theme);
	const guId = Guid.create();
	
	useEffect(() => {
		console.log(guId);
	}, []);
	
	return (
		<section>
			<h1>User Name: {userName}</h1>
			<h2>User ID: {userId}</h2>
		</section>
	)
};

export default FormAboutUser;