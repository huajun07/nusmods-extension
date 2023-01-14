import { resizeIFrameToFitContent } from './utils/iframe'

function resize(this: GlobalEventHandlers, ev: Event) {
	resizeIFrameToFitContent(ev.target as HTMLIFrameElement)
}

export const loadTimeTable = (url: string) => {
	const div = document.getElementsByClassName('main-content')[0]
	const child = document.createElement('div')
	child.id = "schedule"
	div.appendChild(child)
	const iframe = document.createElement('iframe')
	iframe.onload = resize
	iframe.src = url
	child.appendChild(iframe)
}