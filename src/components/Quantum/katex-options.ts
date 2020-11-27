import { RenderMathInElementOptions } from 'katex/dist/contrib/auto-render'

const katexOptions: RenderMathInElementOptions = {
    delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
    ],
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'code'],
}

export default katexOptions
