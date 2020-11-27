import * as React from 'react'
import { Helmet } from 'react-helmet'
import { StyledPageLayout } from './PageLayout.styled'

export interface PageLayoutProps {
    title: string
}

export const PageLayout: React.FunctionComponent<PageLayoutProps> = (props) => (
    <>
        <Helmet>
            <title>{props.title}</title>
        </Helmet>
        <StyledPageLayout>{props.children}</StyledPageLayout>
    </>
)
