import * as React from 'react'
import { StyledInput, StyledLabel } from './Input.styled'

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
    label?: string
}

export const Input: React.FunctionComponent<InputProps> = (props) => {
    // Needed for the label, fallback to if name not specified
    const inputName = props.name || props.id

    return (
        <>
            {props.label && <StyledLabel htmlFor={inputName}>{props.label}</StyledLabel>}
            <StyledInput {...props} name={inputName} />
        </>
    )
}
