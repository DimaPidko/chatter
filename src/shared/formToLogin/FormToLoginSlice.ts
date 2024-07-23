import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	userName: '',
	userId: '',
}

const FormToLoginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		setUserName: (state, action) => {
			state.userName = action.payload;
		},
		setUserId: (state, action) => {
			state.userId = action.payload;
		},
		resetData: (state) => {
			state.userName = '';
		}
	}
})

const {actions, reducer} = FormToLoginSlice;

export default reducer;
export const { setUserName, resetData, setUserId } = actions;