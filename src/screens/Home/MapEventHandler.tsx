import * as React from 'react'
import { useMapEvents } from 'react-leaflet'
import { calcRunwayLatLng } from './calc-runway-lat-lng'
import { HomeState } from './Home'

/**
 * Map event handlers, uses render props to control leaflet map
 * @param props
 */
export const MapEventHandler = (props: {
    state: HomeState
    setState: React.Dispatch<React.SetStateAction<HomeState>>
}) => {
    const { state, setState } = props

    const finaliseCurrentTrack = () => {
        const currTrack = state.currTrack.slice(0, state.currTrack.length - 1)
        setState({
            ...state,
            tracks: state.tracks.concat([
                {
                    runwayId: state.currRunway,
                    name: 'UNTITLED',
                    points: currTrack,
                },
            ]),
            selTrackIndex: state.tracks.length, // last index after insertion above
            currTrack: [calcRunwayLatLng(state.currRunway)],
        })
    }

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
        dblclick: (event) => {
            if (state.mode !== 'draw') {
                return
            }

            finaliseCurrentTrack()
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
                    if (state.mode !== 'draw') {
                        return
                    }

                    // If we're in draw mode, then finalise the track currently being drawn
                    // Drop the last element (temporary preview point)
                    finaliseCurrentTrack()
                    break
                }
                case 'Escape': {
                    setState({
                        ...state,
                        selTrackIndex: -1,
                        currTrack: [calcRunwayLatLng(state.currRunway)],
                    })
                    break
                }
                default:
            }
        },
    })

    return null
}
