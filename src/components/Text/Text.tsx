import * as React from 'react'
import { StyledHeading, StyledParagraph, StyledSubheading } from './Text.styled'

export interface TextProps {
    kind: 'paragraph' | 'heading' | 'subheading'
}

export const Text: React.FunctionComponent<TextProps> = (props) => {
    switch (props.kind) {
        case 'heading':
            return <StyledHeading>{props.children}</StyledHeading>
        case 'subheading':
            return <StyledSubheading>{props.children}</StyledSubheading>
        case 'paragraph':
        default:
            return <StyledParagraph>{props.children}</StyledParagraph>
    }
}
