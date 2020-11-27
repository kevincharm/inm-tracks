/**
 * Generates a random integer within the range `[low, high)`
 * @param low lower bound (inclusive)
 * @param high upper bound (exclusive)
 */
export function genRandomIntBetween(low: number, high: number) {
    const rand = Math.floor(Math.random() * (high - low))
    return low + rand
}

/**
 * Picks a random element of type `T` from `list`.
 *
 * @param list list of elements to pick from
 */
export function pickRandomFrom<T>(...list: T[]): T {
    const randIndex = Math.floor(Math.random() * list.length)
    return list[randIndex]
}

/**
 * Returns a sequence of random bits of `bitLength`, as a bitstring.
 * Maximum number of bits is 53 because of double-precision fp.
 *
 * @param bitLength
 */
export function genRandomBits(bitLength: number): string {
    const bitString = Array(bitLength)
        .fill(0)
        .map((_) => Math.round(Math.random()))

    return bitString.join('')
}

/**
 * Returns a sequence of random bits upto `bitLength`, as a number.
 * Maximum number of bits is 53 because of double-precision fp.
 *
 * @param bitLength number of bits to generate (max 53)
 * @param alwaysSetMsb optionally always set MSB
 */
export function genRandomBitsUpto(bitLength: number, alwaysSetMsb?: boolean): number {
    bitLength = Math.min(53, bitLength)
    const bitString = Array(bitLength)
        .fill(0)
        .map((_) => Math.round(Math.random()))
        .map((bit, i) => {
            if (alwaysSetMsb && i == 0) {
                return 1
            }

            return bit
        })
        .join('')
    return parseInt(bitString, 2)
}

export function pickTrueOrFalse() {
    return [true, false][Math.round(Math.random())]
}

/**
 * Shuffle an array using the Durstenfeld shuffle algorithm.
 * Does a shallow copy of the array and returns the shuffled array.
 *
 * @author Laurens Holst <https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array>
 * @param array
 */
export function shuffleArray<T>(arr: T[]) {
    const array = Array.from(arr) // try to be pure
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}
