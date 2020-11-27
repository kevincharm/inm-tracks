/**
 * The schema for a key piece of information.
 */

export interface QuantumData {
    id: string
    kind: 'proof' | 'objective'
    topic: string
    title: string
    /** variables that can be substituted into the solution */
    vars: { [key: string]: string }
    /** Introductory content; markdown and mathjax enabled */
    preface: string
    /** Main content, intended to be copy-pasteable; markdown and mathjax enabled */
    solution: string
    /** Marking rubric */
    rubric?: string
}
