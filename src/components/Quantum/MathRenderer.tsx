import * as React from 'react'
// @ts-ignore
import * as katex from 'katex'
import renderMathInElement from 'katex/dist/contrib/auto-render'
// @ts-ignore
import marked from 'marked/lib/marked.esm'
import { StyledContainer } from './MathRenderer.styled'
import { highlightPseudocode } from '../../lib/pseudocode-highlighter'
import katexOptions from './katex-options'
import { parseAndRenderGraphs } from '../../lib/parse-and-render-graphs'

const renderer = new marked.Renderer()
renderer.code = highlightPseudocode
marked.setOptions({
    renderer,
})

export interface MathRendererProps {
    markup: string
}

export interface MathRendererState {
    parsedMarkup: string
}

export class MathRenderer extends React.Component<MathRendererProps, MathRendererState> {
    private contentRef = React.createRef<HTMLDivElement>()

    constructor(props: MathRendererProps, state: MathRendererState) {
        super(props, state)

        this.state = {
            parsedMarkup: '',
        }
    }

    private renderMath() {
        const ref = this.contentRef.current
        if (!ref) {
            return
        }

        ref.innerHTML = this.props.markup
        ref.innerHTML = parseAndRenderGraphs(ref.innerHTML)
        // ref.innerHTML = marked(ref.innerHTML)
        renderMathInElement(ref, katexOptions)
    }

    componentDidMount() {
        this.renderMath()
    }

    componentDidUpdate(prevProps: MathRendererProps) {
        if (prevProps.markup !== this.props.markup) {
            this.renderMath()
        }
    }

    render() {
        return <StyledContainer ref={this.contentRef} />
    }
}
