import { createSlice } from '@reduxjs/toolkit';

interface initialState {
	isAdmin: string;

}

const initialState = <initialState>{
	isAdmin: false,
}

const FormToCreateChatSlice = createSlice({
	name: 'admin',
	initialState,
	reducers: {
		setAdmin: (state, action) => {
			state.isAdmin = action.payload
		},
	}
})

const {actions, reducer} = FormToCreateChatSlice

export default reducer
export const { setAdmin } = actions