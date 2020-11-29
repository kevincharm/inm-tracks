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

export interface HomeState {
    mode: 'init' | 'draw'
    tracks: Array<[number, number][]>
    selTrackIndex: number
    currRunway: string
    currTrack: [number, number][]
}

export const HNL_CENTRE: [number, number] = [21.318691, -157.922407] // Elevation: 4.0m

const defaultCurrTrack = calcRunwayLatLng(runwayEnds[0][0])

export const Home: React.FunctionComponent<HomeProps> = (props) => {
    const [state, setState] = useState<HomeState>({
        mode: 'init',
        tracks: [],
        selTrackIndex: -1,
        currRunway: runwayEnds[0][0],
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
                    {state.currTrack && state.currTrack.length > 0 && (
                        <Polyline positions={state.currTrack} color="blue" />
                    )}
                </StyledMapContainer>
                <StyledTrackBox>
                    <div>Runway</div>
                    <div>{state.currRunway /** TODO: should show selected runway */}</div>
                    <label>
                        <div>Track Designation</div>
                        <input type="text" />
                    </label>
                </StyledTrackBox>
            </StyledPage>
        </StyledPageContainer>
    )
}
