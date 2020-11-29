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
