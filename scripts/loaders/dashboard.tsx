import * as ReactDOM from 'react-dom'
import React from 'react'
import App from '../components/App'
import { ChakraProvider } from '@chakra-ui/react'
import { setCurrentSemModules } from '../utils/modules'

export function initalizeDashboard() {
	const div = document.getElementsByClassName('main-container')[0]
	const child = document.createElement('div')
	child.id = 'schedule'
	div.appendChild(child)
	const dashboard = document.createElement('div')
	dashboard.id = 'schedule-dashboard'
	child.appendChild(dashboard)
	const results = document.createElement('div')
	results.id = 'schedule-results'
	child.appendChild(results)
	window.addEventListener('message', (event) => {
		if (event.origin !== 'https://nusmods.com') return
		const data = JSON.parse(event.data)
		if (data.message === 'syncTimetable') {
			console.log(data.modules)
			setCurrentSemModules(data.modules)
			window.location.reload() // reload to rerender timetable
		}
	})
	const root = ReactDOM.createRoot(dashboard)
	root.render(
		<React.StrictMode>
			<ChakraProvider>
				<App />
			</ChakraProvider>
		</React.StrictMode>
	)
}
