import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from './SwitchThemeSlice';

const SwitchTheme: React.FC = () => {
	const { theme } = useSelector((state: any) => state.theme);
	const dispatch = useDispatch();
	
	const onChangeTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
		localStorage.setItem('localTheme', theme === 'light' ? 'dark' : 'light');
	};
	
	return (
		<button onClick={onChangeTheme} className="mt-4 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
			Switch Theme
		</button>
	);
};

export default SwitchTheme;
