import * as React from 'react'
import { StyledLoadingBar } from './LoadingBar.styled'

export interface LoadingBarProps {}

export const LoadingBar: React.FunctionComponent<LoadingBarProps> = (props) => {
    return <StyledLoadingBar />
}
