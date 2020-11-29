export function openFile(callback: (contents: any) => void) {
    /// Whole lotta balony to load a file
    // https://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript
    const readFile = function (e: any) {
        var file = e.target.files[0]
        if (!file) {
            return
        }
        var reader = new FileReader()
        reader.onload = function (e: any) {
            var contents = e.target.result
            callback(contents)
            document.body.removeChild(fileInput)
        }
        reader.readAsText(file)
    }
    const fileInput = document.createElement('input') as HTMLInputElement
    fileInput.type = 'file'
    fileInput.style.display = 'none'
    fileInput.onchange = readFile
    document.body.appendChild(fileInput)
    var eventMouse = document.createEvent('MouseEvents')
    eventMouse.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
    )
    fileInput.dispatchEvent(eventMouse)
}
