import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { MapConsumer, Marker, TileLayer, useMapEvents, Tooltip, Polyline } from 'react-leaflet'
import { StyledMapContainer, StyledPage, StyledPageContainer, StyledToolbar } from './Home.styled'
import * as geolib from 'geolib'
import waypoints from './waypoints'
import runwayEnds, { getRunway } from './rwy-end'

interface HomeProps {}

interface HomeState {
    mode: 'init' | 'draw'
    currRunway: string
    tracks: Array<[number, number][]>
    currTrack: [number, number][]
}

const HNL_CENTRE: [number, number] = [21.318691, -157.922407] // Elevation: 4.0m

const createDefaultPoint = (runwayEnd: string): [number, number] => {
    const [, x, y] = getRunway(runwayEnd)!
    const { latitude: xLat, longitude: xLon } = geolib.computeDestinationPoint(
        { lat: HNL_CENTRE[0], lon: HNL_CENTRE[1] },
        Math.abs(x * 1852),
        x >= 0 ? 90 : 270
    )
    const { latitude, longitude } = geolib.computeDestinationPoint(
        { lat: xLat, lon: xLon },
        Math.abs(y * 1852),
        y >= 0 ? 0 : 180
    )
    // console.log(runwayEnd, x, y, ' -> ', latitude, longitude)
    return [latitude, longitude]
}

const defaultCurrTrack = createDefaultPoint(runwayEnds[0][0])

/**
 * Map event handlers, uses render props to control leaflet map
 * @param props
 */
const MapEventHandler = (props: {
    state: HomeState
    setState: React.Dispatch<React.SetStateAction<HomeState>>
}) => {
    const { state, setState } = props

    useMapEvents({
        click: (event) => {
            if (state.mode !== 'draw') {
                return
            }

            const { lat, lng } = event.latlng
            // Drop the last element (temporary preview point)
            const currTrack = state.currTrack.slice(0, Math.max(1, state.currTrack.length - 1))
            setState({
                ...state,
                currTrack: currTrack.concat([
                    [lat, lng],
                    [lat, lng] /** Add another one at the end for where the mouse is */,
                ]),
            })
        },
        mousemove: (event) => {
            const track = state.currTrack
            if (!track.length || state.mode !== 'draw') {
                return
            }

            const { lat, lng } = event.latlng
            setState({
                ...state,
                currTrack: state.currTrack.map((point, i, arr) => {
                    if (i !== arr.length - 1 || i === 0) {
                        return point
                    }
                    return [lat, lng]
                }),
            })
        },
        keydown: (event) => {
            switch (event.originalEvent.code) {
                case 'Enter': {
                    // Drop the last element (temporary preview point)
                    const currTrack = state.currTrack.slice(0, state.currTrack.length - 1)
                    setState({
                        ...state,
                        tracks: state.tracks.concat([currTrack]),
                        currTrack: [createDefaultPoint(state.currRunway)],
                    })
                    break
                }
                case 'Escape': {
                    setState({
                        ...state,
                        currTrack: [createDefaultPoint(state.currRunway)],
                    })
                    break
                }
                default:
            }
        },
    })

    return null
}

export const Home: React.FunctionComponent<HomeProps> = (props) => {
    const [state, setState] = useState<HomeState>({
        mode: 'init',
        currRunway: runwayEnds[0][0],
        tracks: [],
        currTrack: [defaultCurrTrack],
    })

    // I really hate hooks
    const windowKeyDownHandler = useCallback(
        (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyS': {
                    setState({
                        ...state,
                        mode: 'init',
                    })
                    break
                }
                case 'KeyD': {
                    setState({
                        ...state,
                        mode: 'draw',
                    })
                    break
                }
                default:
            }
        },
        [state]
    )

    useEffect(() => {
        window.addEventListener('keydown', windowKeyDownHandler)

        return () => {
            window.removeEventListener('keydown', windowKeyDownHandler)
        }
    }, [windowKeyDownHandler])

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
                        Select (S)
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
                        Draw (D)
                    </button>
                    <select
                        onChange={(event) => {
                            const runwayId = event.target.value
                            setState({
                                ...state,
                                currRunway: runwayId,
                            })
                        }}
                    >
                        {runwayEnds.map(([id]) => (
                            <option key={id} value={id}>
                                {id}
                            </option>
                        ))}
                    </select>
                </StyledToolbar>
                <StyledMapContainer center={HNL_CENTRE} zoom={11}>
                    <MapConsumer>
                        {(map) => {
                            useEffect(() => {
                                if (state.mode === 'init') {
                                    map.dragging.enable()
                                    // map.touchZoom.enable()
                                    map.doubleClickZoom.enable()
                                    // map.scrollWheelZoom.enable()
                                    // map.boxZoom.enable()
                                    map.keyboard.enable()
                                } else {
                                    map.dragging.disable()
                                    // map.touchZoom.disable()
                                    map.doubleClickZoom.disable()
                                    // map.scrollWheelZoom.disable()
                                    // map.boxZoom.disable()
                                    map.keyboard.disable()
                                }
                            }, [state.mode])
                            return null
                        }}
                    </MapConsumer>
                    <MapEventHandler state={state} setState={setState} />
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {state.currTrack && state.currTrack.length > 0 && (
                        <Polyline positions={state.currTrack} color="blue" />
                    )}
                    {state.tracks.map((track, i) => {
                        const bearings = []
                        const distances = []
                        for (let i = 1; i < track.length; i++) {
                            const [aLat, aLon] = track[i - 1]
                            const [bLat, bLon] = track[i]
                            const bearing = geolib.getGreatCircleBearing(
                                { latitude: aLat, longitude: aLon },
                                { latitude: bLat, longitude: bLon }
                            )
                            bearings.push(bearing)
                            const dist = geolib.getDistance(
                                { lat: aLat, lon: aLon },
                                { lat: bLat, lon: bLon }
                            )
                            distances.push(`S ${(dist / 1000).toFixed(2)} km`)
                        }
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
                            turns.push(`${dir} ${turn.toFixed(2)}º`)
                        }
                        const segments = []
                        while (distances.length > 0 && turns.length > 0) {
                            if (distances.length > 0) segments.push(distances.shift())
                            if (turns.length > 0) segments.push(turns.shift())
                        }

                        return (
                            <Polyline key={i} positions={track} color="red">
                                <Tooltip>{segments.join(',')}</Tooltip>
                            </Polyline>
                        )
                    })}
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
