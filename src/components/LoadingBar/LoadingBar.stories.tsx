import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { LoadingBar } from './LoadingBar'
import { NavBar } from '../NavBar'
import { Logo } from '../Logo'
import { Login } from '../../screens/Login'

export default {
    component: LoadingBar,
    title: 'Components/LoadingBar',
}

export const WithNavBar = () => (
    <MemoryRouter>
        <NavBar logo={<Logo kind="full" colour="grey" />} navItems={[]} />
        <LoadingBar />
        <Login />
    </MemoryRouter>
)
