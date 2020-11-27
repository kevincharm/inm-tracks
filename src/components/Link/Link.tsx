import * as React from 'react'
import { LinkProps as ReactRouterLinkProps } from 'react-router-dom'
import { StyledRouterLink, StyledAnchorLink } from './Link.styled'

interface RouterLinkProps extends ReactRouterLinkProps {
    kind: 'router'
}

interface AnchorLinkProps extends React.ComponentPropsWithoutRef<'a'> {
    kind: 'anchor'
}

export type LinkProps = RouterLinkProps | AnchorLinkProps

export const Link: React.FunctionComponent<LinkProps> = (props) => (
    <>
        {props.kind === 'router' && <StyledRouterLink {...props} />}
        {props.kind === 'anchor' && <StyledAnchorLink {...props} />}
    </>
)
