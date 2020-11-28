import * as React from 'react'
import { useState, useEffect } from 'react'
import { MapConsumer, Marker, TileLayer, useMapEvents, Tooltip, Polyline } from 'react-leaflet'
import { StyledMapContainer, StyledPage, StyledPageContainer, StyledToolbar } from './Home.styled'
import * as geolib from 'geolib'
import waypoints from './waypoints'

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
                    const bearings = []
                    for (let i = 1; i < state.currTrack.length; i++) {
                        const [aLat, aLon] = state.currTrack[i - 1]
                        const [bLat, bLon] = state.currTrack[i]
                        const bearing = geolib.getGreatCircleBearing(
                            { latitude: aLat, longitude: aLon },
                            { latitude: bLat, longitude: bLon }
                        )
                        bearings.push(bearing)
                    }
                    console.log(bearings)
                    // calc bearing diffs
                    const turns = []
                    for (let i = 1; i < bearings.length; i++) {
                        const alpha = bearings[i - 1]
                        const beta = bearings[i]
                        let turn: number
                        let dir: string
                        if (Math.abs(alpha - beta) < 180) {
                            turn = Math.abs(beta - alpha) % 180
                            if (alpha < beta) {
                                dir = 'R'
                            } else {
                                dir = 'L'
                            }
                        } else {
                            turn = Math.abs(alpha - beta) % 180
                            if (alpha < beta) {
                                dir = 'L'
                            } else {
                                dir = 'R'
                            }
                        }
                        turns.push(`${dir} ${turn}`)
                    }
                    console.log(turns)

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
                <StyledMapContainer center={HNL_CENTRE} zoom={11}>
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
                    {state.tracks.map((track, i) => (
                        <Polyline key={i} positions={track} color="red" />
                    ))}
                    {waypoints.map(
                        ([POINT_ID, POINT_CAT, LATITUDE, LONGITUDE, HEIGHT, DEF_COORD]) => (
                            <Marker key={POINT_ID} position={[LATITUDE, LONGITUDE]}>
                                <Tooltip permanent>{POINT_ID}</Tooltip>
                            </Marker>
                        )
                    )}
                </StyledMapContainer>
            </StyledPage>
        </StyledPageContainer>
    )
}
