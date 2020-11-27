const keywords = [
    'for',
    'while',
    'do',
    'end for',
    'end while',
    'if',
    'then',
    'else if',
    'else',
    'end if',
    'return',
    'function',
    'end function',
].sort((a, b) => b.length - a.length)

/**
 * None of this is good code or safe code.
 *
 * @param code
 * @param _infostring
 * @param _escaped
 */
export function highlightPseudocode(code: string, _infostring: string, _escaped: boolean) {
    let result = code.slice()
    for (const keyword of keywords) {
        const regex = new RegExp(keyword, 'g')
        result = result.replace(regex, `<strong>${keyword}</strong>`)
    }
    result = result.replace(/\/\*\*([\s\S]*?)\*\//gm, '<i style="color: #a3be8c;">/**$1*/</i>')
    return `<pre>${result}</pre>`
}
