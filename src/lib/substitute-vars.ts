export function substituteVars(source: string, vars: { [key: string]: string }) {
    let ret = source.slice()

    // search & replace vars (dirty)
    for (const [v0, v1] of Object.entries(vars)) {
        const re = new RegExp(`\\$\\{${v0}\\}`, 'gm')
        ret = ret.replace(re, v1)
    }

    return ret
}
