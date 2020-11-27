import * as React from 'react'
import {
    StyledHeading,
    StyledContainer,
    StyledKind,
    StyledSubheading,
    StyledCode,
    StyledCodeContainer,
    StyledVariableInputContainer,
    StyledCollapsibleContainer,
    StyledTopic,
} from './Quantum.styled'
import { MathRenderer } from './MathRenderer'
import { substituteVars } from '../../lib/substitute-vars'
import { evaluateVars } from '../../lib/eval-vars'
import { QuantumData } from '../../lib/QuantumData'

export interface QuantumProps {
    data: QuantumData
    isExpanded: boolean
    isSelected: boolean
    onTitleClick: (event: React.MouseEvent) => void
}

export interface QuantumState {
    showSolution: boolean
    vars: { [key: string]: string }
}

/**
 * Handles rendering a quantum of information.
 */
export class Quantum extends React.Component<QuantumProps, QuantumState> {
    private codeRef = React.createRef<HTMLTextAreaElement>()
    private containerRef = React.createRef<HTMLDivElement>()

    constructor(props: QuantumProps, state: QuantumState) {
        super(props, state)

        this.state = {
            showSolution: false,
            vars: props.data.vars,
        }
    }

    private textareaKeydownHandler = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            this.setState({ showSolution: false })
        }
    }

    private containerKeydownHandler = (event: KeyboardEvent) => {
        if (!['Escape', 'Enter'].includes(event.key)) {
            event.stopPropagation()
        }
    }

    componentDidMount() {
        const container = this.containerRef.current
        if (container) {
            container.addEventListener('keydown', this.containerKeydownHandler)
        }
    }

    componentDidUpdate() {
        const codeTextarea = this.codeRef.current
        if (codeTextarea) {
            codeTextarea.addEventListener('keydown', this.textareaKeydownHandler)
        }
    }

    componentWillUnmount() {
        const container = this.containerRef.current
        if (container) {
            container.removeEventListener('keydown', this.containerKeydownHandler)
        }
        const codeTextarea = this.codeRef.current
        if (codeTextarea) {
            codeTextarea.removeEventListener('keydown', this.textareaKeydownHandler)
        }
    }

    render() {
        const data = this.props.data
        const substSolution = evaluateVars(
            substituteVars(data.solution, this.state.vars),
            this.state.vars
        )

        return (
            <StyledContainer
                ref={this.containerRef}
                id={data.id}
                isHighlighted={this.props.isSelected}
                isExpanded={this.props.isExpanded}
            >
                <StyledHeading onClick={this.props.onTitleClick}>{data.title}</StyledHeading>
                <StyledTopic>{data.topic}</StyledTopic>
                <StyledKind kind={data.kind}>{data.kind}</StyledKind>
                <StyledCollapsibleContainer isExpanded={this.props.isExpanded}>
                    <StyledSubheading>Preface</StyledSubheading>
                    <MathRenderer markup={data.preface} />
                    {(Object.keys(data.vars).length && (
                        <>
                            <StyledSubheading>Variables</StyledSubheading>
                            {Object.entries(data.vars).map(([key, value]) => (
                                <StyledVariableInputContainer key={key}>
                                    <label>{key}</label>
                                    <input
                                        type="text"
                                        defaultValue={value}
                                        onChange={(event) => {
                                            this.setState({
                                                vars: {
                                                    ...this.state.vars,
                                                    [key]: event.target.value,
                                                },
                                            })
                                        }}
                                    />
                                </StyledVariableInputContainer>
                            ))}
                        </>
                    )) ||
                        null}
                    {data.solution && (
                        <>
                            <StyledSubheading>Solution</StyledSubheading>
                            {this.state.showSolution ? (
                                <StyledCodeContainer>
                                    <StyledCode
                                        ref={this.codeRef}
                                        value={substSolution}
                                        readOnly={true}
                                    />
                                </StyledCodeContainer>
                            ) : (
                                <div onDoubleClick={() => this.setState({ showSolution: true })}>
                                    <MathRenderer markup={substSolution} />
                                </div>
                            )}
                        </>
                    )}
                    {data.rubric && (
                        <>
                            <StyledSubheading>Rubric</StyledSubheading>
                            <MathRenderer markup={data.rubric} />
                        </>
                    )}
                </StyledCollapsibleContainer>
            </StyledContainer>
        )
    }
}
