import * as React from 'react'

import { Link } from './Link'
import { Text } from '../Text'
import { MemoryRouter } from 'react-router-dom'

export default {
    component: Link,
    title: 'Components/Link',
}

export const Default = () => (
    <MemoryRouter>
        <Text kind="paragraph">
            <Link kind="router" to="/">
                Router link
            </Link>
        </Text>
        <Text kind="paragraph">
            <Link kind="anchor" href="//github.com" target="_blank">
                Regular anchor link
            </Link>
        </Text>
    </MemoryRouter>
)
