import styled, { Theme } from '../../themes/lib/styled'
import { Link } from 'react-router-dom'
import { CSSObject } from '@emotion/core'

const baseLinkStyle: (theme: Theme) => CSSObject = (theme: Theme) => ({
    textDecoration: 'none',
    borderBottomStyle: 'dotted',
    borderBottomWidth: 1,
    borderBottomColor: theme.colours.linkFg,
    color: theme.colours.linkFg,
})

export const StyledRouterLink = styled(Link)((props) => ({
    ...baseLinkStyle(props.theme),
}))

export const StyledAnchorLink = styled('a')((props) => ({
    ...baseLinkStyle(props.theme),
}))
