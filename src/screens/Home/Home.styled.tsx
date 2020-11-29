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
    '> *': {
        minWidth: 100,
    },
})

export const StyledTrackBox = styled('div')((props) => ({
    zIndex: 100,
    position: 'absolute',
    padding: props.theme.metrics.margins.md,
    margin: props.theme.metrics.margins.md,
    top: 100,
    right: 20,
    backgroundColor: 'white',
}))
