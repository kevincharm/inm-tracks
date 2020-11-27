const isProduction = process.env.NODE_ENV === 'production'

const config = {
    modelsPath: '/static/models/',
    navmeshPath: '/static/navmesh/',

    debugLights: false,
    debugNavMesh: false,
    showWorldAxes: false,
    showBoundingBoxes: false,

    apiEndpoint: isProduction ? 'https://api.infragrok.com' : 'http://127.0.0.1:3000',
}

export default config
