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
			state.userName = action.payload;
		},
		setPassword: (state, action) => {
			state.userPassword = action.payload;
		},
		resetData: (state) => {
			state.userPassword = '';
			state.userName = '';
		}
	}
})

const {actions, reducer} = FormToRegisterSlice;

export default reducer;
export const { setUserName, setPassword, resetData } = actions;