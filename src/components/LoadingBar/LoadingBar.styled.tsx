import styled from '../../themes/lib/styled'
import { keyframes } from '@emotion/core'

export const StyledLoadingBar = styled('div')((props) => {
    const glowInner = keyframes({
        '0%, 10%, 100%': {
            /** on */
            boxShadow: `0 0 18px ${props.theme.colours.loadingBarGradientInner}`,
            backgroundColor: props.theme.colours.loadingBarGradientInner,
        },
        '50%': {
            /** off */
            boxShadow: `0 0 18px transparent`,
            backgroundColor: 'transparent',
        },
    })

    const glowOuter = keyframes({
        '0%, 10%, 100%': {
            /** on */
            boxShadow: `0 0 24px ${props.theme.colours.loadingBarGradientOuter}`,
            backgroundColor: props.theme.colours.loadingBarGradientOuter,
        },
        '50%': {
            /** off */
            boxShadow: `0 0 18px transparent`,
            backgroundColor: 'transparent',
        },
    })

    return {
        zIndex: 90,
        position: 'fixed',
        top: 0,
        left: props.theme.metrics.margins.md,
        width: `calc(100% - ${props.theme.metrics.margins.md}px)`,
        height: props.theme.metrics.navBarHeight,
        borderRadius: '45%',
        backgroundColor: props.theme.colours.loadingBarGradientInner,
        animation: `${glowInner} 1.6s linear infinite`,

        ':after': {
            content: '" "',
            position: 'fixed',
            top: 0,
            left: props.theme.metrics.margins.md,
            width: `calc(100% - ${props.theme.metrics.margins.md}px)`,
            height: props.theme.metrics.navBarHeight,
            borderRadius: '60%',
            backgroundColor: props.theme.colours.loadingBarGradientOuter,
            animation: `${glowOuter} 1.6s linear infinite`,
        },
    }
})
