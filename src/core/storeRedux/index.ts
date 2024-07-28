import { configureStore } from '@reduxjs/toolkit';

import form from '../../shared/formToCreateChat/FormToCreateChatSlice.ts';
import register from '../../shared/formToRegister/FormToRegisterSlice.ts';
import login from '../../shared/formToLogin/FormToLoginSlice.ts'
import admin from '../../shared/chatPageAdmin/chatPageAdminSlice.ts'

const stringMiddleWare = () => (next) => (action) => {
	if (typeof action ===   'string') {
		return next({
			type: action,
		});
	}
	return next(action);
};

const store = configureStore({
	reducer: { form, register, login, admin },
	middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(stringMiddleWare),
});

export type RootState = ReturnType<typeof store.getState>
export default store;
