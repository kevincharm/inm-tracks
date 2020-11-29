import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
// @ts-ignore
import * as dbf from 'dbf'
import { format } from 'date-fns'
import { MapConsumer, Marker, TileLayer, Tooltip, Polyline } from 'react-leaflet'
import {
    StyledHint,
    StyledKeyHint,
    StyledMapContainer,
    StyledPage,
    StyledPageContainer,
    StyledToolbar,
    StyledToolbarLeft,
    StyledToolbarRight,
    StyledTrackBox,
} from './Home.styled'
import { Button } from '../../components/Button'
import * as geolib from 'geolib'
import waypoints from './waypoints'
import runwayEnds from './rwy-end'
import { calcRunwayLatLng } from './calc-runway-lat-lng'
import { MapEventHandler } from './MapEventHandler'
import { Toolbar } from '../../components/Toolbar'
import { openFile } from '../../lib/open-file'
import { downloadFile } from '../../lib/download-file'
import { dbfWrite } from '../../lib/dbf'

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
        // INM format: SEG_TYPE PARAM1(distance in km?!)
        distances.push(`S ${dist / 1000}`)
    }
    // calc bearing diffs
    const turns = []
    for (let i = 0; i < bearings.length; i++) {
        const alpha = i > 0 ? bearings[i - 1] : Number(track.runwayId.slice(0, 2)) * 10
        const beta = bearings[i]
        if (Math.abs(alpha - beta) < 1) {
            // Negligible turn, probably the first segment
            continue
        }

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
        // This is INM's trk_segs format: SEG_TYPE PARAM1(bearing) PARAM2(distance in nm)
        turns.push(`${dir} ${turn} ${5000 / 1852}`)
    }
    const segments: string[] = []
    while (distances.length > 0 && turns.length > 0) {
        if (turns.length > 0) segments.push(turns.shift()!)
        if (distances.length > 0) segments.push(distances.shift()!)
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

    const deleteSelectedTrack = () => {
        if (selectedTrack && window.confirm('Are you sure you want to delete this track?')) {
            setState({
                ...state,
                tracks: state.tracks.filter((_, i) => i !== state.selTrackIndex),
                selTrackIndex: -1,
            })
        }
    }

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
                case 'KeyX': {
                    deleteSelectedTrack()
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
                    <StyledToolbarLeft>
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
                    </StyledToolbarLeft>
                    <StyledToolbarRight>
                        <Button
                            colourscheme="primary"
                            onClick={() => {
                                if (!window.confirm(`Importing will overwrite tracks. Continue?`)) {
                                    return
                                }

                                openFile((contents) => {
                                    try {
                                        const tracks = JSON.parse(contents)
                                        setState({
                                            ...state,
                                            tracks,
                                        })
                                    } catch (err) {
                                        window.alert(`Error parsing JSON!`)
                                    }
                                })
                            }}
                        >
                            Import JSON
                        </Button>
                        <Button
                            colourscheme="primary"
                            onClick={() => {
                                downloadFile(
                                    `inm_tracks_${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`,
                                    JSON.stringify(state.tracks),
                                    'application/json'
                                )
                            }}
                        >
                            Export JSON
                        </Button>
                        <Button
                            colourscheme="primary"
                            onClick={() => {
                                // Transform tracks into structured DBF
                                const records = state.tracks
                                    .map((track) => {
                                        return calcSegments(track).map((segment, SEG_NUM) => {
                                            const [SEG_TYPE, _p1, _p2] = segment.split(' ')
                                            let PARAM1: string | number = _p1
                                                ? parseFloat(_p1.trim() || '0')
                                                : 0
                                            // INM is really fussy and turns must only have 1dp
                                            // e.g. 65.0
                                            if (['L', 'R'].includes(SEG_TYPE)) {
                                                PARAM1 = PARAM1.toFixed(1)
                                            }
                                            const PARAM2 = _p2 ? parseFloat(_p2.trim() || '0') : 0
                                            return [
                                                track.runwayId,
                                                'D',
                                                track.name,
                                                '0',
                                                SEG_NUM + 1,
                                                SEG_TYPE,
                                                PARAM1,
                                                PARAM2,
                                            ]
                                        })
                                    })
                                    .reduce((p, c) => p.concat(c), [])
                                const buf = dbfWrite(
                                    [
                                        { type: 'C', name: 'RWY_ID', length: 8 },
                                        { type: 'C', name: 'OP_TYPE', length: 1 },
                                        { type: 'C', name: 'TRK_ID1', length: 8 },
                                        { type: 'C', name: 'TRK_ID2', length: 1 },
                                        { type: 'N', name: 'SEG_NUM', length: 3, decimalLength: 0 },
                                        { type: 'C', name: 'SEG_TYPE', length: 1 },
                                        { type: 'N', name: 'PARAM1', length: 9, decimalLength: 4 },
                                        { type: 'N', name: 'PARAM2', length: 9, decimalLength: 4 },
                                    ],
                                    records
                                )
                                downloadFile(`trk_segs.dbf`, buf, 'application/json')
                            }}
                        >
                            Export DBF
                        </Button>
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
                            Reset
                        </Button>
                    </StyledToolbarRight>
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
                                <Tooltip>
                                    {track.runwayId} {track.name}
                                </Tooltip>
                                {/* <Tooltip>{segments.join(',')}</Tooltip> */}
                            </Polyline>
                        )
                    })}
                    {state.currTrack && state.currTrack.length > 0 && (
                        <Polyline positions={state.currTrack} color="blue" />
                    )}
                </StyledMapContainer>
                {selectedTrack && (
                    <Toolbar id="sel_track" title="Selected Track" stackDirection="vertical">
                        <StyledTrackBox>
                            <Button colourscheme="danger" onClick={deleteSelectedTrack}>
                                Delete (X)
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
                    </Toolbar>
                )}
            </StyledPage>
            {state.mode === 'init' && (
                <StyledHint>
                    You are in <u>select</u> mode
                    <br />
                    Click on a track (red line) to edit it
                    <br />
                    Click the <StyledKeyHint>Draw</StyledKeyHint> button or press the{' '}
                    <StyledKeyHint>D</StyledKeyHint> key to enter draw mode
                </StyledHint>
            )}
            {state.mode === 'draw' && (
                <StyledHint>
                    You are in <u>draw</u> mode
                    <br />
                    <StyledKeyHint>Return ⏎</StyledKeyHint> or{' '}
                    <StyledKeyHint>double-click 🖱️</StyledKeyHint> to finalise track
                    <br />
                    <StyledKeyHint>␛</StyledKeyHint> to cancel drawing track
                    <br />
                    Click the <StyledKeyHint>Select</StyledKeyHint> button or press the{' '}
                    <StyledKeyHint>S</StyledKeyHint> key to go back to select mode
                </StyledHint>
            )}
        </StyledPageContainer>
    )
}
