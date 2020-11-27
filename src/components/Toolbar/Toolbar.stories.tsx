import * as React from 'react'

import { Toolbar } from './Toolbar'

export default {
    component: Toolbar,
    title: 'Components/Toolbar',
}

export const Vertical = () => <Toolbar title="Tools" stackDirection="vertical" />

export const Horizontal = () => <Toolbar title="Tools" stackDirection="horizontal" />
