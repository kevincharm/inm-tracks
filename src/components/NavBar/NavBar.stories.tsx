import * as React from 'react'

import { NavBar } from './NavBar'
import { Link, MemoryRouter } from 'react-router-dom'
import { Logo } from '../Logo'

export default {
    component: NavBar,
    title: 'Components/NavBar',
}

// Testing out Corey's icons
const ChevronDown: React.FunctionComponent = (_props) => (
    <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
        <path
            d="m8.5.5-4 4-4-4"
            fill="none"
            stroke="#2a2e3b"
            stroke-linecap="round"
            stroke-linejoin="round"
            transform="translate(6 8)"
        />
    </svg>
)

export const Default = () => {
    const logo = (
        <Link to="/">
            <Logo kind="full" colour="grey" />
        </Link>
    )

    return (
        <MemoryRouter>
            <NavBar
                logo={logo}
                navItems={[
                    { kind: 'router-link', content: <>Home</>, to: '/home' },
                    { kind: 'router-link', content: <>Docs</>, to: '/docs' },
                    { kind: 'router-link', content: <>Settings</>, to: '/settings' },
                    {
                        kind: 'button',
                        content: (
                            <>
                                <span>Dropdown</span>
                                <ChevronDown />
                            </>
                        ),
                    },
                ]}
            />
        </MemoryRouter>
    )
}
