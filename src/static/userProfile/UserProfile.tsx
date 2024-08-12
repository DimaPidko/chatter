import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FormAboutUser from '../../shared/formAboutUser/FormAboutUser.tsx';


const UserProfile : React.FC = () => {
	const { name } = useParams<{name: string}>();
	const { theme } = useSelector((state: any) => state.theme);
	
	return (
		<section className={`min-h-screen p-8 ${theme === 'light' ? 'bg-gradient-to-br from-indigo-100 via-white to-indigo-300' : 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900'}`}>
			<FormAboutUser userName={name}/>
		</section>
	)
};

export default UserProfile;