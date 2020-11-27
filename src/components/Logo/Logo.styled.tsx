import styled from '../../themes/lib/styled'

export const StyledLogoContainer = styled('div')({
    position: 'relative',
    height: '100%',
})

export const StyledImage = styled('img')({
    zIndex: 0,
    position: 'relative',
    maxWidth: '100%',
    maxHeight: '100%',
})

export const StyledMiniLabel = styled('div')((props) => ({
    zIndex: 10,
    position: 'absolute',
    top: -6,
    right: -46,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    padding: '2px 5px',
    borderRadius: 3,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: props.theme.colours.fg,
    color: props.theme.colours.fg,
    backgroundColor: props.theme.colours.bg,
}))
