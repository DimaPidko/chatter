import { createSlice } from '@reduxjs/toolkit';

interface initialState {
	chatName: string;
	themeChat: string;
	privateChat: boolean;
	chats: Array<any>;
	filterChat: string;
}

const initialState = <initialState>{
	chatName: '',
	themeChat: 'Games',
	privateChat: false,
	chats: [],
	filterChat: 'All',
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
		},
		clearChats: (state) => {
			state.chats = [];
		},
		setFilterChat: (state, action) => {
			state.filterChat = action.payload;
		}
	}
})

const {actions, reducer} = FormToCreateChatSlice;

export default reducer;
export const { setChatName, setThemeChat, setPrivateChat, setChats, clearChats, setFilterChat } = actions;