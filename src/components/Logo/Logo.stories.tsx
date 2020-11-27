import * as React from 'react'
import styled from '../../themes/lib/styled'

import { Logo } from './Logo'

export default {
    component: Logo,
    title: 'Components/Logo',
}

interface StyledLogoContainerProps {
    size: 'sm' | 'md' | 'lg'
    bg: 'black' | 'white'
}

const StyledLogoContainer = styled('div')<StyledLogoContainerProps>((props) => {
    const width = {
        sm: 128,
        md: 256,
        lg: 384,
    }[props.size]

    const backgroundColor = {
        black: '#000000',
        white: '#ffffff',
    }[props.bg]

    return {
        padding: props.theme.metrics.margins.lg,
        margin: props.theme.metrics.margins.md,
        backgroundColor,
        width,
    }
})

export const FullBlack = () => (
    <>
        <StyledLogoContainer size="sm" bg="white">
            <Logo kind="full" colour="black" />
        </StyledLogoContainer>
        <StyledLogoContainer size="md" bg="white">
            <Logo kind="full" colour="black" />
        </StyledLogoContainer>
        <StyledLogoContainer size="lg" bg="white">
            <Logo kind="full" colour="black" />
        </StyledLogoContainer>
    </>
)

export const FullWhite = () => (
    <>
        <StyledLogoContainer size="sm" bg="black">
            <Logo kind="full" colour="white" />
        </StyledLogoContainer>
        <StyledLogoContainer size="md" bg="black">
            <Logo kind="full" colour="white" />
        </StyledLogoContainer>
        <StyledLogoContainer size="lg" bg="black">
            <Logo kind="full" colour="white" />
        </StyledLogoContainer>
    </>
)

export const FullGrey = () => (
    <>
        <StyledLogoContainer size="sm" bg="white">
            <Logo kind="full" colour="grey" />
        </StyledLogoContainer>
        <StyledLogoContainer size="md" bg="white">
            <Logo kind="full" colour="grey" />
        </StyledLogoContainer>
        <StyledLogoContainer size="lg" bg="white">
            <Logo kind="full" colour="grey" />
        </StyledLogoContainer>
    </>
)

export const IconBlack = () => (
    <>
        <StyledLogoContainer size="sm" bg="white">
            <Logo kind="icon" colour="black" />
        </StyledLogoContainer>
        <StyledLogoContainer size="md" bg="white">
            <Logo kind="icon" colour="black" />
        </StyledLogoContainer>
        <StyledLogoContainer size="lg" bg="white">
            <Logo kind="icon" colour="black" />
        </StyledLogoContainer>
    </>
)
