export function downloadFile(filename: string, content: any, contentType: string) {
    const blob = new Blob([content], {
        type: contentType,
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = filename
    a.click()
}
