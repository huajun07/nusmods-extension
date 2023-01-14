
export function resize(this: GlobalEventHandlers, ev: Event) {
	resizeIFrameToFitContent(ev.target as HTMLIFrameElement)
}

function resizeIFrameToFitContent(iFrame: HTMLIFrameElement) {
	setTimeout(() => {
		if (!iFrame.contentWindow) return
		const document = iFrame.contentWindow.document
		const content = document.getElementsByClassName('scrollable')[0]
        if(!content){
            iFrame.contentWindow.document.body.innerHTML = `<div style="text-align:center;">An error has occured</div>`
            iFrame.height = "50"
            iFrame.width = iFrame.contentWindow.document.body.scrollWidth.toString()
            return
        }
		iFrame.contentWindow.document.body.innerHTML = content.innerHTML
		iFrame.height = iFrame.contentWindow.document.body.scrollHeight.toString()
		iFrame.width = iFrame.contentWindow.document.body.scrollWidth.toString()
	}, 30)
}
