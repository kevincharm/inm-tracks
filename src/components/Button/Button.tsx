import * as React from 'react'
import { CSSObject } from '@emotion/core'
import styled from '../../themes/lib/styled'

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    colourscheme?: 'primary' | 'confirm' | 'default' | 'danger'
    fillContainer?: boolean
}

export const Button = styled('button')<ButtonProps>((props) => {
    const style: CSSObject = {
        fontWeight: props.theme.metrics.font.weight.button,
        backgroundColor: props.theme.colours.bg,
        color: props.theme.colours.fg,
        padding: `${(2 * props.theme.metrics.margins.md) / 3}px ${
            props.theme.metrics.margins.md
        }px`,
        marginTop: props.theme.metrics.margins.sm,
        marginBottom: props.theme.metrics.margins.sm,
        marginRight: props.theme.metrics.margins.sm,
        borderStyle: 'solid',
        borderColor: props.theme.colours.fg,
        borderRadius: 3,
        borderWidth: 3,
        cursor: 'pointer',
        boxShadow: `0 3px ${props.theme.colours.dropShadow}`,
        ...props.style,

        ':active': {
            marginTop: props.theme.metrics.margins.sm + 1,
            marginBottom: props.theme.metrics.margins.sm - 1,
            boxShadow: 'none',
        },

        ':disabled': {
            backgroundColor: props.theme.colours.disabled.bg,
            color: props.theme.colours.disabled.fg,
            borderColor: props.theme.colours.disabled.bg,

            ':active': {
                marginTop: props.theme.metrics.margins.sm,
                marginBottom: props.theme.metrics.margins.sm,
                boxShadow: `0 3px ${props.theme.colours.dropShadow}`,
            },
        },
    }

    switch (props.colourscheme) {
        case 'primary':
            Object.assign(style, {
                backgroundColor: props.theme.colours.primary.bg,
                color: props.theme.colours.primary.fg,
                borderColor: props.theme.colours.primary.bg,
            })
            break
        case 'confirm':
            Object.assign(style, {
                backgroundColor: props.theme.colours.positive.bg,
                color: props.theme.colours.positive.fg,
                borderColor: props.theme.colours.positive.bg,
            })
            break
        case 'danger':
            Object.assign(style, {
                backgroundColor: props.theme.colours.danger.bg,
                color: props.theme.colours.danger.fg,
                borderColor: props.theme.colours.danger.bg,
            })
            break
        case 'default':
        default:
    }

    if (props.fillContainer) {
        Object.assign(style, {
            width: '100%',
        })
    }

    return style
})
