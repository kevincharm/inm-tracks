import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'

// (If adding stylesheets):
// Don't forget to add all these to ../.storybook/preview.js too
import 'normalize.css'
import './index.css'
import 'katex/dist/katex.css'

import { App } from './App'

function renderApp() {
    ReactDOM.render(
        /**
         * For branch deploys, it's necessary to use a HashRouter so that it works with
         * static webhosting on S3 & CloudFront.
         */
        process.env.NODE_ENV === 'branch' ? (
            <HashRouter>
                <App />
            </HashRouter>
        ) : (
            <BrowserRouter>
                <App />
            </BrowserRouter>
        ),
        document.getElementById('app')
    )
}

renderApp()

// Enables hot module replacement if we're not in a production environment.
// See: https://parceljs.org/hmr.html
// Leave this disabled if developing the editor. Event listeners don't get de-registered
// when HMR reloads the app.
if (process.env.NODE_ENV !== 'production') {
    ;(module as any).hot.accept(renderApp)
}
