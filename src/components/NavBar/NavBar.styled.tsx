import styled from '../../themes/lib/styled'

export const StyledNavBarContainer = styled('div')((props) => ({
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: props.theme.metrics.navBarHeight,
    paddingLeft: props.theme.metrics.margins.md,
    paddingRight: props.theme.metrics.margins.md,
    margin: 0,
    backgroundColor: props.theme.colours.bg,
    boxShadow: `0 1px 5px ${props.theme.colours.dropShadow}`,

    'a, button': {
        cursor: 'pointer',
        color: props.theme.colours.fg,
        textDecoration: 'none',
        fontSize: props.theme.metrics.font.size.navItem,
        fontWeight: props.theme.metrics.font.weight.navItem,
    },

    button: {
        backgroundColor: props.theme.colours.bg,
        borderStyle: 'none',
        padding: 0,
    },
}))

export const StyledNavBarLogoContainer = styled('div')((props) => ({
    flexGrow: 0,
    marginLeft: props.theme.metrics.margins.md,
    marginRight: props.theme.metrics.margins.lg,
    height: 16,
}))

export const StyledNavBarRightContainer = styled('div')({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'right',
    height: '100%',
})

export const StyledNavBarItemContainer = styled('div')((props) => ({
    display: 'flex',
    alignItems: 'center',
    paddingLeft: props.theme.metrics.margins.md,
    paddingRight: props.theme.metrics.margins.md,
    height: '100%',

    ':hover': {
        color: props.theme.colours.fgLight,
    },
}))
