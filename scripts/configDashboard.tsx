import * as ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App'

export function initalizeDashboard() {
	const div = document.createElement('div')
	document.getElementById('schedule')?.appendChild(div)
	div.id = 'testing123'
	const root = ReactDOM.createRoot(div)
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	)
}
