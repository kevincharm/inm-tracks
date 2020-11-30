import * as React from 'react'
import { useEffect, useState } from 'react'
import * as geolib from 'geolib'
import * as L from 'leaflet'
import { Track } from './Home'
import { Marker } from 'react-leaflet'
// @ts-ignore
import a330 from '../../a330.png'

export interface A330Props {
    map: L.Map
    track: Track
}

export interface A330State {
    lat: number
    lng: number
    bearing: number
    i: number
}

const AERO_SPEED = 30

const createDefaultState = (props: A330Props): A330State => {
    const { track } = props
    let i = Math.floor(Math.random() * track.points.length) % track.points.length
    if (i === 0) i += 1
    const point = track.points[i]
    return {
        lat: point[0],
        lng: point[1],
        bearing: 0,
        i,
    }
}

export const A330: React.FunctionComponent<A330Props> = (props) => {
    const { track } = props
    const [state, setState] = useState<A330State>(createDefaultState(props))

    useEffect(() => {
        let timer: any

        const renderAeroplane = () => {
            let i = state.i
            const { lat: currLat, lng: currLng } = state
            const [nextLat, nextLng] = track.points[i]
            const bearing = geolib.getGreatCircleBearing(
                { lat: currLat, lng: currLng },
                { lat: nextLat, lng: nextLng }
            )
            let { latitude, longitude } = geolib.computeDestinationPoint(
                { lat: currLat, lng: currLng },
                AERO_SPEED,
                bearing
            )

            const distToGo = geolib.getDistance(
                { lat: latitude, lng: longitude },
                { lat: nextLat, lng: nextLng }
            )
            if (distToGo < AERO_SPEED) {
                i = (i + 1) % track.points.length
                if (i === 0) {
                    // reset
                    i += 1
                    latitude = track.points[0][0]
                    longitude = track.points[0][1]
                }
            }

            setState({
                ...state,
                lat: latitude,
                lng: longitude,
                bearing,
                i,
            })

            clearTimeout(timer)
            timer = setTimeout(renderAeroplane, 100)
        }
        clearTimeout(timer)
        if (
            state.i === 1 &&
            geolib.getDistance(
                { lat: track.points[0][0], lng: track.points[0][1] },
                { lat: state.lat, lng: state.lng }
            ) < AERO_SPEED
        ) {
            timer = setTimeout(renderAeroplane, Math.random() * 10000)
        } else {
            timer = setTimeout(renderAeroplane)
        }

        return () => {
            clearTimeout(timer)
        }
    }, [state])

    const icon = new L.DivIcon({
        html: `<img src="${a330}" height="50" style="transform: translate(-46%, -33%) rotateZ(${state.bearing}deg);" />`,
    })

    return <Marker position={[state.lat, state.lng]} icon={icon} />
}
