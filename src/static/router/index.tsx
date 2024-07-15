import { BrowserRouter, Route, Routes } from "react-router-dom"
import App from '../App.tsx'
import Register from '../register/Register.tsx'

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={'/'} element={<App />} />
				<Route path={'/register'} element={<Register />} />
			</Routes>
		</BrowserRouter>
	)
}

export default Router