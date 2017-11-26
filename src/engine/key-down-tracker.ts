export default (element: HTMLElement, callback: (keydownEvent: KeyboardEvent) => void) => {
    // on window load, attach an onkeydown event handler to the passed in element
    // on a key down event, fire the callback
    window.onload = () => {
        element.onkeydown = (keyEvent => {
            callback(keyEvent)
        })
    }
}