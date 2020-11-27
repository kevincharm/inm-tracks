import * as React from 'react'
import { StyledLogoContainer, StyledImage, StyledMiniLabel } from './Logo.styled'
// @ts-ignore
import infragrokFullBlack from './infragrok_full_black.png'
// @ts-ignore
import infragrokFullWhite from './infragrok_full_white.png'
// @ts-ignore
import infragrokFullGrey from './infragrok_full_darkgrey.png'
// @ts-ignore
import infragrokIconBlack from './infragrok_icon_black.png'

interface LogoPropsFull {
    kind: 'full'
    colour: 'black' | 'white' | 'grey'
}

interface LogoPropsIcon {
    kind: 'icon'
    colour: 'black'
}

export type LogoProps = (LogoPropsFull | LogoPropsIcon) & {
    label?: string
}

export const Logo: React.FunctionComponent<LogoProps> = (props) => {
    let img
    switch (props.kind) {
        case 'icon': {
            switch (props.colour) {
                default:
                case 'black':
                    img = <StyledImage src={infragrokIconBlack} />
            }
        }
        default:
        case 'full': {
            switch (props.colour) {
                case 'grey':
                    img = <StyledImage src={infragrokFullGrey} />
                case 'white':
                    img = <StyledImage src={infragrokFullWhite} />
                default:
                case 'black':
                    img = <StyledImage src={infragrokFullBlack} />
            }
        }
    }

    return (
        <StyledLogoContainer>
            {props.label && <StyledMiniLabel>{props.label}</StyledMiniLabel>}
            {img}
        </StyledLogoContainer>
    )
}
