import styled from '../../themes/lib/styled'

export const StyledCard = styled('div')((props) => ({
    backgroundColor: props.theme.colours.bg,
    margin: props.theme.metrics.margins.lg,
    padding: props.theme.metrics.margins.lg,
    borderRadius: 3,
    boxShadow: `0px 2px 3px ${props.theme.colours.dropShadow}`,
}))
