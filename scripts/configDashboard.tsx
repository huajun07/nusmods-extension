import * as ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App'
import { ChakraProvider } from '@chakra-ui/react'

export function initalizeDashboard() {
	const div = document.getElementById('schedule-dashboard')
	if (!div) return
	div.id = 'testing123'
	const root = ReactDOM.createRoot(div)
	root.render(
		<React.StrictMode>
			<ChakraProvider>
				<App />
			</ChakraProvider>
		</React.StrictMode>
	)
}
