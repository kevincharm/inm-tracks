import styled from '../../themes/lib/styled'

export const StyledPageLayout = styled('div')((props) => ({
    zIndex: 0,
    position: 'relative',
    top: props.theme.metrics.navBarHeight,
    display: 'flex',
    justifyContent: 'center',
    minHeight: `calc(100vh - ${props.theme.metrics.navBarHeight}px)`,
}))
