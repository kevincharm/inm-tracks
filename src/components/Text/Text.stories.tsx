import * as React from 'react'

import { Text } from './Text'

export default {
    component: Text,
    title: 'Components/Text',
}

export const Combined = () => (
    <>
        <Text kind="heading">Heading</Text>
        <Text kind="subheading">This is a subheading</Text>
        <Text kind="paragraph">Hello, world!</Text>
    </>
)
