import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './core/storeRedux/index.ts'
import Router from './static/router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<Router />
	</Provider>
)
