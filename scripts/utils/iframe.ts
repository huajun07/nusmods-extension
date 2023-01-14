export function resizeIFrameToFitContent( iFrame: HTMLIFrameElement ) {
    if(!iFrame.contentWindow) return
    const document = iFrame.contentWindow.document
    const content = document.getElementsByClassName('scrollable')[0]
    iFrame.contentWindow.document.body.innerHTML = content.innerHTML
    iFrame.height = iFrame.contentWindow.document.body.scrollHeight.toString()
    iFrame.width  = iFrame.contentWindow.document.body.scrollWidth.toString()
    iFrame.width = "100%"
}