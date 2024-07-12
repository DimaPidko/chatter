import { configureStore } from '@reduxjs/toolkit';

// import navigation from '../components/ui/header/navigation/navigationSlice';
// import modal from '../components/ui/modal/ModalSlice';

const stringMiddleWare = () => (next) => (action) => {
	if (typeof action ===   'string') {
		return next({
			type: action,
		});
	}
	return next(action);
};

const store = configureStore({
	reducer: {},
	middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(stringMiddleWare),
});

export type RootState = ReturnType<typeof store.getState>
export default store;
