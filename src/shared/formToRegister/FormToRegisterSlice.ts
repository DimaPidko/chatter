import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	userName: '',
	userPassword: '',
}

const FormToRegisterSlice = createSlice({
	name: 'register',
	initialState,
	reducers: {
		setUserName: (state, action) => {
			state.userName = action.payload
		},
		setPassword: (state, action) => {
			state.userPassword = action.payload
		}
	}
})

const {actions, reducer} = FormToRegisterSlice

export default reducer
export const { setUserName, setPassword } = actions