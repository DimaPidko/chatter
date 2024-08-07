import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from '../App.tsx';
import ChatPage from '../chatPage/chatPage.tsx';
import Chats from '../chats/Chats.tsx';
import Register from '../register/Register.tsx';
import UserProfile from '../userProfile/UserProfile.tsx';

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={'/'} element={<App />} />
				<Route path={'/register'} element={<Register />} />
				<Route path={'/chats'} element={<Chats />} />
				<Route path={'/chat/:id'} element={<ChatPage />} />
				<Route path={'/user/:name'} element={<UserProfile />} />
			</Routes>
		</BrowserRouter>
	)
};

export default Router;