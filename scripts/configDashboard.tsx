import * as ReactDOM from 'react-dom'
import React from 'react'
import App from './components/App'
import { ChakraProvider } from '@chakra-ui/react'
import { setCurrentSemModules } from './utils/modules'

export function initalizeDashboard() {
	window.addEventListener('message', (event) => {
		if (event.origin !== 'https://nusmods.com') return
		const data = JSON.parse(event.data)
		if (data.message === 'syncTimetable') {
			console.log(data.modules)
			setCurrentSemModules(data.modules)
			window.location.reload() // reload to rerender timetable
		}
	})
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
