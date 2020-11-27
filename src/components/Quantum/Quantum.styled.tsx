import styled, { CSSObject } from '@emotion/styled'
import { keyframes } from '@emotion/core'
import TextareaAutosize from 'react-autosize-textarea'
import { QuantumData } from '../../lib/QuantumData'

const slideUpAnimation = keyframes({
    '0%': {
        opacity: 0,
        transform: 'translateX(128px)',
    },
    '100%': {
        opacity: 1,
        transform: 'translateX(0)',
    },
})

export interface StyledContainerProps {
    isHighlighted: boolean
    isExpanded: boolean
}

export const StyledContainer = styled('div')<StyledContainerProps>((props) => ({
    position: 'relative',
    padding: '4px 24px',
    margin: 8,
    borderRadius: 8,
    backgroundColor: props.isExpanded
        ? '#434c5ebb'
        : props.isHighlighted
        ? '#4C576Bcc'
        : '#434c5e70',
    lineHeight: 1.5,
    overflow: 'hidden',
    transition: 'background-color 150ms ease-out',
    animation: `${slideUpAnimation} 100ms ease-out`,
}))

export interface StyledCollapsibleContainerProps {
    isExpanded: boolean
}

export const StyledCollapsibleContainer = styled('div')<StyledCollapsibleContainerProps>(
    (props) => ({
        opacity: props.isExpanded ? 1 : 0,
        height: 'auto',
        maxHeight: props.isExpanded ? 9999 : 0,
        transition: 'max-height 200ms ease-out, opacity 200ms ease-out',
    })
)

export const StyledHeading = styled('h2')({
    position: 'relative',
    zIndex: 10,
    marginTop: 8,
    fontWeight: 300,
    fontSize: 20,
    cursor: 'pointer',
    userSelect: 'none',
})

export const StyledSubheading = styled('h3')({
    position: 'relative',
    zIndex: 10,
    fontWeight: 300,
    fontSize: 12,
    color: '#d8dee9',
    borderBottomStyle: 'dotted',
    borderBottomWidth: 1,
    borderColor: '#d8dee9',
})

export interface StyledKindProps {
    kind: QuantumData['kind']
}

function getColoursForKind(kind: QuantumData['kind']): CSSObject {
    switch (kind) {
        case 'objective':
            return {
                backgroundColor: '#a3be8c',
                color: '#2e3440',
            }
        default:
        case 'proof':
            return {
                backgroundColor: '#bf616a',
                color: '#eceff4',
            }
    }
}

export const StyledKind = styled('div')<StyledKindProps>((props) => ({
    display: 'inline-block',
    marginBottom: 4,
    marginRight: 8,
    padding: '4px 8px',
    borderRadius: 4,
    fontWeight: 700,
    fontStyle: 'italic',
    fontSize: 12,
    textTransform: 'uppercase',
    ...getColoursForKind(props.kind),
}))

export const StyledTopic = styled('div')({
    zIndex: 0,
    position: 'absolute',
    opacity: 0.2,
    top: 8,
    right: 24,
    textTransform: 'uppercase',
    fontSize: 80,
    fontWeight: 700,
    fontStyle: 'italic',
    letterSpacing: -5,
    color: '#81a1c1',
    userSelect: 'none',
    whiteSpace: 'nowrap',
})

export const StyledCodeContainer = styled('div')({
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#2e3440',
})

export const StyledCode = styled(TextareaAutosize)({
    border: 'none',
    width: '100%',
    color: '#eceff4',
    backgroundColor: 'transparent',
})

export const StyledVariableInputContainer = styled('div')({
    margin: 8,

    label: {
        display: 'block',
        marginBottom: 4,
    },

    input: {
        width: 250,
        padding: 8,
        maxWidth: '100%',
        color: '#eceff4',
        backgroundColor: '#2e3440',
        border: 'none',
        borderRadius: 4,
        borderBottomStyle: 'solid',
        borderBottomWidth: 2,
        borderBottomColor: '#4c566a',
    },
})
