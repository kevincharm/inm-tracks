import * as React from 'react'

import { Button } from './Button'

export default {
    component: Button,
    title: 'Components/Button',
}

export const Default = () => <Button>Button!</Button>

export const Primary = () => <Button colourscheme="primary">Submit</Button>

export const Confirm = () => <Button colourscheme="confirm">Confirm</Button>

export const Disabled = () => (
    <Button colourscheme="primary" disabled>
        Disabled
    </Button>
)
