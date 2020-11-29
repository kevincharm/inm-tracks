import styled from '../../themes/lib/styled'
import { MapContainer } from 'react-leaflet'

export const StyledPageContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
})

export const StyledPage = styled('div')((props) => ({
    margin: props.theme.metrics.margins.sm,
    fontSize: 14,
    width: '100%',
    height: `calc(100vh - 60px - ${props.theme.metrics.margins.sm * 2}px)`,
}))

export const StyledMapContainer = styled(MapContainer)({
    zIndex: 0,
    width: '100%',
    height: '100%',
})

export const StyledToolbar = styled('div')({
    display: 'flex',
    height: 60,
})

export const StyledToolbarLeft = styled('div')({
    display: 'flex',
    justifyContent: 'flex-start',
    width: '50%',
    '> *': {
        minWidth: 100,
    },
})

export const StyledToolbarRight = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    width: '50%',
    '> *': {
        minWidth: 100,
    },
})

export const StyledTrackBox = styled('div')((props) => ({
    padding: props.theme.metrics.margins.md,
    backgroundColor: 'white',
}))

export const StyledHint = styled('div')((props) => ({
    backgroundColor: 'transparent',
    zIndex: 110,
    position: 'fixed',
    userSelect: 'none',
    pointerEvents: 'none',
    // textAlign: 'center',
    width: '100%',
    left: props.theme.metrics.margins.lg,
    bottom: props.theme.metrics.margins.lg,
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 3,
    textShadow: `-1px -1px 10px #fff,
        1px -1px 10px #fff,
        -1px 1px 10px #fff,
        1px 1px 10px #fff`,
}))

export const StyledKeyHint = styled('span')((props) => ({
    padding: `${props.theme.metrics.margins.sm}px ${props.theme.metrics.margins.md}px`,
    margin: props.theme.metrics.margins.sm,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#333',
    backgroundColor: '#333',
    color: '#ddd',
    textShadow: 'none',
    fontStyle: 'italic',
}))
