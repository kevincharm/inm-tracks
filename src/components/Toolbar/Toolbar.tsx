import * as React from 'react'
import { useEffect } from 'react'
import {
    StyledToolbarContainer,
    StyledToolbarButton,
    StyledTitle,
    StyledTitleContainer,
    StackDirection,
    StyledSeparator,
} from './Toolbar.styled'

export interface ToolbarProps {
    title?: string
    stackDirection: StackDirection
    defaultX?: number
    defaultY?: number
}

export const ToolbarSeparator: React.FunctionComponent = (props) => <StyledSeparator />

export const ToolbarButton: React.FunctionComponent<React.ComponentPropsWithoutRef<'button'>> = (
    props
) => {
    return <StyledToolbarButton {...props} />
}

export const Toolbar: React.FunctionComponent<ToolbarProps> = (props) => {
    const containerRef = React.createRef<HTMLDivElement>()
    const draggableTargetRef = React.createRef<HTMLDivElement>()
    const dragStart = {
        x: 0,
        y: 0,
    }
    let isDragging = false

    const mouseDownHandler = (e: MouseEvent) => {
        e.preventDefault()

        dragStart.x = e.clientX
        dragStart.y = e.clientY
        isDragging = true
    }

    const mouseUpHandler = (e: MouseEvent) => {
        e.preventDefault()

        isDragging = false
    }

    const mouseMoveHandler = (e: MouseEvent) => {
        e.preventDefault()

        if (!isDragging) {
            return
        }

        const x = dragStart.x - e.clientX
        const y = dragStart.y - e.clientY
        dragStart.x = e.clientX
        dragStart.y = e.clientY

        const container = containerRef.current
        if (!container) {
            return
        }

        container.style.top = container.offsetTop - y + 'px'
        container.style.left = container.offsetLeft - x + 'px'
    }

    useEffect(() => {
        const draggableTarget = draggableTargetRef.current
        if (draggableTarget) {
            draggableTarget.addEventListener('mousedown', mouseDownHandler)
            draggableTarget.addEventListener('mouseup', mouseUpHandler)
            document.addEventListener('mousemove', mouseMoveHandler)
        }

        const container = containerRef.current
        if (container) {
            container.style.top = `${typeof props.defaultY === 'number' ? props.defaultY : 100}px`
            container.style.left = `${typeof props.defaultX === 'number' ? props.defaultX : 10}px`
        }

        return () => {
            const draggableTarget = draggableTargetRef.current
            if (draggableTarget) {
                draggableTarget.removeEventListener('mousedown', mouseDownHandler)
                draggableTarget.removeEventListener('mouseup', mouseUpHandler)
                document.removeEventListener('mousemove', mouseMoveHandler)
            }
        }
    })

    return (
        <StyledToolbarContainer ref={containerRef} {...props}>
            <StyledTitleContainer ref={draggableTargetRef}>
                {props.title && <StyledTitle>{props.title}</StyledTitle>}
            </StyledTitleContainer>
            {props.children}
        </StyledToolbarContainer>
    )
}
