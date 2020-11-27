import * as React from 'react'
import {
    StyledNavBarContainer,
    StyledNavBarItemContainer,
    StyledNavBarLogoContainer,
    StyledNavBarRightContainer,
} from './NavBar.styled'
import { Link, LinkProps as ReactRouterLinkProps } from 'react-router-dom'

interface NavBarRouterLinkProps extends ReactRouterLinkProps {
    kind: 'router-link'
}

interface NavBarAnchorLinkProps extends React.ComponentPropsWithoutRef<'a'> {
    kind: 'anchor-link'
}

interface NavBarButtonProps extends React.ComponentPropsWithRef<'button'> {
    kind: 'button'
}

export type NavBarItemProps = (
    | NavBarRouterLinkProps
    | NavBarAnchorLinkProps
    | NavBarButtonProps
) & {
    content: React.ReactElement
}

export interface NavBarProps {
    logo: React.ReactElement
    navItems: NavBarItemProps[]
}

export const NavBar: React.FunctionComponent<NavBarProps> = (props) => {
    return (
        <StyledNavBarContainer>
            <StyledNavBarLogoContainer>{props.logo}</StyledNavBarLogoContainer>
            <StyledNavBarRightContainer>
                {props.navItems.map((item, idx) => {
                    switch (item.kind) {
                        case 'router-link':
                            return (
                                <Link key={idx} {...item}>
                                    <StyledNavBarItemContainer>
                                        {item.content}
                                    </StyledNavBarItemContainer>
                                </Link>
                            )
                        case 'anchor-link':
                            return (
                                <a {...item} key={idx}>
                                    <StyledNavBarItemContainer>
                                        {item.content}
                                    </StyledNavBarItemContainer>
                                </a>
                            )
                        case 'button':
                            return (
                                <button {...item} key={idx}>
                                    <StyledNavBarItemContainer>
                                        {item.content}
                                    </StyledNavBarItemContainer>
                                </button>
                            )
                    }
                })}
            </StyledNavBarRightContainer>
        </StyledNavBarContainer>
    )
}
