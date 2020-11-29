const runwayEnds: [
    string,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    string
][] = [
    // "RWY_ID","X_COORD","Y_COORD","ELEVATION","DIS_TH_TKO","DIS_TH_APP","GLIDE_SL","TH_CR_HGT","PCT_WIND","DEF_COORD"
    ['04L', -0.05, -0.02, 10.3, 0.0, 0.0, 3.0, 50.0, 0.0, 'Y'],
    ['04R', -0.26, -0.28, 8.6, 0.0, 0.0, 3.0, 54.0, 0.0, 'Y'],
    ['08R', -1.31, -0.71, 10.0, 0.0, 0.0, 3.0, 50.0, 0.0, 'Y'],
    ['22L', 0.91, 0.6, 8.6, 0.0, 0.0, 3.0, 52.0, 0.0, 'Y'],
    ['22R', 0.86, 0.66, 9.7, 0.0, 0.0, 3.0, 50.0, 0.0, 'Y'],
    ['26L', 0.66, -0.71, 10.0, 0.0, 0.0, 3.0, 50.0, 0.0, 'Y'],
    ['08L', -1.16, 0.39, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 'Y'],
    ['26R', 0.86, 0.39, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 'Y'],
]

export function getRunway(id: string) {
    return runwayEnds.find((row) => row[0] === id)
}

export default runwayEnds
