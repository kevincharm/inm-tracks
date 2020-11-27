import styled from '../../themes/lib/styled'

export const TOOLBAR_ICON_SIZE = 48

export type StackDirection = 'vertical' | 'horizontal'

export interface StyledToolbarContainerProps {
    stackDirection: StackDirection
}

export const StyledToolbarContainer = styled('div')<StyledToolbarContainerProps>((props) => ({
    zIndex: 110,
    position: 'fixed',
    backgroundColor: props.theme.colours.bg,
    color: props.theme.colours.fg,
    boxShadow: `0 5px 5px ${props.theme.colours.dropShadow}`,

    '> *': {
        display: props.stackDirection === 'vertical' ? 'block' : 'inline-block',
        width: props.stackDirection === 'vertical' ? '100%' : TOOLBAR_ICON_SIZE,
    },
}))

export const StyledTitleContainer = styled('div')((props) => ({
    display: 'flex',
    alignItems: 'center',
    padding: props.theme.metrics.margins.sm,
    width: '100%',
    backgroundColor: props.theme.colours.toolbarTitleBg,
    color: props.theme.colours.toolbarTitleFg,
    fontSize: props.theme.metrics.font.size.toolbarTitle,
    minHeight: props.theme.metrics.font.size.toolbarTitle,
    cursor: 'pointer',
    userSelect: 'none',
}))

export const StyledTitle = styled('div')((props) => ({
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: 1,
}))

export const StyledToolbarButton = styled('button')((props) => ({
    position: 'relative',
    backgroundColor: props.theme.colours.bg,
    border: 'none',
    padding: 0,
    height: TOOLBAR_ICON_SIZE,
    cursor: 'pointer',

    ':hover': {
        backgroundColor: props.theme.colours.bgDark,
    },

    '> *': {
        padding: props.theme.metrics.margins.sm,
        width: TOOLBAR_ICON_SIZE,
        height: TOOLBAR_ICON_SIZE,
    },

    '> svg': {
        width: TOOLBAR_ICON_SIZE,
        height: TOOLBAR_ICON_SIZE,
    },
}))

export const StyledSeparator = styled('div')((props) => ({
    backgroundColor: props.theme.colours.toolbarTitleBg,
    height: 2,
    width: `calc(100% - ${2 * props.theme.metrics.margins.sm}px)`,
    margin: props.theme.metrics.margins.sm,
}))
