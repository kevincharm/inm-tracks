import * as React from 'react'
import { TransitionGroup, Transition } from 'react-transition-group'
import {
    StyledErrorDisplayContainer,
    StyledErrorDisplayContent,
    StyledDismissButton,
} from './ErrorDisplay.styled'
import UserError from '../../lib/UserError'

export interface ErrorDisplayProps {
    errors: UserError[]
    dismissError: (user: UserError) => void
}

const ERROR_TRANSITION_TIMEOUT = 150

export const ErrorDisplay: React.FunctionComponent<ErrorDisplayProps> = (props) => {
    const { errors, dismissError } = props

    return (
        <TransitionGroup>
            {errors.map((error, idx, arr) => (
                <Transition key={error.uid} timeout={ERROR_TRANSITION_TIMEOUT}>
                    {(transitionState) => (
                        <StyledErrorDisplayContainer
                            style={{ zIndex: arr.length - idx }}
                            transitionState={transitionState}
                            transitionTimeout={ERROR_TRANSITION_TIMEOUT}
                        >
                            <StyledErrorDisplayContent>{error.message}</StyledErrorDisplayContent>
                            <StyledDismissButton onClick={() => dismissError(error)}>
                                ×
                            </StyledDismissButton>
                        </StyledErrorDisplayContainer>
                    )}
                </Transition>
            ))}
        </TransitionGroup>
    )
}
