import { createSlice } from '@reduxjs/toolkit'

interface initialState {
	chatName: string
}

const initialState = {
	chatName: ''
}

const FormToCreateChatSlice = createSlice({
	name: 'form',
	initialState,
	reducers: {
		setChatName: (state, action) => {
			state.chatName = action.payload
		}
	}
})

const {actions, reducer} = FormToCreateChatSlice

export default reducer
export const { setChatName } = actions