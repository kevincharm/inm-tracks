import * as React from 'react'
import { Helmet } from 'react-helmet'
import { ThemeProvider } from 'emotion-theming'
import defaultTheme from './themes/default'
import { Switch, Route } from 'react-router-dom'
import { ErrorDisplay } from './components/ErrorDisplay'
import useErrorStore from './store/error'
import { LoadingBar } from './components/LoadingBar'
import useLoadingStore from './store/loading'
import { Home } from './screens/Home'

export const App: React.FunctionComponent = () => {
    const [errors, dismissError] = useErrorStore((store) => [store.errors, store.dismissError])
    const [isLoading] = useLoadingStore((store) => [store.isLoading])

    return (
        <>
            <Helmet defaultTitle="INM Tracks" titleTemplate="INM Tracks | %s">
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charSet="utf-8" />
            </Helmet>
            <ThemeProvider theme={defaultTheme}>
                <ErrorDisplay errors={errors} dismissError={dismissError} />
                {isLoading && <LoadingBar />}
                <Switch>
                    <Route path="/" default>
                        <Home />
                    </Route>
                </Switch>
            </ThemeProvider>
        </>
    )
}
