import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { ErrorDisplay } from './ErrorDisplay'
import { NavBar } from '../NavBar'
import { Logo } from '../Logo'
import { createErrorStore } from '../../store/error'
import { GenericUserError } from '../../lib/UserError'

export default {
    component: ErrorDisplay,
    title: 'Components/ErrorDisplay',
}

export const WithNavBar = () => {
    // Apparently zustand doesn't play nicely with storybook (no reactivity)
    const [errors, dismissError] = createErrorStore(() => ({
        errors: [
            new GenericUserError(
                '(1) Oepsie woepsie! De trein is stukkie wukkie! We sijn heul hard aan t werk om dit te make mss kan je beter fwietsen  owo'
            ),
            new GenericUserError(
                '(2) Oepsie woepsie! De trein is stukkie wukkie! We sijn heul hard aan t werk om dit te make mss kan je beter fwietsen  owo'
            ),
            new GenericUserError(
                '(3) Oepsie woepsie! De trein is stukkie wukkie! We sijn heul hard aan t werk om dit te make mss kan je beter fwietsen  owo'
            ),
        ],
    }))((store) => [store.errors, store.dismissError])

    return (
        <MemoryRouter>
            <NavBar logo={<Logo kind="full" colour="grey" />} navItems={[]} />
            <ErrorDisplay errors={errors} dismissError={dismissError} />
        </MemoryRouter>
    )
}
