import * as React from 'react'
import { StyledCard } from './Card.styled'

export interface CardProps {}

export const Card: React.FunctionComponent<CardProps> = (props) => {
    return <StyledCard>{props.children}</StyledCard>
}
