import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { MapConsumer, Marker, TileLayer, Tooltip, Polyline } from 'react-leaflet'
import {
    StyledMapContainer,
    StyledPage,
    StyledPageContainer,
    StyledToolbar,
    StyledTrackBox,
} from './Home.styled'
import { Button } from '../../components/Button'
import * as geolib from 'geolib'
import waypoints from './waypoints'
import runwayEnds from './rwy-end'
import { calcRunwayLatLng } from './calc-runway-lat-lng'
import { MapEventHandler } from './MapEventHandler'

interface HomeProps {}

export interface Track {
    runwayId: string
    name: string
    points: [number, number][]
}

export function calcSegments(track: Track) {
    const bearings = []
    const distances = []
    for (let i = 1; i < track.points.length; i++) {
        const [aLat, aLon] = track.points[i - 1]
        const [bLat, bLon] = track.points[i]
        const bearing = geolib.getGreatCircleBearing(
            { latitude: aLat, longitude: aLon },
            { latitude: bLat, longitude: bLon }
        )
        bearings.push(bearing)
        const dist = geolib.getDistance({ lat: aLat, lon: aLon }, { lat: bLat, lon: bLon })
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
    const segments: string[] = []
    while (distances.length > 0 && turns.length > 0) {
        if (distances.length > 0) segments.push(distances.shift()!)
        if (turns.length > 0) segments.push(turns.shift()!)
    }

    return segments
}

export interface HomeState {
    mode: 'init' | 'draw'
    tracks: Track[]
    selTrackIndex: number
    currRunway: string
    currTrack: [number, number][]
}

export const HNL_CENTRE: [number, number] = [21.318691, -157.922407] // Elevation: 4.0m

const defaultCurrTrack = calcRunwayLatLng(runwayEnds[0][0])

export const Home: React.FunctionComponent<HomeProps> = (props) => {
    const [state, setState] = useState<HomeState>({
        mode: 'init',
        tracks: JSON.parse(localStorage.getItem('tracks') || null!) || [],
        selTrackIndex: -1,
        currRunway: runwayEnds[0][0],
        currTrack: [defaultCurrTrack],
    })

    const selectedTrack =
        state.selTrackIndex >= 0 && state.selTrackIndex < state.tracks.length
            ? state.tracks[state.selTrackIndex]
            : null

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

    /// Persist tracks to LocalStorage whenever `state.tracks` is updated
    useEffect(() => {
        console.log('Saving tracks...', state.tracks)
        localStorage.setItem('tracks', JSON.stringify(state.tracks))
    }, [state.tracks])

    useEffect(() => {
        window.addEventListener('keydown', windowKeyDownHandler)

        return () => {
            window.removeEventListener('keydown', windowKeyDownHandler)
        }
    }, [windowKeyDownHandler])

    useEffect(() => {
        const currTrack = state.currTrack
        if (currTrack.length < 1) {
            setState({
                ...state,
                currTrack: [calcRunwayLatLng(state.currRunway)],
            })
            return
        }

        setState({
            ...state,
            currTrack: currTrack.map((segment, i) => {
                if (i === 0) {
                    return calcRunwayLatLng(state.currRunway)
                }
                return segment
            }),
        })
    }, [state.currRunway])

    return (
        <StyledPageContainer>
            <StyledPage>
                <StyledToolbar>
                    <Button
                        colourscheme="primary"
                        disabled={state.mode === 'init'}
                        onClick={() =>
                            setState({
                                ...state,
                                mode: 'init',
                            })
                        }
                    >
                        Select (S)
                    </Button>
                    <Button
                        colourscheme="primary"
                        disabled={state.mode === 'draw'}
                        onClick={() =>
                            setState({
                                ...state,
                                mode: 'draw',
                            })
                        }
                    >
                        Draw (D)
                    </Button>
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
                    <Button
                        colourscheme="danger"
                        onClick={() => {
                            if (
                                window.confirm(
                                    'Are you sure you want to delete all locally-stored data?'
                                )
                            ) {
                                localStorage.clear()
                                setState({
                                    ...state,
                                    tracks: [],
                                })
                            }
                        }}
                    >
                        Clear Data
                    </Button>
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
                    {waypoints.map(
                        ([POINT_ID, POINT_CAT, LATITUDE, LONGITUDE, HEIGHT, DEF_COORD]) => (
                            <Marker key={POINT_ID} position={[LATITUDE, LONGITUDE]}>
                                <Tooltip permanent>{POINT_ID}</Tooltip>
                            </Marker>
                        )
                    )}
                    {runwayEnds.map(([RWY_ID, X_COORD, Y_COORD]) => {
                        const FUDGE_FACTOR = 10 /** MAGNETIC SHIFT? LOLWAT */
                        const bearing = Number(RWY_ID.slice(0, 2)) * 10 + FUDGE_FACTOR
                        const [lat, lng] = calcRunwayLatLng(RWY_ID)
                        const {
                            latitude: endLat,
                            longitude: endLng,
                        } = geolib.computeDestinationPoint(
                            { lat, lng },
                            2500 /** TODO: Import this from ABS? */,
                            bearing
                        )
                        // console.log(lat, lng, ' -> ', endLat, endLng)

                        return (
                            <Polyline
                                key={RWY_ID}
                                positions={[
                                    [lat, lng],
                                    [endLat, endLng],
                                ]}
                                color="grey"
                            >
                                <Tooltip permanent>{RWY_ID}</Tooltip>
                            </Polyline>
                        )
                    })}
                    {state.tracks.map((track, i) => {
                        const segments = calcSegments(track)

                        return (
                            <Polyline
                                key={i}
                                positions={track.points}
                                color="red"
                                eventHandlers={{
                                    click: (event) => {
                                        setState({
                                            ...state,
                                            selTrackIndex: i,
                                        })
                                    },
                                }}
                            >
                                <Tooltip>{segments.join(',')}</Tooltip>
                            </Polyline>
                        )
                    })}
                    {state.currTrack && state.currTrack.length > 0 && (
                        <Polyline positions={state.currTrack} color="blue" />
                    )}
                </StyledMapContainer>
                {selectedTrack && (
                    <StyledTrackBox>
                        <Button
                            colourscheme="danger"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this track?')) {
                                    setState({
                                        ...state,
                                        tracks: state.tracks.filter(
                                            (track, i) => i !== state.selTrackIndex
                                        ),
                                        selTrackIndex: -1,
                                    })
                                }
                            }}
                        >
                            Delete
                        </Button>
                        <h4>Runway</h4>
                        <select
                            onChange={(event) => {
                                // !! Change the runway ID and lat,lng end for this track !!
                                const runwayId = event.target.value
                                setState({
                                    ...state,
                                    tracks: state.tracks.map((track, i) => {
                                        if (i !== state.selTrackIndex) {
                                            return track
                                        }

                                        return {
                                            ...track,
                                            runwayId,
                                            // !! Runway end must be updated !!
                                            points: track.points.map((point, j) => {
                                                if (j !== 0) {
                                                    return point
                                                }

                                                return calcRunwayLatLng(runwayId)
                                            }),
                                        }
                                    }),
                                })
                            }}
                            value={selectedTrack.runwayId}
                        >
                            {runwayEnds.map(([id]) => (
                                <option key={id} value={id}>
                                    {id}
                                </option>
                            ))}
                        </select>
                        <h4>Track Designation</h4>
                        <input
                            type="text"
                            value={selectedTrack.name}
                            onChange={(event) => {
                                setState({
                                    ...state,
                                    tracks: state.tracks.map((track, i) => {
                                        if (i !== state.selTrackIndex) {
                                            return track
                                        }

                                        return {
                                            ...track,
                                            name: event.target.value,
                                        }
                                    }),
                                })
                            }}
                        />
                        <h4>Segments</h4>
                        <ol>
                            {calcSegments(selectedTrack).map((segment, i) => (
                                <li key={i}>{segment}</li>
                            ))}
                        </ol>
                    </StyledTrackBox>
                )}
            </StyledPage>
        </StyledPageContainer>
    )
}
