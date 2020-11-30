import { format } from 'date-fns'
import { HNL_CENTRE } from './HNL_CENTRE'
import WorldMagneticModel from './WorldMagneticModel'

export const hnlMagneticDeclination = new WorldMagneticModel().declination(
    0,
    HNL_CENTRE[0],
    HNL_CENTRE[1],
    Math.max(
        2010,
        Math.min(2015, Number(format(new Date(), 'yyyy')))
    ) /** Only defined for year \in [2010, 2015] */
)
