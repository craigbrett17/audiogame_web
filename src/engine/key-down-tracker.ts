// since holding a key fires a bazillion times, store all the key IDs that are temporarily locked
const lockedKeys = []

export default (element: HTMLElement, keyPressLockOutTime: number, callback: (keydownEvent: KeyboardEvent) => void) => {
    // on window load, attach an onkeydown event handler to the passed in element
    // on a key down event, fire the callback
    window.onload = () => {
        element.onkeydown = (keyEvent => {
            if (lockedKeys.indexOf(keyEvent.which) >= 0) {
                return
            }

            lockedKeys.push(keyEvent.which)
            setTimeout(() => {
                const index = lockedKeys.indexOf(keyEvent.which)
                if (index >= 0) {
                    lockedKeys.splice(index, 1)
                }
            }, keyPressLockOutTime);
            callback(keyEvent)
        })
    }
}