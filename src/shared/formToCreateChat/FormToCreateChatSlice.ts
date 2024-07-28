import { createSlice } from '@reduxjs/toolkit';

interface initialState {
	chatName: string;
	themeChat: string;
	privateChat: string;
	chats: Array<any>;
}

const initialState = <initialState>{
	chatName: '',
	themeChat: 'games',
	privateChat: '',
	chats: [],
}

const FormToCreateChatSlice = createSlice({
	name: 'form',
	initialState,
	reducers: {
		setChatName: (state, action) => {
			state.chatName = action.payload
		},
		setThemeChat: (state, action) => {
			state.themeChat = action.payload
		},
		setPrivateChat: (state, action) => {
			state.privateChat = action.payload
		},
		setChats: (state, action) => {
			state.chats.push(action.payload);
		}
	}
})

const {actions, reducer} = FormToCreateChatSlice

export default reducer
export const { setChatName, setThemeChat, setPrivateChat, setChats } = actions