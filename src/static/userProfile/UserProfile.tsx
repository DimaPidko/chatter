import React from 'react';
import { useParams } from 'react-router-dom';
import FormAboutUser from '../../shared/formAboutUser/FormAboutUser.tsx';

const UserProfile : React.FC = () => {
	const { name } = useParams<{name: string}>();
	
	return (
		<section>
			<FormAboutUser userName={name}/>
		</section>
	)
};

export default UserProfile;