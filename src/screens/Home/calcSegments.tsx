import * as geolib from 'geolib'
import { Track } from './Home'

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
        if (distances.length > 0) segments.push(distances.shift()!)
        if (turns.length > 0) segments.push(turns.shift()!)
    }

    return segments
}
