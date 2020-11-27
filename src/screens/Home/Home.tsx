import * as React from 'react'
import { useState, useEffect } from 'react'
import { MapConsumer, Marker, TileLayer, useMapEvents, Polyline } from 'react-leaflet'
import { StyledMapContainer, StyledPage, StyledPageContainer, StyledToolbar } from './Home.styled'

interface HomeProps {}

interface HomeState {
    mode: 'init' | 'draw'
    tracks: Array<[number, number][]>
    currTrack: [number, number][]
}

const HNL_CENTRE: [number, number] = [21.3245182, -157.9272623]

export const Home: React.FunctionComponent<HomeProps> = (props) => {
    const [state, setState] = useState<HomeState>({
        mode: 'init',
        tracks: [],
        currTrack: [],
    })

    const MapEventHandler = () => {
        useMapEvents({
            click: (event) => {
                if (state.mode !== 'draw') {
                    return
                }

                const { lat, lng } = event.latlng
                setState({
                    ...state,
                    currTrack: state.currTrack.concat([[lat, lng]]),
                })
            },
            keydown: (event) => {
                if (event.originalEvent.code === 'Enter') {
                    console.log(`New track:`, state.currTrack)
                    setState({
                        ...state,
                        tracks: state.tracks.concat([state.currTrack]),
                        currTrack: [],
                    })
                }
            },
        })

        return null
    }

    return (
        <StyledPageContainer>
            <StyledPage>
                <StyledToolbar>
                    <button
                        disabled={state.mode === 'init'}
                        onClick={() =>
                            setState({
                                ...state,
                                mode: 'init',
                            })
                        }
                    >
                        Select
                    </button>
                    <button
                        disabled={state.mode === 'draw'}
                        onClick={() =>
                            setState({
                                ...state,
                                mode: 'draw',
                            })
                        }
                    >
                        Draw
                    </button>
                </StyledToolbar>
                <StyledMapContainer center={HNL_CENTRE} zoom={13}>
                    <MapConsumer>
                        {(map) => {
                            useEffect(() => {
                                if (state.mode === 'init') {
                                    map.dragging.enable()
                                    map.touchZoom.enable()
                                    map.doubleClickZoom.enable()
                                    map.scrollWheelZoom.enable()
                                    map.boxZoom.enable()
                                    map.keyboard.enable()
                                } else {
                                    map.dragging.disable()
                                    map.touchZoom.disable()
                                    map.doubleClickZoom.disable()
                                    map.scrollWheelZoom.disable()
                                    map.boxZoom.disable()
                                    map.keyboard.disable()
                                }
                            }, [state.mode])
                            return null
                        }}
                    </MapConsumer>
                    <MapEventHandler />
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {state.currTrack && state.currTrack.length > 0 && (
                        <Polyline positions={state.currTrack} color="blue" />
                    )}
                    {state.tracks.map((track) => {
                        return <Polyline positions={track} color="red" />
                    })}
                    <Marker position={[51.505, -0.09]} />
                </StyledMapContainer>
            </StyledPage>
        </StyledPageContainer>
    )
}
