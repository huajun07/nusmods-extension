export const loadScheduler = () => {
	const div = document.getElementsByClassName('main-container')[0]
	const child = document.createElement('div')
	child.id = "schedule"
	div.appendChild(child)
	const dashboard = document.createElement('div')
	dashboard.id = "schedule-dashboard"
	child.appendChild(dashboard)
	const results = document.createElement('div')
	results.id = "schedule-results"
	child.appendChild(results)
}