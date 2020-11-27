import { TransitionStatus } from 'react-transition-group/Transition'
import styled from '../../themes/lib/styled'

export interface StyledErrorDisplayContainerProps {
    transitionState: TransitionStatus
    transitionTimeout: number
}

export const StyledErrorDisplayContainer = styled('div')<StyledErrorDisplayContainerProps>(
    (props) => ({
        zIndex: 101,
        position: 'fixed',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transform:
            props.transitionState === 'entered'
                ? 'translateY(0)'
                : `translateY(${props.theme.metrics.errorDisplayHeight}px)`,
        bottom: 0,
        left: 0,
        height: props.theme.metrics.errorDisplayHeight,
        width: '100%',
        paddingLeft: props.theme.metrics.margins.md,
        paddingRight: props.theme.metrics.margins.md,
        backgroundColor: props.theme.colours.danger.bg,
        color: props.theme.colours.danger.fg,
        boxShadow: `0 1px 5px ${props.theme.colours.dropShadow}`,
        transition: `transform ${props.transitionTimeout}ms linear`,
    })
)

export const StyledErrorDisplayContent = styled('div')((props) => ({
    fontSize: props.theme.metrics.font.size.errorDisplay,
    fontWeight: props.theme.metrics.font.weight.errorDisplay,
}))

export const StyledDismissButton = styled('button')((props) => ({
    fontSize: 24,
    fontWeight: props.theme.metrics.font.weight.errorDisplay,
    border: 'none',
    backgroundColor: 'transparent',
    color: props.theme.colours.danger.fg,
    cursor: 'pointer',
}))
