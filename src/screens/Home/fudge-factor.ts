import { HNL_CENTRE } from './HNL_CENTRE'
import * as geomag from 'geomag'

export const hnlMagneticDeclination = geomag.field(HNL_CENTRE[0], HNL_CENTRE[1], 0).declination
