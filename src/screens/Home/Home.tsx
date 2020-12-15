import * as React from 'react'
import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
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
import * as L from 'leaflet'
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
import { calcSegments } from './calc-segments'
// @ts-ignore
import flyoverIcon from '../../flyover.png'
// @ts-ignore
import vortacIcon from '../../vortac.png'
import { hnlMagneticDeclination } from './fudge-factor'
import { HNL_CENTRE } from './HNL_CENTRE'
import { A330 } from './A330'

const flyoverMarkerIcon = new L.Icon({
    iconUrl: flyoverIcon,
    iconSize: [15, 15],
})

const vortacMarkerIcon = new L.Icon({
    iconUrl: vortacIcon,
    iconSize: [25, 22],
})

interface HomeProps {}

export interface Track {
    runwayId: string
    name: string
    points: [number, number][]
    /** UI only */
    isVisible: boolean
}

export interface HomeState {
    mode: 'init' | 'draw'
    tracks: Track[]
    selTrackIndex: number
    currRunway: string
    currTrack: [number, number][]
    showSummary: boolean
}

const defaultCurrTrack = calcRunwayLatLng(runwayEnds[0][0])

export const Home: React.FunctionComponent<HomeProps> = (props) => {
    const [state, setState] = useState<HomeState>({
        mode: 'init',
        tracks: fixTracks(JSON.parse(localStorage.getItem('tracks') || null!) || []),
        selTrackIndex: -1,
        currRunway: runwayEnds[0][0],
        currTrack: [defaultCurrTrack],
        showSummary: JSON.parse(localStorage.getItem('showSummary') || null!) || true,
    })

    // Polyline props are immutable so we gotta do this side-effect garbage 🤮
    const lineRefs = useRef([]) as React.MutableRefObject<L.Polyline<any, any>[]>
    useLayoutEffect(() => {
        for (let i = 0; i < state.tracks.length; i++) {
            const lines = lineRefs.current
            if (!lines) {
                return
            }
            const line = lines[i]
            if (!line) {
                return
            }

            // Highlight if it's being selected
            if (state.selTrackIndex === i) {
                line.setStyle({ color: 'yellow' })
                line.bringToFront()
            } else {
                line.setStyle({ color: 'red' })
            }
        }
    }, [state.tracks, state.selTrackIndex])

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

    /// The magic sauce: export to DBF for INM
    const exportDbf = () => {
        // Transform tracks into structured DBF
        const records = state.tracks
            .map((track) => {
                return calcSegments(track).map((segment, SEG_NUM) => {
                    const [SEG_TYPE, _p1, _p2] = segment.split(' ')
                    let PARAM1: string | number = _p1 ? parseFloat(_p1.trim() || '0') : 0
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
    }

    /// Persist tracks to LocalStorage whenever `state.tracks` is updated
    useEffect(() => {
        console.log('Saving tracks...', state.tracks)
        localStorage.setItem('tracks', JSON.stringify(state.tracks))
        localStorage.setItem('showSummary', JSON.stringify(state.showSummary))
    }, [state.tracks, state.showSummary])

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
                                setState({
                                    ...state,
                                    showSummary: !state.showSummary,
                                })
                            }}
                        >
                            Summary
                        </Button>
                        <Button
                            colourscheme="primary"
                            onClick={() => {
                                if (!window.confirm(`Importing will overwrite tracks. Continue?`)) {
                                    return
                                }

                                openFile((contents) => {
                                    try {
                                        const tracks: Track[] = JSON.parse(contents)
                                        // Fix format version inconsistency
                                        fixTracks(tracks)
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
                        <Button colourscheme="confirm" onClick={exportDbf}>
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
                            <Marker
                                icon={POINT_CAT === 'V' ? vortacMarkerIcon : flyoverMarkerIcon}
                                key={POINT_ID}
                                position={[LATITUDE, LONGITUDE]}
                            >
                                <Tooltip>{POINT_ID}</Tooltip>
                            </Marker>
                        )
                    )}
                    {runwayEnds.map(([RWY_ID, X_COORD, Y_COORD]) => {
                        const bearing = Number(RWY_ID.slice(0, 2)) * 10 + hnlMagneticDeclination
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
                            track.isVisible && (
                                <Polyline
                                    ref={(el) => {
                                        lineRefs.current[i] = el as L.Polyline<any, any>
                                    }}
                                    key={i}
                                    positions={track.points}
                                    color="red"
                                    eventHandlers={{
                                        click: (_) => {
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
                        )
                    })}
                    {state.currTrack && state.currTrack.length > 0 && (
                        <Polyline positions={state.currTrack} color="blue" />
                    )}
                    <MapConsumer>
                        {(map) => (
                            <div>
                                {state.tracks.map(
                                    (track, i) =>
                                        track.isVisible && <A330 key={i} map={map} track={track} />
                                )}
                            </div>
                        )}
                    </MapConsumer>
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
                {state.showSummary && (
                    <Toolbar id="summary" title="Summary" stackDirection="vertical">
                        <StyledTrackBox>
                            {Object.entries(
                                state.tracks.reduce((group: { [key: string]: string[] }, track) => {
                                    if (!group[track.runwayId]) {
                                        group[track.runwayId] = []
                                    }
                                    group[track.runwayId].push(track.name)
                                    group[track.runwayId].sort()
                                    return group
                                }, {})
                            ).map(([runwayId, trackNames], i) => (
                                <div key={i}>
                                    <h4>{runwayId}</h4>
                                    <ul>
                                        {trackNames.map((name, j) => (
                                            <li
                                                key={j}
                                                onClick={() => {
                                                    const trackIndex = state.tracks.findIndex(
                                                        (t) =>
                                                            t.name === name &&
                                                            t.runwayId === runwayId
                                                    )
                                                    setState({
                                                        ...state,
                                                        selTrackIndex: trackIndex,
                                                    })
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        state.tracks.find(
                                                            (t) =>
                                                                t.name === name &&
                                                                t.runwayId === runwayId
                                                        )?.isVisible
                                                    }
                                                    onClick={() => {
                                                        setState({
                                                            ...state,
                                                            tracks: state.tracks.map((t) => {
                                                                if (
                                                                    t.name === name &&
                                                                    t.runwayId === runwayId
                                                                ) {
                                                                    t.isVisible = !t.isVisible
                                                                }
                                                                return t
                                                            }),
                                                        })
                                                    }}
                                                />
                                                {name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
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
                    <StyledKeyHint>␛</StyledKeyHint> to cancel last track segment
                    <br />
                    Click the <StyledKeyHint>Select</StyledKeyHint> button or press the{' '}
                    <StyledKeyHint>S</StyledKeyHint> key to go back to select mode
                </StyledHint>
            )}
        </StyledPageContainer>
    )
}

function fixTracks(tracks: Track[]) {
    for (const track of tracks) {
        if (typeof track.isVisible === 'undefined') {
            track.isVisible = true
        }
    }
    return tracks
}
