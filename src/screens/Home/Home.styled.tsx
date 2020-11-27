import styled from '../../themes/lib/styled'
import { MapContainer } from 'react-leaflet'

export const StyledPageContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
})

export const StyledPage = styled('div')((props) => ({
    margin: props.theme.metrics.margins.lg,
    fontSize: 20,
    width: '100%',
    height: `calc(100vh - ${props.theme.metrics.margins.lg * 2}px)`,
}))

export const StyledMapContainer = styled(MapContainer)({
    width: '100%',
    height: '100%',
})

export const StyledToolbar = styled('div')({
    display: 'flex',
})
