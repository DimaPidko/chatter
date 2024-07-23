import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	userName: '',
}

const FormToLoginSlice = createSlice({
	name: 'login',
	initialState,
	reducers: {
		setUserName: (state, action) => {
			state.userName = action.payload;
		},
		resetData: (state) => {
			state.userName = '';
		}
	}
})

const {actions, reducer} = FormToLoginSlice;

export default reducer;
export const { setUserName, resetData } = actions;