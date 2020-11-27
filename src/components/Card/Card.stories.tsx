import * as React from 'react'

import { Card } from './Card'
import styled from '../../themes/lib/styled'

export default {
    component: Card,
    title: 'Components/Card',
}

const StyledContainer = styled('div')({
    width: 400,
})

export const Default = () => (
    <StyledContainer>
        <Card>Test 400px wide card</Card>
    </StyledContainer>
)
