import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	theme: 'light',
}

const SwitchThemeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setTheme: (state, action) => {
			state.theme = action.payload;
		},
	}
})

const {actions, reducer} = SwitchThemeSlice;

export default reducer;
export const { setTheme } = actions;