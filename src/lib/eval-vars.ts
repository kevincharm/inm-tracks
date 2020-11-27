import * as math from 'mathjs'

/**
 * This is bad, very bad.
 *
 * @param source
 * @param vars
 */
export function evaluateVars(source: string, scope?: object) {
    return source
        .replace(/\%\{([\s\S]*?)\}/gm, (_match, p1) => {
            /** js eval */
            try {
                return eval(p1)
            } catch (err) {
                console.warn(err)
                return p1
            }
        })
        .replace(/\#\{([\s\S]*?)\}/gm, (_match, p1) => {
            /** mathjs */
            try {
                return math.evaluate(p1, scope)
            } catch (err) {
                console.warn(err)
                return p1
            }
        })
}
