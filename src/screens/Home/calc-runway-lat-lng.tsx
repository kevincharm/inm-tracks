import * as geolib from 'geolib'
import { getRunway } from './rwy-end'
import { HNL_CENTRE } from './HNL_CENTRE'

export const calcRunwayLatLng = (runwayEnd: string): [number, number] => {
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
